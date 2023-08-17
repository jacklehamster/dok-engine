import { ConvertError } from "../../napl/core/error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";
import { InventoryPool } from "../data/inventory/InventoryPool";
import { OBJECT_POOL } from "./pool/ObjPool";

export interface IExecutor {
    get inventory(): Inventory;
    get errors(): ConvertError[];
    reset(): void;
    ifCondition(bool: ValueOf<boolean>): IExecutor | null;
    evaluate<T>(value: ValueOf<T>): T | null;
    skipNextStep(): void;
    jumpTo(step: StepId): void;
    stash(itemKeys: string[]): void;
    unstash(clean: boolean): void;
    reportError(error: ConvertError): void;
    executeSingleStep(): boolean;
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
    private id: number = 0;

    //  steps followed by the executor
    private accumulator: StepAccumulator;

    //  state
    private nextStep: StepId = 0;           //  Next step
    inventory: Inventory;                   //  inventory carried
    private inventoryPool: InventoryPool;
    private stepStack: number[] = [];
    private stashes: Record<string, any>[] = [];

    //  error report
    errors: ConvertError[] = [];    //  any error encountered

    constructor({accumulator, inventory = {}}: Props) {
        this.inventoryPool = new InventoryPool(inventory);
        this.accumulator = accumulator;
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

    jumpTo(step: StepId): void {
        this.nextStep = step;
    }

    skipNextStep(): void {
        this.nextStep++;
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
        const step = this.nextStep;
        const executionStep = this.accumulator.getStep(step);
        if (executionStep) {
            this.nextStep++;
            console.log(`${this.id}-${step}`, executionStep.description);
            executionStep.execute?.(this);
            return true;
        }
        return false;
    }

    reportError(error: ConvertError) {
        this.errors.push(error)
    }

    stash(itemKeys: string[]): void {
        const items: Record<string, any> = OBJECT_POOL.get();
        this.stashes.push(items);
        for (let key of itemKeys) {
            items[key] = this.inventory[key];
        }
    }

    unstash(): void {
        const items = this.stashes.pop();
        const inventory = this.inventory as Inventory;
        for (let key in items) {
            inventory[key] = items[key];
        }
        OBJECT_POOL.recycle(items);
    }

    pushStep(): void {
        this.stepStack.push(this.nextStep);
    }

    popStep(): void {
        this.nextStep = this.stepStack.pop() ?? this.accumulator.count();
    }
}