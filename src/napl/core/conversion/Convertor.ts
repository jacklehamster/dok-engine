import { ConvertError } from "../error/errors";
import { Aux } from "../../../types/Aux";

export interface ConvertorConfig {
    type: string;
    config?: any;
}

export interface Context {
}

export abstract class Convertor<A extends Aux = Aux, C extends Context = Context> {
    get type(): string {
        return this.constructor.name;
    }

    abstract validate(action: Aux): boolean;

    priority: number = 0;

    validationErrors(_: A, __: ConvertError[]): void {
        //  can override
    }

    abstract convert(action: A, context: C): void;

    abstract serialize(): ConvertorConfig;
}
