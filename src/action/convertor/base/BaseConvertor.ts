import { ConvertorConfig } from "../../../napl/core/conversion/Convertor";
import { Action } from "../../actions/Action";
import { ConvertError } from "../../../napl/core/error/errors";
import { asArray } from "../../utils/array-utils";
import { ActionConvertor } from "../ActionConvertor";
import { Validation } from "../coded/CodedValidator";
import { verifyDefined, verifyType } from "../writer/validation/verifyType";


export interface BaseConvertorConfig {
    priority?: number;
    field: string | string[];
    forbiddenField?: string | string[];
    validations?: Validation[];
}

export abstract class BaseConvertor<A extends Action = Action> extends ActionConvertor<A> {
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

    serialize(): ConvertorConfig {
        return {
            type: this.constructor.name,
            config: this.config,
        };
    }
}