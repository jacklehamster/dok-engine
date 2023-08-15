import { Action } from "../../actions/Action";
import { ConvertError } from "../../error/errors";
import { asArray } from "../../utils/array-utils";
import { Convertor } from "../Convertor";
import { Validation } from "../coded/CodedValidator";
import { verifyDefined, verifyType } from "../writer/validation/verifyType";


export interface BaseConvertorConfig {
    priority?: number;
    field: string | string[];
    forbiddenField?: string | string[];
    validations?: Validation[];
}

export abstract class BaseConvertor<A extends Action = Action> extends Convertor<A> {
    private field: string[];
    private forbiddenField: string[];
    private validations: Validation[];

    constructor({ field, forbiddenField, priority = 0, validations = [] }: BaseConvertorConfig) {
        super();
        this.priority = priority,
        this.field = asArray(field);
        this.forbiddenField = asArray(forbiddenField);
        this.validations = validations;
    }

    validate(action: Action): boolean {
        return this.field.every(field => action[field] !== undefined)
            && this.forbiddenField.every(field => action[field] === undefined || action[field] === null);
    }

    validationErrors(action: A, errors: ConvertError[]): void {
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
}