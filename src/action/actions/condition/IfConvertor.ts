import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const IF_CONVERTOR = new CodedConvertor({
    field: "if",
    validations: [
        {
            field: "then",
            type: "array",
            error: {
                code: "WRONG_TYPE",
                neededType: "array",
            },
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
