import { Context, Convertor } from "./Convertor";
import { SerializerConfig } from "../serialization/SerializerConfig";
import { ConvertError } from "../error/errors";
import { Aux } from "../../../types/Aux";
import { Deserializer } from "../serialization/Deserializer";
import { asArray } from "../../../action/utils/array-utils";

export class MultiConvertor<A extends Aux = Aux, C extends Context = Context> extends Convertor<A, C> {
    private readonly convertors: Convertor<A>[] = [];
    private subjectType?: string[];

    constructor(convertors?: Convertor<A, C>[] | { convertors: SerializerConfig[]; subjectType: string[] }, {
        deserializer,
        subjectType,
    }: { deserializer?: Deserializer, subjectType?: string } = {} ) {
        super();
        if (Array.isArray(convertors)) {
            this.subjectType = asArray(subjectType);
            this.setConvertors(convertors);
        } else {
            const convertorObjs = convertors?.convertors
                .map(config => deserializer?.deserialize(config))
                .filter((c): c is Convertor<A,C> => !!c);
            this.setConvertors(convertorObjs);
            this.subjectType = convertors?.subjectType ?? asArray(subjectType);
        }
    }

    validate(_aux: Aux, context: C): boolean {
        return !this.subjectType?.length || this.subjectType?.indexOf(context.subject?.type ?? "") >= 0;
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
            if (convertor.validate(action, context)) {
                const errors: ConvertError[] = [];
                convertor.validationErrors(action, context, errors);
                if (errors.length) {
                    throw new Error("Errors in conversion : " + JSON.stringify(errors));
                }
                convertor.convert(action, context);
            }
        }
    }

    serialize(): SerializerConfig {
        return {
            type: this.constructor.name,
            config: {
                subjectType: this.subjectType,
                convertors: this.convertors.map((convertor) => convertor.serialize()),
            }
        };
    }
}
