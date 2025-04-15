
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
import { DEFAULT_DESKTOP_MODE_MEDIA_QUERY } from "@mui/x-date-pickers";
interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}
export default function BrandMaster() {
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const userId = getId();

   const { defaultValuestime } = getISTDate();
   const [toaster, setToaster] = useState(false);


   const [isbrandShortName, setIsbrandShortName] = useState(false);
   const getPageSetupData = async () => {
      await api.get(`Setting/GetPageSetupDataall`).then((res) => {
         const data = res.data.data;
         const pageSetup = data.find((e: any) => e.setupId === 1);
         setIsbrandShortName(pageSetup?.showHide ?? true); // Default to true only if undefined
      });
   };
   // const getPageSetupData = async () => {
   //    await api.get(`Setting/GetPageSetupDataall`).then((res) => {
   //       const data = res.data.data;
   //       data.map((e: any, index: number) => {
   //          if (e.setupId === 1 && e.showHide) {
   //             setIsbrandShortName(true);
   //          } else if (e.setupId === 1 && !e.showHide) {
   //             setIsbrandShortName(false);
   //          } else {
   //             setIsbrandShortName(true);
   //          }
   //       })
   //    });
   //    //return response;
   // }


   useEffect(() => {
      getPageSetupData();
      const timeout = setTimeout(() => {
         //getPageSetupData();
         fetchBrandData();
      }, 100);
      return () => clearTimeout(timeout);
   }, [isLoading]);


   const formik = useFormik({
      initialValues:
      {
         "brandId": 0,
         "brandname": "",
         "brandshortname": "",
         "brandCode": "",
         "createdBy": userId,
         "updatedBy": userId,
         "createdOn": defaultValuestime,
         "updatedOn": defaultValuestime,
         "srno": 0
      },

      validationSchema: Yup.object({
         brandname: Yup.string()
            .required(t("text.reqBrandName")),
         brandCode: Yup.string()
            .required(t("text.reqBrandCode")),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post(`Master/UpsertBrand`, values);
            if (response.data.status === 1) {
               formik.resetForm();
               setToaster(false);
               toast.success(response.data.message);
            } else {
               setToaster(true);
               toast.error(response.data.message);
            }
            fetchBrandData();

         } catch (error) {
            setToaster(true);
            toast.error("An error occurred while saving. Please try again.");
            console.error("API Error:", error);
         }
      },
   });

   const handleEdit = (row: any) => {
      console.log("row:--", row);
      formik.setFieldValue("brandId", row.brandId);
      formik.setFieldValue("brandname", row.brandname);
      formik.setFieldValue("brandCode", row.brandCode);
      formik.setFieldValue("brandshortname", row.brandshortname);
   }


   let delete_id = "";
   let delete_name = "";
   const accept = () => {
      const collectData = {
         "brandId": delete_id,
         "brandname": delete_name,
         "brandshortname": "",
         "brandCode": "",
         "createdBy": "adminvm",
         "updatedBy": "adminvm",
         "createdOn": defaultValuestime,
         "updatedOn": defaultValuestime,
         "srno": 0
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`Master/DeleteBrand`, collectData)
         .then((response) => {
            if (response.data.status === 1) {
               toast.success(response.data.message);
            } else {
               toast.success(response.data.message);
            }
            fetchBrandData();
         });
   };
   const reject = () => {
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (row: any) => {
      delete_id = row.brandId;
      delete_name = row.brandname;
      confirmDialog({
         message: "Do you want to delete this record ?",
         header: "Delete Confirmation",
         icon: "pi pi-info-circle",
         acceptClassName: "p=-button-danger",
         accept,
         reject,
      });
   };




   const fetchBrandData = async () => {
      try {
         const response = await api.get(
            `Master/GetBrand?brandid=-1`,
            //{ headers: { "brandid": -1 } }
         );
         const data = response.data.data;
         const arr = data.map((Item: any, index: any) => ({
            ...Item,
            serialNo: index + 1,
            id: Item.brandId,
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
                  field: "brandname",
                  headerName: t("text.Brandname"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "brandCode",
                  headerName: t("text.Brandcode"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               ...(isbrandShortName ? [{
                  field: "brandshortname",
                  headerName: t("text.BrandShortname"),
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
                  {t("text.BrandMaster")}
               </Typography>
               <Divider />
               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster && <ToastApp />}
                  <Grid container spacing={2}>

                     {/* Brand name */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.BrandName")}
                                 required={true}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="brandname"
                           id="brandname"
                           value={formik.values.brandname}
                           placeholder={t("text.BrandName")}
                           onChange={(e) => {
                              formik.setFieldValue("brandname", e.target.value)
                           }}
                        />
                        {formik.touched.brandname && formik.errors.brandname && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.brandname}</div>
                        )}

                     </Grid>


                     {/* Brand Code */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.BrandCode")}
                                 required={true}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="brandCode"
                           id="brandCode"
                           value={formik.values.brandCode}
                           placeholder={t("text.BrandCode")}
                           onChange={(e) => {
                              formik.setFieldValue("brandCode", e.target.value)
                           }}
                        />
                        {formik.touched.brandCode && formik.errors.brandCode && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.brandCode}</div>
                        )}

                     </Grid>

                     {/* Brand Short Name */}
                     <Grid item xs={12} sm={4} lg={4}>
                        {(isbrandShortName) ? (<TextField
                           label={
                              <CustomLabel
                                 text={t("text.BrandShortName")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="brandshortname"
                           id="brandshortname"
                           value={formik.values.brandshortname}
                           placeholder={t("text.BrandShortName")}
                           onChange={(e) => {
                              formik.setFieldValue("brandshortname", e.target.value)
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
