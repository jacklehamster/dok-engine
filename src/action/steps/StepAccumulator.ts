import { Inventory } from "../data/inventory/Inventory";
import { ExecutionStep, StepId } from "./ExecutionStep";

export class StepAccumulator<I extends Inventory = Inventory> {
    private steps: ExecutionStep<I>[] = [];

    add(step: ExecutionStep<I>): StepId {
        const id = this.steps.length;
        this.steps[id] = step;
        return id;
    }

    getStep(stepId: StepId) {
        return this.steps[stepId];
    }

    clear() {
        this.steps.length = 0;
    }
}