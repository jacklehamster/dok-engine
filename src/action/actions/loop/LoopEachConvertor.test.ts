import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { LOOP_EACH_CONVERTOR } from "./LoopEachConvertor";

describe('LoopEachConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(
                LOG_CONVERTOR,
            ),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            log,
            stash: [],
        } });
    });

    it('Ignore action without loop', () => {
        expect(LOOP_EACH_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert loop', () => {
        LOOP_EACH_CONVERTOR.convert({
            loopEach: [0, "one", "2", "III"],
            do: [
                { log: ["~{element}"] },
            ],
        }, context);
        executor.executeUtilStop();
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith("one");
        expect(log).toBeCalledWith("2");
        expect(log).toBeCalledWith("III");
    });
});