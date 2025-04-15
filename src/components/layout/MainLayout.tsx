// import { Outlet } from "react-router-dom";
// import { Box, Toolbar } from "@mui/material";
// import sizeConfigs from "../../configs/sizeConfigs";
// import Sidebar from "../common/Sidebar";
// import { useLocation } from "react-router-dom";
// import FolderIcon from "@mui/icons-material/Folder";
// import { useNavigate } from "react-router-dom";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import backgroundimage from "../../assets/images/backgroundimage.jpg";
// import { useEffect, useState } from "react";
// const colorConfigs = {
//   sidebar: {
//     bg: "#233044",
//     color: "#eeeeee",
//     hoverBg: "#1e293a",
//     activeBg: "#1e253a",
//   },
//   topbar: {
//     bg: "#fff",
//     color: "#000",
//   },
//   mainBg: `url(${backgroundimage})`,
// };

// const MainLayout = () => {
//   const location = useLocation();
//   var menuarray = [];
//   let navigate = useNavigate();
//   const [appFlow, setAppFlow] = useState(localStorage.getItem("ApplicationFlow"));
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     if (appFlow === "outsource") {
//       setIsVisible(true);
//     } else {
//       setIsVisible(false);
//     }
//   }, [appFlow])


//   if (localStorage.getItem("userdata") == null) {
//     navigate("/");
//   } else {
//     const items2 = JSON.parse(localStorage.getItem("userdata")!);
//     if (items2.length > 0) {
//       const items1 = [
//         {
//           menuName: "Master",
//           path: "",
//           menuId: 1,
//           displayNo: 1,
//           childMenu: [

//             {
//               menuId: 1,
//               menuName: "Country Master",
//               path: "/master/CountryMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 2,
//               menuName: "State Master",
//               path: "/master/StateMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 3,
//               menuName: "District Master",
//               path: "/master/CityMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 4,
//               menuName: "Zone Master",
//               path: "/master/ZoneMaster",
//               displayNo: 0,
//             },

//             {
//               menuId: 5,
//               menuName: "Unit Master",
//               path: "/master/Unitmaster",
//             },

//             {
//               menuId: 6,
//               menuName: "Tax Master",
//               path: "/master/Taxmaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 7,
//               menuName: "ItemCategory",
//               path: "/master/ItemCategory",
//               displayNo: 0,
//             },

//             {
//               menuId: 8,
//               menuName: "Item Type",
//               path: "/master/ItemType",
//               displayNo: 0,
//             },

//             {
//               menuId: 9,
//               menuName: "Folder Location",
//               path: "/master/FolderLocation",
//               displayNo: 0,
//             },


//             {
//               menuId: 10,
//               menuName: "Financial Year",
//               path: "/master/FinancialYear",
//               displayNo: 0,
//             },


//             {
//               menuId: 11,
//               menuName: "Stock Bin",
//               path: "/master/StockBin",
//               displayNo: 0,
//             },









//           ],
//         },
//         {
//           menuName: "Store Management",
//           path: "",
//           menuId: 2,
//           displayNo: 1,
//           childMenu: [

//             {
//               menuId: 15,
//               menuName: "JobCard Indent",
//               path: "/Inventory/JobCardIndent",
//               displayNo: 0,
//             },
//             {
//               menuId: 15,
//               menuName: "Wrk.Pur. Indent",
//               path: "/Inventory/WorkShopPurchaseIndent",
//               displayNo: 0,
//             },
//             {
//               menuId: 12,
//               menuName: "Indent For Staff",
//               path: "/Inventory/StaffIndent",
//               displayNo: 0,
//             },

//             {
//               menuId: 18,
//               menuName: "Store Master",
//               path: "/Inventory/StoreMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 18,
//               menuName: "Item Detail",
//               path: "/Inventory/ItemDetail",
//               displayNo: 0,
//             },
//             // {
//             //   menuId: 18,
//             //   menuName: "Office Pur. Indent",
//             //   path: "/Inventory/OfficePurchaseIndent",
//             //   displayNo: 0,
//             // },
//             // {
//             //   menuId: 18,
//             //   menuName: "Office Pur. Order",
//             //   path: "/Inventory/OfficePurchaseOrder",
//             //   displayNo: 0,
//             // },
//             {
//               menuId: 18,
//               menuName: "Work. Pur. Order",
//               path: "/Inventory/WorkShopPurchaseOrder",
//               displayNo: 0,
//             },
//             // {
//             //   menuId: 18,
//             //   menuName: "Purchase Invoice",
//             //   path: "/Inventory/PurchaseInvoice",
//             //   displayNo: 0,
//             // },
//             {
//               menuId: 13,
//               menuName: "Staff Item Issue",
//               path: "/Inventory/StaffItemIssue",
//               displayNo: 0,
//             },

//             {
//               menuId: 13,
//               menuName: "Jobcard Item Issue",
//               path: "/Inventory/JobcardItemIssue",
//               displayNo: 0,
//             },
//             {
//               menuId: 13,
//               menuName: "Stock Opening",
//               path: "/Inventory/StockGeneral",
//               displayNo: 0,
//             },



//             {
//               menuId: 3,
//               menuName: "Material Recpt. Note",
//               path: "/Inventory/MRNForm",
//               displayNo: 0,
//             },


//             {
//               menuId: 5,
//               menuName: "Quality Check",
//               path: "/Inventory/QualityCheck",
//               displayNo: 0,
//             },



//             {
//               menuId: 14,
//               menuName: "Staff Item Return",
//               path: "/Inventory/StaffItemReturn",
//               displayNo: 0,
//             },
//             {
//               menuId: 14,
//               menuName: "JobCard Item Return",
//               path: "/Inventory/JobCardItemReturn",
//               displayNo: 0,
//             },


//           ],
//         },

//         {
//           menuName: "Communication",
//           path: "/emailsystem",
//           menuId: 3,
//           displayNo: 1,
//           childMenu: [
//             {
//               menuId: 1,
//               menuName: "Group",
//               path: "/emailsystem/Groupmaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 2,
//               menuName: "Email Setting",
//               path: "/emailsystem/emailsetting",
//               displayNo: 0,
//             },
//             {
//               menuId: 3,
//               menuName: "Email Campaign",
//               path: "/emailsystem/campagianmaster",
//               displayNo: 0,
//             },

//             {
//               menuId: 4,
//               menuName: "Email Event Setting",
//               path: "/emailsystem/eventmaster",
//               displayNo: 0,
//             },

//             {
//               menuId: 5,
//               menuName: "Campaign Template",
//               path: "/emailsystem/campaignTemplate",
//               displayNo: 0,
//             },
//             {
//               menuId: 6,
//               menuName: "Sms Event Settings",
//               path: "/emailsystem/SmsEventSettings",
//               displayNo: 0,
//             },
//             {
//               menuId: 7,
//               menuName: "Sms Setting",
//               path: "/emailsystem/Smssetting",
//               displayNo: 0,
//             },
//             {
//               menuId: 7,
//               menuName: "Sms Campaign",
//               path: "/emailsystem/Smscampagian",
//               displayNo: 0,
//             },
//           ],
//         },


//         {
//           menuName: "Employee Info",
//           path: "employeeInfo",
//           menuId: 4,
//           displayNo: 1,
//           childMenu: [
//             {
//               menuId: 1,
//               menuName: "Employee",
//               path: "/employeeInfo/Employee",
//               displayNo: 0,
//             },
//             {
//               menuId: 2,
//               menuName: "Department",
//               path: "/employeeInfo/Department",
//               displayNo: 0,
//             },
//             {
//               menuId: 3,
//               menuName: "Designation",
//               path: "/employeeInfo/Designation",
//               displayNo: 0,
//             },
//             {
//               menuId: 4,
//               menuName: "Organization",
//               path: "/employeeInfo/Organization",
//               displayNo: 0,
//             },
//             {
//               menuId: 5,
//               menuName: "Upload Documents",
//               path: "/employeeInfo/UploadDocuments",
//               displayNo: 0,
//             },
//           ],
//         },


//         // {
//         //   menuName: "Employee",
//         //   path: "",
//         //   menuId: 4,
//         //   displayNo: 1,
//         //   childMenu: [
//         //     {
//         //       menuId: 1,
//         //       menuName: "Employee Master",
//         //       path: "/Employee/EmployeeMaster",
//         //       displayNo: 0,
//         //     },
//         //   ],
//         // },

//         // {
//         //   menuName: "Vehicle Master",
//         //   path: "/vehiclemaster",
//         //   menuId: 5,
//         //   displayNo: 1,
//         //   childMenu: [
//         //     {
//         //       menuId: 1,
//         //       menuName: "Licensing/Insurance",
//         //       path: "/vehiclemaster/LicensingInsuranceMaster",
//         //       displayNo: 0,
//         //     },
//         //     {
//         //       menuId: 2,
//         //       menuName: "Maintainance/Warranty",
//         //       path: "/vehiclemaster/MaintainanceWarrantyMaster",
//         //       displayNo: 0,
//         //     },
//         //     {
//         //       menuId: 3,
//         //       menuName: "UtilizationLog",
//         //       path: "/vehiclemaster/UtilizationLog",
//         //       displayNo: 0,
//         //     },
//         //     {
//         //       menuId: 4,
//         //       menuName: "Vehicle Type Master",
//         //       path: "/vehiclemaster/VehicleTypeMaster",
//         //       displayNo: 0,
//         //     },
//         //   ]
//         // },

//         {
//           menuName: "Vehicle Complaints",
//           path: "/vehiclecomplaint",
//           menuId: 5,
//           displayNo: 1,
//           childMenu: [
//             {
//               menuId: 1,
//               menuName: "Complaint",
//               path: "/vehiclecomplaint/Complaint",
//               displayNo: 0,
//             },
//             (isVisible ?
//               {
//                 menuId: 2,
//                 menuName: "Job Card",
//                 path: "/vehiclecomplaint/JobCard",
//                 displayNo: 0,
//               }
//               : {
//                 menuId: 2,
//                 menuName: "Job Card",
//                 path: "/vehiclecomplaint/JobCard1",
//                 displayNo: 0,
//               }
//             ),


//             {
//               menuId: 3,
//               menuName: "Job Work Challan",
//               path: "/vehiclecomplaint/JobWorkChallan",
//               displayNo: 0,
//             },
//             {
//               menuId: 4,
//               menuName: "JobWorkChallanRcv  ",
//               path: "/vehiclecomplaint/JobWorkChallanRecieve",
//               displayNo: 0,
//             },
//           ]
//         },

//         {
//           menuName: "Vendor Info",
//           path: "/vendorinfo",
//           menuId: 6,
//           displayNo: 1,
//           childMenu: [
//             {
//               menuId: 1,
//               menuName: "Vendor",
//               path: "/vendorinfo/Vendor",
//               displayNo: 0,
//             },
//             {
//               menuId: 2,
//               menuName: "Services",
//               path: "/vendorinfo/Services",
//               displayNo: 0,
//             },
//             {
//               menuId: 3,
//               menuName: "Service Contract",
//               path: "/vendorinfo/ServiceContract",
//               displayNo: 0,
//             },
//             {
//               menuId: 4,
//               menuName: "Item Contract",
//               path: "/vendorinfo/ItemContract",
//               displayNo: 0,
//             },
//           ]
//         },


//         {
//           menuName: "Vehicle Master",
//           path: "/vehiclemaster",
//           menuId: 7,
//           displayNo: 1,
//           childMenu: [
//             {
//               menuId: 1,
//               menuName: "Licensing/Insurance",
//               path: "/vehiclemaster/LicensingInsuranceMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 2,
//               menuName: "Maintainance/Warranty",
//               path: "/vehiclemaster/MaintainanceWarrantyMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 3,
//               menuName: "UtilizationLog",
//               path: "/vehiclemaster/UtilizationLog",
//               displayNo: 0,
//             },
//             {
//               menuId: 4,
//               menuName: "Vehicle Type Master",
//               path: "/vehiclemaster/VehicleTypeMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 5,
//               menuName: "Vehicle Detail",
//               path: "/vehiclemaster/VehicleDetail",
//               displayNo: 0,
//             },
//             {
//               menuId: 6,
//               menuName: "Brand Master",
//               path: "/vehiclemaster/BrandMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 7,
//               menuName: "Fuel Type Master",
//               path: "/vehiclemaster/FuelTypeMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 8,
//               menuName: "Location",
//               path: "/vehiclemaster/Location",
//               displayNo: 0,
//             },
//             {
//               menuId: 9,
//               menuName: "Vehicle Type Info",
//               path: "/vehiclemaster/VehicleTypeInfo",
//               displayNo: 0,
//             },
//           ]
//         },


//         // {
//         //   menuName: "Installation",
//         //   path: "",
//         //   menuId: 8,
//         //   displayNo: 1,
//         //   childMenu: [
//         //     {
//         //       menuId: 1,
//         //       menuName: "Pole Installation",
//         //       path: "/installation/PoleInstallation",
//         //       displayNo: 0,
//         //     },

//         //     {
//         //       menuId: 2,
//         //       menuName: "Light Installation",
//         //       path: "/installation/LightInstallation",
//         //       displayNo: 0,
//         //     },
//         //     // {menuId: 3, menuName: 'User Type', path:"/UserManagement/UserType",displayNo:0},
//         //     // {menuId: 4, menuName: 'User Permission Master', path:"/UserManagement/UserPermissionMaster",displayNo:0},
//         //   ],
//         // },





//         {
//           menuName: "Reports",
//           path: "",
//           menuId: 9,
//           displayNo: 1,
//           childMenu: [

//             {
//               menuId: 1,
//               menuName: "Job Card Status",
//               path: "/Reports/JobCardStatus",
//               displayNo: 0,
//             },
//             {
//               menuId: 2,
//               menuName: "Vehicle Item Con.",
//               path: "/Reports/WorkshopService",
//               displayNo: 0,
//             },
//             {
//               menuId: 3,
//               menuName: "Item Consumed",
//               path: "/Reports/ItemConsumedReport",
//               displayNo: 0,
//             },

//             {
//               menuId: 4,
//               menuName: "Out Source Service",
//               path: "/Reports/OutSourceService",
//               displayNo: 0,
//             },
//             {
//               menuId: 5,
//               menuName: "Vendor Item Detail",
//               path: "/Reports/VendorItemDetail",
//               displayNo: 0,
//             },
//             {
//               menuId: 6,
//               menuName: "Vehicle Age ",
//               path: "/Reports/VehicleAgeReport",
//               displayNo: 0,
//             },
//             {
//               menuId: 7,
//               menuName: "Complain Status",
//               path: "/Reports/ComplainStatus",
//               displayNo: 0,
//             },
//             {
//               menuId: 8,
//               menuName: "Vehicle Item Service",
//               path: "/Reports/VehicleItemService",
//               displayNo: 0,
//             },
//             {
//               menuId: 9,
//               menuName: "Stock Ledger ",
//               path: "/Reports/StockLedgerReport",
//               displayNo: 0,
//             },

//             {
//               menuId: 10,
//               menuName: "Stock Summary ",
//               path: "/Reports/StockSummaryReport",
//               displayNo: 0,
//             },




//             // {
//             //   menuId: 4,
//             //   menuName: "Vendor Evaluation Report",
//             //   path: "/Reports/VendorEvaluationReport",
//             //   displayNo: 0,
//             // },


//             {
//               menuId: 11,
//               menuName: "Vehicle Status ",
//               path: "/Reports/VehicleStatusReport",
//               displayNo: 0,
//             },

//             // {
//             //   menuId: 12,
//             //   menuName: "Vehicle E-File Report",
//             //   path: "/Reports/VehicleEfileReport",
//             //   displayNo: 0,
//             // },
























//           ],
//         },



//         {
//           menuName: "User Management",
//           path: "",
//           menuId: 10,
//           displayNo: 1,
//           childMenu: [
//             {
//               menuId: 1,
//               menuName: "User Permission",
//               path: "/UserManagement/UserPermissionMaster",
//               displayNo: 0,
//             },



//           ],
//         },



//         {
//           menuName: "Security",
//           path: "",
//           menuId: 11,
//           displayNo: 1,
//           childMenu: [
//             {
//               menuId: 1,
//               menuName: "Role",
//               path: "/security/RoleMaster",
//               displayNo: 0,
//             },
//             {
//               menuId: 2,
//               menuName: "Jurisdiction with Location",
//               path: "/security/Jurisdiction",
//               displayNo: 0,
//             },
//           ],
//         },

        // {
        //   menuName: "Admin",
        //   path: "",
        //   menuId: 10,
        //   displayNo: 1,
        //   childMenu: [
        //     {
        //       menuId: 1,
        //       menuName: "Complaint Approval",
        //       path: "/Admin/ComplaintApproval",
        //       displayNo: 0,
        //     },

        //     {
        //       menuId: 2,
        //       menuName: "Flow Master",
        //       path: "/Admin/Flowmaster",
        //       displayNo: 0,
        //     },
        //     {
        //       menuId: 3,
        //       menuName: "Menu Create",
        //       path: "/Admin/MenuCreate",
        //       displayNo: 0,
        //     },
        //     {
        //       menuId: 4,
        //       menuName: "HelpCreation",
        //       path: "/Admin/HelpCreation",
        //       displayNo: 0,
        //     },


        //   ],
        // },


//       ];

//       //const items1 = items2[0]["userPermission"][0]["parentMenu"];
//       //{id: 1, name: 'Master', label: 'Master', displayNo: 1, path: '', …}

//       for (let index = 0; index < items1.length; index++) {
//         const element = items1[index];

//         var childmenuarray = [];
//         var childMenu = items1[index]["childMenu"];

//         for (let index2 = 0; index2 < childMenu.length; index2++) {
//           childmenuarray.push({
//             id: childMenu[index2]["menuId"],
//             name: childMenu[index2]["menuName"],
//             label: childMenu[index2]["menuName"],
//             path: childMenu[index2]["path"],
//             displayNo: childMenu[index2]["displayNo"],
//             Icon: TouchAppIcon,
//             onClick,
//           });
//         }
//         menuarray.push({
//           id: items1[index]["menuId"],
//           name: items1[index]["menuName"],
//           label: items1[index]["menuName"],
//           displayNo: items1[index]["displayNo"],
//           path: "",
//           Icon: FolderIcon,
//           items: childmenuarray.sort(
//             (a: any, b: any) => a.displayNo - b.displayNo
//           ),
//         });
//       }
//     } else {
//       navigate("/");
//     }
//   }

//   const items = menuarray.sort((a, b) => a.displayNo - b.displayNo);

//   function onClick(e: any, item: any) {
//     console.log("Main " + item);

//     let path = item.path;
//     if (path == "" || path == null || path == "undefind") {
//       window.alert("Path Not Found ????");
//     } else {
//       navigate(path);
//     }
//   }
//   return (
//     <div>
//       {location.pathname == "/" ? (
//         <Outlet />
//       ) : (
//         <div>
//           <Box sx={{ display: "flex" }}>
//             <Sidebar items={items} />

//             <Box
//               // component="main"
//               sx={{
//                 flexGrow: 1,
//                 px: 5,
//                 py: 3,
//                 width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//                 // width:"100vh",
//                 minHeight: "100vh",
//                 backgroundColor: `var( --main-background)`,
//                 backgroundImage: `var(--background-image)`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 // backgroundImage: "url('../../assets/images/backgroundimage.jpg')"
//               }}
//             >
//               <Toolbar />
//               <Outlet />
//             </Box>
//           </Box>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainLayout;

// ===================
// digital library


// import { Outlet } from "react-router-dom";
// import { Box, IconButton, Toolbar, Typography } from "@mui/material";
// import sizeConfigs from "../../configs/sizeConfigs";
// import Sidebar from "../common/Sidebar";
// import { useLocation, useNavigate } from "react-router-dom";
// import FolderIcon from "@mui/icons-material/Folder";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import backgroundimage from "../../assets/images/backgroundimage.jpg";
// import { useEffect, useState } from "react";
// import "../common/ThemeStyle.css";
// import ChatIcon from "@mui/icons-material/Chat";
// import ChatBotIcon from "../../assets/images/chatBot1.png";
// import ChatBot from "../../pages/ChatBot/ChatBot";
// import Draggable from "react-draggable";

// const themes = [
//   "light-theme",
//   "dark-theme",
//   "ocean-theme",
//   "sunset-theme",
//   "forest-theme",
// ];

// const MainLayout = () => {
//   const location = useLocation();
//   let navigate = useNavigate();
//   const [menuItems, setMenuItems] = useState([]);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isChatBotOpen, setIsChatBotOpen] = useState(false);


//   // const selectedTheme:any = () => {
//   //   const storedTheme = localStorage.getItem("theme");
//   //   return storedTheme ? storedTheme : themes[0];
//   // };

//   // useEffect(() => {
//   //   document.body.className = selectedTheme;
//   //   localStorage.setItem("theme", selectedTheme);
//   // }, [selectedTheme]);

//   useEffect(() => {
//     const menuData = localStorage.getItem("userdata");

//     if (menuData === null) {
//       navigate("/");
//       return;
//     }

//     const parseMenuItems = (data: any) => {
//       return data
//         .map((item: any) => {
//           const children = item.children ? parseMenuItems(item.children) : [];

//           return {
//             menuId: item.menuId,
//             menuName: item.menuName,
//             label: item.label,
//             path: item.href ? item.href.replace(".aspx", "") : "",
//             displayNo: item.ordNo,

//             items: children,
//           };
//         })
//         .sort(
//           (a: { displayNo: number }, b: { displayNo: number }) =>
//             a.displayNo - b.displayNo
//         );
//     };

//     const items = JSON.parse(menuData);
//     // console.log("🚀 ~ useEffect ~ items:", items)

//     if (items.length > 0) {
//       const parsedItems = parseMenuItems(items);
//       setMenuItems(parsedItems);
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleMenuClick = (
//     e: any,
//     item: { menuId: any; path: any; menuName: any }
//   ) => {
//     var menuId = item.menuId;
//     var menuName = item.menuName;
//     const path =
//       item.path + "?appId=" + menuId + "&Appname=" + menuName + ".aspx";

//     if (!path) {
//       window.alert("Path Not Found");
//     } else {
//       sessionStorage.setItem("menuId", menuId);
//       sessionStorage.setItem("menuName", menuName);
//       navigate(path);
//     }
//   };

//   return (
//     <div>
//       {location.pathname === "/" ? (
//         <Outlet />
//       ) : (
//         <div>

//             <Box sx={{ display: "flex" }}>
//               <Sidebar items={menuItems} onClick={handleMenuClick} />

//               <Box
//                 sx={{
//                   flexGrow: 1,
//                   px: 5,
//                   py: 3,
//                   width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//                   minHeight: "100vh",
//                   backgroundColor: `var(--main-background)`,
//                   backgroundImage: `var(--background-image)`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   backgroundRepeat: "no-repeat",
//                 }}
//               >
//                 <Toolbar />
//                 <Outlet />

//                 {/* Chatbot Icon with Image */}
//                 <Draggable>
//                 <Box
//                   sx={{
//                     position: "fixed",
//                     bottom: 20,
//                     right: 20,
//                     display: "flex",
//                     alignItems: "center",

//                   }}
//                 >
//                   {isHovered && (
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         marginRight: 1,
//                         background: "rgba(0, 0, 0, 0.7)",
//                         color: "white",
//                         padding: "5px 10px",
//                         borderRadius: "5px",
//                         position: "absolute",
//                         bottom: "70px", // Adjust as needed
//                         right: "50px", // Adjust as needed
//                       }}
//                     >
//                       Ask Me...
//                     </Typography>
//                   )}
//                   <Box
//                     component="img"
//                     src={ChatBotIcon}
//                     alt="Chatbot"
//                     sx={{
//                       width: 60,
//                       height: 60,
//                       cursor: "pointer",
//                       "&:hover": {
//                         opacity: 0.8,
//                       },
//                     }}
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                     onClick={() => setIsChatBotOpen(true)} // Open chatbot modal
//                   />
//                 </Box>
//                 </Draggable>
//               </Box>
//             </Box>


//             {/* ChatBot Modal */}
//             <ChatBot
//               open={isChatBotOpen}
//               onClose={() => setIsChatBotOpen(false)}
//             />

//         </div>
//       )}
//     </div>
//   );
// };

// export default MainLayout;


// =================mycode 7/2/25

// import { Outlet } from "react-router-dom";
// import { Box, IconButton, Toolbar, Typography } from "@mui/material";
// import sizeConfigs from "../../configs/sizeConfigs";
// import Sidebar from "../common/Sidebar";
// import { useLocation, useNavigate } from "react-router-dom";
// import FolderIcon from "@mui/icons-material/Folder";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import backgroundimage from "../../assets/images/backgroundimage.jpg";
// import { useEffect, useState } from "react";
// import "../common/ThemeStyle.css";
// import ChatIcon from "@mui/icons-material/Chat";
// import ChatBotIcon from "../../assets/images/chatBot1.png";
// import ChatBot from "../../pages/ChatBot/ChatBot";
// import Draggable from "react-draggable";

// const themes = [
//   "light-theme",
//   "dark-theme",
//   "ocean-theme",
//   "sunset-theme",
//   "forest-theme",
// ];

// const MainLayout = () => {
//   const location = useLocation();
//   let navigate = useNavigate();
//   const [menuItems, setMenuItems] = useState([]);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isChatBotOpen, setIsChatBotOpen] = useState(false);


//   // const selectedTheme:any = () => {
//   //   const storedTheme = localStorage.getItem("theme");
//   //   return storedTheme ? storedTheme : themes[0];
//   // };

//   // useEffect(() => {
//   //   document.body.className = selectedTheme;
//   //   localStorage.setItem("theme", selectedTheme);
//   // }, [selectedTheme]);

//   useEffect(() => {
//     const storedPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");

//     // Convert flat permissions list into hierarchical menu structure
//     const menuMap = new Map();

//     storedPermissions.forEach((perm:any) => {
//         const menu = { 
//             menuId: perm.menuId,
//             parentId: perm.parentId,
//             menuName: perm.menuName,
//             path: `/path-to/${perm.menuName.replace(/\s+/g, "-").toLowerCase()}`,
//             children: []
//         };

//         menuMap.set(menu.menuId, menu);
//     });

//     // Assign children to their respective parents
//     const rootMenus:any = [];
//     menuMap.forEach((menu) => {
//         if (menu.parentId === null) {
//             rootMenus.push(menu);
//         } else {
//             const parentMenu = menuMap.get(menu.parentId);
//             if (parentMenu) {
//                 parentMenu.children.push(menu);
//             }
//         }
//     });

//     setMenuItems(rootMenus);
//  }, []);

//   const handleMenuClick = (
//     e: any,
//     item: { menu_id: any; path: any; menu_name: any }
//   ) => {
//     var menuId = item.menu_id;
//     var menu_name = item.menu_name;
//     const path =
//       item.path + "?appId=" + menuId + "&Appname=" + menu_name + ".aspx";

//     if (!path) {
//       window.alert("Path Not Found");
//     } else {
//       sessionStorage.setItem("menuId", menuId);
//       sessionStorage.setItem("menuName", menu_name);
//       navigate(path);
//     }
//   };

//   return (
//     <div>
//       {location.pathname === "/" ? (
//         <Outlet />
//       ) : (
//         <div>

//             <Box sx={{ display: "flex" }}>
//               <Sidebar items={menuItems} onClick={handleMenuClick} />

//               <Box
//                 sx={{
//                   flexGrow: 1,
//                   px: 5,
//                   py: 3,
//                   width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//                   minHeight: "100vh",
//                   backgroundColor: `var(--main-background)`,
//                   backgroundImage: `var(--background-image)`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   backgroundRepeat: "no-repeat",
//                 }}
//               >
//                 <Toolbar />
//                 <Outlet />

//                 {/* Chatbot Icon with Image */}
//                 <Draggable>
//                 <Box
//                   sx={{
//                     position: "fixed",
//                     bottom: 20,
//                     right: 20,
//                     display: "flex",
//                     alignItems: "center",

//                   }}
//                 >
//                   {isHovered && (
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         marginRight: 1,
//                         background: "rgba(0, 0, 0, 0.7)",
//                         color: "white",
//                         padding: "5px 10px",
//                         borderRadius: "5px",
//                         position: "absolute",
//                         bottom: "70px", // Adjust as needed
//                         right: "50px", // Adjust as needed
//                       }}
//                     >
//                       Ask Me...
//                     </Typography>
//                   )}
//                   <Box
//                     component="img"
//                     src={ChatBotIcon}
//                     alt="Chatbot"
//                     sx={{
//                       width: 60,
//                       height: 60,
//                       cursor: "pointer",
//                       "&:hover": {
//                         opacity: 0.8,
//                       },
//                     }}
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                     onClick={() => setIsChatBotOpen(true)} // Open chatbot modal
//                   />
//                 </Box>
//                 </Draggable>
//               </Box>
//             </Box>


//             {/* ChatBot Modal */}
//             <ChatBot
//               open={isChatBotOpen}
//               onClose={() => setIsChatBotOpen(false)}
//             />

//         </div>
//       )}
//     </div>
//   );
// };

// export default MainLayout;

// ==============================
// working upper





import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar";
import FolderIcon from "@mui/icons-material/Folder";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import backgroundimage from "../../assets/images/backgroundimage.jpg";
import { useEffect, useState } from "react";
import "../common/ThemeStyle.css";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBotIcon from "../../assets/images/chatBot1.png";
import ChatBot from "../../pages/ChatBot/ChatBot";
import Draggable from "react-draggable";
import React from "react";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<any>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

 //console.log("menuItems",menuItems);
  // const fetchMenu = () => {
  //   const storedPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  //   const buildMenuHierarchy = (permissions: any[]) => {
  //     const menuMap = new Map<number, any>();

  //     // Step 1: Create a map with menuId as key
  //     permissions.forEach((perm: any) => {
  //       menuMap.set(perm.menuId, {
  //         menuId: perm.menuId,
  //         parentId: perm.parentId,
  //         menuName: perm.menuName,
  //         path: "", // Path will be generated dynamically
  //         children: [],
  //       });
  //     });

  //     const rootMenus: any[] = [];

  //     // Step 2: Assign child items to their respective parents
  //     menuMap.forEach((menu) => {
  //       if (menu.parentId === null) {
  //         rootMenus.push(menu);
  //       } else {
  //         const parentMenu = menuMap.get(menu.parentId);
  //         if (parentMenu) {
  //           parentMenu.children.push(menu);
  //         }
  //       }
  //     });

  //     // Step 3: Generate Paths Recursively
  //     const generatePaths = (menus: any[], parentPath = "") => {
  //       menus.forEach((menu) => {
  //         menu.path = `${parentPath}/${menu.menuName.replace(/\s+/g, "").toLowerCase()}`; // Append Parent Menu Name
  //         if (menu.children.length > 0) {
  //           generatePaths(menu.children, menu.path); // Pass updated parent path
  //         }
  //       });
  //     };

  //     generatePaths(rootMenus); // Start path generation

  //     return rootMenus;
  //   };

  //   setMenuItems(buildMenuHierarchy(storedPermissions));
  // };


  const fetchMenu = () => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  
    const buildMenuHierarchy = (permissions: any[]) => {
      const menuMap = new Map<number, any>();
  
      // ✅ Step 1: Store all menus in a map
      permissions.forEach((perm: any) => {
        menuMap.set(perm.menuId, {
          menuId: perm.menuId,
          parentId: perm.parentId,
          menuName: perm.menuName,
          path: "",
          children: [],
        });
      });
  
      let rootMenus: any[] = [];
  
      // ✅ Step 2: Assign children to their parents
      menuMap.forEach((menu) => {
        if ((menu.parentId === null) && menuMap.has(menu.menuId)) {
          rootMenus.push(menu);
        } else {
          const parentMenu = menuMap.get(menu.parentId);
          if (parentMenu && menuMap.has(parentMenu.menuId)) {
            parentMenu.children.push(menu);
          }
        }
      });
  
      // ✅ Step 3: Define the fixed order for parent menus
      const parentMenuOrder = [
        "Vehicle Management",
        "Store Management",
        "Communication",
        "Vendor Info",
        "Employee Info",
        "Reports",
        "Admin",
      ];
  
      // ✅ Step 4: Filter root menus based on permissions & sort them in the given order
      rootMenus = rootMenus.filter((menu) =>
        permissions.some((perm) => perm.menuName === menu.menuName)
      );
  
      rootMenus.sort((a, b) => {
        const indexA = parentMenuOrder.indexOf(a.menuName);
        const indexB = parentMenuOrder.indexOf(b.menuName);
        return indexA - indexB;
      });
  
      // ✅ Step 5: Sort child items alphabetically & remove empty parents
      const filterAndSortChildren:any = (menus: any[]) => {
        return menus
          .filter((menu) => menuMap.has(menu.menuId)) // Remove non-existing menus
          .map((menu) => ({
            ...menu,
            children: filterAndSortChildren(menu.children).sort((a:any, b:any) =>
              a.menuName.localeCompare(b.menuName)
            ),
          }));
      };
  
      const sortedMenus = filterAndSortChildren(rootMenus);
  
      // ✅ Step 6: Generate Paths Recursively
      const generatePaths = (menus: any[], parentPath = "") => {
        menus.forEach((menu) => {
          menu.path = `${parentPath}/${menu.menuName.replace(/\s+/g, "").toLowerCase()}`;
          if (menu.children.length > 0) {
            generatePaths(menu.children, menu.path);
          }
        });
      };
  
      generatePaths(sortedMenus);
  
      return sortedMenus;
    };
  
    setMenuItems(buildMenuHierarchy(storedPermissions));
  };
  
  
  
  
  useEffect(() => {
    fetchMenu(); // Initial fetch

    // ✅ Listen for permission updates from login
    const updateMenu = () => fetchMenu();
    window.addEventListener("permissionsUpdated", updateMenu);

    return () => window.removeEventListener("permissionsUpdated", updateMenu);
  }, []);

  const handleMenuClick = (e: any, item: any) => {
    const menuId = item.menuId;
    const menuName = item.menuName;
    const path = `${item.path}?appId=${menuId}&Appname=${menuName}.aspx`;

    if (!path) {
      window.alert("Path Not Found");
    } else {
      sessionStorage.setItem("menuId", menuId);
      sessionStorage.setItem("menuName", menuName);
      navigate(path);
    }
  };

  return (
    <div>
      {location.pathname === "/" ? (
        <Outlet />
      ) : (
        <div>
          <Box sx={{ display: "flex" }}>
            <Sidebar items={menuItems} onClick={handleMenuClick} />
            <Box
              sx={{
                flexGrow: 1,
                px: 5,
                py: 3,
                width: `calc(100% - ${sizeConfigs.sidebar.width})`,
                minHeight: "100vh",
                backgroundColor: `var(--main-background)`,
                backgroundImage: `var(--background-image)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Toolbar />
              <Outlet />
              <Draggable>
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isHovered && (
                    <Typography
                      variant="body2"
                      sx={{
                        marginRight: 1,
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        position: "absolute",
                        bottom: "70px",
                        right: "50px",
                      }}
                    >
                      Ask Me...
                    </Typography>
                  )}
                  <Box
                    component="img"
                    src={ChatBotIcon}
                    alt="Chatbot"
                    sx={{
                      width: 60,
                      height: 60,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setIsChatBotOpen(true)}
                  />
                </Box>
              </Draggable>
            </Box>
          </Box>
          <ChatBot open={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default MainLayout;






