import { Action } from "../Action";

export interface ActionsAction<A extends Action> extends Action {
    actions: A[];
}