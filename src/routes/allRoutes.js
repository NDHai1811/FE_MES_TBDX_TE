import React from "react";
import { Redirect } from "react-router-dom";

import Login from "../pages/Authentication/Login";
import Screen from "../pages/screen";
import UI from "../pages/UI";
import Manufacture from "../pages/OI/Manufacture";
import Quality from "../pages/OI/Quality";
import Equipment from "../pages/OI/Equipment";
import Warehouse from "../pages/OI/Warehouse";

import UIManufacture from "../pages/UI/Manufacture";
import UIManufactureKHSX from "../pages/UI/Manufacture/KeHoachSanXuat";
import UIManufactureSL from "../pages/UI/Manufacture/SanLuong";
import UIManufactureLSSX from "../pages/UI/Manufacture/LichSuSanXuat";
import UIQualityPQC from "../pages/UI/Quality/PQC";
import UIQualityOQC from "../pages/UI/Quality/OQC";
import UIEquipment1 from "../pages/UI/Equipment/Equipment1";
import UIEquipment2 from "../pages/UI/Equipment/Equipment2";
import UIKPI from "../pages/UI/KPI"
import WarehouseExportPlan from "../pages/UI/Warehouse/WarehouseExportPlan";
import ThanhPhamGiay from "../pages/UI/Warehouse/ThanhPhamGiay";
import DBTinhHinhSanXuat from "../pages/DB/TinhHinhSanXuat";
import DBHieuSuatThietBi from "../pages/DB/HieuSuatThietBi";
import DBCanhBaoBatThuong from "../pages/DB/CanhBaoBatThuong";
import DashBoard from '../pages/DB'
import Logout from "../pages/Authentication/Logout";
import Kichban from "../pages/UI/Abnormal/Kichban";
import Giamsat from "../pages/UI/Abnormal/Giamsat";
import InTem from "../pages/OI/InTem";
import Machine from "../pages/UI/MasterData/Machine";
import SpecProduct from "../pages/UI/MasterData/SpecProduct";
import Errors from "../pages/UI/MasterData/Errors";
import TestCriteria from "../pages/UI/MasterData/TestCriteria";
import Line from "../pages/UI/MasterData/Line";
import Users from "../pages/UI/MasterData/Users";
import Roles from "../pages/UI/MasterData/Roles";
import Permissions from "../pages/UI/MasterData/Permissions";
import ErrorMachines from "../pages/UI/MasterData/ErrorMachine";
import Materials from "../pages/UI/MasterData/Material";
import Warehouses from "../pages/UI/MasterData/Warehouse";
import Cells from "../pages/UI/MasterData/Cells";
import Khuon from "../pages/UI/MasterData/Khuon";
import Jig from "../pages/UI/MasterData/Jig";
import Maintenance from "../pages/UI/MasterData/Maintenance/";
import CreateMaintenance from "../pages/UI/MasterData/Maintenance/form";
import EditMaintenance from "../pages/UI/MasterData/Maintenance/form";
import ChangePassword from "../pages/Authentication/ChangePassword";
import Orders from "../pages/UI/MasterData/Orders";

const authProtectedRoutes = [
  // Authentication Page
  {
    path: "/",
    component: () => <Redirect to="/screen" />,
  },
  { path: "/screen", component: Screen },

  // UI
  { path: ["/ui", "/ui/home"], component: UI },
  { path: ["/ui/manufacture/giay-bao-on"], component: UIManufacture },
  { path: ["/ui/manufacture/ke-hoach-san-xuat"], component: UIManufactureKHSX },
  { path: ["/ui/manufacture/lich-su-san-xuat"], component: UIManufactureLSSX },
  { path: ["/ui/manufacture/quan-ly-san-luong"], component: UIManufactureSL },
  { path: ["/ui/quality/PQC"], component: UIQualityPQC },
  { path: ["/ui/quality/OQC"], component: UIQualityOQC },
  { path: ["/ui/equipment/thong-ke-loi"], component: UIEquipment1 },
  { path: ["/ui/equipment/thong-so-may"], component: UIEquipment2 },
  { path: ["/ui", "/ui/warehouse/ke-hoach-xuat-kho"], component: WarehouseExportPlan },
  { path: ["/ui/warehouse/thanh-pham-giay"], component: ThanhPhamGiay },
  { path: ["/ui/kpi"], component: UIKPI },
  { path: ["/ui/abnormal/kich-ban-bat-thuong"], component: Kichban },
  { path: ["/ui/abnormal/lich-su-bat-thuong"], component: Giamsat },
  
  //OI
  { path: ["/tao-tem"], component: InTem },
  { path: ["/manufacture", "/manufacture/:machine_id"], component: Manufacture },
  { path: ["/quality", "/quality/:machine_id"], component: Quality },
  { path: ["/equipment", "/equipment/:line"], component: Equipment },
  { path: ["/warehouse", "/warehouse/:line"], component: Warehouse },

  //Master Data
  { path: ["/ui/master-data/may"], component: Machine },
  { path: ["/ui/master-data/spec-product"], component: SpecProduct },
  { path: ["/ui/master-data/errors"], component: Errors },
  { path: ["/ui/master-data/test_criteria"], component: TestCriteria },
  { path: ["/ui/master-data/cong-doan"], component: Line },
  { path: ["/ui/master-data/users"], component: Users },
  { path: ["/ui/master-data/roles"], component: Roles },
  { path: ["/ui/master-data/permissions"], component: Permissions },
  { path: ["/ui/master-data/error-machines"], component: ErrorMachines },
  { path: ["/ui/master-data/material"], component: Materials },
  { path: ["/ui/master-data/warehouse"], component: Warehouses },
  { path: ["/ui/master-data/cell"], component: Cells },
  { path: ["/ui/master-data/khuon"], component: Khuon },
  { path: ["/ui/master-data/jig"], component: Jig },
  { path: ["/ui/master-data/maintenance"], component: Maintenance },
  { path: ["/ui/master-data/maintenance/create"], component: CreateMaintenance },
  { path: ["/ui/master-data/maintenance/edit/:maintenanceId"], component: EditMaintenance },
  { path: ["/ui/master-data/orders"], component: Orders },
];

const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/change-password", component: ChangePassword },
  // dashboard
  { path: ["/dashboard-slide", "/dashboard-slide/:screen"], component: DashBoard },
  { path: ["/dashboard/tinh-hinh-san-xuat"], component: DBTinhHinhSanXuat },
  { path: ["/dashboard/hieu-suat-thiet-bi"], component: DBHieuSuatThietBi },
  { path: ["/dashboard/canh-bao-bat-thuong"], component: DBCanhBaoBatThuong },
];

export { authProtectedRoutes, publicRoutes };