import { Action } from "../../../actions/Action";
import { BooleanResolution } from "../../../data/resolution/BooleanResolution";

export interface WriterBaseCommand extends Action {
    condition?: BooleanResolution;
}