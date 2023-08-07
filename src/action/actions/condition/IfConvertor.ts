import { Action } from "../Action";
import { Context, Convertor } from "../../convertor/Convertor";
import { IfAction } from "./IfAction";
import { resolveBoolean } from "../../data/resolution/BooleanResolution";
import { Executor } from "../../execution/Executor";
import { ConvertError } from "../error/errors";
import { asArray } from "../../utils/array-utils";



export class IfConvertor extends Convertor {
    convert(action: IfAction, context: Context): void {
        const { accumulator, subConvertor } = context;
        const { if: ifProperty, then: thenProp, else: elseProp } = action;
        const condition = resolveBoolean(ifProperty);

        //  Skip next step depending on condition
        accumulator.add({
            execute(executor: Executor) {
                const bool = executor.evaluate(condition) ?? false;
                executor.ifCondition(bool).skipNextStep();
            },
        });

        //  If then action
        if (!elseProp) {
            //  Next step jumps over "then" actions
            accumulator.add({
                execute(executor: Executor) {
                    executor.jumpTo(endAnchor);
                },
            });
            //  Add "then" actions
            asArray(thenProp).forEach(action => subConvertor.convert(action, context));
        } else {
            //  If then else action
            //  Next step jumps to "else" anchor
            accumulator.add({
                execute(executor: Executor) {
                    executor.jumpTo(elseAnchor);
                },
            });
            //  Add "then" actions
            asArray(thenProp).forEach(action => subConvertor.convert(action, context));
            //  Jump to "end" anchor
            accumulator.add({
                execute(executor: Executor) {
                    executor.jumpTo(endAnchor);
                },
            });
            const elseAnchor = accumulator.add({});
            //  Add "else" actions
            asArray(elseProp).forEach(action => subConvertor.convert(action, context));
        }
        const endAnchor = accumulator.add({ description: "endAnchor" });
    }

    validate(action: Action): boolean {
        return action.if !== undefined;
    }

    validationErrors(action: Action, errors: ConvertError[]): void {
        if (action.then === undefined) {
            errors.push({
                field: "then",
                code: "MISSING_PROPERTY",
            });
        }
        const { if: ifProperty, then: thenProp, else: elseProp, ...subAction } = action;
        if (Object.values(subAction).length) {
            errors.push({
                code: "TOO_MANY_PROPERTIES",
                validProperties: ["if", "then", "else"],
            });
        }
    }
}
