import { ConvertError } from "../../../error/errors";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface CallExternalCommand extends WriterBaseCommand {
    callExternal: {
        name: StringResolution;
        arguments: ArrayResolution,
    };
}

export class CallExternalConvertor extends Convertor<CallExternalCommand, WriterInventory, WriterContext> {
    convert(command: CallExternalCommand, writerContext: WriterContext): void {
        const externalName = resolveString(command.callExternal.name);
        const argumentsArray = resolveArray(command.callExternal.arguments);
        writerContext.accumulator.add({
            description: `Convert: call external: ${externalName}(${command.callExternal.arguments})`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context } = writerExecutor.inventory;
                const external = context.externals[writerExecutor.evaluate(externalName) ?? ""];
                const args = writerExecutor.evaluate(argumentsArray) as Resolution[];
                const argsValues = args.map(resolution => resolveAny(resolution));
                const argsResult = new Array(argsValues.length);
                context.accumulator.add({
                    description: `Execute: ${externalName}(${args.join(",")})`,
                    execute(executor) {
                        executor.evaluateArray(argsValues, argsResult);
                        external(...argsResult);
                    },
                });
            },
        });
    }

    validate(action: WriterCommand): boolean {
        return action.callExternal !== undefined;
    }

    validationErrors(action: CallExternalCommand, errors: ConvertError[]): void {
        verifyType(action.callExternal, "name", ["string"], errors);
        verifyType(action.callExternal, "arguments", ["array", "formula"], errors);
    }
}
