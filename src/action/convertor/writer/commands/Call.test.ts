import { ConvertError } from "../../../error/errors";
import { Inventory } from "../../../data/inventory/Inventory";
import { Executor } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { CallCommand, CallConvertor } from "./CallMethod";

describe('test call', () => {
    let convertor: CallConvertor;
    let writerContext: WriterContext;
    let actionContext: Context;
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

        const executor = new Executor<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
                log: [1, 2, "~{x}"],
            },
            context: actionContext,
            labels: {},
            stash: [],
        } });
        executor.executeUtilStop();

        const actionExecutor = new Executor<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: {x: 3, log, stash: []},
        });
        actionExecutor.executeUtilStop()
        expect(log).toBeCalledWith(1, 2, 3);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeTruthy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeFalsy();
    });

    it('has validation errors when call is invalid', () => {
        const errors: ConvertError[] = [];
        const command = { call: 123 };
        convertor.validationErrors(command as unknown as CallCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "call",
            wrongType: "number",
            neededType: "array|formula",
            object: command,
        }]);
    });
});