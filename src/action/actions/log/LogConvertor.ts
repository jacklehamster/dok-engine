import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const LOG_CONVERTOR = new CodedConvertor({
    field: "log",
    writerCommands: [
        {
            subject: "~~{consoleLog}",
            call: "~{action.log}",
        },
    ],
});