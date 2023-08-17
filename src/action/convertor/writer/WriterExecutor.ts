import { Action } from "../../actions/Action";
import { Executor } from "../../execution/Executor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { ActionContext } from "../ActionConvertor";

export class WriterExecutor<A extends Action = Action> extends Executor {
    action: A;
    context: ActionContext<A>;
    labels: Record<string, number>;

    constructor(accumulator: StepAccumulator,
            action:  A,
            context: ActionContext,
            labels: Record<string, number> = {}) {
        super({ accumulator });
        this.action = action
        this.context = context;
        this.labels = labels;

        this.inventory.action = action;
    }
}