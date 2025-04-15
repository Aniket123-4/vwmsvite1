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
export default function Designation() {
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
      fetchDesignationData();
   }, [isLoading]);


   const formik = useFormik({
      initialValues:
      {
         "sno": 0,
         "designationId": 0,
         "designationName": "",
         "designationCode": "",
         "createdBy": userId,
         "updatedBy": userId,
         "createdOn":defaultValuestime,
         "updatedOn": defaultValuestime,
         "srn": 0
      },

      validationSchema: Yup.object({
         designationName: Yup.string()
            .required(t("text.reqDesignationName")),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post(`Department/UpsertDesignation`, values);
            if (response.data.status === 1) {
               formik.resetForm();
               setToaster(false);
               toast.success(response.data.message);
            } else {
               setToaster(true);
               toast.error(response.data.message);
            }
            fetchDesignationData();

         } catch (error) {
            setToaster(true);
            toast.error("An error occurred while saving. Please try again.");
            console.error("API Error:", error);
         }
      },
   });

   const handleEdit = (row: any) => {
      console.log("row:--", row);
      formik.setFieldValue("designationId",row.designationId);
      formik.setFieldValue("designationName",row.designationName);
      formik.setFieldValue("designationCode",row.designationCode);
   }


   let delete_id = "";
   const accept = () => {
      const collectData = {
         designationId: delete_id
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`Department/DeleteDesignation`, collectData)
         .then((response) => {
            if (response.data.status === 1) {
               toast.success(response.data.message);
            } else {
               toast.success(response.data.message);
            }
            fetchDesignationData();
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




   const fetchDesignationData = async () => {
      try {
         const collectData = {
            "designationId": -1
         };
         const response = await api.post(`Department/GetDesignation`, collectData);
         const data = response.data.data;
         console.log("🚀 ~ fetchDesignationData ~ response.data.data:", response.data.data)
         const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.designationId,
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
                  field: "designationName",
                  headerName: t("text.Designation"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "designationCode",
                  headerName: t("text.DesignationCode"),
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
                  {t("text.Designation")}
               </Typography>
               <Divider />
               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster && <ToastApp />}
                  <Grid container spacing={2}>

                     {/* Designation */}
                     <Grid item xs={12} sm={6} lg={6}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterDesigName")}
                                 required={true}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="designationName"
                           id="designationName"
                           value={formik.values.designationName}
                           placeholder={t("text.EnterDesigName")}
                           onChange={(e) => {
                              formik.setFieldValue("designationName", e.target.value.toString());
                           }}
                        />
                        {formik.touched.designationName && formik.errors.designationName && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.designationName}</div>
                        )}
                     </Grid>


                     {/* Designation Code */}
                     <Grid item xs={12} sm={6} lg={6}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterDesignationCode")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="designationCode"
                           id="designationCode"
                           value={formik.values.designationCode}
                           placeholder={t("text.EnterDesignationCode")}
                           onChange={(e) => {
                              formik.setFieldValue("designationCode", e.target.value.toString());
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
