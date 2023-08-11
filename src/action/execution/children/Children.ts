import { Executor } from "../Executor";
import { ObjPool } from "../pool/ObjPool";

export class Children {
    private executor: Executor;
    private executors: Set<Executor> = new Set();
    private pool: ObjPool<Executor>;

    constructor(executor: Executor) {
        this.executor = executor;
        this.pool = new ObjPool<Executor>(() => new Executor({
                inventoryInitializer: this.executor.inventoryInitializer,
                accumulator: this.executor.accumulator,
                doors: {...this.executor.doors},            
            }, this.executor),
            (executor) => executor.cleanup());
    }

    spawn(): Executor {
        return this.pool.get();
    }

    cleanup() {
        this.executors.forEach(executor => {
            executor.cleanup();
            this.pool.recycle(executor);
        });
    }
}