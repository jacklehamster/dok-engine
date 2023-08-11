import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { ASSIGN_CONVERTOR } from "./AssignConvertor";

describe('SetConvertor', () => {
    let context: Context;
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventoryInitializer: () => ({
            name: "inventory",
            stash: [],
        }) });
    });

    it('Ignore action without =', () => {
        expect(ASSIGN_CONVERTOR.validate({})).toBeFalsy();
        expect(ASSIGN_CONVERTOR.validate({"=": ["a", 123]})).toBeTruthy();
    });

    it('convert set', () => {
        ASSIGN_CONVERTOR.convert({
            "=": ["abc", 123],
        }, context);
        executeUntilStop(executor);
        expect(executor.inventory.abc).toEqual(123);
    });

    it('convert set with formula', () => {
        ASSIGN_CONVERTOR.convert({
            "=": ["abc", "~{100 + 50}"],
        }, context);
        executeUntilStop(executor);
        expect(executor.inventory.abc).toEqual(150);
    });

    it('convert assign with subject', () => {
        executor.inventory.abc = {};
        ASSIGN_CONVERTOR.convert({
            "=": ["~{abc}", "a", 123],
        }, context);
        executeUntilStop(executor);
        expect(executor.inventory.abc.a).toEqual(123);
    });
});