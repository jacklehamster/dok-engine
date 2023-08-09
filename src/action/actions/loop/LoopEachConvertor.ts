import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const LOOP_EACH_CONVERTOR = new CodedConvertor({
    field: "loopEach",
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
            stash: ["idx", "array", "length", "element"]
        },
        {
            property: "idx",
            value: 0,
        },
        {
            property: "array",
            value: "~{action.loopEach}",
        },
        {
            property: "length",
            value: "~~{length(array)}",
        },
        {
            label: "loopStartAnchor",
            skipNextOnCondition: "~~{idx < length}",
        },
        {
            jumpTo: "endAnchor",
        },
        {
            property: "element",
            value: "~~{at(array, idx)}",
        },
        {
            accumulate: "~{action.do}",
        },
        {
            property: "idx",
            value: "~~{value + 1}",
        },
        {
            jumpTo: "loopStartAnchor",
        },
        {
            label: "endAnchor",
            unstash: {},
        },
    ],
});
