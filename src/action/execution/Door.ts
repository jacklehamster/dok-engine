import { Inventory } from "../data/inventory/Inventory";
import { StepAccumulator } from "../steps/StepAccumulator";

export default interface Door<I extends Inventory = Inventory> {
    accumulator: StepAccumulator<I>;
}