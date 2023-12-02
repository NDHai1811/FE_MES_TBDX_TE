import axios from "axios";

export async function getErrorDetailList(params) {
    const res = await axios.get('ui/quality/table-error-detail', {params});
    return res;
}