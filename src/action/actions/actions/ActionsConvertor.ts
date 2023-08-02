import { Action } from "../Action";
import { ActionsAction } from "./ActionsAction";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { Convertor } from "../../convertor/Convertor";
import { Validator } from "../../convertor/validators/Validator";

export class ActionsConvertor implements Convertor {
    convert<T extends Action>(
            action: ActionsAction<T>,
            accumulator: StepAccumulator,
            subconvertor: Convertor): void {
        action.actions.forEach(action => subconvertor.convert(action, accumulator, subconvertor));
    }
}

export class ActionsValidator implements Validator {
    validate(action: Action): boolean {
        return Array.isArray(action.actions);
    }
}