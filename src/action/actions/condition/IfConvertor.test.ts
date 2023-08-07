import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { ExecutorBase } from "../../execution/Executor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { IfConvertor } from "./IfConvertor";

describe('IfConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: ExecutorBase;

    let convertor: IfConvertor;

    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(
                LOG_CONVERTOR,
            ),
            accumulator: new StepAccumulator(),
            externals: { log },
        };
        executor = new ExecutorBase({ accumulator: context.accumulator, inventory: {} });
        convertor = new IfConvertor();
    });

    it('Ignore action without if', () => {
        expect(new IfConvertor().validate({})).toBeFalsy();
    });

    it('convert then if true', () => {
        convertor.convert({
            if: true,
            then: {
                log: [123],
            },
            else: {
                log: [456],
            },
        }, context);
        executor.executeUtilStop();
        expect(log).toBeCalledWith(123);
    });

    it('convert else if false', () => {
        convertor.convert({
            if: false,
            then: {
                log: [123],
            },
            else: {
                log: [456],
            },
        }, context);
        executor.executeUtilStop();
        expect(log).toBeCalledWith(456);
    });
});