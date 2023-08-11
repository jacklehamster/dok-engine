import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "./LogConvertor";

describe('LogConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            log,
        } });
    });

    it('Ignore action without log', () => {
        expect(LOG_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert log', () => {
        LOG_CONVERTOR.convert({
            log: [1, 2, 3],
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(1, 2, 3);
    });

    it('convert log with formula', () => {
        LOG_CONVERTOR.convert({
            log: ["~{x}"],
        }, context);
        executor.inventory.x = 123
        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
    });
});