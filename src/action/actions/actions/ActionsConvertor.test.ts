import { Convertor } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { ACTIONS_CONVERTOR } from "./ActionsConvertor";

describe('ActionsConvertor', () => {
    it('Ignore action without actions', () => {
        expect(ACTIONS_CONVERTOR.validate({})).toBeFalsy();
    });

    it('convert subactions', () => {
        const receiveAction = jest.fn();
        const subConvertor: Convertor = new MultiConvertor();
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
        }, { accumulator, subConvertor, externals: {} });
        expect(receiveAction).toBeCalledWith({ name: "sampleAction" });
        expect(receiveAction).toBeCalledWith({ name: "sampleAction2" });
    });
});