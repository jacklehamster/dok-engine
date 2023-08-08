import { Resolution } from "../../data/resolution/Resolution";
import { StringResolution } from "../../data/resolution/StringResolution";
import { Action } from "../Action";

export interface SetAction extends Action {
    set: {
        subject: Resolution;
        property: StringResolution;
        value: Resolution;
    }
}
