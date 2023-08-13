import { Executor, IExecutor } from "../Executor";

const MAX_STEPS_TAKEN = 1000;

export function executeUntilStop(executor: Executor) {
    let stepCount = 0;

    let exec: IExecutor | undefined = executor;
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