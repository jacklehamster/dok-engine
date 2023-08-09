import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const LOOP_CONVERTOR = new CodedConvertor({
    field: "loop",
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
            property: "i",
            value: 0,
        },
        {
            property: "length",
            value: "~{action.loop}"
        },
        {
            label: "loopStartAnchor",
        },
        {
            skipNextOnCondition: "~~{i < length}",
        },
        {
            jumpTo: "endAnchor",
        },
        {
            accumulate: "~{action.do}",
        },
        {
            property: "i",
            value: "~~{value + 1}"
        },
        {
            jumpTo: "loopStartAnchor",
        },
        {
            label: "endAnchor",
        },
    ],
});
