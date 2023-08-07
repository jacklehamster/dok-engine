import { Inventory } from "../data/inventory/Inventory";
import { Executor } from "../execution/Executor";

export type StepId = number;

export interface ExecutionStep<I extends Inventory = Inventory> {
    description?: string;
    execute?(executor: Executor<I>): void;
}
