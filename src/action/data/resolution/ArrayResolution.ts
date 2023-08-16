import { asArray } from "../../utils/array-utils";
import { Formula } from "../formula/Formula";
import { calculateEvaluator, getFormulaEvaluator } from "../formula/formula-evaluator";
import { hasFormula, isFormula } from "../formula/formula-utils";
import { EMPTY_INVENTORY, Inventory } from "../inventory/Inventory";
import { BasicType } from "../types/basic-types";
import { Resolution, resolveAny } from "./Resolution";
import { ValueOf } from "./ValueOf";

export type ArrayResolution = Formula | Resolution[];

export function resolveArray(resolution: ArrayResolution): ValueOf<BasicType[]> {
    //  check if we have any resolution to perform
    if (!hasFormula(resolution)) {
        if (!Array.isArray(resolution)) {
            throw new Error("value is not an array");
        }
        const array = resolution as BasicType[];
        return { valueOf: () => array };
    }
    if (isFormula(resolution)) {
        const formula = resolution as Formula;
        const evaluator = getFormulaEvaluator(formula);
        return {
            valueOf(parameters?: Inventory): BasicType[] {
                return asArray(calculateEvaluator<BasicType[] | undefined>(evaluator, parameters ?? EMPTY_INVENTORY, formula));
            },
        };
    }
    const evaluators = resolution as Resolution[]

    const values: ValueOf<any>[] = asArray(evaluators).map(resolution => resolveAny(resolution));
    const array: BasicType[] = new Array(values.length);

    return {
        valueOf(parameters: Inventory): BasicType[] {
            for (let i = 0; i < values.length; i++) {
                array[i] = values[i]?.valueOf(parameters);
            }
            return array;
        }
    };
}