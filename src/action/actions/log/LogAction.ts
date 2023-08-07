import { StringResolution } from "../../data/resolution/StringResolution";
import { Action } from "../Action";

export interface LogAction extends Action {
    log: StringResolution[];
}