import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { StringResolution } from "../../data/resolution/StringResolution";
import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface ScriptAction<A extends Action = Action> extends Action {
    script: {
        name: StringResolution;
        actions: Actions<A>;    
    };
}

export const SCRIPT_CONVERTOR = new CodedConvertor({
    field: "script",
    validations: [
        {
            field: "script",
            types: ["object"],
        },
    ],
    writerCommands: [
        {
            jumpTo: "postPortal",
        },
        {
            label: "~portal-{action.script.name}",
            isGlobal: true,
            accumulate: "~{action.script.actions}",
        },
        {
            state: "pop",
            return: {},
        },
        {
            label: "postPortal",
        },
    ],
});
