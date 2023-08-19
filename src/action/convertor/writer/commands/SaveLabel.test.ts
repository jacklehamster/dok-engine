import { ConvertError } from "../../../../napl/core/error/errors";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { ActionContext } from "../../ActionConvertor";
import { MultiConvertor } from "../../../../napl/core/conversion/MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterExecutor } from "../WriterExecutor";
import { SaveLabelCommand, SaveLabelConvertor } from "./SaveLabel";

describe('test SaveLabel', () => {
    let convertor: SaveLabelConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: ActionContext;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new SaveLabelConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
        actionContext.subConvertor.convert = convert;
    });

    it('save label', () => {
        convertor.convert({
            label: "testLabel",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator, {},
            actionContext);
        executeUntilStop(executor);

        expect(executor.labels).toEqual({ testLabel: 0 });
    });

    it('has error on duplicate label', () => {
        convertor.convert({
            label: "testLabel",
        }, writerContext);
        convertor.convert({
            label: "testLabel",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator, {
            },
            actionContext);
        executeUntilStop(executor);
        expect(executor.errors).toEqual([{
            code: "DUPLICATE_LABEL",
            label: "testLabel",
        }]);
    });


    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ label: "test" })).toBeTruthy();
    });

    it('has validation errors when field is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { label: 123 };
        convertor.validationErrors(command as unknown as SaveLabelCommand, writerContext, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "label",
            wrongType: "number",
            neededType: "string",
            object: command,
        }]);
    });
});