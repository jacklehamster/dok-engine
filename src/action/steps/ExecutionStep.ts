import { IExecutor } from "../execution/Executor";

export type StepId = number;

export interface ExecutionStep {
    description?: string;
    execute?(executor: IExecutor): void;
}
