import { CodedConvertor } from "../../convertor/coded/CodedConvertor";

export const ACTIONS_CONVERTOR = new CodedConvertor({
    field: "actions",
    writerCommands: [
        {
            accumulate: "~{action.actions}",
        }
    ]
});