import { Inventory } from "../../data/inventory/Inventory";
import { resolveBoolean } from "../../data/resolution/BooleanResolution";
import { resolveAny } from "../../data/resolution/Resolution";
import { Executor } from "../../execution/Executor";
import { WriterInventory } from "./WriterInventory";
import { WriterBaseCommand } from "./commands/WriterBaseCommand";

export function shouldConvert(command: WriterBaseCommand, writerExecutor: Executor<WriterInventory>) {
    if (command.condition === undefined) {
        return true;
    }
    const conditionResult = writerExecutor.evaluate(resolveBoolean(command.condition));

    if (conditionResult == null) {
        writerExecutor.reportError({
            code: "INVALID_FORMULA",
            formula: command.condition,
        })    
    }

    if (!conditionResult) {
        return false;
    }
    return true;
}

export function getSubjectResolution(
        command: WriterBaseCommand,
        writerExecutor: Executor<WriterInventory>,
        defaultSubject?: any) {
    const subjectConversionResolution = resolveAny(command.subject);
    const subjectConversion = writerExecutor.evaluate(subjectConversionResolution);
    const subjectValueResolution = resolveAny(subjectConversion);

    return {
        valueOf(inventory: Inventory) {
            return subjectValueResolution.valueOf(inventory) ?? defaultSubject ?? inventory;
        },
    };
}
