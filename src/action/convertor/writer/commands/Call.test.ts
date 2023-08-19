import { ConvertError } from "../../../../napl/core/error/errors";
import { Executor } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { ActionContext } from "../../ActionConvertor";
import { MultiConvertor } from "../../../../napl/core/conversion/MultiConvertor";
import { WriterContext } from "../WriterContext";
import { CallCommand, CallConvertor } from "./CallMethod";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { WriterExecutor } from "../WriterExecutor";

describe('test call', () => {
    let convertor: CallConvertor;
    let writerContext: WriterContext;
    let actionContext: ActionContext;
    let log = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new CallConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
    });

    it('call with arguments', () => {
        convertor.convert({
            subject: "~~{log}",
            call: "~{action.log}",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator,
            {
                log: [1, 2, "~{x}"],
            },
            actionContext);
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
            inventory: {x: 3, log } });
        executeUntilStop(actionExecutor);
        expect(log).toBeCalledWith(1, 2, 3);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeTruthy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeFalsy();
    });

    it('has validation errors when call is invalid', () => {
        const errors: ConvertError[] = [];
        const command = { call: 123 };
        convertor.validationErrors(command as unknown as CallCommand, writerContext, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "call",
            wrongType: "number",
            neededType: "array|formula",
            object: command,
        }]);
    });
});