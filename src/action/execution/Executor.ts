import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";
import { Cleanup } from "./cleanup/Cleanup";
import { InventoryPool } from "../data/inventory/InventoryPool";
import { OBJECT_POOL } from "./pool/ObjPool";

export interface IExecutor {
    get inventory(): Inventory;
    get errors(): ConvertError[];
    reset(): void;
    ifCondition(bool: ValueOf<boolean>): IExecutor | null;
    evaluate<T>(value: ValueOf<T>): T | null;
    skipNextStep(): IExecutor;
    jumpTo(step: StepId): IExecutor;
    stash(itemKeys: string[]): void;
    unstash(clean: boolean): void;
    reportError(error: ConvertError): void;
    addCleanup(cleanup: Cleanup): void;
    executeSingleStep(): boolean;
    pushState(newInventory: Record<string, any>): void;
    pushStep(): void;
    popStep(): void;
}

interface Props {
    accumulator: StepAccumulator;
    inventory?: Record<string, any>;
}

let nextExecutorId = 1;
export class Executor implements IExecutor {
    //  Executor ID
    id: number = 0;

    //  steps followed by the executor
    accumulator: StepAccumulator;

    //  state
    nextStep: StepId = 0;           //  Next step
    inventory: Inventory;                   //  inventory carried
    inventoryPool: InventoryPool;
    stepStack: number[] = [];
    stashes: Record<string, any>[] = [];

    //  error report
    errors: ConvertError[] = [];    //  any error encountered

    //  cleanup
    cleanups: Set<Cleanup> = new Set();

    constructor({accumulator, inventory = {}}: Props) {
        this.accumulator = accumulator;
        this.inventoryPool = new InventoryPool(inventory);
        this.inventory = this.inventoryPool.get();
    }

    reset() {
        this.nextStep = 0;
        this.stepStack.length = 0;
        while(this.stashes.length) {
            OBJECT_POOL.recycle(this.stashes.pop());
        }
        this.stashes.length = 0;
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

    executeSingleStep(): boolean {
        if (!this.id) {
            this.id = nextExecutorId++;
        }
        const step = this.nextStep++;
        const executionStep = this.accumulator.getStep(step);
        if (executionStep) {
            console.log(`${this.id}-${step}`, executionStep.description);
            executionStep.execute?.(this);
            return true;
        }
        return false;
    }

    reportError(error: ConvertError) {
        this.errors.push(error)
    }

    pushState(newInventory: Record<string, any>): void {
        this.stashes.push(this.inventory);
        this.inventory = Object.assign(this.inventoryPool.get(), newInventory);
    }

    stash(itemKeys: string[]): void {
        const items: Record<string, any> = OBJECT_POOL.get();
        this.stashes.push(items);
        for (let key of itemKeys) {
            items[key] = this.inventory[key];
        }
    }

    unstash(clean: boolean): void {
        const items = this.stashes.pop();
        if (clean) {
            this.inventory = items ?? this.inventoryPool.get();
        } else if (items) {
            const inventory = this.inventory as Inventory;
            for (let key in items) {
                inventory[key] = items[key];
            }
            OBJECT_POOL.recycle(items);
        }
    }

    addCleanup(cleanup: Cleanup): void {
        this.cleanups.add(cleanup);
    }

    pushStep(): void {
        this.stepStack.push(this.nextStep);
    }

    popStep(): void {
        this.nextStep = this.stepStack.pop() ?? this.nextStep;
    }

    cleanup(): void {
        this.cleanups.forEach(cleanup => cleanup.cleanup());
        this.inventory = this.inventoryPool.cleanup(this.inventory);
        this.errors.length = 0;
        this.id = 0;
        this.reset();
    }
}