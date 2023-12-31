import { ActionContext } from "../../convertor/ActionConvertor";
import { MultiConvertor } from "../../../napl/core/conversion/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { SET_CONVERTOR } from "../inventory/SetConvertor";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { LOOP_CONVERTOR, LOOP_RECONVERTOR } from "./LoopConvertor";

describe('LoopConvertor', () => {
    let context: ActionContext;
    let log = jest.fn();
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor([
                LOG_CONVERTOR,
                LOOP_CONVERTOR,
                SET_CONVERTOR,
                LOOP_RECONVERTOR,
            ]),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            consoleLog: log,
        } });
    });

    it('Ignore action without loop', () => {
        expect(LOOP_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert loop', () => {
        LOOP_CONVERTOR.convert({
            loop: 5,
            do: [
                { log: ["~{idx}"] },
            ],
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });

    it('convert nested loop', () => {
        LOOP_CONVERTOR.convert({
            loop: 2,
            do: [
                {
                    set: {
                        property: "i",
                        value: "~{idx}"
                    },
                },
                {
                    loop: 3,
                    do: [
                        { log: ["~{i * 10 + idx}"] },
                    ],
                }
            ],
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(10);
        expect(log).toBeCalledWith(11);
        expect(log).toBeCalledWith(12);
    });

    it('convert loop without do', () => {
        LOOP_RECONVERTOR.convert({
            loop: 5,
            log: ["~{idx}"],
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });
});