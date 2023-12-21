import axios from "axios";

export async function getMachineList(params) {
    const res = await axios.get('ui/machine/list', {params});
    return res;
}
export async function getMachineErrorList(params) {
    const res = await axios.get('ui/equipment/error-machine-list', {params});
    return res;
}
export async function getErrorMachineFrenquency(params) {
    const res = await axios.get('ui/equipment/error-machine-frequency', {params});
    return res;
}
export async function getMachinePerformance(params) {
    const res = await axios.get('ui/equipment/performance', {params});
    return res;
}
export async function getMachineParamLogs(params) {
    const res = await axios.get('ui/equipment/get-machine-param-logs', {params});
    return res;
}