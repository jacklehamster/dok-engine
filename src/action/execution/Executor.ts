import { ConvertError } from "../actions/error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";

export interface Executor {
    skipNextStep(): Executor;
    jumpTo(step: StepId): Executor;
    evaluate<T>(value: ValueOf<T>): T | null;
    evaluateArray<T>(values: ValueOf<T>[], result: (T|null)[]): void;
    ifCondition(bool: ValueOf<boolean>): Executor;
    reportError(error: ConvertError): void;
}

class NoopExecutor implements Executor {
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

interface Props<I extends Inventory = Inventory> {
    accumulator: StepAccumulator;
    inventory: I;
}

export class ExecutorBase<I extends Inventory = Inventory> implements Executor {
    nextStep: StepId = 0;
    accumulator: StepAccumulator<I>;
    inventory: I;
    errors: ConvertError[] = [];

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
        return value.valueOf(this.inventory);
    }

    evaluateArray<T>(values: ValueOf<T>[], result: (T|null)[]): void {
        for (let i = 0; i < values.length; i++) {
            result[i] = this.evaluate(values[i]);
        }
    }

    executeSingleStep() {
        const step = this.nextStep++;
        const executionStep = this.accumulator.getStep(step);
        if (executionStep) {
            console.log("Executing", executionStep.description);
            executionStep.execute?.(this.inventory, this);
            if (this.errors.length) {
                throw new Error("Errors:" + JSON.stringify(this.errors));
            }
            return true;
        }
        return false;
    }

    reportError(error: ConvertError) {
        this.errors.push(error)
    }

    executeUtilStop() {
        for (let i = 0; i < MAX_STEPS_PER_EXECUTION; i++) {
            if (!this.executeSingleStep()) {
                return;
            }
        }
        throw new Error(`Execution is considered stuck after running ${MAX_STEPS_PER_EXECUTION} steps.`);
    }
}