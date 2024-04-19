import React from "react";
import { Redirect } from "react-router-dom";

import Login from "../pages/Authentication/Login";
import Screen from "../pages/screen";
import Manufacture from "../pages/OI/Manufacture";
import Equipment from "../pages/OI/Equipment";
import Warehouse from "../pages/OI/Warehouse";
import WarehouseTP from "../pages/OI/Warehouse/finished-product";

import UITaoKeHoachSanXuat from "../pages/UI/Manufacture/TaoKeHoachSanXuat";
import UIManufactureKHSX from "../pages/UI/Manufacture/KeHoachSanXuat";
import UIManufactureLSSX from "../pages/UI/Manufacture/LichSuSanXuat";
import UIQualityPQC from "../pages/UI/Quality/PQC";
import UIEquipment1 from "../pages/UI/Equipment/Equipment1";
import UIEquipment2 from "../pages/UI/Equipment/Equipment2";
import UIKPI from "../pages/UI/KPI";
import WarehouseExportPlan from "../pages/UI/Warehouse/WarehouseExportPlan";
import ThanhPhamGiay from "../pages/UI/Warehouse/ThanhPhamGiay";
import KhoNVL from "../pages/UI/Warehouse/KhoNvl";
import DBHieuSuatThietBi from "../pages/DB/HieuSuatThietBi";
import DBCanhBaoBatThuong from "../pages/DB/CanhBaoBatThuong";
import DBGiaoDienDaChieu from "../pages/DB/GiaoDienDaChieu";
import DashBoard from "../pages/DB";
import Logout from "../pages/Authentication/Logout";
import Kichban from "../pages/UI/Abnormal/Kichban";
import Giamsat from "../pages/UI/Abnormal/Giamsat";
import InTem from "../pages/OI/InTem";
import Machine from "../pages/UI/MasterData/Machine";
import Errors from "../pages/UI/MasterData/Errors";
import TestCriteria from "../pages/UI/MasterData/TestCriteria";
import Line from "../pages/UI/MasterData/Line";
import Users from "../pages/UI/MasterData/Users";
import Roles from "../pages/UI/MasterData/Roles";
import Permissions from "../pages/UI/MasterData/Permissions";
import ErrorMachines from "../pages/UI/MasterData/ErrorMachine";
import Materials from "../pages/UI/MasterData/Material";
import Cells from "../pages/UI/MasterData/Cells";
import Khuon from "../pages/UI/MasterData/Khuon";
import Maintenance from "../pages/UI/MasterData/Maintenance/";
import CreateMaintenance from "../pages/UI/MasterData/Maintenance/form";
import EditMaintenance from "../pages/UI/MasterData/Maintenance/form";
import ChangePassword from "../pages/Authentication/ChangePassword";
import QCByMachine from "../pages/OI/Quality/QCByMachine";
import Orders from "../pages/UI/MasterData/Orders";
import Layout from "../pages/UI/Manufacture/Layout";
import Buyer from "../pages/UI/Manufacture/Buyer";
import Customer from "../pages/UI/MasterData/Customer";
import WarehouseMLT from "../pages/UI/Warehouse/WarehouseMLT";
import TaoTem from "../pages/UI/Manufacture/TaoTem";
import Vehicle from "../pages/UI/MasterData/Vehicle";
import TaoTon from "../pages/UI/Warehouse/TaoTon";
import TinhHinhSanXuat from "../pages/DB/TinhHinhSanXuat";
import EmptyPage from "../pages/EmptyPage";
import QCByMachineIOT from "../pages/OI/Quality/QCByMachineIOT";
import IQC from "../pages/OI/Quality/IQC";
import WarehouseExportCommand from "../pages/UI/Warehouse/WarehouseExportCommand";
import MachineAssignment from "../pages/UI/MasterData/MachineAssignment";

const authProtectedRoutes = [
  // Authentication Page
  { path: "/", component: () => <Redirect to="/screen" />, },
  { path: "/screen", component: Screen },

  // UI
  { path: "/ui/manufacture/ke-hoach-san-xuat", component: UIManufactureKHSX, label: "Kế hoạch sản xuất", permission: 'ui-manufacture-ke-hoach-san-xuat' },
  { path: "/ui/manufacture/tao-ke-hoach-san-xuat", component: UITaoKeHoachSanXuat, permission: 'ui-manufacture-tao-ke-hoach-san-xuat' },
  { path: "/ui/manufacture/tao-tem", component: TaoTem, label: "Tạo tem", permission: 'ui-manufacture-tao-tem' },
  { path: "/ui/manufacture/lich-su-san-xuat", component: UIManufactureLSSX, label: "Lịch sử sản xuất", permission: 'ui-manufacture-lich-su-san-xuat' },
  { path: "/ui/manufacture/layout", component: Layout, label: "Layout", permission: 'ui-manufacture-layout' },
  { path: "/ui/manufacture/don-hang", component: Orders, label: "Đơn hàng", permission: 'ui-manufacture-don-hang' },
  { path: "/ui/manufacture/buyer", component: Buyer, label: "Buyer", permission: 'ui-manufacture-buyer' },
  { path: "/ui/quality/pqc", component: UIQualityPQC, label: 'Chất lượng', permission: 'ui-quality-pqc' },
  // { path: "/ui/quality/oqc", component: UIQualityOQC },
  { path: "/ui/equipment/thong-ke-loi", component: UIEquipment1, label: 'Thống kê lỗi', permission: 'ui-equipment-thong-ke-loi' },
  { path: "/ui/equipment/thong-so-may", component: UIEquipment2, label: 'Thông số máy', permission: 'ui-equipment-thong-so-may' },
  { path: "/ui/warehouse/quan-ly-kho-tp", component: ThanhPhamGiay, label: 'Quản lý kho thành phẩm', permission: 'ui-warehouse-quan-ly-kho-tp' },
  { path: "/ui/warehouse/ke-hoach-xuat-kho", component: WarehouseExportPlan, label: 'Kế hoạch xuất kho', permission: 'ui-warehouse-ke-hoach-xuat-kho' },
  { path: "/ui/warehouse/quan-ly-lenh-xuat-kho", component: WarehouseExportCommand, label: 'Quản lý lệnh xuất kho', permission: 'ui-warehouse-quan-ly-lenh-xuat-kho' },
  { path: "/ui/warehouse/quan-ly-giay-cuon", component: WarehouseMLT, label: 'Quản lý giấy cuộn', permission: 'ui-warehouse-quan-ly-giay-cuon' },
  { path: "/ui/warehouse/quan-ly-kho-nvl", component: KhoNVL, label: 'Quản lý kho NVL', permission: 'ui-warehouse-quan-ly-kho-nvl' },
  { path: "/ui/warehouse/tao-ton", component: TaoTon, permission: 'ui-warehouse-tao-ton' },
  { path: "/ui/kpi", component: UIKPI, label: 'KPI', permission: 'ui-kpi' },
  { path: "/ui/abnormal/kich-ban-bat-thuong", component: Kichban },
  { path: "/ui/abnormal/lich-su-bat-thuong", component: Giamsat },

  //Master Data
  { path: "/ui/master-data/san-xuat/may", component: Machine, label: 'Máy', permission: 'ui-master-data-san-xuat-may' },
  { path: "/ui/master-data/san-xuat/errors", component: Errors, label: 'Quản lý lỗi công đoạn', permission: 'ui-master-data-san-xuat-errors' },
  { path: "/ui/master-data/san-xuat/test-criteria", component: TestCriteria, label: 'Quản lý chỉ tiêu kiểm tra', permission: 'ui-master-data-san-xuat-test-criteria' },
  { path: "/ui/master-data/san-xuat/cong-doan", component: Line, label: 'Quản lý công đoạn', permission: 'ui-master-data-san-xuat-cong-doan' },
  { path: "/ui/master-data/san-xuat/error-machines", component: ErrorMachines, label: 'Quản lý lỗi máy', permission: 'ui-master-data-san-xuat-error-machines' },
  { path: "/ui/master-data/san-xuat/material", component: Materials, label: 'Quản lý NVL', permission: 'ui-master-data-san-xuat-material' },
  { path: "/ui/master-data/san-xuat/customer", component: Customer, label: "Quản lý khách hàng" },
  { path: "/ui/master-data/to-chuc/users", component: Users, label: 'Quản lý người dùng', permission: 'ui-master-data-to-chuc-users' },
  { path: "/ui/master-data/to-chuc/assign-machine", component: MachineAssignment, label: 'Phân bổ máy cho tài khoản', permission: 'ui-master-data-machine-assignment' },
  { path: "/ui/master-data/to-chuc/roles", component: Roles, label: 'Quản lý bộ phận', permission: 'ui-master-data-to-chuc-roles' },
  { path: "/ui/master-data/to-chuc/permissions", component: Permissions, label: 'Quản lý phân quyền', permission: 'ui-master-data-to-chuc-permissions' },
  // { path: "/ui/master-data/kho/warehouse", component: Warehouses, label: 'Quản lý kho', permission: 'ui-master-data-kho-warehouse' },
  { path: "/ui/master-data/kho/cell", component: Cells, permission: 'ui-master-data-kho-cell' },
  { path: "/ui/master-data/kho/vehicle", component: Vehicle, label: 'Quản lý phương tiện', permission: 'ui-master-data-kho-vehicle' },
  { path: "/ui/master-data/kho/khuon", component: Khuon, label: 'Quản lý khuôn', permission: 'ui-master-data-kho-khuon' },
  { path: "/ui/master-data/bao-tri/maintenance", component: Maintenance, label: 'Bảo trì', permission: 'ui-master-data-bao-tri-maintenance' },
  { path: "/ui/master-data/bao-tri/maintenance/create", component: CreateMaintenance, permission: 'ui-master-data-bao-tri-maintenance' },
  { path: "/ui/master-data/bao-tri/maintenance/edit/:maintenanceId", component: EditMaintenance, permission: 'ui-master-data-bao-tri-maintenance' },

  //OI
  { path: ["/tao-tem"], component: InTem },
  { path: ["/oi/manufacture", "/oi/manufacture/:machine_id"], component: Manufacture, permission: 'oi-manufacture' },
  // { path: ["/oi/quality/:type"], component: Quality, permission: 'oi-quality' },
  { path: ["/oi/quality/machine-iot", "/oi/quality/machine-iot/:machine_id"], component: QCByMachineIOT, permission: 'oi-quality-machine-iot' },
  { path: ["/oi/quality/machine", "/oi/quality/machine/:machine_id"], component: QCByMachine, permission: 'oi-quality-machine' },
  { path: ["/oi/quality/iqc", "/oi/quality/iqc"], component: IQC, permission: 'oi-quality-iqc' },
  { path: ["/oi/equipment", "/oi/equipment/:machine_id"], component: Equipment, permission: 'oi-equipment' },
  { path: ["/oi/warehouse/kho-nvl", "/oi/warehouse/kho-nvl/:line"], component: Warehouse, permission: 'oi-warehouse-nvl' },
  { path: ["/oi/warehouse/kho-tp", "/oi/warehouse/kho-tp/:line"], component: WarehouseTP, permission: 'oi-warehouse-tp' },
  { path: '*', component: EmptyPage }
];

const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/change-password", component: ChangePassword },
  // dashboard
  {
    path: ["/dashboard-slide", "/dashboard-slide/:screen"],
    component: DashBoard,
  },
  { path: ["/dashboard/tinh-hinh-san-xuat"], component: TinhHinhSanXuat },
  { path: ["/dashboard/hieu-suat-thiet-bi"], component: DBHieuSuatThietBi },
  { path: ["/dashboard/canh-bao-bat-thuong"], component: DBCanhBaoBatThuong },
  { path: ["/dashboard/giao-dien-da-chieu"], component: DBGiaoDienDaChieu },
];

export { authProtectedRoutes, publicRoutes };
