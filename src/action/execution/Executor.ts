import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";
import { Door } from "./door/Door";
import { Obj } from "../data/types/basic-types";
import { Cleanup } from "./cleanup/Cleanup";
import { Children } from "./children/Children";

export interface IExecutor {
    get inventory(): Inventory;
    get parent(): IExecutor | undefined;
    get errors(): ConvertError[];
    reset(): void;
    ifCondition(bool: ValueOf<boolean>): IExecutor | null;
    evaluate<T>(value: ValueOf<T>): T | null;
    skipNextStep(): IExecutor;
    jumpTo(step: StepId): IExecutor;
    stash(itemKeys: string[]): void;
    unstash(): void;
    createDoor(name: string): Door;
    passDoor(name: string, passedInventory: Obj): IExecutor;
    reportError(error: ConvertError): void;
    addCleanup(cleanup: Cleanup): void;
    executeSingleStep(): IExecutor | undefined;
}

interface Props {
    accumulator: StepAccumulator;
    inventory?: Record<string, any>;
    doors?: Record<string, Door>;
}

let nextExecutorId = 1;
export class Executor implements IExecutor {
    //  Executor ID
    id: number = 0;

    //  steps followed by the executor
    accumulator: StepAccumulator;

    //  doors that can lead to new execution
    doors: Record<string, Door>;
    initialDoors: Record<string, Door>;

    //  state
    nextStep: StepId = 0;           //  Next step
    inventory: Inventory;                   //  inventory carried
    initialInventory: Inventory;

    //  error report
    errors: ConvertError[] = [];    //  any error encountered

    //  cleanup
    cleanups: Set<Cleanup> = new Set();

    //  children
    children: Children = new Children(this);
    parent: IExecutor | undefined;

    constructor({accumulator, inventory = {}, doors = {}}: Props, parent?: IExecutor) {
        this.parent = parent;
        this.accumulator = accumulator;
        const stash: Record<string, any>[] = [];
        this.initialInventory = { stash, ...inventory};
        this.inventory = { ...this.initialInventory };
        this.initialDoors = doors;
        this.doors = {...this.initialDoors};
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

    executeSingleStep(): IExecutor | undefined {
        if (!this.id) {
            this.id = nextExecutorId++;
        }
        const step = this.nextStep++;
        const executionStep = this.accumulator.getStep(step);
        if (executionStep) {
            console.log(`${this.id}-${step}`, executionStep.description);
            const returnValue = executionStep.execute?.(this);
            return returnValue ? returnValue.executor : this;
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

    passDoor(name: string, passedInventory: Obj): IExecutor {
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

    spawn(): Executor {
        return this.children.spawn();
    }

    private clearInventory() {
        for (let i in this.inventory) {
            if (this.initialInventory[i] !== undefined) {
                this.inventory[i] = this.initialInventory[i];
            } else {
                delete this.inventory[i];
            }
        }
    }

    private clearDoors() {
        for (let i in this.doors) {
            if (this.initialDoors[i] !== undefined) {
                this.doors[i] = this.initialDoors[i];
            } else {
                delete this.doors[i];
            }
        }
    }

    cleanup(): void {
        this.children.cleanup();
        this.cleanups.forEach(cleanup => cleanup.cleanup());
        this.clearInventory();
        this.clearDoors();
        this.errors.length = 0;
        this.id = 0;
        this.reset();
    }
}