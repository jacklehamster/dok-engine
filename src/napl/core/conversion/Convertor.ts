import { ConvertError } from "../error/errors";
import { Aux } from "../../../types/Aux";
import { Entity } from "../../../types/entities/Entity";
import { SerializerConfig } from "../serialization/SerializerConfig";

export interface Context<A extends Aux = Aux, E extends Entity = Entity> {
    subject?: E;
    subConvertor?: Convertor<A>;
}

export abstract class Convertor<A extends Aux = Aux, C extends Context = Context> {
    get type(): string {
        return this.constructor.name;
    }

    validate(_aux: Aux, _context: C): boolean {
        // can override
        return true;
    }

    priority: number = 0;

    validationErrors(_aux: A, _context: Context, _errors: ConvertError[]): void {
        //  can override
    }

    abstract convert(aux: A, context: C): void;

    abstract serialize(): SerializerConfig;
}
