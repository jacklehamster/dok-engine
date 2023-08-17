import { ActionContext } from "../../convertor/ActionConvertor";
import { MultiConvertor } from "../../../napl/core/conversion/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { ACTIONS_CONVERTOR } from "../actions/ActionsConvertor";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { EXECUTE_CONVERTOR } from "./ExecuteAction";
import { RETURN_CONVERTOR } from "./ReturnAction";
import { SCRIPT_CONVERTOR } from "./ScriptAction";

describe('ScriptConvertor', () => {
    let context: ActionContext;
    let log = jest.fn();
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subject: {},
            subConvertor: new MultiConvertor([
                LOG_CONVERTOR,
                SCRIPT_CONVERTOR,
                EXECUTE_CONVERTOR,
                RETURN_CONVERTOR,
                ACTIONS_CONVERTOR,
            ]),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            consoleLog: log,
        } });
    });

    it('Ignore action without execute', () => {
        expect(SCRIPT_CONVERTOR.validate({})).toBeFalsy();
        expect(EXECUTE_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert and execute script', () => {
        SCRIPT_CONVERTOR.convert({
            script: {
                name: "test",
                parameters: ["param1"],
                actions: [
                    {
                        log: ["~{param1.passedValue}"],
                    },
                ],
            },
        }, context);

        EXECUTE_CONVERTOR.convert({
            execute: "test",
            parameters: {
                passedValue: 123,
            }
        }, context);

        EXECUTE_CONVERTOR.convert({
            execute: "test",
            parameters: {
                passedValue: 456,
            }
        }, context);

        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
        expect(log).toBeCalledWith(456);
    });

    it('convert and execute script with return', () => {
        SCRIPT_CONVERTOR.convert({
            script: {
                name: "test",
                parameters: ["param1"],
                actions: [
                    {
                        log: ["~{param1.passedValue}"],
                        return: {},
                    },
                    {
                        log: ["error"],
                    },
                ],
            },
        }, context);

        EXECUTE_CONVERTOR.convert({
            execute: "test",
            parameters: {
                passedValue: 123,
            }
        }, context);

        LOG_CONVERTOR.convert({
            log: ["afterwards"]
        }, context);

        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
        expect(log).not.toBeCalledWith("error");
        expect(log).toHaveBeenLastCalledWith("afterwards");
    });


    it('execute with return', () => {
        ACTIONS_CONVERTOR.convert({
            actions: [
                { log: 123 },
                { return: {} },
                { log: 456 },
            ],
        }, context);

        executeUntilStop(executor);
        expect(log).toHaveBeenLastCalledWith(123);
    });
});
