import { ConvertError } from "../../../actions/error/errors";
import { Inventory } from "../../../data/inventory/Inventory";
import { ExecutorBase } from "../../../execution/Executor";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { CallExternalCommand, CallExternalConvertor } from "./CallExternal";

describe('test callExternal', () => {
    let convertor: CallExternalConvertor;
    let writerContext: WriterContext;
    let actionContext: Context;
    let log = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new CallExternalConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
            externals: { log },
        };
    });

    it('call external with arguments', () => {
        convertor.convert({
            callExternal: {
                name: "log",
                arguments: "~{action.log}"
            },
        }, writerContext);

        const executor = new ExecutorBase<WriterInventory>({ accumulator: writerContext.accumulator, inventory: {
            action: {
                log: [1, 2, "~{x}"],
            },
            context: actionContext,
        } });
        executor.executeUtilStop();

        const actionExecutor = new ExecutorBase<Inventory>({
            accumulator: actionContext.accumulator,
            inventory: {x: 3},
        });
        actionExecutor.executeUtilStop()
        expect(log).toBeCalledWith(1, 2, 3);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ callExternal: { name: "test", arguments: [] } })).toBeTruthy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeFalsy();
    });

    it('has validation errors when callExternal is invalid', () => {
        const errors: ConvertError[] = [];
        convertor.validationErrors({ callExternal: {
            name: 123,
            arguments: 123,
        } } as unknown as CallExternalCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "callExternal.name",
            wrongType: "number",
            neededType: "string",
        }, {
            code: "WRONG_TYPE",
            field: "callExternal.arguments",
            wrongType: "number",
            neededType: "array|formula",
        }]);
    });
});