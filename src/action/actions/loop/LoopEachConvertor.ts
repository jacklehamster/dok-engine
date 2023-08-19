import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { ReConvertor } from "../../convertor/reconvertor/ReConvertor";

export const LOOP_EACH_CONVERTOR = new CodedConvertor({
    field: ["loopEach", "do"],
    validations: [
        {
            field: "do",
            types: ["array", "object"],
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

export const LOOP_EACH_RECONVERTOR = new ReConvertor({
    field: "loopEach",
    forbiddenField: "do",
    action: {
        loopEach: "~{action.loopEach}",
        do: "~{removeFields(action, 'loop')}",
    },
});
