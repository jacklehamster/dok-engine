import { ReturnValue } from "../../../steps/ExecutionStep";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterExecutor } from "../WriterExecutor";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface ReturnCommand extends WriterBaseCommand {
    return: {};
}

export class ReturnConvertor extends Convertor<ReturnCommand, WriterContext> {
    priority: number = -1;

    convert(command: ReturnCommand, writerContext: WriterContext): void {
        writerContext.accumulator.add({
            description: `Convert: Return`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context } = writerExecutor;

                const returnValue: ReturnValue = {};

                context.accumulator.add({
                    description: `Execute: Return"`,
                    execute(executor) {
                        returnValue.executor = executor.parent;
                        return returnValue;
                    }
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.return !== undefined;
    }
}
