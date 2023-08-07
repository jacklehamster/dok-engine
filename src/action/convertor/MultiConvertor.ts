import { Action } from "../actions/Action";
import { ConvertError } from "../actions/error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { Context, Convertor } from "./Convertor";

export class MultiConvertor<A extends Action = Action, I extends Inventory = Inventory, C extends Context = Context> extends Convertor<A, I, C> {
    convertors: Convertor<A>[];

    constructor(...convertors: Convertor<A>[]) {
        super();
        this.convertors = convertors;
    }

    convert(action: A, context: C): void {
        for (let convertor of this.convertors) {
            if (convertor.validate(action)) {
                convertor.convert(action, context);
            }
        }
    }

    validate(): boolean {
        return true;
    }

    validationErrors(action: A, errors: ConvertError[]): void {
        for (let convertor of this.convertors) {
            if (convertor.validate(action)) {
                convertor.validationErrors(action, errors);
            }
        }
    }
}
