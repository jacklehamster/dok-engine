import { IExecutor } from "../execution/Executor";

export type StepId = number;

export interface ReturnValue {
    executor?: IExecutor;
}

export interface ExecutionStep {
    description?: string;
    execute?(executor: IExecutor): ReturnValue | void;
}
