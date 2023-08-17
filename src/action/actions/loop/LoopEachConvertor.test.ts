import { ActionContext } from "../../convertor/ActionConvertor";
import { MultiConvertor } from "../../../napl/core/conversion/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { LOOP_EACH_CONVERTOR, LOOP_EACH_RECONVERTOR } from "./LoopEachConvertor";

describe('LoopEachConvertor', () => {
    let context: ActionContext;
    let log = jest.fn();
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subject: {},
            subConvertor: new MultiConvertor([
                LOG_CONVERTOR,
                LOOP_EACH_CONVERTOR,
            ]),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            consoleLog: log,
        } });
    });

    it('Ignore action without loop', () => {
        expect(LOOP_EACH_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert loopEach', () => {
        LOOP_EACH_CONVERTOR.convert({
            loopEach: [0, "one", "2", "III"],
            do: [
                { log: ["~{element}"] },
            ],
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith("one");
        expect(log).toBeCalledWith("2");
        expect(log).toBeCalledWith("III");
    });


    it('convert loopEach without do', () => {
        LOOP_EACH_RECONVERTOR.convert({
            loopEach: [0, "one", "2", "III"],
            log: ["~{element}"],
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith("one");
        expect(log).toBeCalledWith("2");
        expect(log).toBeCalledWith("III");
    });
});