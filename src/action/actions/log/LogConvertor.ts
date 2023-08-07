import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const LOG_CONVERTOR = new CodedConvertor({
    field: "log",
    writerCommands: [
        {
            callExternal: {
                name: "log",
                arguments: "~{action.log}",
            },
        },
    ],
    validations: [
        {
            field: "log",
            type: "array",
            error: {
                code: "WRONG_TYPE",
                neededType: "array",
            },
        },
    ]
});