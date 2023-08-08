import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";

export interface Executor<I extends Inventory = Inventory> {
    skipNextStep(): Executor;
    jumpTo(step: StepId): Executor;
    evaluate<T>(value: ValueOf<T>): T | null;
    evaluateArray<T>(values: ValueOf<T>[], result: (T|null)[]): void;
    ifCondition(bool: ValueOf<boolean>): Executor;
    reportError(error: ConvertError): void;
    get inventory(): I;
}

class NoopExecutor implements Executor {
    inventory: Inventory = {};

    static INSTANCE: NoopExecutor = new NoopExecutor();

    jumpTo(): Executor {
        return this;
    }
    skipNextStep(): Executor {
        return this;
    }
    evaluate(): null {
        return null;
    }
    ifCondition(): Executor {
        return this;
    }

    reportError(): void {
        //  DO NOTHING
    }

    evaluateArray(): void {
        //  DO NOTHING
    }
}

const MAX_STEPS_PER_EXECUTION = 1000;
const MAX_STEPS_TAKEN = 5000;

interface Props<I extends Inventory = Inventory> {
    accumulator: StepAccumulator;
    inventory: I;
}

let stepCount = 0;
let nextExecutorId = 1;
export class ExecutorBase<I extends Inventory = Inventory> implements Executor {
    nextStep: StepId = 0;
    accumulator: StepAccumulator<I>;
    inventory: I;
    errors: ConvertError[] = [];
    id: number = 0;

    constructor({accumulator, inventory}: Props<I>) {
        this.inventory = inventory;
        this.accumulator = accumulator;
    }

    jumpTo(step: StepId): Executor {
        this.nextStep = step;
        return this;
    }

    skipNextStep(): Executor {
        this.nextStep++;
        return this;
    }

    ifCondition(bool: boolean): Executor {
        if (!bool) {
            return NoopExecutor.INSTANCE;
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
}