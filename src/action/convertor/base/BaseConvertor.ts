import { Context, Convertor } from "../../../napl/core/conversion/Convertor";
import { SerializerConfig } from "../../../napl/core/serialization/SerializerConfig";
import { ConvertError } from "../../../napl/core/error/errors";
import { asArray } from "../../utils/array-utils";
import { Validation } from "../coded/CodedValidator";
import { verifyDefined, verifyType } from "../writer/validation/verifyType";
import { Aux } from "../../../types/Aux";


export interface BaseConvertorConfig {
    priority?: number;
    field: string | string[];
    forbiddenField?: string | string[];
    validations?: Validation[];
}

export abstract class BaseConvertor<A extends Aux = Aux, C extends Context<A> = Context<A>> extends Convertor<A, C> {
    protected config: BaseConvertorConfig;
    private field: string[];
    private forbiddenField: string[];
    private validations: Validation[];

    constructor(config: BaseConvertorConfig) {
        super();
        this.config = config;
        const { field, forbiddenField, priority = 0, validations = [] } = this.config;
        this.priority = priority,
        this.field = asArray(field);
        this.forbiddenField = asArray(forbiddenField);
        this.validations = validations;
    }

    validate(action: Aux): boolean {
        return this.field.every(field => action[field] !== undefined)
            && this.forbiddenField.every(field => action[field] === undefined || action[field] === null);
    }

    validationErrors(action: A, _context: C, errors: ConvertError[]): void {
        this.validations.forEach(({ field, types, defined }) => {
            if (!field) {
                return;
            }
            if (types) {
                verifyType(action, field, types, errors);
            }
            if (defined) {
                verifyDefined(action, field, errors);
            }
        });
    }

    serialize(): SerializerConfig {
        return {
            type: this.constructor.name,
            config: this.config,
        };
    }
}