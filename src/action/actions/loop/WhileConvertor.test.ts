import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { ExecutorBase } from "../../execution/Executor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { SET_CONVERTOR } from "../inventory/SetConvertor";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { WHILE_CONVERTOR } from "./WhileConvertor";

describe('WhileConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: ExecutorBase;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(
                LOG_CONVERTOR,
                SET_CONVERTOR,
            ),
            accumulator: new StepAccumulator(),
            externals: {},
        };
        executor = new ExecutorBase({ accumulator: context.accumulator, inventory: {
            log,
        } });
    });

    it('Ignore action without while', () => {
        expect(WHILE_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert while loop', () => {
        WHILE_CONVERTOR.convert({
            while: "~{x < 5}",
            do: [
                { log: ["~{x}"] },
                { set: { property: "x", value: "~{value + 1}" } },
            ],
        }, context);
        executor.inventory.x = 0
        executor.executeUtilStop();
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });
});