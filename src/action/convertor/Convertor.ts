import { Action } from "../actions/Action";
import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { StepAccumulator } from "../steps/StepAccumulator";

export interface Context<A extends Action = Action, I extends Inventory = Inventory> {
    accumulator: StepAccumulator<I>,
    subConvertor: Convertor<A, I, Context<A, I>>,
};

export abstract class Convertor<A extends Action = Action, I extends Inventory = Inventory, C extends Context<A, I> = Context> {
    abstract validate(action: Action): boolean;

    priority: number = 0;

    get name() {
        return this.constructor.name;
    }

    validationErrors(_: A, __: ConvertError[]): void {
        //  can override
    }

    process(action: A, context: C, errors: ConvertError[]) {
        if (this.validate(action)) {
            const localErrors: ConvertError[] = [];
            this.validationErrors(action, errors);
            if (localErrors.length) {
                errors.push(...localErrors);
                return;
            }
            this.convert(action, context);
        }
    }

    abstract convert(action: A, context: C): void;
}
