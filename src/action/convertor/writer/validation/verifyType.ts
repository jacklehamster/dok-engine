import { ConvertError } from "../../../error/errors";
import { isFormula } from "../../../data/formula/formula-utils";
import { typeIsAnyOf } from "../../../utils/type-utils";

export function verifyType(object: Record<string, any>, field: string, types: string[], errors: ConvertError[]) {
    if (!typeIsAnyOf(object?.[field], ...types) && (types.indexOf("array") < 0 || !Array.isArray(object?.[field])) && (types.indexOf("formula") < 0 || !isFormula(object?.[field]))) {
        errors.push({
            code: "WRONG_TYPE",
            field,
            wrongType: typeof(object?.[field]),
            neededType: types.join("|"),
            object,
        });
    }
}

export function verifyArrayOrFormula(object: Record<string, any>, field: string, errors: ConvertError[]) {
    if (!Array.isArray(object?.[field]) && !isFormula(object?.[field])) {
        errors.push({
            code: "WRONG_TYPE",
            field,
            wrongType: typeof(object?.[field]),
            neededType: "array|Formula",
            object,
        });
    }
}
