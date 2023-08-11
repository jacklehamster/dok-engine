import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../error/errors";
import { Executor } from "../../../execution/Executor";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
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
        };
        actionContext.subConvertor.convert = convert;
    });

    function verifyActionsConverted(command: AccumulateCommand, action: Action, actionsExpected: Action[], expectSubConversion: boolean) {
        expect(actionsExpected.length).not.toBe(0);

        convertor.convert(command, writerContext);

        const executor = new Executor<WriterInventory>({ accumulator: writerContext.accumulator, inventoryInitializer: () => ({
            action,
            context: actionContext,
            labels: {},
            stash: [],
        }) });
        executeUntilStop(executor);

        for (let i = 0; i < actionsExpected.length; i++) {
            if (expectSubConversion) {
                expect(convert).toBeCalledWith(actionsExpected[i], actionContext);                
            } else {
                expect(convert).not.toBeCalledWith(actionsExpected[i], actionContext);                
            }
        }
    }

    it('accumulates actions in subconvertor', () => {
        verifyActionsConverted({
            accumulate: [{ name: "testWriterAction" }, { name: "testWriterAction2"}],            
        }, {
            actions: [{ name: "testAction" }, { name: "testAction2" }]
        }, [
            {name: "testWriterAction"},
            {name: "testWriterAction2"},
        ], true);
    });

    it('accumulate actions using formula', () => {
        verifyActionsConverted({
            accumulate: "~{action.actions}",            
        }, {
            actions: [{ name: "testAction" }, { name: "testAction2" }]
        }, [
            {name: "testAction"},
            {name: "testAction2"},
        ], true);
    });

    it('should not accumulate if condition is false', () => {
        verifyActionsConverted({
            condition: "~{false}",
            accumulate: "~{action.actions}",            
        }, {
            actions: [{ name: "testAction" }, { name: "testAction2" }]
        }, [
            {name: "testAction"},
            {name: "testAction2"},
        ], false);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeTruthy();
    });

    it('has validation errors when accumulate is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { accumulate: 123 };
        convertor.validationErrors(command as unknown as AccumulateCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "accumulate",
            wrongType: "number",
            neededType: "array|object|formula",
            object: command,
        }]);
    });
});