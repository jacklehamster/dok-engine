import { ConvertError } from "../../../actions/error/errors";
import { ExecutorBase } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { SaveLabelCommand, SaveLabelConvertor } from "./SaveLabel";

describe('test SaveLabel', () => {
    let convertor: SaveLabelConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new SaveLabelConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
            externals: {},
        };
        actionContext.subConvertor.convert = convert;
    });

    it('save label', () => {
        convertor.convert({
            label: "testLabel",
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
            },
            context: actionContext,
            labels: {},
        } });
        executor.executeUtilStop();

        expect(executor.inventory.labels).toEqual({ testLabel: 0 });
    });

    it('has error on duplicate label', () => {
        convertor.convert({
            label: "testLabel",
        }, writerContext);
        convertor.convert({
            label: "testLabel",
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
            },
            context: actionContext,
            labels: {},
        } });
        executor.executeUtilStop();
        expect(executor.errors).toEqual([{
            code: "DUPLICATE_LABEL",
            label: "testLabel",
        }]);
    });


    it('has error on invalid formula', () => {
        convertor.convert({
            label: "~{123}",
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
            },
            context: actionContext,
            labels: {},
        } });
        executor.executeUtilStop();
        expect(executor.errors).toEqual([{
            code: "INVALID_FORMULA",
            formula: "~{123}",
        }]);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ callExternal: { name: "test", arguments: [] } })).toBeFalsy();
        expect(convertor.validate({ label: "test" })).toBeTruthy();
    });

    it('has validation errors when field is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { label: 123 };
        convertor.validationErrors(command as unknown as SaveLabelCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "label",
            wrongType: "number",
            neededType: "string",
            object: command,
        }]);
    });
});