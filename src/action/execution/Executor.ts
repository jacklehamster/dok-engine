import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";
import { Cleanup } from "./cleanup/Cleanup";

export interface IExecutor {
    get inventory(): Inventory;
    get errors(): ConvertError[];
    reset(): void;
    ifCondition(bool: ValueOf<boolean>): IExecutor | null;
    evaluate<T>(value: ValueOf<T>): T | null;
    skipNextStep(): IExecutor;
    jumpTo(step: StepId): IExecutor;
    stash(itemKeys: string[]): void;
    unstash(): void;
    reportError(error: ConvertError): void;
    addCleanup(cleanup: Cleanup): void;
    executeSingleStep(): boolean;
    pushState(newInventory: Record<string, any>): void;
    popState(): void;
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
    initialInventory: Inventory;
    inventories: Inventory[] = [];
    stepStack: number[] = [];

    //  error report
    errors: ConvertError[] = [];    //  any error encountered

    //  cleanup
    cleanups: Set<Cleanup> = new Set();

    constructor({accumulator, inventory = {}}: Props) {
        this.accumulator = accumulator;
        const stash: Record<string, any>[] = [];
        this.initialInventory = { stash, ...inventory};
        this.inventory = { ...this.initialInventory };
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

    addCleanup(cleanup: Cleanup): void {
        this.cleanups.add(cleanup);
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

    pushState(newInventory: Record<string, any>): void {
        this.inventories.push(this.inventory);
        this.inventory = {...this.initialInventory};
        for (let i in newInventory) {
            this.inventory[i] = newInventory[i];
        }
    }

    popState(): void {
        const inventory = this.inventories.pop();
        if (inventory) {
            this.inventory = inventory;
        }
    }

    pushStep(): void {
        this.stepStack.push(this.nextStep);
    }

    popStep(): void {
        const nextStep = this.stepStack.pop();
        if (nextStep !== undefined) {
            this.nextStep = nextStep;
        }
    }

    cleanup(): void {
        this.cleanups.forEach(cleanup => cleanup.cleanup());
        this.clearInventory();
        this.errors.length = 0;
        this.inventories.length = 0;
        this.id = 0;
        this.reset();
    }
}