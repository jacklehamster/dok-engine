import { ConvertError } from "../../../error/errors";
import { Inventory } from "../../../data/inventory/Inventory";
import { ExecutorBase } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { JumpToLabelCommand, JumpToLabelConvertor } from "./JumpToLabel";

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

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
            },
            context: actionContext,
            labels: {
                testLabel: 123
            },
        } });
        executor.executeUtilStop();

        const actionExecutor = new ExecutorBase<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: {},
        });
        actionExecutor.jumpTo = jest.fn();
        actionExecutor.executeUtilStop()
        expect(actionExecutor.jumpTo).toBeCalledWith(123);
    });

    it('has runtime error with invalid label', () => {
        convertor.convert({
            jumpTo: "invalidLabel",
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
            },
            context: actionContext,
            labels: {},
        } });
        executor.executeUtilStop();

        const actionExecutor = new ExecutorBase<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: {},
        });
        actionExecutor.executeUtilStop()
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