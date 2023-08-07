import { ConvertError } from "../../../error/errors";
import { Inventory } from "../../../data/inventory/Inventory";
import { ExecutorBase } from "../../../execution/Executor";
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
            externals: {},
        };
        actionContext.subConvertor.convert = convert;
    });

    it('set variable', () => {
        convertor.convert({
            variable: "~{action.variable}",
            value: "~{action.value}",
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
                variable: "test",
                value: 123,
            },
            context: actionContext,
            labels: {
            },
        } });
        executor.executeUtilStop();

        const actionExecutor = new ExecutorBase<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: {},
        });
        actionExecutor.executeUtilStop()
        expect(actionExecutor.inventory.test).toEqual(123);
    });

    it('increment variable', () => {
        convertor.convert({
            variable: "~{action.variable}",
            value: "~{action.value}",
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
                variable: "test",
                value: "~{test + 1}",
            },
            context: actionContext,
            labels: {
            },
        } });
        executor.executeUtilStop();

        const actionExecutor = new ExecutorBase<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: { test: 999 },
        });
        actionExecutor.executeUtilStop()
        expect(actionExecutor.inventory.test).toEqual(1000);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ callExternal: { name: "test", arguments: [] } })).toBeFalsy();
        expect(convertor.validate({ variable: "~{variable}", value: "~{value}" })).toBeTruthy();
    });

    it('has validation errors when field is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { variable: "test" };
        convertor.validationErrors(command as unknown as InventorySetCommand, errors);
        expect(errors).toEqual([{
            code: "MISSING_PROPERTY",
            field: "value",
            object: command,
        }]);
    });
});