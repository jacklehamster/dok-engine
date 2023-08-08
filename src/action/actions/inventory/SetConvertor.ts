import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const SET_CONVERTOR = new CodedConvertor({
    field: "set",
    writerCommands: [
        {
            subject: "~{action.set.subject}",
            property: "~{action.set.property}",
            value: "~{action.set.value}",
        },
    ],
    validations: [
        {
            field: "set",
            type: "object",
            error: {
                code: "WRONG_TYPE",
                neededType: "object",
            },
        },
    ]
});
