import { StepAccumulator } from "../../../steps/StepAccumulator";
import { ActionContext } from "../../ActionConvertor";
import { MultiConvertor } from "../../../../napl/core/conversion/MultiConvertor";
import { WriterContext } from "../WriterContext";
import { executeUntilStop } from "../../../execution/utils/execution-utils";
import { WriterExecutor } from "../WriterExecutor";
import { DebugConversionConvertor } from "./Debug";

describe('test debug', () => {
    let convertor: DebugConversionConvertor;
    let writerContext: WriterContext;
    let actionContext: ActionContext;

    beforeEach(() => {
        jest.clearAllMocks();
        convertor = new DebugConversionConvertor();
        writerContext = new WriterContext();
        actionContext = {
            subject: {},
            accumulator: new StepAccumulator(),
            subConvertor: new MultiConvertor(),
        };
    });

    it('call with arguments', () => {
        convertor.log = jest.fn();
        convertor.convert({
            debug: "~{action.data}",
        }, writerContext);

        const executor = new WriterExecutor(writerContext.accumulator,
            {
                data: 1234,
            },
            actionContext);
        executeUntilStop(executor);
        expect(convertor.log).toBeCalledWith(1234);
    });

    it('validates on proper WriterCommand', () => {
        expect(convertor.validate({ debug: [] })).toBeTruthy();
        expect(convertor.validate({ accumulate: "~{action.actions}" })).toBeFalsy();
    });
});