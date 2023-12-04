import axios from "axios";

export const getListPlanMaterialExport = async () => {
  return await axios.get("/ui/warehouse/list-material-import");
};
