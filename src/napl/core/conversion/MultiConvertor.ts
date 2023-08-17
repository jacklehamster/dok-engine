import { Context, Convertor, ConvertorConfig } from "./Convertor";
import { ConvertError } from "../error/errors";
import { Aux } from "../../../types/Aux";
import { Deserializer } from "./Deserializer";

export class MultiConvertor<A extends Aux = Aux, C extends Context = Context> extends Convertor<A, C> {
    private readonly convertors: Convertor<A>[] = [];

    constructor(convertors?: Convertor<A, C>[] | { convertors: ConvertorConfig[] }, deserializer?: Deserializer) {
        super();
        if (Array.isArray(convertors)) {
            this.setConvertors(convertors);
        } else {
            const convertorObjs = convertors?.convertors
                .map(config => deserializer?.deserialize(config))
                .filter((c): c is Convertor<A,C> => !!c);
            this.setConvertors(convertorObjs);
        }
    }

    private setConvertors(convertors: Convertor<A, C>[] = []) {
        this.convertors.length = 0;
        this.convertors.push(...convertors);
        this.convertors.sort((c1, c2) => {
            if (c1.priority !== c2.priority) {
                return c2.priority - c1.priority;
            }
            return c1.constructor.name.localeCompare(c2.constructor.name);
        });
        console.log("Convertor order:", this.convertors.map(({constructor: {name}, priority}) => `${name} (${priority})`));
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

    serialize(): ConvertorConfig {
        return {
            type: this.constructor.name,
            config: {
                convertors: this.convertors.map((convertor) => convertor.serialize()),
            }
        };
    }
}
