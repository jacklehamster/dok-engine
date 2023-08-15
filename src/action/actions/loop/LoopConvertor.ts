import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { ReConvertor } from "../../convertor/reconvertor/ReConvertor";

export const LOOP_CONVERTOR = new CodedConvertor({
    field: ["loop", "do"],
    validations: [
        {
            field: "do",
            types: ["array"],
        },
    ],
    writerCommands: [
        {
            stash: ["idx", "length"],
        },
        {
            property: "idx",
            value: 0,
        },
        {
            property: "length",
            value: "~{action.loop}"
        },
        {
            label: "loopStartAnchor",
            skipNextOnCondition: "~~{idx < length}",
        },
        {
            jumpTo: "endAnchor",
        },
        {
            accumulate: "~{action.do}",
        },
        {
            property: "idx",
            value: "~~{value + 1}"
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

export const LOOP_RECONVERTOR = new ReConvertor({
    field: "loop",
    forbiddenField: "do",
    action: {
        loop: "~{action.loop}",
        do: "~{removeFields(action, 'loop')}",
    },
});
