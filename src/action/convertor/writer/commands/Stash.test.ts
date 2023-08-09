import { ConvertError } from "../../../error/errors";
import { Inventory } from "../../../data/inventory/Inventory";
import { Executor } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { StashCommand, StashConvertor } from "./Stash";

describe('test Stash', () => {
    let convertor: StashConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new StashConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
        actionContext.subConvertor.convert = convert;
    });

    it('stash', () => {
        convertor.convert({
            stash: ["a", "b"],
        }, writerContext);

        const executor = new Executor<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
            },
            context: actionContext,
            labels: {
            },
            stash: [],
        } });
        executor.executeUtilStop();

        const actionExecutor = new Executor<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: {
                a: 123,
                b: 456,
                c: 789,
                stash: [],
            },
        });
        actionExecutor.executeUtilStop()
        expect(actionExecutor.inventory.stash[0]).toEqual({a: 123, b: 456});
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ stash: [] })).toBeTruthy();
    });

    it('has validation errors when field is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { stash: "test" };
        convertor.validationErrors(command as unknown as StashCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "stash",
            neededType: "array",
            wrongType: "string",
            object: command,
        }]);
    });
});