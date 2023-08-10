import { ConvertError } from "../error/errors";
import { Inventory } from "../data/inventory/Inventory";
import { ValueOf } from "../data/resolution/ValueOf";
import { StepId } from "../steps/ExecutionStep";
import { StepAccumulator } from "../steps/StepAccumulator";
import Door from "./Door";
import { Obj } from "../data/types/basic-types";

export interface IExecutor<I extends Inventory = Inventory> {
    get inventory(): I;
    ifCondition(bool: ValueOf<boolean>): IExecutor | null;
    evaluate<T>(value: ValueOf<T>): T | null;
    skipNextStep(): IExecutor;
    jumpTo(step: StepId): IExecutor;
    stash(itemKeys: string[]): void;
    unstash(): void;
    createDoor(name: string): Door;
    passDoor(name: string, passedInventory: Obj): void;
    reportError(error: ConvertError): void;
}

const MAX_STEPS_PER_EXECUTION = 1000;
const MAX_STEPS_TAKEN = 5000;

interface Props<I extends Inventory = Inventory> {
    accumulator: StepAccumulator;
    inventoryInitializer(): I;
    doors?: Record<string, Door>;
}

export interface State<I extends Inventory = Inventory> {
    nextStep: StepId;
    inventory: I;
    accumulator: StepAccumulator<I>;
    doors: Record<string, Door>;
}

let stepCount = 0;
let nextExecutorId = 1;
export class Executor<I extends Inventory = Inventory> implements IExecutor {
    //  Executor ID
    id: number = 0;

    //  steps followed by the executor
    accumulator: StepAccumulator<I>;

    //  doors that can lead to new execution
    doors: Record<string, Door>;

    //  state
    nextStep: StepId = 0;           //  Upcoming step
    inventory: I;                   //  inventory carried
    inventoryInitializer: () => I;

    //  error report
    errors: ConvertError[] = [];    //  any error encountered

    //  state history
    states: State<I>[] = [];

    constructor({accumulator, inventoryInitializer, doors = {}}: Props<I>) {
        this.inventoryInitializer = inventoryInitializer;
        this.inventory = this.inventoryInitializer();
        this.accumulator = accumulator;
        this.doors = {...doors};
    }

    jumpTo(step: StepId): IExecutor {
        this.nextStep = step;
        return this;
    }

    skipNextStep(): IExecutor {
        this.nextStep++;
        return this;
    }

    ifCondition(bool: boolean): IExecutor | null {
        if (!bool) {
            return null;
        }
        return this;
    }

    evaluate<T>(value: ValueOf<T>): T | null {
        return value.valueOf(this.inventory) ?? null;
    }

    executeSingleStep() {
        stepCount++;
        if (stepCount > MAX_STEPS_TAKEN) {
            throw new Error(`${MAX_STEPS_TAKEN} steps taken without completing.`)
        }
        const step = this.nextStep++;
        const executionStep = this.accumulator.getStep(step);
        if (executionStep) {
            console.log(`${this.id}-${step}`, executionStep.description);
            executionStep.execute?.(this);
            if (this.errors.length) {
                return false;
            }
            return true;
        } else {
            if (this.popState()) {
                return true;
            }
        }
        return false;
    }

    reportError(error: ConvertError) {
        this.errors.push(error)
    }

    executeUtilStop() {
        if (!this.id) {
            this.id = nextExecutorId++;
        }
        let i;
        for (i = 0; i < MAX_STEPS_PER_EXECUTION; i++) {
            if (!this.executeSingleStep()) {
                break;
            }
        }
        if (i >= MAX_STEPS_PER_EXECUTION) {
            throw new Error(`Execution is considered stuck after running ${MAX_STEPS_PER_EXECUTION} steps.`);
        }
        if (this.errors.length) {
            console.error("Errors in execution: ", this.errors);
        }
    }

    stash(itemKeys: string[]): void {
        const items: Record<string, any> = {};
        this.inventory.stash.push(items);
        for (let key of itemKeys) {
            items[key] = this.inventory[key];
        }
    }

    unstash(): void {
        const items = this.inventory.stash.pop();
        if (items) {
            const inventory = this.inventory as Inventory;
            for (let key in items) {
                inventory[key] = items[key];
            }
        }
    }

    createDoor(name: string) {
        return this.doors[name] = {
            accumulator: new StepAccumulator(),
        };
    }

    private pushState() {
        this.states.push({
            nextStep: this.nextStep,
            inventory: this.inventory,
            accumulator: this.accumulator,
            doors: this.doors,
        });
    }

    private popState(): boolean {
        const savedState = this.states.pop();
        if (savedState) {
            const { nextStep, inventory, accumulator, doors } = savedState;
            this.nextStep = nextStep;
            this.inventory = inventory;
            this.accumulator = accumulator;
            this.doors = doors;
            return true;   
        }
        return false;
    }

    passDoor(name: string, passedInventory: Obj) {
        this.pushState();
        const door = this.doors[name];
        this.inventory = this.inventoryInitializer();
        for (let i in passedInventory) {
            (this.inventory as Inventory)[i] = passedInventory[i];
        }
        this.accumulator = door.accumulator;
        this.nextStep = 0;
        this.doors = {...this.doors};
    }
}