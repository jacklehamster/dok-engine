import { ConvertError } from "../../../error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { WriterExecutor } from "../WriterExecutor";

export interface RegisterMethodCommand extends WriterBaseCommand {
    method: StringResolution;
    portal: StringResolution;
}

export class RegisterMethodConvertor extends Convertor<RegisterMethodCommand, WriterContext> {
    convert(command: RegisterMethodCommand, writerContext: WriterContext): void {
        const nameResolution = resolveString(command.method);
        const portalResolution = resolveString(command.portal);
        writerContext.accumulator.add({
            description: `Convert: method ${command.method}`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context, labels } = writerExecutor;
                const nameValue = writerExecutor.evaluate(nameResolution);
                const nameValueResolution = resolveString(writerExecutor.evaluate(nameValue ?? "") ?? "");
                const portalValue = writerExecutor.evaluate(portalResolution);
                const portalValueResolution = resolveString(writerExecutor.evaluate(portalValue ?? "") ?? "");

                context.accumulator.add({
                    description: `method: ${nameValue} to ${portalValue}`,
                    execute: (executor) => {
                        const methodName = executor.evaluate(nameValueResolution) ?? "";
                        const portalLabel = executor.evaluate(portalValueResolution) ?? "";
                        const destination = labels[portalLabel] ?? context.accumulator.getLabel(portalLabel);

                        executor.inventory[methodName] = (...parameters: any[]) => {
                            executor.inventory.parameters = parameters;
                            executor.pushStep();
                            executor.jumpTo(destination);
                        };
                    },
                });

                if (nameValue) {

                } else {
                    writerExecutor.reportError({
                        code: "INVALID_FORMULA",
                        formula: command.label,
                    });
                }
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.method !== undefined && command.call === undefined;
    }

    validationErrors(command: RegisterMethodCommand, errors: ConvertError[]): void {
        verifyType(command, "method", ["string"], errors);        
    }
}
