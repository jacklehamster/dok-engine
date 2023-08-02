import { Action } from "../actions/Action";
import { StepAccumulator } from "../steps/StepAccumulator";

export interface Convertor {
    convert(action: Action, accumulator: StepAccumulator, subconvertor: Convertor): void;
}
