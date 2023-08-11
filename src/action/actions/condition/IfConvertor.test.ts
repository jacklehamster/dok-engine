import { Context, Convertor } from "../../convertor/Convertor";
import { MultiConvertor } from "../../convertor/MultiConvertor";
import { Executor } from "../../execution/Executor";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { StepAccumulator } from "../../steps/StepAccumulator";
import { LOG_CONVERTOR } from "../log/LogConvertor";
import { IF_CONVERTOR } from "./IfConvertor";

describe('IfConvertor', () => {
    let context: Context;
    let log = jest.fn();
    let executor: Executor;

    let convertor: Convertor;

    beforeEach(() => {
        jest.clearAllMocks();
        context = {
            subConvertor: new MultiConvertor(
                LOG_CONVERTOR,
                IF_CONVERTOR,
            ),
            accumulator: new StepAccumulator(),
        };
        executor = new Executor({ accumulator: context.accumulator, inventory: { log }});
        convertor = IF_CONVERTOR;
    });

    it('Ignore action without if', () => {
        expect(convertor.validate({})).toBeFalsy();
    });

    it('convert then if true', () => {
        convertor.convert({
            if: true,
            then: {
                log: [123],
            },
            else: {
                log: [456],
            },
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
    });

    it('convert else if false', () => {
        convertor.convert({
            if: false,
            then: {
                log: [123],
            },
            else: {
                log: [456],
            },
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(456);
    });

    it('convert then if true. else missing', () => {
        convertor.convert({
            if: true,
            then: {
                log: [123],
            },
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
    });

    it('convert then if true with nesting', () => {
        convertor.convert({
            if: true,
            then: {
                if: true,
                then: {
                    log: [123],
                },
            },
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(123);
    });

    it('convert else with nesting', () => {
        convertor.convert({
            if: false,
            then: {
            },
            else: {
                if: false,
                then: {

                }, else: {
                    log: [456],
                }
            },
        }, context);
        executeUntilStop(executor);
        expect(log).toBeCalledWith(456);
    });
});