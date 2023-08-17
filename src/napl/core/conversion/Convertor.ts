import { ConvertError } from "../error/errors";
import { Aux } from "../../../types/Aux";
import { Entity } from "../../../types/Entity";

export interface ConvertorConfig {
    type: string;
    config?: any;
}

export interface Context<A extends Aux = Aux> {
    subject: Entity;
    subConvertor: Convertor<A>;
}

export abstract class Convertor<A extends Aux = Aux, C extends Context = Context> {
    get type(): string {
        return this.constructor.name;
    }

    abstract validate(aux: Aux): boolean;

    priority: number = 0;

    validationErrors(_aux: A, _errors: ConvertError[]): void {
        //  can override
    }

    abstract convert(aux: A, context: C): void;

    abstract serialize(): ConvertorConfig;
}
