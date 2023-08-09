import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface Script<A extends Action = Action> {
    name: string;
    actions: Actions<A>;
}

export interface ScriptAction<A extends Action = Action> extends Action {
    script: {
        name: string;
        actions: Actions<A>;    
    };
}