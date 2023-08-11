import { Action } from "../../actions/Action";
import { Executor } from "../../execution/Executor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { Context } from "../Convertor";

export class WriterExecutor<A extends Action = Action> extends Executor {
    action: A;
    context: Context<A>;
    labels: Record<string, number>;

    constructor(accumulator: StepAccumulator,
            action:  A,
            context: Context,
            labels: Record<string, number> = {}) {
        super({ accumulator });
        this.action = action
        this.context = context;
        this.labels = labels;

        this.inventory.action = action;
    }
}