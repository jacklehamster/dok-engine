import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { IfAction } from "./IfAction";

export const IF_CONVERTOR = new CodedConvertor<IfAction>({
    field: "if",
    validations: [
        {
            field: "then",
            types: ["array", "object"],
        },
        {
            field: "else",
            types: ["array", "object", "undefined"],
        },
    ],
    writerCommands: [
        {
            skipNextOnCondition: "~{action.if}",
        },
        {
            condition: "~{not defined(action.else)}",
            jumpTo: "endAnchor",
        },
        {
            condition: "~{defined(action.else)}",
            jumpTo: "elseAnchor",
        },
        {
            accumulate: "~{action.then}",
        },
        {
            condition: "~{defined(action.else)}",
            jumpTo: "endAnchor",
        },
        {
            label: "elseAnchor",
            condition: "~{defined(action.else)}",
            accumulate: "~{action.else}",
        },
        {
            label: "endAnchor",
        },
    ],
});
