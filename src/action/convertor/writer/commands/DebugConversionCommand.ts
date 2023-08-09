import { Resolution } from "../../../data/resolution/Resolution";
import { resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface DebugConversionCommand extends WriterBaseCommand {
    debug: Resolution;
}

export class DebugConversionConvertor extends Convertor<DebugConversionCommand, WriterInventory, WriterContext> {
    convert(command: DebugConversionCommand, writerContext: WriterContext): void {
        const debugResolution = resolveString(command.label);
        writerContext.accumulator.add({
            description: `Convert: Debug ${command.debug}`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                console.log(writerExecutor.evaluate(debugResolution));
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.debug !== undefined;
    }
}