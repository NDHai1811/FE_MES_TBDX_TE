import axios from "axios";

export async function getProductFMB(params) {
      const res = await axios.get('produce/fmb');
      return res;
}

export async function getPerfomanceMachine(params) {
      const res = await axios.get('machine/perfomance');
      return res;
}

export async function getMonitorList(params) {
      const res = await axios.get('dashboard/monitor');
      return res;
}

export async function getMonitor(params) {
      const res = await axios.get('dashboard/get-monitor');
      return res;
}