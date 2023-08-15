import { Executor } from "../action/execution/Executor";

export default class Engine {
    executors: Set<Executor> = new Set();

}