import { Action } from "../../actions/Action";
import { ConvertError } from "../../error/errors";
import { Executor } from "../../execution/Executor";
import { Context, Convertor } from "../Convertor";
import { WriterContext } from "../writer/WriterContext";
import { WriterCommand } from "../writer/commands/WriterCommand";
import { WriterInventory } from "../writer/WriterInventory";
import { Validation } from "./CodedValidator";
import { executeUntilStop } from "../../execution/utils/execution-utils";

interface ConverterConfig {
    field: string;
    validations?: Validation[];
    writerCommands?: WriterCommand[];
}

export class CodedConvertor<A extends Action = Action> extends Convertor<A> {
    private field: string;
    private validations: Validation[];
    private writerCommands: WriterCommand[];

    constructor({ field, validations = [], writerCommands = [] }: ConverterConfig) {
        super();
        this.field = field;
        this.validations = validations;
        this.writerCommands = writerCommands;
    }

    validate(action: Action): boolean {
        return action[this.field] !== undefined;
    }

    convert(action: A, context: Context): void {
        const writerContext: WriterContext = new WriterContext();
        this.writerCommands?.forEach(command => {
            const errors: ConvertError[] = [];
            writerContext.subConvertor.validationErrors(command, errors);
            if (errors.length) {
                throw new Error("Errors in conversion : " + JSON.stringify(errors));
            }
            writerContext.subConvertor.convert(command, writerContext);
        });
        const executor: Executor<WriterInventory> = new Executor<WriterInventory>({
            inventoryInitializer() {
                return {
                    action,
                    context,
                    labels: {},
                    stash: [],
                };
            },
            accumulator: writerContext.accumulator,
        });
        executeUntilStop(executor);
    }

    validationErrors(action: A, errors: ConvertError[]): void {
        this.validations.forEach(({ field, type, error }) => {
            const fieldValue = action[field ?? this.field];
            switch (type) {
                case 'array':
                    if (!Array.isArray(fieldValue)) {
                        errors.push(error);
                    }
                    break;
                case 'string':
                    if (typeof(fieldValue) !== "string") {
                        errors.push(error);
                    }
                    break;
            }
        });
    }

}