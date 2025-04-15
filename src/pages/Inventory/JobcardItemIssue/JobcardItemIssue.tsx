// import React, { useEffect, useState } from "react";
// import AddCircleIcon from "@mui/icons-material/AddCircle";

// import { GridColDef } from "@mui/x-data-grid";
// import api from "../../../utils/Url";
// import Card from "@mui/material/Card";

// import {
//   Box,
//   Divider,
//   Stack,
//   Grid,
//   Typography,
//   Button,

// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import Paper from "@mui/material/Paper";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import CircularProgress from "@mui/material/CircularProgress";
// //import { getId } from "../../../utils/Constant";
// //import { Language } from "react-transliterate";
// import "react-transliterate/dist/index.css";
// // import CustomDataGrids from "../../../utils/CustomDataGrids";
// import CustomDataGrid from "../../../utils/CustomDatagrid";
// import dayjs from "dayjs";

// interface MenuPermission {
//   isAdd: boolean;
//   isEdit: boolean;
//   isPrint: boolean;
//   isDel: boolean;
// }

// export default function JobcardItemIssue() {
//   // const Userid = getId();
//   let navigate = useNavigate();
//   // const [editId, setEditId] = useState(-1);
//   const [zones, setZones] = useState([]);
//   const [columns, setColumns] = useState<any>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   // const location = useLocation();
//   // const [lang, setLang] = useState<Language>("en");
//   // const [permissionData, setPermissionData] = useState<MenuPermission>({
//   //   isAdd: false,
//   //   isEdit: false,
//   //   isPrint: false,
//   //   isDel: false,
//   // });

//   const { t } = useTranslation();

//   useEffect(() => {
//     fetchZonesData();
//   }, []);

//   const routeChangeEdit = (row: any) => {
//     // console.log(row);
//     let path = `/Inventory/EditJobcardItemIssue`;
//     navigate(path, {
//       state: row,
//     });
//   };

  
//   const routeChangeAdd = () => {
//     let path = `/Inventory/CreateJobcardItemIssue`;
//     navigate(path);
//   };

//   let delete_id = "";

//   const accept = () => {
//     const collectData = {
//       issueId: delete_id,
//     };
//     console.log("collectData " + JSON.stringify(collectData));
//     api
//       .delete(`StaffItemIssue/DeleteItemIssue`, { data: collectData })
//       .then((response) => {
//         if (response.data.isSuccess) {
//           toast.success(response.data.mesg);
//         } else {
//           toast.error(response.data.mesg);
//         }
//         fetchZonesData();
//       });
//   };

//   const reject = () => {
//     toast.warn("Rejected: You have rejected", { autoClose: 3000 });
//   };

//   const handledeleteClick = (del_id: any) => {
//     delete_id = del_id;
//     confirmDialog({
//       message: "Do you want to delete this record ?",
//       header: "Delete Confirmation",
//       icon: "pi pi-info-circle",
//       acceptClassName: "p=-button-danger",
//       accept,
//       reject,
//     });
//   };

//   const fetchZonesData = async () => {
//     try {
//       const collectData = {
//         issueId: -1,
//         indentId: -1,
//         empId: -1,
//       };
//       const response = await api.post(
//         `StaffItemIssue/GetItemIssue`,
//         collectData
//       );
//       const data = response.data.data;
//       console.log(
//         "🚀 ~ fetchZonesData ~ response.data.data:",
//         response.data.data
//       );
//       const zonesWithIds = data.map((zone: any, index: any) => ({
//         ...zone,
//         serialNo: index + 1,
//         id: zone.issueId,
//         empId: zone.empId,
//         indentId: zone.indentId,
//       }));
//       setZones(zonesWithIds);
//       setIsLoading(false);

//       if (data.length > 0) {
//         const columns: GridColDef[] = [
//           {
//             field: "actions",
//             headerName: t("text.Action"),
//             width: 150,

//             renderCell: (params) => {
//               return [
//                 <Stack
//                   spacing={1}
//                   direction="row"
//                   sx={{ alignItems: "center", marginTop: "5px" }}
//                 >
//                   {/* {permissionData?.isEdit ? ( */}
//                   <EditIcon
//                     style={{
//                       fontSize: "20px",
//                       color: "blue",
//                       cursor: "pointer",
//                     }}
//                     className="cursor-pointer"
//                     onClick={() => routeChangeEdit(params.row)}
//                   />
//                   {/* ) : (
//                     ""
//                   )}
//                   {permissionData?.isDel ? ( */}
//                   <DeleteIcon
//                     style={{
//                       fontSize: "20px",
//                       color: "red",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       handledeleteClick(params.row.id);
//                     }}
//                   />
//                   {/* ) : (
//                     ""
//                   )} */}
//                 </Stack>,
//               ];
//             },
//           },

//           {
//             field: "serialNo",
//             headerName: t("text.SrNo"),
//             flex: 1,
//           },
//           {
//             field: "indentNo",
//             headerName: t("text.IndentNo"),
//             flex: 1,
//             headerClassName: "MuiDataGrid-colCell",
//           },
//           {
//             field: "IssueDate",
//             headerName: t("text.IssueDate"),
//             flex: 1,
//             headerClassName: "MuiDataGrid-colCell",
//             renderCell(params) {
//               return dayjs(params.row.issueDate).format("DD-MMM-YYYY");
//             },
//           },

          
//           {
//             field: "vehicleno",
//             headerName: t("text.vehicleno"),
//             flex: 1,
//             headerClassName: "MuiDataGrid-colCell",
//           },
//         ];
//         setColumns(columns as any);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const adjustedColumns = columns.map((column: any) => ({
//     ...column,
//   }));

//   return (
//     <>
//       <Card
//         style={{
//           width: "100%",
//           backgroundColor: "lightgreen",
//           border: ".5px solid #2B4593",
//           marginTop: "3vh",
//         }}
//       >
//         <Paper
//           sx={{
//             width: "100%",
//             overflow: "hidden",
//           }}
//           style={{ padding: "10px" }}
//         >
//           <ConfirmDialog />

//           <Grid item xs={12} container spacing={1}>
//             <Grid item lg={10} md={10} xs={12}>
//               <Typography
//                 gutterBottom
//                 variant="h5"
//                 component="div"
//                 sx={{ padding: "20px" }}
//                 align="left"
//               >
//                 {t("text.JobcardItemIssue")}
//               </Typography>
//             </Grid>
//           </Grid>

//           <Divider />

//           <Box height={10} />

//           <Stack direction="row" spacing={2} classes="my-2 mb-2">
//             {/* {permissionData?.isAdd == true ? ( */}
//             <Button
//               onClick={routeChangeAdd}
//               variant="contained"
//               endIcon={<AddCircleIcon />}
//               size="large"
//               style={{ backgroundColor: `var(--header-background)` }}
//             >
//               {t("text.add")}
//             </Button>
//             {/* ) : (
//                 ""
//               )} */}

//             {/* {permissionData?.isPrint == true ? (
//                 <Button
//                   variant="contained"
//                   endIcon={<PrintIcon />}
//                   size="large"
//                 >
//                   {t("text.print")}
//                 </Button>
//               ) : (
//                 ""
//               )} */}
//           </Stack>

//           {isLoading ? (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <CircularProgress />
//             </div>
//           ) : (
//             <CustomDataGrid
//               isLoading={isLoading}
//               rows={zones}
//               columns={adjustedColumns}
//               pageSizeOptions={[5, 10, 25, 50, 100]}
//               initialPageSize={5}
//             />
//           )}
//         </Paper>
//       </Card>
//       <ToastApp />
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Button,

} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
//import { getId } from "../../../utils/Constant";
//import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
// import CustomDataGrids from "../../../utils/CustomDataGrids";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import dayjs from "dayjs";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function JobcardItemIssue() {
  // const Userid = getId();
  let navigate = useNavigate();
  // const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const location = useLocation();
  // const [lang, setLang] = useState<Language>("en");
  // const [permissionData, setPermissionData] = useState<MenuPermission>({
  //   isAdd: false,
  //   isEdit: false,
  //   isPrint: false,
  //   isDel: false,
  // });

  const { t } = useTranslation();

  useEffect(() => {
    fetchZonesData();
  }, []);

  const routeChangeEdit = (row: any) => {
    // console.log(row);
    let path = `/storemanagement/itemissue/EditJobcardItemIssue`;
    navigate(path, {
      state: row,
    });
  };

  
  const routeChangeAdd = () => {
    let path = `/storemanagement/itemissue/CreateJobcardItemIssue`;
    navigate(path);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      IssueId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api.get(`ItemIssue/DeleteItemIssue?IssueId=${delete_id}`)
      .then((response) => {
        if (response.data.status===1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchZonesData();
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    delete_id = del_id;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        issueId: -1,
        indentId: -1,
         empId: -1,
      };
      const response = await api.post(
        `ItemIssue/GetItemIssue`,
        collectData
      );
      const data = response.data.data;
      console.log(
        "🚀 ~ fetchZonesData ~ response.data.data:",
        response.data.data
      );
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.issueId,
        empId: zone.empId,
        indentId: zone.indentId,
      }))
      .filter((Item: any) => Item.issueType==="JobCard");
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerName: t("text.Action"),
            width: 150,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  {/* {permissionData?.isEdit ? ( */}
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  {/* ) : (
                    ""
                  )}
                  {permissionData?.isDel ? ( */}
                  <DeleteIcon
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handledeleteClick(params.row.id);
                    }}
                  />
                      <VisibilityIcon
                    style={{
                      fontSize: "20px",
                      color: "grey",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit({ ...params.row, isView: true })}
                  />

                  {/* ) : (
                    ""
                  )} */}
                </Stack>,
              ];
            },
          },

          // {
          //   field: "serialNo",
          //   headerName: t("text.SrNo"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          // },
          {
            field: "indentNno",
            headerName: t("text.IndentNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "IssueDate",
            headerName: t("text.IssueDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell(params) {
              return dayjs(params.row.issueDate).format("DD-MMM-YYYY");
            },
          },

          
          {
            field: "vehicleNo",
            headerName: t("text.vehicleNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  return (
    <>
       <Card
            style={{
                width: "100%",
                // height: "100%",
                backgroundColor: "#E9FDEE",
                border: ".5px solid #FF7722 ",
                marginTop: "3vh"
            }}
        >
            <Paper
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    "& .MuiDataGrid-colCell": {
                        backgroundColor: `var(--grid-headerBackground)`,
                        color: `var(--grid-headerColor)`,
                        fontSize: 17,
                        fontWeight: 900
                    },
                }}
                style={{ padding: "10px", }}
            >
          <ConfirmDialog />

          <Grid item xs={12} container spacing={1}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.JobcardItemIssue")}
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true ? ( */}
            <Button
              onClick={routeChangeAdd}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{ backgroundColor: `var(--header-background)` }}
            >
              {t("text.add")}
            </Button>
            {/* ) : (
                ""
              )} */}

            {/* {permissionData?.isPrint == true ? (
                <Button
                  variant="contained"
                  endIcon={<PrintIcon />}
                  size="large"
                >
                  {t("text.print")}
                </Button>
              ) : (
                ""
              )} */}
          </Stack>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <CustomDataGrid
              isLoading={isLoading}
              rows={zones}
              columns={adjustedColumns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialPageSize={5}
            />
          )}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
