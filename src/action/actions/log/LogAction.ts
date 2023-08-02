import { Action } from "../Action";

export interface LogAction extends Action {
    log: string[];
}