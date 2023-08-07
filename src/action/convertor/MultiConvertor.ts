import { Action } from "../actions/Action";
import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { Context, Convertor } from "./Convertor";

export class MultiConvertor<A extends Action = Action, I extends Inventory = Inventory, C extends Context = Context> extends Convertor<A, I, C> {
    convertors: Convertor<A>[];

    constructor(...convertors: Convertor<A>[]) {
        super();
        this.convertors = convertors.sort((c1, c2) => {
            if (c1.priority !== c2.priority) {
                return c2.priority - c1.priority;
            }
            return c1.name.localeCompare(c2.name);
        });
        console.log(this.convertors.map(({name}) => name));
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
