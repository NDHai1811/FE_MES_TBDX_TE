import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

const Navdata = () => {
    const history = useHistory();
    const { userInfo} = useSelector((state) => ({
        userInfo: state.User.userInfo
    }));
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isSchedule, setIsSchedule] = useState(false);
    const [isTodoList, setIsTodoList] = useState(false);
    const [isKaizen, setIsKaizen] = useState(false);
    const [isTimeSet, setIsTimeSet] = useState(false);
    const [isSystem, setIsSystem] = useState(false);
    const [isMachine, setIsMachine] = useState(false);
    const [isMaintenancePlan, setIsMaintenancePlan] = useState(false);
    const [isTrouble, setIsTrouble] = useState(false);
    const [isInspection, setIsInspection] = useState(false);
    const [isSparePart, setIsSparePart] = useState(false);
    const [isLibrary, setIsLibrary] = useState(false);


    const [isShowSystem, setIsShowSystem] = useState(false);
    const [isShowTPM, setIsShowTPM] = useState(false);
    const [isShowTimekeeping, setIsShowTimekeeping] = useState(false);

    const [isTPM, setIsTPM] = useState(false);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }
    useEffect(()=>{
        if(userInfo?.permission?.includes('system-dashboard')){
            setIsShowSystem(true);
        }
        if(userInfo?.permission?.includes('tpm-index')){
            setIsShowTPM(true);
        }
        if(userInfo?.permission?.includes('timekeeping-index')){
            setIsShowTimekeeping(true);
        }
    },[userInfo])

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Schedule') {
            setIsSchedule(false);
        }
        if (iscurrentState !== 'TodoList') {
            setIsTodoList(false);
        }
        if (iscurrentState !== 'Kaizen') {
            setIsKaizen(false);
        }
        if (iscurrentState !== 'TimeSet') {
            setIsTimeSet(false);
        }
        if (iscurrentState !== 'TPM') {
            setIsTPM(false);
        }
        if (iscurrentState !== 'System') {
            setIsSystem(false);
        }
        if (iscurrentState !== 'Library') {
            setIsLibrary(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isSystem,
        isSchedule,
        isTodoList,
        isKaizen,
        isTimeSet,
        isLibrary
    ]);

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "bx bxs-dashboard",
            image: "/Portal.png",
            link: "/#",
            is_show:true,
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
        },
        {
            id: "library",
            label: "Thư viện",
            icon: "bx bx-file",
            image: "/books.png",
            link: "/library",
            is_show:true,
            click: function (e) {
                e.preventDefault();
                setIsLibrary(!isLibrary);
                setIscurrentState('Library');
                updateIconSidebar(e);
            },
            stateVariables: isLibrary,
        },
        {
            id: "schedule",
            label: "Quản lý lịch trình",
            icon: "bx bx-calendar",
            image: "/Scheduler.png",
            link: "/schedule",
            is_show:true,
            click: function (e) {
                e.preventDefault();
                setIsSchedule(!isSchedule);
                setIscurrentState('Schedule');
                updateIconSidebar(e);
            },
            stateVariables: isSchedule,
        },
        {
            id: "todolist",
            label: "Quản lý công việc",
            icon: "bx bx-check-square",
            image: "/To_do_list.png",
            link: "/task/home",
            is_show:true,
            click: function (e) {
                e.preventDefault();
                setIsTodoList(!isTodoList);
                setIscurrentState('TodoList');
                updateIconSidebar(e);
            },
            stateVariables: isTodoList,
        },
        // {
        //     id: "kaizen",
        //     label: "Kaizen",
        //     icon: "bx bx-file",
        //     image: "/kaizen.png",
        //     // link: "/apps-mailbox",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsKaizen(!isKaizen);
        //         setIscurrentState('Kaizen');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isKaizen,
        // },
        {
            id: "tpm",
            label: "TPM",
            icon: "ri-rocket-line",
            image: "/TPM.png",
            link: "/#",
            stateVariables: isTPM,
            is_show:isShowTPM,
            click: function (e) {
                e.preventDefault();
                setIsTPM(!isTPM);
                setIscurrentState('TPM');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "machine",
                    label: "Quản lý thiết bị",
                    link: "/#",
                    isChildItem: true,
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    parentId: "tpm",
                    stateVariables: isMachine,
                    childItems: [
                        { id: 1, label: "Nhóm model", link: "/machine_category" },
                        { id: 2, label: "Model", link: "/machine_type" },
                        { id: 3, label: "Đơn vị cung cấp", link: "/supplier" },
                        { id: 4, label: "Thiết bị", link: "/machine" },
                    ]
                },
                {
                    id: "maintenanceplan",
                    label: "Bảo trì bảo dưỡng",
                    link: "/maintenance",
                    isChildItem: false,
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMaintenancePlan(!isMaintenancePlan);
                    },
                    parentId: "tpm",
                    stateVariables: isMaintenancePlan,
                },
                {
                    id: "trouble",
                    label: "Sự cố",
                    link: "/trouble",
                    isChildItem: false,
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsTrouble(!isTrouble);
                    },
                    parentId: "tpm",
                    stateVariables: isTrouble,
                },
            ],
        },
        {
            id: "timeset",
            label: "TimeSet",
            icon: "bx bx-palette",
            image: "/stopwatch.png",
            link: "/#",
            is_show:isShowTimekeeping,
            click: function (e) {
                e.preventDefault();
                setIsTimeSet(!isTimeSet);
                setIscurrentState('TimeSet');
                updateIconSidebar(e);
            },
            stateVariables: isTimeSet,
            subItems: [
                {
                    id: "dashboardtimekeeping",
                    label: "Dashboard",
                    link: "/dashboard-timekeeping",
                    isChildItem: false,
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsTimeSet(!isTimeSet);
                        setIscurrentState('TimeSet');
                        updateIconSidebar(e);
                    },
                    parentId: "timeset",
                    stateVariables: isMachine,
                },
                {
                    id: "timekeeping",
                    label: "Chấm công",
                    link: "/timekeeping",
                    isChildItem: false,
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsTimeSet(!isTimeSet);
                        setIscurrentState('TimeSet');
                        updateIconSidebar(e);
                    },
                    parentId: "timeset",
                    stateVariables: isMachine,
                },
                {
                    id: "require",
                    label: "Yêu cầu",
                    link: "/require",
                    isChildItem: false,
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsTimeSet(!isTimeSet);
                        setIscurrentState('TimeSet');
                        updateIconSidebar(e);
                    },
                    parentId: "timeset",
                    stateVariables: isMaintenancePlan,
                },
                {
                    id: "location",
                    label: " Cấu hình vị trí GPS",
                    link: "/location",
                    isChildItem: false,
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsTimeSet(!isTimeSet);
                        setIscurrentState('TimeSet');
                        updateIconSidebar(e);
                    },
                    parentId: "timeset",
                    stateVariables: isMaintenancePlan,
                },
            ],
        },
        {
            id: "system",
            label: "System",
            icon: "ri-rocket-line",
            image: "/gear.png",
            link: "/#",
            is_show:isShowSystem,
            click: function (e) {
                e.preventDefault();
                setIsSystem(!isSystem);
                setIscurrentState('System');
                updateIconSidebar(e);
            },
            stateVariables: isSystem,
            subItems: [
                {
                    id: "systemconfig",
                    label: "Cấu hình hệ thống",
                    link: "/configs",
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    stateVariables: isMachine,
                },
                {
                    id: "company_managerment",
                    label: "Quản lý công ty",
                    link: "/company",
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    stateVariables: isMachine,
                },
                {
                    id: "department_managerment",
                    label: "Quản lý phòng ban",
                    link: "/department",
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    stateVariables: isMachine,
                },
                {
                    id: "position_managerment",
                    label: "Quản lý chức vụ",
                    link: "/position",
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    stateVariables: isMachine,
                },
                {
                    id: "user_managerment",
                    label: "Quản lý tài khoản",
                    link: "/user",
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    stateVariables: isMachine,
                },
                {
                    id: "role_managerment",
                    label: "Quản lý quyền hạn",
                    link: "/role",
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    stateVariables: isMachine,
                },
                // {
                //     id: "level_managerment",
                //     label: "Quản lý cấp độ đề án",
                //     link: "/level",
                //     click: function (e) {
                //         e.preventDefault();
                //         setIsMachine(!isMachine);
                //     },
                //     stateVariables: isMachine,
                // },
                {
                    id: "equipment_managerment",
                    label: "Quản lý trang thiết bị",
                    link: "/equipment",
                    is_show:true,
                    click: function (e) {
                        e.preventDefault();
                        setIsMachine(!isMachine);
                    },
                    stateVariables: isMachine,
                },
            ],
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;