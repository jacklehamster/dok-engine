import { BooleanResolution } from "../../data/resolution/BooleanResolution";
import { Action } from "../Action";
import { Actions } from "../actions/Actions";

export interface IfAction<A extends Action = Action> extends Action {
    if: BooleanResolution;
    then: Actions<A>;
    else?: Actions<A>;
}