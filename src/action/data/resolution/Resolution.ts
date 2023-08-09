import { getFormulaEvaluator } from "../formula/formula-evaluator";
import { isFormula } from "../formula/formula-utils";
import { Inventory } from "../inventory/Inventory";
import { BasicType } from "../types/basic-types";
import { resolveArray } from "./ArrayResolution";
import { BooleanResolution } from "./BooleanResolution";
import { NumberResolution } from "./NumberResolution";
import { StringResolution } from "./StringResolution";
import { ValueOf } from "./ValueOf";

export type Resolution = BasicType | BooleanResolution | StringResolution | NumberResolution;

export function resolveAny(resolution: Resolution): ValueOf<any> {
    const type = typeof(resolution);
    switch(type) {
        case "string":
            const sResolution: string = resolution as string;
            if (isFormula(sResolution)) {
                const evaluator = getFormulaEvaluator(sResolution);
                return {
                    valueOf(parameters?: Inventory): any | null {
                        return evaluator.evaluate(parameters) ?? null;
                    },
                };
            } else {
                return resolution as string;
            }
        case "object":
            if (Array.isArray(resolution)) {
                return resolveArray(resolution);
            } else if (resolution) {
                return resolution;
            }
            break;
        default:
            if (resolution) {
                return resolution;
            }
    }
    return {
        valueOf: () => resolution,
    };
}