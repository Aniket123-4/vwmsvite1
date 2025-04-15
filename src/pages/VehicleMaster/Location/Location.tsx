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
export default function Location() {
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
      fetchLocationData();
   }, [isLoading]);



   const formik = useFormik({
      initialValues:
      {
         "sno": 0,
         "locID": 0,
         "locName": "",
         "parentID": 0,
         "createdBy": userId,
         "updatedBy": userId,
         "createdOn": defaultValuestime,
         "updatedOn": defaultValuestime,
         "srNo": 0
      },

      validationSchema: Yup.object({
         locName: Yup.string()
            .required(t("text.reqLocName")),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post(`Master/UpsertLocationMaster`, values);
            if (response.data.status === 1) {
               formik.resetForm();
               setToaster(false);
               toast.success(response.data.message);
            } else {
               setToaster(true);
               toast.error(response.data.message);
            }
            fetchLocationData();

         } catch (error) {
            setToaster(true);
            toast.error("An error occurred while saving. Please try again.");
            console.error("API Error:", error);
         }
      },
   });

   const handleEdit = (row: any) => {
      console.log("row:--", row);
      formik.setFieldValue("locID", row.locID);
      formik.setFieldValue("locName", row.locName);
      formik.setFieldValue("parentID", row.parentID);
   }


   let delete_id = "";
   const accept = () => {
      const collectData = {
         locID: delete_id
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`Master/DeleteLocationMaster`, collectData)
         .then((response) => {
            if (response.data.isSuccess) {
               toast.success(response.data.message);
            } else {
               toast.success(response.data.message);
            }
            fetchLocationData();
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




   const fetchLocationData = async () => {
      try {
         const collectData = {
            "locID": -1
         };
         const response = await api.post(`Master/GetLocationMaster`, collectData);
         const data = response.data.data;
         console.log("🚀 ~ fetchLocationData ~ response.data.data:", response.data.data)
         const arr = data.map((Item: any, index: any) => ({
            ...Item,
            serialNo: index + 1,
            id: Item.locID,
            label: Item.locName,

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
                  field: "locName",
                  headerName: t("text.LocationName"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "label",
                  headerName: t("text.ParentLocation"),
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
                  {t("text.Location")}
               </Typography>
               <Divider />
               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster && <ToastApp />}
                  <Grid container spacing={2}>

                     {/* location name */}
                     <Grid item xs={12} sm={6} lg={6}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.LocationName")}
                                 required={true}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="routeDate"
                           id="routeDate"
                           value={formik.values.locName}
                           placeholder={t("text.LocationName")}
                           onChange={(e) => {
                              formik.setFieldValue("locName", e.target.value);
                           }}
                        />
                        {formik.touched.locName && formik.errors.locName && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.locName}</div>
                        )}
                     </Grid>


                     {/* parent location */}
                     <Grid item xs={12} sm={6} lg={6}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={item}
                           //value={zoneValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("parentID", newValue?.id);

                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.ParentLocation")} required={false} />}
                                 name="parentID"
                                 id="parentID"
                                 placeholder={t("text.ParentLocation")}
                              />
                           )}
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
