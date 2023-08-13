import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { WriterExecutor } from "../WriterExecutor";
import { ReturnConvertor } from "./Return";
import { Executor } from "../../../execution/Executor";

describe('test debug', () => {
    let convertor: ReturnConvertor;
    let writerContext: WriterContext;
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new ReturnConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
    });

    it('call return', () => {
        convertor.convert({
            return: {},
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator,
            {
                return: {},
            },
            actionContext);
        executeUntilStop(executor);
        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
        });

        const parentExecutor = new Executor({
            accumulator: new StepAccumulator(),
        });
        const execute = jest.fn();
        parentExecutor.accumulator.add({
            execute,
        });
        actionExecutor.parent = parentExecutor;

        executeUntilStop(actionExecutor);
        expect(execute).toBeCalled();
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ return: {} })).toBeTruthy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeFalsy();
    });
});