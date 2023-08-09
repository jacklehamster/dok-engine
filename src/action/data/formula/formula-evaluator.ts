import { FORMULA_SEPARATORS, Formula } from "./Formula";
import { getInnerFormulas, isFormula, isNestedFormula, isSimpleInnerFormula } from "./formula-utils";
import { Inventory } from "../inventory/Inventory";
import { create, all } from 'mathjs'

const math = create(all);

math.import({
    defined(value: any) {
        return value !== undefined;
    },
    length(value: any) {
        if (!Array.isArray(value)) {
            console.error(`${value} is not an array.`);
        }
        return value.length;
    },
    at(value: any, index: number) {
        if (!Array.isArray(value)) {
            console.error(`${value} is not an array.`);
        }
        console.log(value);
        return value[index];
    },
});

export function calculateEvaluator<T>(evaluator: math.EvalFunction, parameters: Inventory, formula: Formula): T | null {
    const scope = parameters;
    try {
        return evaluator.evaluate(scope ?? {}) ?? null;
    } catch (e) {
        console.error("Error: " + e + " on formula: " + formula + ", scope: ", JSON.parse(JSON.stringify(scope)));
    }
    return null;
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
    if (isNestedFormula(value)) {
        //  Nested formula ~~ returns formula as string.
        return {
            evaluate() {
                return value.substring(1);
            }
        }
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

