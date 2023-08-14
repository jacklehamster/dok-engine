import { ConvertError } from "../../../error/errors";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { verifyType } from "../validation/verifyType";
import { WriterExecutor } from "../WriterExecutor";

export interface StepStackCommand extends WriterBaseCommand {
    stepStack: "push" | "pop";
}

export class StepStackConvertor extends Convertor<StepStackCommand, WriterContext> {
    convert(command: StepStackCommand, writerContext: WriterContext): void {
        writerContext.accumulator.add({
            description: `Convert: stepStack ${command.stepStack}.`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }

                const { context } = writerExecutor;

                context.accumulator.add({
                    description: `Execute: stepStack ${command.stepStack}`,
                    execute(executor) {
                        if (command.stepStack === "pop") {
                            executor.popStep();
                        } else if (command.stepStack === "push") {
                            executor.pushStep();
                        }
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.stepStack !== undefined;
    }

    validationErrors(command: StepStackCommand, errors: ConvertError[]): void {
        verifyType(command, "stepStack", ["string"], errors);
    }
}
