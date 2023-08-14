import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { ObjectResolution } from "../../data/resolution/ObjectResolution";
import { StringResolution } from "../../data/resolution/StringResolution";
import { Action } from "../Action";

export interface ExecuteAction extends Action {
    execute: StringResolution;
    parameters: ObjectResolution;
}


export const EXECUTE_CONVERTOR = new CodedConvertor({
    field: "execute",
    validations: [
        {
            field: "parameters",
            type: "object",
            error: {
                code: "WRONG_TYPE",
                neededType: "object",
            },
        },
    ],
    writerCommands: [
        {
            state: "push",
            parameters: "~{action.parameters}",
        },
        {
            jumpTo: "~portal-{action.execute}",
            pushStep: true,
        },
    ],
});
