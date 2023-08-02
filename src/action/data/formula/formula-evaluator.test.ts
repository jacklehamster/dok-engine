import { calculateEvaluator, getFormulaEvaluator } from "./formula-evaluator";

describe('calculateEvaluator', () => {
    it('should calculate evaluator', () => {
        const formula = "~{3 + 10}";
        const evaluator = getFormulaEvaluator(formula);
        expect(calculateEvaluator(evaluator, undefined, formula, 0)).toEqual(13);
    });

    it('should calculate evaluator with scope', () => {
        const formula = "~{3 + x}";
        const evaluator = getFormulaEvaluator(formula);
        expect(calculateEvaluator(evaluator, {x: 6}, formula, 0)).toEqual(9);
    });
});

describe('getFormulaEvaluator', () => {
    it('should properly get evaluator with formula', () => {
        const evaluator = getFormulaEvaluator("~{3 + 10}");
        expect(evaluator.evaluate()).toEqual(13);
    });

    it('should evaluate a template with formula and text', () => {
        const evaluator = getFormulaEvaluator("~prefix-{3 + 100}-suffix");
        expect(evaluator.evaluate()).toEqual("prefix-103-suffix")
    });

    it('should evaluate a template with formula and text with expression', () => {
        const evaluator = getFormulaEvaluator("~prefix-{3 + x}-suffix");
        expect(evaluator.evaluate({ x: 10 })).toEqual("prefix-13-suffix")
    });
});
