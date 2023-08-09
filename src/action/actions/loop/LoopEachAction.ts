import { ArrayResolution } from "../../data/resolution/ArrayResolution";
import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface LoopEachAction<A extends Action = Action> extends Action {
    loopEach: ArrayResolution;
    do: Actions<A>;
}