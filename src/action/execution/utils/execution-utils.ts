import { Inventory } from "../../data/inventory/Inventory";
import { Executor } from "../Executor";

const MAX_STEPS_TAKEN = 1000;

export function executeUntilStop<I extends Inventory = Inventory>(executor: Executor<I>) {
    let stepCount = 0;

    let exec: Executor<I> | undefined = executor;
    while (exec) {
        exec = exec?.executeSingleStep();

        if (exec?.errors.length) {
            console.error("Errors in execution: ", exec.errors);
        }
        if (++stepCount > MAX_STEPS_TAKEN) {
            throw new Error(`${MAX_STEPS_TAKEN} steps taken without completing.`)
        }
    }
}