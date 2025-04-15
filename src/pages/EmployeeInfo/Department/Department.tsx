import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
   Autocomplete,
   Box,
   Button,
   Divider,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import {
   GridColDef,
} from "@mui/x-data-grid";
import DataGrids from "../../../utils/Datagrids";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import * as Yup from "yup";
interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}
export default function Department() {
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const userId = getId();

   const { defaultValuestime } = getISTDate();
   const [toaster, setToaster] = useState(false);


   useEffect(() => {
      fetchDeptData();
   }, [isLoading]);


   const formik = useFormik({
      initialValues:
      {
         "departmentId": 0,
         "departmentName": "",
         "departmentShortname": "",
         "createdBy": userId,
         "updatedBy": userId,
         "createdOn": defaultValuestime,
         "updatedOn": defaultValuestime,    
      },

      validationSchema: Yup.object({
         departmentName: Yup.string()
            .required(t("text.reqDeptName")),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post(`Department/UpsertDepartment`, values);
            if (response.data.status === 1) {
               formik.resetForm();
               setToaster(false);
               toast.success(response.data.message);
            } else {
               setToaster(true);
               toast.error(response.data.message);
            }
            fetchDeptData();

         } catch (error) {
            setToaster(true);
            toast.error("An error occurred while saving. Please try again.");
            console.error("API Error:", error);
         }
      },
   });

   const handleEdit = (row: any) => {
      console.log("row:--", row);
      formik.setFieldValue("departmentId",row.departmentId);
      formik.setFieldValue("departmentName",row.departmentName);
      formik.setFieldValue("departmentShortname",row.departmentShortname);
   }


   let delete_id = "";
   const accept = () => {
      const collectData = {
         departmentId: delete_id
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`Department/DeleteDepartment`, collectData)
         .then((response) => {
            if (response.data.isSuccess) {
               toast.success(response.data.message);
            } else {
               toast.success(response.data.message);
            }
            fetchDeptData();
         });
   };
   const reject = () => {
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (del_id: any) => {
      console.log(del_id + " del_id ");
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




   const fetchDeptData = async () => {
      try {
         const collectData = {
            "departmentId": -1
         };
         const response = await api.post(`Department/GetDepartment`, collectData);
         const data = response.data.data;
         console.log("🚀 ~ fetchDeptData ~ response.data.data:", response.data.data)
         const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.departmentId,
         }));
         setItem(arr);
         setIsLoading(false);
         if (data.length > 0) {
            const columns: GridColDef[] = [
               {
                  field: "actions",
                  headerClassName: "MuiDataGrid-colCell",
                  headerName: t("text.Action"),
                  width: 100,
                  renderCell: (params) => {
                     return [
                        <Stack
                           spacing={1}
                           direction="row"
                           sx={{ alignItems: "center", marginTop: "5px" }}
                        >
                           <EditIcon
                              style={{
                                 fontSize: "20px",
                                 color: "blue",
                                 cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => handleEdit(params.row)}
                           />
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
                        </Stack>,
                     ];
                  },
               },
               {
                  field: "serialNo",
                  headerName: t("text.SrNo"),
                  flex: .3,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "departmentName",
                  headerName: t("text.DepartmentName"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "departmentShortname",
                  headerName: t("text.ShortName"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
            ];
            setColumns(columns as any);
         }
      } catch (error) {
         console.error("Error fetching data:", error);
         //setLoading(false);
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
               <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
               >
                  {t("text.Department")}
               </Typography>
               <Divider />
               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster && <ToastApp />}
                  <Grid container spacing={2}>

                     {/* Department name */}
                     <Grid item xs={12} sm={6} lg={6}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterDepartmentName")}
                                 required={true}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="departmentName"
                           id="departmentName"
                           value={formik.values.departmentName}
                           placeholder={t("text.EnterDepartmentName")}
                           onChange={(e) => {
                              formik.setFieldValue("departmentName", e.target.value.toString());
                           }}
                        />
                        {formik.touched.departmentName && formik.errors.departmentName && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.departmentName}</div>
                        )}
                     </Grid>


                     {/* Department Short Name */}
                     <Grid item xs={12} sm={6} lg={6}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterShortName")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="departmentShortname"
                           id="departmentShortname"
                           value={formik.values.departmentShortname}
                           placeholder={t("text.EnterShortName")}
                           onChange={(e) => {
                              formik.setFieldValue("departmentShortname", e.target.value.toString());
                           }}
                        />
                     </Grid>


                     {/* Submit Button */}
                     <Grid item lg={6} sm={6} xs={12}>
                        <Button
                           type="submit"
                           fullWidth
                           style={{
                              backgroundColor: `var(--header-background)`,
                              color: "white",
                              marginTop: "10px",
                           }}
                        >
                           {t("text.save")}
                        </Button>
                     </Grid>

                     {/* Reset Button */}
                     <Grid item lg={6} sm={6} xs={12}>
                        <Button
                           type="reset"
                           fullWidth
                           style={{
                              backgroundColor: "#F43F5E",
                              color: "white",
                              marginTop: "10px",
                           }}
                           onClick={() => {
                              formik.resetForm();
                           }}
                        >
                           {t("text.reset")}
                        </Button>
                     </Grid>
                  </Grid>
               </form>

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
