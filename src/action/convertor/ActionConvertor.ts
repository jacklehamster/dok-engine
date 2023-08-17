import { Convertor } from "../../napl/core/conversion/Convertor";
import { Action } from "../actions/Action";
import { ConvertError } from "../../napl/core/error/errors";
import { StepAccumulator } from "../steps/StepAccumulator";

export interface ActionContext<A extends Action = Action> {
    accumulator: StepAccumulator,
    subConvertor: ActionConvertor<A, ActionContext<A>>,
};

export abstract class ActionConvertor<A extends Action = Action, C extends ActionContext<A> = ActionContext<A>> extends Convertor<A, C> {
    abstract validate(action: Action): boolean;

    priority: number = 0;

    validationErrors(_: A, __: ConvertError[]): void {
        //  can override
    }

    abstract convert(action: A, context: C): void;
}
