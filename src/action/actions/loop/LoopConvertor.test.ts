import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { ExecutorBase } from "../../execution/Executor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { LOOP_CONVERTOR } from "./LoopConvertor";

describe('LoopConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: ExecutorBase;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(
                LOG_CONVERTOR,
            ),
            accumulator: new StepAccumulator(),
        };
        executor = new ExecutorBase({ accumulator: context.accumulator, inventory: {
            log,
        } });
    });

    it('Ignore action without loop', () => {
        expect(LOOP_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert loop', () => {
        LOOP_CONVERTOR.convert({
            loop: 5,
            do: [
                { log: ["~{i}"] },
            ],
        }, context);
        executor.executeUtilStop();
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });
});