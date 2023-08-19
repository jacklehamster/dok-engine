import { ConvertError } from "../../../../napl/core/error/errors";
import { Executor } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { ActionContext } from "../../ActionConvertor";
import { MultiConvertor } from "../../../../napl/core/conversion/MultiConvertor";
import { WriterContext } from "../WriterContext";
import { InventorySetCommand, InventorySetConvertor } from "./InventorySet";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { WriterExecutor } from "../WriterExecutor";

describe('test Inventory Set', () => {
    let convertor: InventorySetConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: ActionContext;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new InventorySetConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
        actionContext.subConvertor.convert = convert;
    });

    it('set', () => {
        convertor.convert({
            property: "~{action.property}",
            value: "~{action.value}",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator, {
                property: "test",
                value: 123,
            },
            actionContext);
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
        });
        executeUntilStop(actionExecutor);
        expect(actionExecutor.inventory.test).toEqual(123);
    });


    it('set with subject', () => {
        convertor.convert({
            subject: "~{action.subject}",
            property: "~{action.property}",
            value: "~{action.value}",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator, {
                subject: "~{test}",
                property: "prop",
                value: 123,
            },
            actionContext);
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
            inventory: {
                test: {},
            },
        });
        executeUntilStop(actionExecutor);
        expect(actionExecutor.inventory.test).toEqual({prop: 123});
    });

    it('increment variable', () => {
        convertor.convert({
            subject: "~{action.subject}",
            property: "~{action.property}",
            value: "~~{value + 1}",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator,{
                property: "test",
            },
            actionContext);
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
            inventory: {
                test: 999,
            },
        });
        executeUntilStop(actionExecutor);
        expect(actionExecutor.inventory.test).toEqual(1000);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ subject: "~{variable}", property: "~{property}", value: "~{value}" })).toBeTruthy();
    });

    it('has validation errors when field is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { property: "test" };
        convertor.validationErrors(command as unknown as InventorySetCommand, writerContext, errors);
        expect(errors).toEqual([{
            code: "MISSING_PROPERTY",
            field: "value",
            object: command,
        }]);
    });
});