import * as math from "mathjs";
import { FORMULA_SEPARATORS, Formula } from "./Formula";
import { getInnerFormulas, isFormula, isSimpleInnerFormula } from "./formula-utils";
import { Parameters } from "../parameters/Parameters";

export function calculateEvaluator<T>(evaluator: math.EvalFunction, parameters: Parameters = {}, formula: Formula, defaultValue: T): T {
    const scope = parameters;
    try {
        return evaluator.evaluate(scope ?? {}) ?? defaultValue;
    } catch (e) {
        console.error("Error: " + e + " on formula: " + formula + ", scope: ", JSON.parse(JSON.stringify(scope)));
    }
    return defaultValue;
}

function getEvaluator(formula: string): math.EvalFunction {
    if (!formula.length) {
        return {
            evaluate: () => "",
        };
    }
    const mathEvaluator = math.parse(formula).compile();
    if (isSimpleInnerFormula(formula)) {
        return {
            evaluate(scope?: any) {
                return scope[formula] ?? mathEvaluator.evaluate(scope);
            },
        };
    }
    return mathEvaluator;    
}

export function getFormulaEvaluator(value: Formula): math.EvalFunction {
    if (!isFormula(value)) {
        throw new Error(`Formula: ${value} must match the format: "${FORMULA_SEPARATORS[0]}formula${FORMULA_SEPARATORS[1]}".`);
    }
    const values = getInnerFormulas(value);
    if (values.length === 1 && !values[0].textSuffix.length) {
        return getEvaluator(values[0].formula);
    } else {
        const evaluators = values.map(({ formula, textSuffix }) => {
            return { mathEvaluator: getEvaluator(formula), textSuffix};
        });

        return {
            evaluate(scope?: any) {
                return evaluators.map(({ mathEvaluator, textSuffix }) => {
                    return mathEvaluator.evaluate(scope) + textSuffix;
                }).join("");
            },
        };
    }
}

