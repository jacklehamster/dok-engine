import { Action } from "../../../actions/Action";
import { BooleanResolution } from "../../../data/resolution/BooleanResolution";
import { Resolution } from "../../../data/resolution/Resolution";

export interface WriterBaseCommand extends Action {
    subject?: Resolution;
    condition?: BooleanResolution;
}