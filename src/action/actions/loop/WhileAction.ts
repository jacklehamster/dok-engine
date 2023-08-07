import { BooleanResolution } from "../../data/resolution/BooleanResolution";
import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface WhileAction<A extends Action = Action> extends Action {
    while: BooleanResolution;
    do: Actions<A>;
}