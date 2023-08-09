import { Formula } from "../formula/Formula";
import { getFormulaEvaluator } from "../formula/formula-evaluator";
import { isFormula } from "../formula/formula-utils";
import { Inventory } from "../inventory/Inventory";
import { ValueOf } from "./ValueOf";

export type NumberResolution = Formula | number;

export function resolveNumber(resolution: NumberResolution): ValueOf<number> {
    if (typeof(resolution) === "number") {
        return resolution;
    }
    if (isFormula(resolution)) {
        const evaluator = getFormulaEvaluator(resolution);
        return {
            valueOf(parameters?: Inventory): number {
                return evaluator.evaluate(parameters);
            },
        };
    }
    return 0;
}