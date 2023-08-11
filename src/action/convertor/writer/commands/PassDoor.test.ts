import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../error/errors";
import { Executor } from "../../../execution/Executor";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { PassDoorCommand, PassDoorConvertor } from "./PassDoor";

describe('test passDoor', () => {
    let convertor: PassDoorConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new PassDoorConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
        actionContext.subConvertor.convert = convert;
        
    });

    function verifyPassDoorConverted(command: PassDoorCommand, doorName: string, action: Action) {
        convertor.convert(command, writerContext);

        const executor = new Executor<WriterInventory>({ accumulator: writerContext.accumulator, inventoryInitializer: () => ({
            action,
            context: actionContext,
            labels: {},
            stash: [],
        }) });
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
            inventoryInitializer: () => ({ stash: []}),
        });

        const execute = jest.fn();
        const door = actionExecutor.createDoor(doorName);
        door.accumulator.add({
            description: "Execute: test-step",
            execute,
        });
        executeUntilStop(actionExecutor);

        expect(execute).toBeCalled();
    }

    it('pass door', () => {
        verifyPassDoorConverted({
            passDoor: {
                name: "~{action.execute}",
                inventory: "~{action.parameters}",            
            },
        }, "theDoor", {
            execute: "theDoor",
            parameters: {a: 123},
        });
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ passDoor: { name: "passDoor", inventory: {} } })).toBeTruthy();
    });

    it('has validation errors when accumulate is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { passDoor: { name: 123, inventory: 123} };
        convertor.validationErrors(command as unknown as PassDoorCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "name",
            wrongType: "number",
            neededType: "string|formula",
            object: command.passDoor,
        }, {
            code: "WRONG_TYPE",
            field: "inventory",
            wrongType: "number",
            neededType: "object|undefined|formula",
            object: command.passDoor,
        }]);
    });
});