import { Action } from "../actions/Action";
import { StepAccumulator } from "../steps/StepAccumulator";
import { Convertor } from "./Convertor";
import { Validator } from "./validators/Validator";

export interface ConversionIntercept {
    validator: Validator;
    convertor: Convertor;
}


export class MultiConvertor implements Convertor {
    intercepts: ConversionIntercept[] = [];

    constructor(intercepts: ConversionIntercept[]) {
        this.intercepts = intercepts;
    }
    convert(action: Action, accumulator: StepAccumulator, subconvertor: Convertor): void {
        for (let intercept of this.intercepts) {
            if (intercept.validator.validate(action)) {
                intercept.convertor.convert(action, accumulator, subconvertor);
            }
        }
    }
}