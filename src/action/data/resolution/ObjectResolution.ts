import { Formula } from "../formula/Formula";
import { calculateEvaluator, getFormulaEvaluator } from "../formula/formula-evaluator";
import { hasFormula, isFormula } from "../formula/formula-utils";
import { EMPTY_INVENTORY, Inventory } from "../inventory/Inventory";
import { Obj } from "../../../types/basic-types";
import { Resolution, resolveAny } from "./Resolution";
import { ValueOf } from "./ValueOf";

export type ObjectResolution = Formula | Obj;

export function resolveObject(resolution: ObjectResolution): ValueOf<Obj> {
    //  check if we have any resolution to perform
    if (!hasFormula(resolution)) {
        if (!resolution || typeof(resolution) !== "object" || Array.isArray(resolution)) {
            throw new Error("value is not an object");
        }
        const object = resolution as Obj;
        return { valueOf: () => object };
    }
    if (isFormula(resolution)) {
        const formula = resolution as Formula;
        const evaluator = getFormulaEvaluator(formula);
        return {
            valueOf(parameters?: Inventory): Obj {
                return calculateEvaluator<Obj | undefined>(evaluator, parameters ?? EMPTY_INVENTORY, formula) ?? {};
            },
        };
    }
    const object = resolution as Obj<Resolution>;

    const result: Record<string, any> = {};
    for (let i in object) {
        result[i] = resolveAny(object[i])
    }

    return {
        valueOf(parameters: Inventory): Obj {
            for (let i in result) {
                result[i] = result[i]?.valueOf(parameters);
            }
            return result;
        }
    };
}