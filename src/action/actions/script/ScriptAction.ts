import { CodedConvertor } from "../../convertor/coded/CodedConvertor";
import { StringResolution } from "../../data/resolution/StringResolution";
import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface ScriptAction<A extends Action = Action> extends Action {
    script: {
        name: StringResolution;
        parameters: string[];
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
            method: "~{action.script.name}",
            portal: "~portal-{action.script.name}"
        },
        {
            jumpTo: "postPortal",
        },
        {
            label: "~portal-{action.script.name}",
            isGlobal: true,
        },
        {
            stash: "~{action.script.parameters}"
        },
        {
            subject: "~~{parameters}",
            spread: "~{action.script.parameters}",
        },
        {
            accumulate: "~{action.script.actions}",
        },
        {
            unstash: {},
        },
        {
            return: {},
        },
        {
            label: "postPortal",
        },
    ],
});
