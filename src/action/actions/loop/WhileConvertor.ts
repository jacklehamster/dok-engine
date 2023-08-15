import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { ReConvertor } from "../../convertor/reconvertor/ReConvertor";

export const WHILE_CONVERTOR = new CodedConvertor({
    field: ["while", "do"],
    validations: [
        {
            field: "do",
            types: ["array"],
        },
    ],
    writerCommands: [
        {
            label: "whileAnchor",
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


export const WHILE_RECONVERTOR = new ReConvertor({
    field: "while",
    forbiddenField: "do",
    action: {
        while: "~{action.while}",
        do: "~{removeFields(action, 'loop')}",
    },
});
