import { verifyType } from "../../../action/convertor/writer/validation/verifyType";
import { Aux } from "../../../types/Aux";
import { ConvertError } from "../error/errors";
import { Context, Convertor } from "./Convertor";
import { SerializerConfig } from "../serialization/SerializerConfig";
import { ConvertorDeserializer } from "../serialization/ConvertorDeserializer";
import { MultiConvertor } from "./MultiConvertor";

export interface ConvertorsAux {
    convertors: SerializerConfig[];
}

export class ConvertorsConvertor extends Convertor<ConvertorsAux> {
    priority: number = 1;
    deserializer: ConvertorDeserializer;;

    constructor() {
        super();
        this.deserializer = new ConvertorDeserializer({ instances: [this] });
    }

    validate(aux: Aux): boolean {
        return aux.convertors;
    }

    convert(aux: ConvertorsAux, context: Context): void {
        const convertors: Convertor[] = [];
        aux.convertors.map(conv => this.deserializer.deserialize(conv)).forEach(convertor => {
            convertors.push(convertor);
        });
        context.subConvertor = new MultiConvertor(convertors);
    }

    serialize(): SerializerConfig {
        return {
            type: this.type,
        };
    }
    
    validationErrors(aux: ConvertorsAux, _context: Context, errors: ConvertError[]): void {
        verifyType(aux, "convertors", ["array"], errors);
    }
}

export const INITIAL_CONVERTORS = new MultiConvertor<Aux>([
    new ConvertorsConvertor(),
]);