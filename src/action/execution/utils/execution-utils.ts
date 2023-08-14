import { Executor, IExecutor } from "../Executor";

const MAX_STEPS_TAKEN = 1000;

export function executeUntilStop(executor: Executor) {
    let stepCount = 0;

    let running: boolean = true;
    let exec: IExecutor | undefined = executor;
    while (running) {
        running = executor?.executeSingleStep();

        if (exec?.errors.length) {
            console.error("Errors in execution: ", exec.errors);
        }
        if (++stepCount > MAX_STEPS_TAKEN) {
            throw new Error(`${MAX_STEPS_TAKEN} steps taken without completing.`)
        }
    }
}