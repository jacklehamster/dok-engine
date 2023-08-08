import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { ExecutorBase } from "../../execution/Executor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { SET_CONVERTOR } from "./SetConvertor";

describe('SetConvertor', () => {
    let context: Context;
    let executor: ExecutorBase;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(),
            accumulator: new StepAccumulator(),
        };
        executor = new ExecutorBase({ accumulator: context.accumulator, inventory: {name: "inventory"} });
    });

    it('Ignore action without set', () => {
        expect(SET_CONVERTOR.validate({})).toBeFalsy();
        expect(SET_CONVERTOR.validate({set: {}})).toBeTruthy();
    });

    it('convert set', () => {
        SET_CONVERTOR.convert({
            set: {
                property: "abc",
                value: 123,
            },
        }, context);
        executor.executeUtilStop();
        expect(executor.inventory.abc).toEqual(123);
    });

    it('convert set with formula', () => {
        SET_CONVERTOR.convert({
            set: {
                property: "abc",
                value: "~{100 + 50}",
            },
        }, context);
        executor.executeUtilStop();
        expect(executor.inventory.abc).toEqual(150);
    });

    it('convert set with subject', () => {
        executor.inventory.abc = {};
        SET_CONVERTOR.convert({
            set: {
                subject: "~{abc}",
                property: "a",
                value: 123,
            },
        }, context);
        executor.executeUtilStop();
        expect(executor.inventory.abc.a).toEqual(123);
    });
});