import { IExecutor } from "../Executor";

const MAX_STEPS_TAKEN = 1000;

export function executeUntilStop(executor: IExecutor) {
    let stepCount = 0;

    let running: boolean = true;
    while (running) {
        running = executor?.executeSingleStep();

        if (executor?.errors.length) {
            console.error("Errors in execution: ", executor.errors);
        }
        if (++stepCount > MAX_STEPS_TAKEN) {
            throw new Error(`${MAX_STEPS_TAKEN} steps taken without completing.`)
        }
    }
}
