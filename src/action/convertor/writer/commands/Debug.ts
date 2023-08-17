import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { WriterContext } from "../WriterContext";
import { WriterBaseConvertor } from "../WriterBaseConvertor";
import { WriterExecutor } from "../WriterExecutor";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface DebugConversionCommand extends WriterBaseCommand {
    debug: Resolution;
}

export class DebugConversionConvertor extends WriterBaseConvertor<DebugConversionCommand> {
    log = console.log;

    convert(command: DebugConversionCommand, writerContext: WriterContext): void {
        const debugResolution = resolveAny(command.debug);
        const log = this.log;
        writerContext.accumulator.add({
            description: `Convert: Debug ${command.debug}`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                log(writerExecutor.evaluate(debugResolution));
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.debug !== undefined;
    }
}
