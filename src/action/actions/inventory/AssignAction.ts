import { Resolution } from "../../data/resolution/Resolution";
import { StringResolution } from "../../data/resolution/StringResolution";
import { Action } from "../Action";

export interface AssignAction extends Action {
    "=": [Resolution, StringResolution, Resolution] | [StringResolution, Resolution];
}
