import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { Action } from "../Action";

export interface ReturnAction extends Action {
    return: {},
}


export const RETURN_CONVERTOR = new CodedConvertor({
    priority: -1,
    field: "return",
    validations: [
        {
            field: "return",
            type: "object",
            error: {
                code: "WRONG_TYPE",
                neededType: "object",
            },
        },
    ],
    writerCommands: [
        {
            state: "pop",
        },
        {
            stepStack: "pop",
        },
    ],
});
