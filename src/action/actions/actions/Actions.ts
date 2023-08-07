import { Action } from "../Action";

export type Actions<A extends Action = Action> = A[] | A;