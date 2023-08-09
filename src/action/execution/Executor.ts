import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";
import Door from "./Door";

export interface IExecutor<I extends Inventory = Inventory> {
    skipNextStep(): IExecutor;
    jumpTo(step: StepId): IExecutor;
    evaluate<T>(value: ValueOf<T>): T | null;
    evaluateArray<T>(values: ValueOf<T>[], result: (T|null)[]): void;
    ifCondition(bool: ValueOf<boolean>): IExecutor | null;
    reportError(error: ConvertError): void;
    get inventory(): I;
    stash(itemKeys: string[]): void;
    unstash(): void;
}

const MAX_STEPS_PER_EXECUTION = 1000;
const MAX_STEPS_TAKEN = 5000;

interface Props<I extends Inventory = Inventory> {
    accumulator: StepAccumulator;
    inventory: I;
}

let stepCount = 0;
let nextExecutorId = 1;
export class Executor<I extends Inventory = Inventory> implements IExecutor {
    //  Executor ID
    id: number = 0;

    //  steps followed by the executor
    accumulator: StepAccumulator<I>;

    //  doors that can lead to new execution
    doors: Record<string, Door> = {};

    //  state
    nextStep: StepId = 0;           //  Upcoming step
    inventory: I;                   //  inventory carried
    errors: ConvertError[] = [];    //  any error encountered

    constructor({accumulator, inventory}: Props<I>) {
        this.inventory = inventory;
        this.accumulator = accumulator;
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

    evaluateArray<T>(values: ValueOf<T>[], result: (T|null)[]): void {
        for (let i = 0; i < values.length; i++) {
            result[i] = this.evaluate(values[i]);
        }
    }

    executeSingleStep() {
        stepCount++;
        if (stepCount > MAX_STEPS_TAKEN) {
            throw new Error(`${MAX_STEPS_TAKEN} steps taken without completing.`)
        }
        const step = this.nextStep++;
        const executionStep = this.accumulator.getStep(step);
        if (executionStep) {
            console.log(`${this.id}-${step}`, executionStep.description);
            executionStep.execute?.(this);
            if (this.errors.length) {
                return false;
            }
            return true;
        }
        return false;
    }

    reportError(error: ConvertError) {
        this.errors.push(error)
    }

    executeUtilStop() {
        if (!this.id) {
            this.id = nextExecutorId++;
        }
        let i;
        for (i = 0; i < MAX_STEPS_PER_EXECUTION; i++) {
            if (!this.executeSingleStep()) {
                break;
            }
        }
        if (i >= MAX_STEPS_PER_EXECUTION) {
            throw new Error(`Execution is considered stuck after running ${MAX_STEPS_PER_EXECUTION} steps.`);
        }
        if (this.errors.length) {
            console.error("Errors in execution: ", this.errors);
        }
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
}