import { ConvertError } from "../../../error/errors";
import { Inventory } from "../../../data/inventory/Inventory";
import { Executor } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { InventorySetCommand, InventorySetConvertor } from "./InventorySet";

describe('test Inventory Set', () => {
    let convertor: InventorySetConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: Context;

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

        const executor = new Executor<WriterInventory>({ accumulator: writerContext.accumulator, inventoryInitializer: () => ({
            action: {
                property: "test",
                value: 123,
            },
            context: actionContext,
            labels: {
            },
            stash: [],
        }) });
        executor.executeUtilStop();

        const actionExecutor = new Executor<Inventory>({
            accumulator: actionContext.accumulator,
            inventoryInitializer: () => ({
                stash: [],
            }),
        });
        actionExecutor.executeUtilStop()
        expect(actionExecutor.inventory.test).toEqual(123);
    });


    it('set with subject', () => {
        convertor.convert({
            subject: "~{action.subject}",
            property: "~{action.property}",
            value: "~{action.value}",
        }, writerContext);

        const executor = new Executor<WriterInventory>({ accumulator: writerContext.accumulator, inventoryInitializer: () => ({
            action: {
                subject: "~{test}",
                property: "prop",
                value: 123,
            },
            context: actionContext,
            labels: {
            },
            stash: [],
        }) });
        executor.executeUtilStop();

        const actionExecutor = new Executor<Inventory>({
            accumulator: actionContext.accumulator,
            inventoryInitializer: () => ({
                test: {},
                stash: [],
            }),
        });
        actionExecutor.executeUtilStop()
        expect(actionExecutor.inventory.test).toEqual({prop: 123});
    });

    it('increment variable', () => {
        convertor.convert({
            subject: "~{action.subject}",
            property: "~{action.property}",
            value: "~~{value + 1}",
        }, writerContext);

        const executor = new Executor<WriterInventory>({ accumulator: writerContext.accumulator, inventoryInitializer: () => ({
            action: {
                property: "test",
            },
            context: actionContext,
            labels: {
            },
            stash: [],
        }) });
        executor.executeUtilStop();

        const actionExecutor = new Executor<Inventory>({
            accumulator: actionContext.accumulator,
            inventoryInitializer: () => ({
                test: 999,
                stash: [],
            }),
        });
        actionExecutor.executeUtilStop()
        expect(actionExecutor.inventory.test).toEqual(1000);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ subject: "~{variable}", property: "~{property}", value: "~{value}" })).toBeTruthy();
    });

    it('has validation errors when field is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { property: "test" };
        convertor.validationErrors(command as unknown as InventorySetCommand, errors);
        expect(errors).toEqual([{
            code: "MISSING_PROPERTY",
            field: "value",
            object: command,
        }]);
    });
});