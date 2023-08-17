import { ConvertError } from "../../../../napl/core/error/errors";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { verifyType } from "../validation/verifyType";
import { WriterExecutor } from "../WriterExecutor";
import { WriterBaseConvertor } from "../WriterBaseConvertor";

export interface ReturnCommand extends WriterBaseCommand {
    return: {};
}

export class ReturnConvertor extends WriterBaseConvertor<ReturnCommand> {
    priority: number = -1;

    convert(command: ReturnCommand, writerContext: WriterContext): void {
        writerContext.accumulator.add({
            description: `Convert: return.`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }

                const { context } = writerExecutor;
                context.accumulator.add({
                    description: `Execute: return`,
                    execute(executor) {
                        executor.popStep();
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.return !== undefined;
    }

    validationErrors(command: ReturnCommand, errors: ConvertError[]): void {
        verifyType(command, "return", ["object"], errors);
    }
}
