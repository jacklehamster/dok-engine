import { Action } from "../actions/Action";
import { ConvertError } from "../error/errors";
import { Context, Convertor } from "./Convertor";

export class MultiConvertor<A extends Action = Action, C extends Context<A> = Context<A>> extends Convertor<A, C> {
    convertors: Convertor<A>[];

    constructor(...convertors: Convertor<A>[]) {
        super();
        this.convertors = convertors.sort((c1, c2) => {
            if (c1.priority !== c2.priority) {
                return c2.priority - c1.priority;
            }
            return c1.name.localeCompare(c2.name);
        });
        console.log("Convertor order:", this.convertors.map(({name}) => name));
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
