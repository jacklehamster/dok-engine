import { ConvertError } from "../../../error/errors";
import { Executor } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { JumpToLabelCommand, JumpToLabelConvertor } from "./JumpToLabel";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { WriterExecutor } from "../WriterExecutor";

describe('test JumpToLabel', () => {
    let convertor: JumpToLabelConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new JumpToLabelConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
        actionContext.subConvertor.convert = convert;
    });

    it('jumpTo label', () => {
        convertor.convert({
            jumpTo: "testLabel",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator, {},
            actionContext,
            {
                testLabel: 123
            });
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
            inventoryInitializer: () => ({
                stash: [],
            }),
        });
        actionExecutor.jumpTo = jest.fn();
        executeUntilStop(actionExecutor);
        expect(actionExecutor.jumpTo).toBeCalledWith(123);
    });

    it('has runtime error with invalid label', () => {
        convertor.convert({
            jumpTo: "invalidLabel",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator, {},
            actionContext);
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
            inventoryInitializer: () => ({
                stash: [],
            }),
        });
        executeUntilStop(actionExecutor);
        expect(actionExecutor.errors).toEqual([{
            code: "INVALID_LABEL",
            label: "invalidLabel",
        }]);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ jumpTo: "test" })).toBeTruthy();
    });

    it('has validation errors when field is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { jumpTo: 123 };
        convertor.validationErrors(command as unknown as JumpToLabelCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "jumpTo",
            wrongType: "number",
            neededType: "string",
            object: command,
        }]);
    });
});