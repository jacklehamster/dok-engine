import { Inventory } from "../data/inventory/Inventory";
import { Executor, IExecutor } from "../execution/Executor";

export type StepId = number;

export interface ExecutionStep<I extends Inventory = Inventory> {
    description?: string;
    execute?(executor: IExecutor<I>): Executor<I> | void;
}
