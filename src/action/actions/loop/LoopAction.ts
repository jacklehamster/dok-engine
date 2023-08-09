import { NumberResolution } from "../../data/resolution/NumberResolution";
import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface LoopAction<A extends Action = Action> extends Action {
    loop: NumberResolution;
    do: Actions<A>;
}