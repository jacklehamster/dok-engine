import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const ASSIGN_CONVERTOR = new CodedConvertor({
    field: "=",
    writerCommands: [
        {
            condition: "~{length(action['=']) == 2}",
            property: "~{at(action['='], 0)}",
            value: "~{at(action['='], 1)}",
        },
        {
            condition: "~{length(action['=']) == 3}",
            subject: "~{at(action['='], 0)}",
            property: "~{at(action['='], 1)}",
            value: "~{at(action['='], 2)}",
        },
    ],
    validations: [
        {
            field: "=",
            types: ["object"],
        },
    ]
});
