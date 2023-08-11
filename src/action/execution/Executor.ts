import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";
import { Door } from "./door/Door";
import { Obj } from "../data/types/basic-types";
import { Cleanup } from "./cleanup/Cleanup";
import { Children } from "./children/Children";

export interface IExecutor<I extends Inventory = Inventory> {
    get inventory(): I;
    get children(): Children;
    reset(): void;
    ifCondition(bool: ValueOf<boolean>): IExecutor | null;
    evaluate<T>(value: ValueOf<T>): T | null;
    skipNextStep(): IExecutor;
    jumpTo(step: StepId): IExecutor;
    stash(itemKeys: string[]): void;
    unstash(): void;
    createDoor(name: string): Door;
    passDoor(name: string, passedInventory: Obj): void;
    reportError(error: ConvertError): void;
    addCleanup(cleanup: Cleanup): void;
}

interface Props<I extends Inventory = Inventory> {
    accumulator: StepAccumulator<I>;
    inventoryInitializer(): I;
    doors?: Record<string, Door<I>>;
}

let nextExecutorId = 1;
export class Executor<I extends Inventory = Inventory> implements IExecutor {
    //  Executor ID
    id: number = 0;

    //  steps followed by the executor
    accumulator: StepAccumulator<I>;

    //  doors that can lead to new execution
    doors: Record<string, Door<I>>;

    //  state
    nextStep: StepId = 0;           //  Next step
    inventory: I;                   //  inventory carried
    inventoryInitializer: () => I;

    //  error report
    errors: ConvertError[] = [];    //  any error encountered

    //  cleanup
    cleanups: Set<Cleanup> = new Set();

    //  children
    children: Children<I> = new Children(this);
    parent?: Executor<I>;

    constructor({accumulator, inventoryInitializer, doors = {}}: Props<I>, parent?: Executor<I>) {
        this.parent = parent;
        this.accumulator = accumulator;
        this.inventoryInitializer = inventoryInitializer;
        this.inventory = this.inventoryInitializer();
        this.doors = {...doors};
    }

    reset() {
        this.nextStep = 0;
    }

    jumpTo(step: StepId): IExecutor {
        this.nextStep = step;
        return this;
    }

    skipNextStep(): IExecutor {
        this.nextStep++;
        return this;
    }

    ifCondition(bool: boolean): IExecutor | null {
        if (!bool) {
            return null;
        }
        return this;
    }

    evaluate<T>(value: ValueOf<T>): T | null {
        return value.valueOf(this.inventory) ?? null;
    }

    executeSingleStep(): Executor<I> | undefined {
        if (!this.id) {
            this.id = nextExecutorId++;
        }
        const step = this.nextStep++;
        const executionStep = this.accumulator.getStep(step);
        if (executionStep) {
            console.log(`${this.id}-${step}`, executionStep.description);
            return executionStep.execute?.(this) ?? this;
        }
        return this.parent ?? undefined;
    }

    reportError(error: ConvertError) {
        this.errors.push(error)
    }

    stash(itemKeys: string[]): void {
        const items: Record<string, any> = {};
        this.inventory.stash.push(items);
        for (let key of itemKeys) {
            items[key] = this.inventory[key];
        }
    }

    unstash(): void {
        const items = this.inventory.stash.pop();
        if (items) {
            const inventory = this.inventory as Inventory;
            for (let key in items) {
                inventory[key] = items[key];
            }
        }
    }

    createDoor(name: string): Door {
        return this.doors[name] = {
            accumulator: new StepAccumulator(),
        };
    }

    passDoor(name: string, passedInventory: Obj) {
        const door = this.doors[name];
        const child = this.spawn();
        child.accumulator = door.accumulator;
        const childInventory: Inventory = child.inventory;
        for (let i in passedInventory) {
            childInventory[i] = passedInventory[i];
        }
        return child;
    }

    addCleanup(cleanup: Cleanup): void {
        this.cleanups.add(cleanup);
    }

    spawn(): Executor<I> {
        return this.children.spawn();
    }

    destroy(): void {
        this.children.destroy();
        this.cleanups.forEach(cleanup => cleanup.cleanup());
    }
}