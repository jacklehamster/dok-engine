import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const WHILE_CONVERTOR = new CodedConvertor({
    field: "while",
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
            label: "whileAnchor",
        },
        {
            skipNextOnCondition: "~{action.while}",
        },
        {
            jumpTo: "endAnchor",
        },
        {
            accumulate: "~{action.do}",
        },
        {
            jumpTo: "whileAnchor",
        },
        {
            label: "endAnchor",
        },
    ],
});
