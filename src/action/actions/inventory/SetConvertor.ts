import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const SET_CONVERTOR = new CodedConvertor({
    field: "set",
    writerCommands: [
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