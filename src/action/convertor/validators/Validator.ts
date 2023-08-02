import { Action } from "../../actions/Action";

export interface Validator {
    validate(action: Action): boolean;
}