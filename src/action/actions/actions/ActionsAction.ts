import { Action } from "../Action";
import { Actions } from "./Actions";

export interface ActionsAction<A extends Action> extends Action {
    actions: Actions<A>;
}