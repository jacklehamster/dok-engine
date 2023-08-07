import { Formula } from "../formula/Formula";
import { getFormulaEvaluator } from "../formula/formula-evaluator";
import { isFormula } from "../formula/formula-utils";
import { Inventory } from "../inventory/Inventory";
import { ValueOf } from "./ValueOf";

export type BooleanResolution = Formula | boolean | number | null;

export function resolveBoolean(resolution: BooleanResolution): ValueOf<boolean> {
    if (!resolution)  {
        return { valueOf: () => false };
    }
    if (typeof(resolution) === "boolean") {
        return resolution;
    }
    if (typeof(resolution) === "number") {
        return !!resolution;
    }
    if (isFormula(resolution)) {
        const evaluator = getFormulaEvaluator(resolution);
        return {
            valueOf(parameters?: Inventory): boolean {
                return !!evaluator.evaluate(parameters);
            },
        };
    }
    return {
        valueOf: () => false,
    };
}