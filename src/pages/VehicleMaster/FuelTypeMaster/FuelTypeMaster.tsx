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
export default function FuelTypeMaster() {
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const userId = getId();

   const { defaultValuestime } = getISTDate();
   const [toaster, setToaster] = useState(false);

   const [isfuelShortName, setIsfuelShortName] = useState(false);
   const getPageSetupData = async () => {
      await api.get(`Setting/GetPageSetupDataall`).then((res) => {
         const data = res.data.data;
         const pageSetup = data.find((e: any) => e.setupId === 2);
         setIsfuelShortName(pageSetup?.showHide ?? true); // Default to true only if undefined
      });
   };

   useEffect(() => {
      getPageSetupData();
      const timeout = setTimeout(() => {
         //getPageSetupData();
         fetchFuelTypeData();
      }, 100);
      return () => clearTimeout(timeout);
   }, [isLoading]);



   const formik = useFormik({
      initialValues:
      {
         "sno": 0,
         "fuelTypeId": 0,
         "fuelTypename": "",
         "shortName": "",
         "fuelCode": "",
         "createdBy": userId,
         "updatedBy": userId,
         "createdOn": defaultValuestime,
         "updatedOn": defaultValuestime,
         "srno": 0
      },

      validationSchema: Yup.object({
         fuelTypename: Yup.string()
            .required(t("text.reqFuelTypeName")),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post(`Master/UpsertFuelType`, values);
            if (response.data.status === 1) {
               formik.resetForm();
               setToaster(false);
               toast.success(response.data.message);
            } else {
               setToaster(true);
               toast.error(response.data.message);
            }
            fetchFuelTypeData();

         } catch (error) {
            setToaster(true);
            toast.error("An error occurred while saving. Please try again.");
            console.error("API Error:", error);
         }
      },
   });

   const handleEdit = (row: any) => {
      formik.setFieldValue("fuelTypeId", row.fuelTypeId);
      formik.setFieldValue("fuelTypename", row.fuelTypename);
      formik.setFieldValue("shortName", row.shortName);
      formik.setFieldValue("fuelCode", row.fuelCode);
   }


   let delete_id = "";
   let delete_name = "";
   const accept = () => {
      const collectData = {
         "sno": 0,
         "fuelTypeId": delete_id,
         "fuelTypename": delete_name,
         "shortName": "",
         "fuelCode": "",
         "createdBy": "adminvm",
         "updatedBy": "adminvm",
         "createdOn": defaultValuestime,
         "updatedOn": defaultValuestime,
         "srno": 0
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`Master/DeleteFuelType`, collectData)
         .then((response) => {
            if (response.data.status === 1) {
               toast.success(response.data.message);
            } else {
               toast.success(response.data.message);
            }
            fetchFuelTypeData();
         });
   };
   const reject = () => {
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (row: any) => {
      delete_id = row.fuelTypeId;
      delete_name = row.fuelTypename;
      confirmDialog({
         message: "Do you want to delete this record ?",
         header: "Delete Confirmation",
         icon: "pi pi-info-circle",
         acceptClassName: "p=-button-danger",
         accept,
         reject,
      });
   };




   const fetchFuelTypeData = async () => {
      try {
         const response = await api.get(
            `Master/GetFuelType?brandid=-1`,
            //{ headers: { "brandid": -1 } }
         );
         const data = response.data.data;
         const arr = data.map((Item: any, index: any) => ({
            ...Item,
            serialNo: index + 1,
            id: Item.fuelTypeId,
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
                                 handledeleteClick(params.row);
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
                  field: "fuelTypename",
                  headerName: t("text.FueltypeName"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "fuelCode",
                  headerName: t("text.FueltypeCode"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               ...(isfuelShortName ? [{

                  field: "shortName",
                  headerName: t("text.FueltypeShortName"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               }] : []),
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
                  {t("text.FuelTypeMaster")}
               </Typography>
               <Divider />
               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster && <ToastApp />}
                  <Grid container spacing={2}>

                     {/* Fuel type name */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.FuelTypeName")}
                                 required={true}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="fuelTypename"
                           id="fuelTypename"
                           value={formik.values.fuelTypename}
                           placeholder={t("text.FuelTypeName")}
                           onChange={(e) => {
                              formik.setFieldValue("fuelTypename", e.target.value);
                           }}
                        />
                        {formik.touched.fuelTypename && formik.errors.fuelTypename && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.fuelTypename}</div>
                        )}

                     </Grid>


                     {/* Fuel type Code */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.FuelTypeCode")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="fuelCode"
                           id="fuelCode"
                           value={formik.values.fuelCode}
                           placeholder={t("text.FuelTypeCode")}
                           onChange={(e) => {
                              formik.setFieldValue("fuelCode", e.target.value);
                           }}
                        />
                     </Grid>

                     {/* fuel Short Name */}
                     <Grid item xs={12} sm={4} lg={4}>
                        {(isfuelShortName) ? (<TextField
                           label={
                              <CustomLabel
                                 text={t("text.FuelTypeShortName")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="shortName"
                           id="shortName"
                           value={formik.values.shortName}
                           placeholder={t("text.FuelTypeShortName")}
                           onChange={(e) => {
                              formik.setFieldValue("shortName", e.target.value);
                           }}
                        />) : ""}
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
