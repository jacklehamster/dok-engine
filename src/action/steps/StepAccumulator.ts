import { ExecutionStep, StepId } from "./ExecutionStep";

export class StepAccumulator {
    private steps: ExecutionStep[] = [];
    private labels: Record<string, number> = {};

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

    addLabel(label: string, step: number) {
        this.labels[label] = step;
    }

    getLabel(label: string): number | undefined {
        return this.labels[label];
    }
}