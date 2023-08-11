import { Context } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { EXECUTE_CONVERTOR } from "./ExecuteAction";
import { SCRIPT_CONVERTOR } from "./ScriptAction";

describe('ScriptConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: Executor;
    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(
                LOG_CONVERTOR,
                SCRIPT_CONVERTOR,
                EXECUTE_CONVERTOR,
            ),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: {
            log,
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
                actions: [
                    {
                        log: ["~{passedValue}"],
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

        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
    });
});