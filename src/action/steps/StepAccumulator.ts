import { ExecutionStep, StepId } from "./ExecutionStep";

export class StepAccumulator {
    private steps: ExecutionStep[] = [];

    add(step: ExecutionStep): StepId {
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