import { ActionContext } from "../../convertor/ActionConvertor";
import { MultiConvertor } from "../../../napl/core/conversion/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { SET_CONVERTOR } from "./SetConvertor";

describe('SetConvertor', () => {
    let context: ActionContext;
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            name: "inventory",
        } });
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
        executeUntilStop(executor);
        expect(executor.inventory.abc).toEqual(123);
    });

    it('convert set with formula', () => {
        SET_CONVERTOR.convert({
            set: {
                property: "abc",
                value: "~{100 + 50}",
            },
        }, context);
        executeUntilStop(executor);
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
        executeUntilStop(executor);
        expect(executor.inventory.abc.a).toEqual(123);
    });
});