import { ActionConvertor } from "../../convertor/ActionConvertor";
import { MultiConvertor } from "../../../napl/core/conversion/MultiConvertor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { ACTIONS_CONVERTOR } from "./ActionsConvertor";
import { ConvertorDeserializer } from "../../../napl/core/serialization/ConvertorDeserializer";

describe('ActionsConvertor', () => {
    it('Ignore action without actions', () => {
        expect(ACTIONS_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert subactions', () => {
        const receiveAction = jest.fn();
        const subConvertor: ActionConvertor = new MultiConvertor();
        subConvertor.convert = (action) => receiveAction(action);
        const accumulator = new StepAccumulator();
        ACTIONS_CONVERTOR.convert({
            actions: [
                {
                    name: "sampleAction",
                },
                {
                    name: "sampleAction2",
                },
            ],
        }, { accumulator, subConvertor });
        expect(receiveAction).toBeCalledWith({ name: "sampleAction" });
        expect(receiveAction).toBeCalledWith({ name: "sampleAction2" });
    });

    it('serialize', () => {
        const deserializer = new ConvertorDeserializer();
        const serialized = ACTIONS_CONVERTOR.serialize();
        const result = deserializer.deserialize(serialized);
        expect(result.serialize()).toEqual(serialized);
    });
});