import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
   Box,
   Button,
   Divider,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from '../../../utils/Url';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import {
   DataGrid,
   GridColDef,
   GridToolbar,
} from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import DataGrids from "../../../utils/Datagrids";
import dayjs from "dayjs";
import { getISTDate } from "../../../utils/Constant";
import moment from "moment";
import { setEnvironmentData } from "worker_threads";


interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function JobCard() {
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [lang, setLang] = useState<Language>("en");
   const { defaultValues } = getISTDate();


   let navigate = useNavigate();
   const { t } = useTranslation();

   const [vehicleOption, setVehicleOption] = useState([
      { value: -1, label: t("text.VehicleNo"), name: "" },
   ]);

   const [empOption, setEmpOption] = useState([
      { value: 1, label: t("text.EmpName"), department: "", designation: "" },
   ]);

   const [jobCardData, setJobCardData] = useState([{
      "jobCardId": 0,
      "jobCardNo": "",
      "fileNo": "",
      "imageFile": "",
      "jobCardDate": "2025-01-02T08:08:36.700Z",
      "complainId": 0,
      "complainDate": "2025-01-02T08:08:36.700Z",
      "empId": 0,
      "itemId": 0,
      "currenReading": 0,
      "complain": "",
      "status": "",
      "serviceType": "",
      "createdBy": "",
      "updatedBy": "",
      "createdOn": "2025-01-02T08:08:36.700Z",
      "updatedOn": "2025-01-02T08:08:36.700Z",
      "companyId": 0,
      "fyId": 0,
      "totalItemAmount": 0,
      "totalServiceAmount": 0,
      "netAmount": 0,
      "vehicleNo": "",
      "empName": "",
      "serviceDetail": [
         {
            "id": 0,
            "jobCardId": 0,
            "serviceId": 0,
            "amount": 0,
            "jobWorkReq": true,
            "vendorId": 0,
            "challanRemark": "",
            "challanNo": 0,
            "challanDate": defaultValues,
            "challanRcvNo": 0,
            "challanRcvDate": "2025-01-02T08:08:36.700Z",
            "challanStatus": "",
            "netAmount": 0,
            "qty": 0,
            "unitRate": 0,
            "unitId": 0,
            "vendorName": "",
            "serviceName": "",
            "unitName": "",
            "cgstid": 0,
            "sgstid": 0,
            "gstid": 0,
            "gst": 0
         }
      ],
      "update": true
   }]);


   useEffect(() => {
      getVehicleDetails();
      getEmpData();
      const timeoutId = setTimeout(() => {
         fetchJobCardData();
      }, 100);
      return () => clearTimeout(timeoutId);
   }, [isLoading]);

   const getVehicleDetails = async () => {
      const response = await api.get(
         `Master/GetVehicleDetail?ItemMasterId=-1`,
      );
      const data = response.data.data;
      const arr = data.map((Item: any, index: any) => ({
         value: Item.itemMasterId,
         label: Item.vehicleNo,
         name: Item.itemName
      }));
      setVehicleOption(arr);
   };

   const getEmpData = async () => {
      const collectData = {
         "empid": -1,
         "userId": ""
      };
      const response = await api.post(`Employee/GetEmployee`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["empName"],
            value: data[index]["empid"],
            department: data[index]["departmentName"],
            designation: data[index]["designationName"],
         });
      }
      setEmpOption(arr);
   };


   const routeChangeEdit = (row: any) => {
      console.log("row " + row);

      let path = `/vehiclemanagement/vehiclecomplaints/EditJobCard`;
      navigate(path, {
         state: {
            ...row,
            // serviceDetail: jobCardData[jobCardData.findIndex(e => e.jobCardId == row.jobCardId)]?.serviceDetail || [{
            //    id: 0,
            //    jobCardId: 0,
            //    serviceId: 0,
            //    amount: 0,
            //    jobWorkReq: true,
            //    vendorId: 0,
            //    challanRemark: "",
            //    challanNo: 0,
            //    challanDate: defaultValues,
            //    challanRcvNo: 0,
            //    challanRcvDate: defaultValues,
            //    challanStatus: "",
            //    netAmount: 0,
            //    qty: 0,
            //    unitRate: 0,
            //    unitId: 0,
            //    vendorName: "",
            //    serviceName: "",
            //    unitName: "",
            //    cgstid: 0,
            //    sgstid: 0,
            //    gstid: 0,
            //    gst: 0
            // }],
            vehicleName: vehicleOption[vehicleOption.findIndex(e => e.value == row.itemId)]?.name || "", department: empOption[empOption.findIndex(e => e.value == row.empId)]?.department || "", designation: empOption[empOption.findIndex(e => e.value == row.empId)]?.designation || ""
         },
      });
   };

   const routeChangeAdd = () => {
      let path = `/vehiclemanagement/vehiclecomplaints/AddJobCard`;
      navigate(path);
   };


   // let delete_id = "";
   // const accept = () => {
   //    const collectData = {
   //       campaignId: delete_id
   //    }
   //    api
   //       .post(`Comm/DeleteCampaign`, collectData)
   //       .then((response) => {
   //          if (response.data.status === 1) {
   //             toast.success(response.data.message);
   //          } else {
   //             toast.error(response.data.message);
   //          }
   //          fetchJobCardData();
   //       });
   // };

   // const reject = () => {
   //    // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
   //    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   // };

   // const handledeleteClick = (del_id: any) => {
   //    // console.log(del_id + " del_id ");
   //    delete_id = del_id;
   //    confirmDialog({
   //       message: "Do you want to delete this record ?",
   //       header: "Delete Confirmation",
   //       icon: "pi pi-info-circle",
   //       acceptClassName: "p=-button-danger",
   //       accept,
   //       reject,
   //    });
   // };


   function formatDate(dateString: string) {
      const timestamp = Date.parse(dateString);
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
   }




   const fetchJobCardData = async () => {
      try {
         const collectData = {
            "jobCardId": -1,
            "status": ""
         };
         const response = await api.post(
            `Master/GetJobCardInhouse`,
            collectData
         );
         const data = response.data.data;
         const arr = data.map((Item: any, index: any) => ({
            ...Item,
            serialNo: index + 1,
            id: Item.jobCardId,
            jobCardDate: formatDate(Item.jobCardDate)
         }));
         setItem(arr);
         setJobCardData(data)
         setIsLoading(false);

         if (data.length > 0) {
            const columns: GridColDef[] = [
               {
                  field: "actions",
                  headerClassName: "MuiDataGrid-colCell",
                  headerName: t("text.Action"),
                  width: 70,

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
                           {/* ) : ( */}
                           {/* "" */}
                           {/* )} */}
                           {/* {permissionData?.isDel ? ( */}
                           {/* <DeleteIcon
                              style={{
                                 fontSize: "20px",
                                 color: "red",
                                 cursor: "pointer",
                              }}
                              onClick={() => {
                                 handledeleteClick(params.row.id);
                              }}
                           /> */}
                           <VisibilityIcon
                              style={{
                                 fontSize: "20px",
                                 color: "grey",
                                 cursor: "pointer",
                              }}
                              onClick={() => routeChangeEdit({ ...params.row, isView: true })}
                           />
                        </Stack>,
                     ];
                  },
               },

               // {
               //    field: "serialNo",
               //    headerName: t("text.SrNo"),
               //    flex: .3,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
               {
                  field: "jobCardNo",
                  headerName: t("text.JobCardNum"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "vehicleNo",
                  headerName: t("text.VehicleNo"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },

               // {
               //    field: "1",
               //    headerName: t("text.Zone"),
               //    flex: .6,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
               {
                  field: "complain",
                  headerName: t("text.Complaint"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "complainId",
                  headerName: t("text.ComplaintNo"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               // {
               //    field: "4",
               //    headerName: t("text.InHouse"),
               //    flex: 1,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
               // {
               //    field: "5",
               //    headerName: t("text.OutSource"),
               //    flex: 1,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
               {
                  field: "jobCardDate",
                  headerName: t("text.JobCardDate"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "empName",
                  headerName: t("text.UnderControlOf"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "status",
                  headerName: t("text.Status"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               // {
               //    field: "n",
               //    headerName: t("text.Department"),
               //    flex: 1,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
               // {
               //    field: "itemName",
               //    headerName: t("text.VehicleName"),
               //    flex: 1,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
            ];
            setColumns(columns as any);
         }

      } catch (error) {
         console.error("Error fetching data:", error);
         // setLoading(false);
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
                        {t("text.Jobcard")}
                     </Typography>
                  </Grid>
                  <Grid item lg={2} md={2} xs={12} marginTop={2}>
                     <select
                        className="language-dropdown"
                        value={lang}
                        onChange={(e) => setLang(e.target.value as Language)}
                     >
                        {Languages.map((l) => (
                           <option key={l.value} value={l.value}>
                              {l.label}
                           </option>
                        ))}
                     </select>
                  </Grid>
               </Grid>

               <Divider />

               <Box height={10} />

               <Stack direction="row" spacing={2} classes="my-2 mb-2">
                  {/* {permissionData?.isAdd == true && ( */}
                  <Button
                     onClick={routeChangeAdd}
                     variant="contained"
                     endIcon={<AddCircleIcon />}
                     size="large"
                     style={{ backgroundColor: `var(--header-background)` }}
                  >
                     {t("text.add")}
                  </Button>
                  {/* ) } */}

               </Stack>

               <DataGrids
                  isLoading={isLoading}
                  rows={item}
                  columns={adjustedColumns}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  initialPageSize={5}
               />
            </Paper>
         </Card>
         <ToastApp />

      </>
   );
}