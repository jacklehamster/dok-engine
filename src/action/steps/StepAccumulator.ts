import { ExecutionStep, StepId } from "./ExecutionStep";

export interface StepAccumulator {
    add(step: ExecutionStep): StepId;
}