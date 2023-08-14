import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const LOG_CONVERTOR = new CodedConvertor({
    field: "log",
    writerCommands: [
        {
            subject: "~~{log}",
            call: "~{action.log}",
        },
    ],
    validations: [
        {
            field: "log",
            types: ["array"],
        },
    ]
});