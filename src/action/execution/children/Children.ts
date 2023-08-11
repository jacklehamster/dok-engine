import { Inventory } from "../../data/inventory/Inventory";
import { Executor } from "../Executor";

export class Children<I extends Inventory = Inventory> {
    private executor: Executor<I>;
    private executors: Set<Executor<I>> = new Set();

    constructor(executor: Executor<I>) {
        this.executor = executor;
    }

    spawn(): Executor<I> {
        return new Executor<I>({
            inventoryInitializer: this.executor.inventoryInitializer,
            accumulator: this.executor.accumulator,
            doors: {...this.executor.doors},            
        }, this.executor);
    }

    destroy() {
        this.executors.forEach(executor => executor.destroy());
    }
}