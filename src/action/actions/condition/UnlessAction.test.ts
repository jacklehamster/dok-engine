import { Context, Convertor } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { UNLESS_CONVERTOR } from "./UnlessAction";

describe('UnlessConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: Executor;

    let convertor: Convertor;

    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(
                LOG_CONVERTOR,
                UNLESS_CONVERTOR,
            ),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventoryInitializer: () => ({
            log,
            stash: [],
        }) });
        convertor = UNLESS_CONVERTOR;
    });

    it('Ignore action without unless', () => {
        expect(convertor.validate({})).toBeFalsy();
    });

    it('convert then unless false', () => {
        convertor.convert({
            unless: false,
            do: {
                log: [123],
            },
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
    });

    it('convert unless true', () => {
        convertor.convert({
            unless: true,
            do: {
                log: [123],
            },
        }, context);
        executeUntilStop(executor);
        expect(log).not.toBeCalledWith(123);
    });
});
