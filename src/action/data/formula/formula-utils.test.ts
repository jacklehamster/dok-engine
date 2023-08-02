import { getInnerFormulas, hasFormula, isFormula } from "./formula-utils";

describe('formula-utils', () => {
    it('check is formula', () => {
        expect(isFormula("~{formula}")).toBeTruthy();
        expect(isFormula("~formula")).toBeFalsy();
        expect(isFormula("{formula}")).toBeFalsy();
        expect(isFormula("~{func(value)}")).toBeTruthy();
    });

    it('check has formula', () => {
        expect(hasFormula(null)).toBeFalsy();
        expect(hasFormula({})).toBeFalsy();
        expect(hasFormula({"test": "~{123}"})).toBeTruthy();
        expect(hasFormula({"~{key}": 123})).toBeTruthy();
    });

    it('check get inner formulas', () => {
        expect(getInnerFormulas("~{formula}")).toEqual([{ formula: "formula", textSuffix: "" }]);
        expect(getInnerFormulas("~Prefix{formula}Suffix")).toEqual([
            { formula: "", textSuffix: "Prefix" },
            { formula: "formula", textSuffix: "Suffix" },
        ]);
    });
});