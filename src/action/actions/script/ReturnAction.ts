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
            types: ["object"],
        },
    ],
    writerCommands: [
        {
            state: "pop",
            return: {},
        },
    ],
});
