import { Formula } from "../formula/Formula";
import { getFormulaEvaluator } from "../formula/formula-evaluator";
import { isFormula } from "../formula/formula-utils";
import { Inventory } from "../inventory/Inventory";
import { EMPTY_VALUEOF, ValueOf } from "./ValueOf";

export type StringResolution = Formula | string;

export function resolveString(resolution: StringResolution): ValueOf<string> {
    if (isFormula(resolution)) {
        const evaluator = getFormulaEvaluator(resolution);
        return {
            valueOf(parameters?: Inventory): string | null {
                const value = evaluator.evaluate(parameters);
                return typeof(value) === "string" ? value : `${value}`;
            },
        };
    }
    if (typeof(resolution) === "string") {
        return resolution;
    }
    return EMPTY_VALUEOF;
}