import { MultiConvertor } from "../../napl/core/conversion/MultiConvertor";
import { ACTIONS_CONVERTOR } from "../actions/actions/ActionsConvertor";
import { IF_CONVERTOR } from "../actions/condition/IfConvertor";
import { UNLESS_CONVERTOR } from "../actions/condition/UnlessAction";
import { ASSIGN_CONVERTOR } from "../actions/inventory/AssignConvertor";
import { SET_CONVERTOR } from "../actions/inventory/SetConvertor";
import { LOG_CONVERTOR } from "../actions/log/LogConvertor";
import { LOOP_CONVERTOR, LOOP_RECONVERTOR } from "../actions/loop/LoopConvertor";
import { LOOP_EACH_CONVERTOR, LOOP_EACH_RECONVERTOR } from "../actions/loop/LoopEachConvertor";
import { WHILE_CONVERTOR, WHILE_RECONVERTOR } from "../actions/loop/WhileConvertor";
import { EXECUTE_CONVERTOR } from "../actions/script/ExecuteAction";
import { RETURN_CONVERTOR } from "../actions/script/ReturnAction";
import { SCRIPT_CONVERTOR } from "../actions/script/ScriptAction";

export const MULTI_ACTION_CONVERTOR = new MultiConvertor([
    ACTIONS_CONVERTOR,
    IF_CONVERTOR,
    UNLESS_CONVERTOR,
    ASSIGN_CONVERTOR,
    SET_CONVERTOR,
    LOG_CONVERTOR,
    LOOP_CONVERTOR,
    LOOP_RECONVERTOR,
    LOOP_EACH_CONVERTOR,
    LOOP_EACH_RECONVERTOR,
    WHILE_CONVERTOR,
    WHILE_RECONVERTOR,
    EXECUTE_CONVERTOR,
    RETURN_CONVERTOR,
    SCRIPT_CONVERTOR,
]);