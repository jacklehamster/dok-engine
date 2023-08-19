import { BaseConvertor, BaseConvertorConfig } from "../../../action/convertor/base/BaseConvertor";
import { verifyType } from "../../../action/convertor/writer/validation/verifyType";
import { resolveByType } from "../../../action/data/resolution/TypedResolution";
import { Aux } from "../../../types/Aux";
import { EntityKey } from "../../../types/entities/Entity";
import { ConvertError } from "../error/errors";
import { Context } from "./Convertor";

export interface PropConfig extends BaseConvertorConfig {
    field: EntityKey;
    type: "string";
}

export class PropConvertor extends BaseConvertor {
    prop: EntityKey;
    propType: string;
    constructor(config: PropConfig) {
        super(config);
        this.prop = config.field;
        this.propType = config.type;
    }

    convert(aux: Aux, context: Context): void {
        const subject = context.subject;
        if (subject) {
            const propResolution = resolveByType[this.propType]?.(aux[this.prop]);
            subject[this.prop] = propResolution.valueOf(subject) ?? undefined;    
        }
    }

    validationErrors(aux: Aux, _context: Context, errors: ConvertError[]): void {
        verifyType(aux, this.prop, [this.propType], errors);
    }
}