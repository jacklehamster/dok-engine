import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { BooleanResolution } from "../../data/resolution/BooleanResolution";
import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface UnlessAction<A extends Action = Action> extends Action {
    unless: BooleanResolution;
    do: Actions<A>;
}

export const UNLESS_CONVERTOR = new CodedConvertor<UnlessAction>({
    field: "unless",
    validations: [
        {
            field: "do",
            type: "array",
            error: {
                code: "WRONG_TYPE",
                neededType: "array",
            },
        },
    ],
    writerCommands: [
        {
            skipNextOnCondition: "~{not action.unless}",
        },
        {
            jumpTo: "endAnchor",
        },
        {
            accumulate: "~{action.do}",
        },
        {
            label: "endAnchor",
        },
    ],
});
