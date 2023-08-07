import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../actions/error/errors";
import { isFormula } from "../../../data/formula/formula-utils";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
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
            execute(writerInventory, writerExecutor) {
                const external = writerInventory.context.externals[writerExecutor.evaluate(externalName, writerInventory) ?? ""];
                const args = writerExecutor.evaluate(argumentsArray, writerInventory) as Resolution[];
                const argsValues = args.map(resolution => resolveAny(resolution));
                const argsResult = new Array(argsValues.length);
                writerInventory.context.accumulator.add({
                    execute(parameters, executor) {
                        executor.evaluateArray(argsValues, parameters, argsResult);
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
        if (typeof(action.callExternal?.name) !== "string") {
            errors.push({
                code: "WRONG_TYPE",
                field: "callExternal.name",
                wrongType: typeof(action.callExternal?.name),
                neededType: "string",
            });
        }
        if (!isFormula(action.callExternal?.arguments) && !Array.isArray(action.callExternal?.arguments)) {
            errors.push({
                code: "WRONG_TYPE",
                field: "callExternal.arguments",
                wrongType: typeof(action.callExternal?.arguments),
                neededType: "array|formula",
            });
        }
    }
}
