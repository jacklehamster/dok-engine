import { Formula } from "../formula/Formula";
import { calculateEvaluator, getFormulaEvaluator } from "../formula/formula-evaluator";
import { hasFormula, isFormula } from "../formula/formula-utils";
import { Inventory } from "../inventory/Inventory";
import { BasicType } from "../types/basic-types";
import { Resolution, resolveAny } from "./Resolution";
import { EMPTY_VALUEOF, ValueOf } from "./ValueOf";

export type ArrayResolution = Formula | Resolution[];

export function resolveArray(resolution: ArrayResolution): ValueOf<any[]> {
    //  check if we have any resolution to perform
    if (!hasFormula(resolution)) {
        if (!Array.isArray(resolution)) {
            throw new Error("value is not an array");
        }
        const array = resolution as BasicType[];
        return { valueOf: () => array };
    }
    if (!resolution) {
        return EMPTY_VALUEOF;
    }
    if (isFormula(resolution)) {
        const formula = resolution as Formula;
        const evaluator = getFormulaEvaluator(formula);
        return {
            valueOf(parameters?: Inventory): BasicType[] {
                return calculateEvaluator<BasicType[] | undefined>(evaluator, parameters, formula) ?? [];
            }
        };
    }
    const array = resolution as Resolution[]

    const evaluator = array.map(resolution => resolveAny(resolution));

    return {
        valueOf(parameters: Inventory): BasicType[] {
            return evaluator.map(evalItem => evalItem?.valueOf(parameters));
        }
    };
}