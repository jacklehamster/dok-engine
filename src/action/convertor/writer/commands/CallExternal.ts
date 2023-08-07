import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../actions/error/errors";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { verifyType } from "../validation/verifyType";
import { WriterCommand } from "./WriterCommand";

export interface CallExternalCommand extends Action {
    callExternal: {
        name: StringResolution;
        arguments: ArrayResolution,
    };
}

export class CallExternalConvertor extends Convertor<CallExternalCommand, WriterInventory, WriterContext> {
    convert(action: CallExternalCommand, context: WriterContext): void {
        const externalName = resolveString(action.callExternal.name);
        const argumentsArray = resolveArray(action.callExternal.arguments);
        context.accumulator.add({
            execute(writerExecutor) {
                const { context } = writerExecutor.inventory;
                const external = context.externals[writerExecutor.evaluate(externalName) ?? ""];
                const args = writerExecutor.evaluate(argumentsArray) as Resolution[];
                const argsValues = args.map(resolution => resolveAny(resolution));
                const argsResult = new Array(argsValues.length);
                context.accumulator.add({
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
