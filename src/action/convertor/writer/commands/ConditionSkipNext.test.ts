import { ConvertError } from "../../../actions/error/errors";
import { Inventory } from "../../../data/inventory/Inventory";
import { ExecutorBase } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { SkipNextCommand, SkipNextConvertor } from "./ConditionSkipNext";
import { Action } from "../../../actions/Action";

describe('test conditionSkipNext', () => {
    let convertor: SkipNextConvertor;
    let writerContext: WriterContext;
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new SkipNextConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
            externals: { },
        };
    });

    function testWriterCommandWithAction(command: SkipNextCommand, action: Action, expectedSkip: boolean) {
        convertor.convert(command, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action,
            context: actionContext,
            labels: {},
        } });
        executor.executeUtilStop();

        const actionExecutor = new ExecutorBase<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: {},
        });
        actionExecutor.skipNextStep = jest.fn();

        actionExecutor.executeUtilStop();
        if (expectedSkip) {
            expect(actionExecutor.skipNextStep).toBeCalled();
        } else {
            expect(actionExecutor.skipNextStep).not.toBeCalled();
        }

    }

    it('skip next with true "if"', () => {
        testWriterCommandWithAction({
            skipNextOnCondition: "~{action.if}",
        }, {
            if: true,
        }, true);
    });

    it('dont skip next with false "if"', () => {
        testWriterCommandWithAction({
            skipNextOnCondition: "~{action.if}",
        }, {
            if: false,
        }, false);
    });

    it('skip next with true "if" with formula', () => {
        testWriterCommandWithAction({
            skipNextOnCondition: "~{action.if}",
        }, {
            if: "~{123 == 123}",
        }, true);
    });

    it('dont skip next with false "if" with formula', () => {
        testWriterCommandWithAction({
            skipNextOnCondition: "~{action.if}",
        }, {
            if: "~{123 == 456}",
        }, false);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ skipNextOnCondition: "~{condition}" })).toBeTruthy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeFalsy();
    });

    it('has validation errors when field type is invalid', () => {
        const errors: ConvertError[] = [];
        const command = { skipNextOnCondition: {} };
        convertor.validationErrors(command as unknown as SkipNextCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "skipNextOnCondition",
            wrongType: "object",
            neededType: "boolean|formula",
            object: command,
        }]);
    });
});