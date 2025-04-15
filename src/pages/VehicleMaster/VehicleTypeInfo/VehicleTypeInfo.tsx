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
import dayjs from "dayjs";
interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}
export default function VehicleTypeInfo() {
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const userId = getId();

   const { defaultValuestime } = getISTDate();
   const [toaster, setToaster] = useState(false);

   const [vehicleTypeOption, setVehicleTypeOption] = useState([
      { value: -1, label: t("text.VehicleType") },
   ]);
   const [petrolPumpOption, setPetrolPumpOption] = useState([
      { value: -1, label: t("text.PetrolPump") },
   ]);
   const [vehicleValue, setVehicleValue] = useState("")
   const [petroValue, setPetroValue] = useState("")




   useEffect(() => {
      getVehicleTypeData();
      getPetrolPumpData();
      const timeoutId = setTimeout(() => {
         fetchVehicleTypeInfoData();
      }, 200);
      return () => clearTimeout(timeoutId);
   }, [isLoading]);

   const getVehicleTypeData = async () => {
      const response = await api.get(
         `Master/GetVehicleType?VehicleTypeId=-1`,
         //{ headers: { "vehicleTypeId": -1 } }
      );
      const data = response.data.data;
      const arr = data.map((item: any, index: any) => ({
         value: item.vehicleTypeId,
         label: item.vehicleTypename
      }));
      setVehicleTypeOption(arr);
   }

   const getPetrolPumpData = async () => {
      const collectData = {
         "id": -1
      };
      const response = await api.post(`PetrolPump/GetPetrolPump`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["petroPump"],
            value: data[index]["id"],
         });
      }
      setPetrolPumpOption(arr);
   };





   const formik = useFormik({
      initialValues:
      {
         "sno": 0,
         "id": 0,
         "vehicleTypeId": 0,
         "vehicleName": "",
         "petroId": 0,
         "sessionD1": 0,
         "sessionD2": 0,
         "petroName": "",
         "createdOn": defaultValuestime,
         "effectiveDate": dayjs(defaultValuestime).format("YYYY-MM-DD"),
         "updateOn": defaultValuestime,
         "createdBy": userId,
         "updatedBy": userId
      },

      validationSchema: Yup.object({
         vehicleName: Yup.string()
            .required(t("text.reqVehName")),
         petroName: Yup.string()
            .required(t("text.reqPetrolName")),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post(`Master/UpsertVehicleTypeInfo`, values);
            if (response.data.status === 1) {
               formik.resetForm();
               setPetroValue("");
               setVehicleValue("");
               setToaster(false);
               toast.success(response.data.message);
            } else {
               setToaster(true);
               toast.error(response.data.message);
            }
            fetchVehicleTypeInfoData();

         } catch (error) {
            setToaster(true);
            toast.error("An error occurred while saving. Please try again.");
            console.error("API Error:", error);
         }
      },
   });

   const handleEdit = (row: any) => {
      console.log("row:--", row);
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("vehicleTypeId", row.vehicleTypeId);
      formik.setFieldValue("vehicleName", row.vehicleName);
      formik.setFieldValue("petroId", row.petroId);
      formik.setFieldValue("sessionD1", row.sessionD1);
      formik.setFieldValue("sessionD2", row.sessionD2);
      formik.setFieldValue("petroName", row.petroName);
      formik.setFieldValue("effectiveDate", row.effectiveDate);
      setPetroValue(row.petroName);
      setVehicleValue(vehicleTypeOption[vehicleTypeOption.findIndex(e => e.value === row.vehicleTypeId)]?.label);
   }


   let delete_id = "";
   const accept = () => {
      const collectData = {
         "id": delete_id,
         "petroId": 0,
         "vehicleTypeId": 0
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`Master/DeleteVehicleTypeInfo`, collectData)
         .then((response) => {
            if (response.data.status === 1) {
               toast.success(response.data.message);
            } else {
               toast.success(response.data.message);
            }
            fetchVehicleTypeInfoData();
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

   function formatDate(dateString: string) {
      const timestamp = Date.parse(dateString);
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
   }



   const fetchVehicleTypeInfoData = async () => {
      try {
         const collectData = {
            "id": -1,
            "petroId": -1,
            "vehicleTypeId": -1
         };
         const response = await api.post(`Master/GetVehicleTypeInfo`, collectData);
         const data = response.data.data;
         console.log("🚀 ~ fetchVehicleTypeInfoData ~ response.data.data:", response.data.data)
         const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.id,
            effectiveDate: formatDate(item.effectiveDate),
            vehicleName: vehicleTypeOption[vehicleTypeOption.findIndex(e => e.value === item.vehicleTypeId)]?.label || item.vehicleName

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
                  field: "vehicleName",
                  headerName: t("text.VehicleTypeName"),
                  flex: .8,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "sessionD1",
                  headerName: t("text.FirstSessionFuel"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "sessionD2",
                  headerName: t("text.SecondSessionFuel"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "petroName",
                  headerName: t("text.Petrolpump"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "effectiveDate",
                  headerName: t("text.EffectiveDate"),
                  flex: .8,
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
                  {t("text.VehicleTypeInfo")}
               </Typography>
               <Divider />
               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster && <ToastApp />}
                  <Grid container spacing={2}>

                     {/* Effective Date */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EffectiveDate")}
                                 required={false}
                              />
                           }
                           type="date"
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="effectiveDate"
                           id="effectiveDate"
                           value={formik.values.effectiveDate}
                           placeholder={t("text.EffectiveDate")}
                           onChange={(e) => {
                              formik.setFieldValue("effectiveDate", e.target.value);
                           }}
                           InputLabelProps={{ shrink: true }}
                        />
                     </Grid>

                     {/* Vehicle Type*/}
                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={vehicleTypeOption}
                           value={vehicleValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("vehicleTypeId", newValue?.value);
                              formik.setFieldValue("vehicleName", newValue?.label);
                              setVehicleValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectVehicleType")} required={true} />}
                                 name="vehicleName"
                                 id="vehicleName"
                                 placeholder={t("text.SelectVehicleType")}
                              />
                           )}
                        />

                        {formik.touched.vehicleName && formik.errors.vehicleName && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.vehicleName}</div>
                        )}

                     </Grid>


                     {/* Shift fuel 1 */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.FirstSessionFuel")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="sessionD1"
                           id="sessionD1"
                           value={formik.values.sessionD1}
                           placeholder={t("text.FirstSessionFuel")}
                           onChange={(e) => {
                              formik.setFieldValue("sessionD1", e.target.value);
                           }}
                        />
                     </Grid>

                     {/* Shift fuel 2 */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.SecondSessionFuel")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="sessionD2"
                           id="sessionD2"
                           value={formik.values.sessionD2}
                           placeholder={t("text.SecondSessionFuel")}
                           onChange={(e) => {
                              formik.setFieldValue("sessionD2", e.target.value);
                           }}
                        />
                     </Grid>

                     {/* Petrol Pump */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={petrolPumpOption}
                           value={petroValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("petroId", newValue?.value);
                              formik.setFieldValue("petroName", newValue?.label);
                              setPetroValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.PetrolPump")} required={true} />}
                                 name="petroName"
                                 id="petroName"
                                 placeholder={t("text.PetrolPump")}
                              />
                           )}
                        />
                        {formik.touched.petroName && formik.errors.petroName && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.petroName}</div>
                        )}
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
