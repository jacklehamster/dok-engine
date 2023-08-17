import { verifyType } from "../../../action/convertor/writer/validation/verifyType";
import { StringResolution, resolveString } from "../../../action/data/resolution/StringResolution";
import { Aux } from "../../../types/Aux";
import { ConvertError } from "../error/errors";
import { Context, Convertor, ConvertorConfig } from "./Convertor";

export interface NameAux {
    name: StringResolution;
}

export class NameConvertor extends Convertor<NameAux> {
    validate(aux: Aux): boolean {
        return aux.name;
    }

    convert(aux: NameAux, context: Context): void {
        const subject = context.subject;
        const nameResolution = resolveString(aux.name);
        subject.name = nameResolution.valueOf(subject) ?? undefined;
    }

    serialize(): ConvertorConfig {
        return {
            type: this.type,
        };
    }
    
    validationErrors(aux: NameAux, errors: ConvertError[]): void {
        verifyType(aux, "name", ["string"], errors);
    }
}