import { ConvertError } from "../../../actions/error/errors";
import { ExecutorBase } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { AccumulateCommand, AccumulateConvertor } from "./Accumulate";

describe('test accumulate', () => {
    let convertor: AccumulateConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new AccumulateConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
            externals: {},
        };
        actionContext.subConvertor.convert = convert;
    });

    it('accumulates actions in subconvertor', () => {
        convertor.convert({
            accumulate: [{ name: "testWriterAction" }, { name: "testWriterAction2"}],
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
                actions: [{ name: "testAction" }, { name: "testAction2" }]
            },
            context: actionContext,
        } });
        executor.executeUtilStop();

        expect(convert).toBeCalledWith({name: "testWriterAction"}, actionContext);
        expect(convert).toBeCalledWith({name: "testWriterAction2"}, actionContext);
    });

    it('accumulate actions using formula', () => {
        convertor.convert({
            accumulate: "~{action.actions}",
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
                actions: [{ name: "testAction" }, { name: "testAction2" }]
            },
            context: actionContext,
        } });
        executor.executeUtilStop();

        expect(convert).toBeCalledWith({name: "testAction"}, actionContext);
        expect(convert).toBeCalledWith({name: "testAction2"}, actionContext);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ callExternal: { name: "test", arguments: [] } })).toBeFalsy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeTruthy();
    });

    it('has validation errors when accumulate is an invalid type', () => {
        const errors: ConvertError[] = [];
        convertor.validationErrors({ accumulate: 123 } as unknown as AccumulateCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "accumulate",
            wrongType: "number",
            neededType: "array|formula",
        }]);
    });
});