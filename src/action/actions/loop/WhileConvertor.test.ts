import { ActionContext } from "../../convertor/ActionConvertor";
import { MultiConvertor } from "../../../napl/core/conversion/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { ACTIONS_CONVERTOR } from "../actions/ActionsConvertor";
import { SET_CONVERTOR } from "../inventory/SetConvertor";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { WHILE_CONVERTOR, WHILE_RECONVERTOR } from "./WhileConvertor";

describe('WhileConvertor', () => {
    let context: ActionContext;
    let log = jest.fn();
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subject: {},
            subConvertor: new MultiConvertor([
                LOG_CONVERTOR,
                SET_CONVERTOR,
                WHILE_CONVERTOR,
                ACTIONS_CONVERTOR,
            ]),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            consoleLog: log,
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
        executeUntilStop(executor);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });


    it('convert while loop without do', () => {
        WHILE_RECONVERTOR.convert({
            while: "~{x < 5}",
            actions: [
                { log: ["~{x}"] },
                { set: { property: "x", value: "~{value + 1}" } },
            ],
        }, context);
        executor.inventory.x = 0
        executeUntilStop(executor);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });
});