import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../error/errors";
import { Executor } from "../../../execution/Executor";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { StepAccumulator } from "../../../steps/StepAccumulator";
import { Context } from "../../Convertor";
import { MultiConvertor } from "../../MultiConvertor";
import { WriterContext } from "../WriterContext";
import { WriterExecutor } from "../WriterExecutor";
import { CreateDoorCommand, CreateDoorConvertor } from "./CreateDoor";

describe('test createDoor', () => {
    let convertor: CreateDoorConvertor;
    let writerContext: WriterContext;
    let convert = jest.fn();
    let actionContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new CreateDoorConvertor();
        writerContext = new WriterContext();
        actionContext = {
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
        actionContext.subConvertor.convert = convert;
    });

    function verifyCreateDoorConverted(command: CreateDoorCommand, action: Action, actionsExpected: Action[], expectSubConversion: boolean) {
        expect(actionsExpected.length).not.toBe(0);

        convertor.convert(command, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator,action, actionContext);
        executeUntilStop(executor);

        const actionExecutor = new Executor({
            accumulator: actionContext.accumulator,
        });
        executeUntilStop(actionExecutor);

        for (let i = 0; i < actionsExpected.length; i++) {
            if (expectSubConversion) {
                expect(convert).toBeCalledWith(actionsExpected[i], expect.objectContaining({
                    subConvertor: actionContext.subConvertor,
                    accumulator: {
                        steps: [],
                    },
                }));
            } else {
                expect(convert).not.toBeCalled();               
            }
        }
        expect(actionExecutor.doors[command.door.name]).toBeDefined();
    }

    it('accumulates actions in subconvertor', () => {
        verifyCreateDoorConverted({
            door: {
                name: "theDoor",
                actions: [{ name: "testWriterAction" }, { name: "testWriterAction2"}],            
            },
        }, {
            actions: [{ name: "testAction" }, { name: "testAction2" }]
        }, [
            {name: "testWriterAction"},
            {name: "testWriterAction2"},
        ], true);
    });

    it('accumulate actions using formula', () => {
        verifyCreateDoorConverted({
            door: {
                name: "theDoor",
                actions: "~{action.actions}",            
            },
        }, {
            actions: [{ name: "testAction" }, { name: "testAction2" }]
        }, [
            {name: "testAction"},
            {name: "testAction2"},
        ], true);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ call: [] })).toBeFalsy();
        expect(convertor.validate({ door: { name: "door", actions: "act" } })).toBeTruthy();
    });

    it('has validation errors when accumulate is an invalid type', () => {
        const errors: ConvertError[] = [];
        const command = { door: { name: 123, actions: 123} };
        convertor.validationErrors(command as unknown as CreateDoorCommand, errors);
        expect(errors).toEqual([{
            code: "WRONG_TYPE",
            field: "name",
            wrongType: "number",
            neededType: "string|formula",
            object: command.door,
        }, {
            code: "WRONG_TYPE",
            field: "actions",
            wrongType: "number",
            neededType: "array|object|formula",
            object: command.door,
        }]);
    });
});