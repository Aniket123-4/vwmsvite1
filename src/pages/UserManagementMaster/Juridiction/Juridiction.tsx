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
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function Juridiction() {
   const { i18n, t } = useTranslation();
   const { defaultValues, defaultValuestime } = getISTDate();

   const [columns, setColumns] = useState<any>([]);
   const [rows, setRows] = useState<any>([]);
   const [editId, setEditId] = useState(0);
   const location = useLocation();
   const [isLoading, setIsLoading] = useState(true);
   const [permissionData, setPermissionData] = useState<MenuPermission>({
      isAdd: false,
      isEdit: false,
      isPrint: false,
      isDel: false,
   });
   const [lang, setLang] = useState<Language>("en");

   useEffect(() => {

      getList();
   }, [isLoading]);

   let delete_id = "";
   let del_name = "";
   let del_loc = "";
   const accept = () => {
      const collectData = {
         nodeId: delete_id,
         nodeName: del_name,
         "parentId": 0,
         "displayNo": 0,
         location: del_loc
      };
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`Auth/DeleteNode`, collectData)
         .then((response) => {
            if (response.data.status === 1) {
               toast.success(response.data.message);
            } else {
               toast.error(response.data.message);
            }
            getList();
         });
   };

   const reject = () => {
      // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (row: any) => {
      delete_id = row.nodeId;
      del_name = row.nodeName;
      del_loc = row.location;
      confirmDialog({
         message: "Do you want to delete this record ?",
         header: "Delete Confirmation",
         icon: "pi pi-info-circle",
         acceptClassName: "p=-button-danger",
         accept,
         reject,
      });
   };

   const getList = () => {
      try {
         api.get(`Auth/GetAllNodes`).then((res) => {
            console.log("result" + JSON.stringify(res.data.data));
            const data = res.data.data;
            const arr = data.map((item: any, index: any) => ({
               ...item,
               serialNo: index + 1,
               id: item.nodeId,
            }));
            setRows(arr);
            setIsLoading(false);
            if (data.length > 0) {
               const columns: GridColDef[] = [
                  {
                     field: "actions",
                     headerClassName: "MuiDataGrid-colCell",
                     headerName: t("text.Action"),
                     width: 150,

                     renderCell: (params) => {
                        console.log("Is Edit Allowed:", permissionData?.isEdit);
                        return [
                           <Stack
                              spacing={1}
                              direction="row"
                              sx={{ alignItems: "center", marginTop: "5px" }}
                           >
                              {/* {permissionData?.isEdit ? (  */}
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
                     )}  */}
                              {/* {permissionData?.isDel ? (  */}
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
                              {/* ) : ( 
                        "" 
                      )}  */}
                           </Stack>,
                        ];
                     },
                  },

                  {
                     field: "serialNo",
                     headerName: t("text.SrNo"),
                     flex: 1,
                     headerClassName: "MuiDataGrid-colCell",
                  },
                  {
                     field: "nodeName",
                     headerName: t("text.Juridiction"),
                     flex: 1,
                     headerClassName: "MuiDataGrid-colCell",
                  },
                  {
                     field: "location",
                     headerName: t("text.Location"),
                     flex: 1,
                     headerClassName: "MuiDataGrid-colCell",
                  },
               ];
               setColumns(columns as any);
            }
         });
         // setIsLoading(false);
      } catch (error) {
         console.error("Error fetching data:", error);
         // setIsLoading(false);
      }
   };

   const validationSchema = Yup.object({
      nodeName: Yup.string().required(
         t("text.reqJuridiction"),
      ),
   });

   const [toaster, setToaster] = useState(false);

   const formik = useFormik({
      initialValues: {
         "nodeId": 0,
         "nodeName": "",
         "parentId": 0,
         "displayNo": 0,
         "location": ""
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
         values.nodeId = editId;

         const response = await api.post(`Auth/UpsertNode`, values);
         if (response.data.status === 1) {
            setToaster(false);
            toast.success(response.data.message);
            formik.resetForm();
            getList();
            setEditId(0);
         } else {
            setToaster(true);
            toast.error(response.data.message);
         }
      },
   });

   const requiredFields = ["countryName"];

   const routeChangeEdit = (row: any) => {
      formik.setFieldValue("nodeName", row.nodeName);
      formik.setFieldValue("location", row.location);
      setEditId(row.id);
   };

   const handleSubmitWrapper = async () => {
      await formik.handleSubmit();
   };

   const handleConversionChange = (params: any, text: string) => {
      formik.setFieldValue(params, text);
   };

   return (
      <>
         <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
            <Card
               style={{
                  width: "100%",
                  height: "50%",
                  backgroundColor: "#E9FDEE",
                  border: ".5px solid #2B4593 ",
                  marginTop: "5px",
               }}
            >
               <Paper
                  sx={{
                     width: "100%",
                     overflow: "hidden",

                  }}
                  style={{ padding: "10px" }}
               >
                  <ConfirmDialog />

                  <Grid item xs={12} container spacing={2}>
                     <Grid item lg={10} md={10} xs={12}>
                        <Typography
                           gutterBottom
                           variant="h5"
                           component="div"
                           sx={{ padding: "20px" }}
                           align="left"
                        >
                           {t("text.Juridiction")}
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
                  <form onSubmit={formik.handleSubmit}>
                     <Grid item xs={12} container spacing={2}>
                        <Grid item xs={5}>
                           <TranslateTextField
                              label={t("text.EnterJuridiction")}
                              value={formik.values.nodeName}
                              onChangeText={(text: string) => handleConversionChange("nodeName", text)}
                              required={true}
                              lang={lang}
                              suggestions={["Suggestion 1", "Suggestion 2", "Suggestion 3"]} // Example suggestions
                              onBlur={() => {
                                 formik.setFieldTouched("nodeName", true);
                              }}
                           />

                           {/* <TranslateTextField
                    label={t("text.EnterCountryName")}
                    value={formik.values.countryName}
                    onChangeText={(text: string) =>
                      handleConversionChange("countryName", text)
                    }
                    required={true}
                    lang={lang}
                  /> */}
                           {/* <TextField
                    label={<CustomLabel text={t("text.EnterCountryName")} required={true} />}
                    value={formik.values.countryName}
                    placeholder={t("text.EnterCountryName")}
                    size="small"
                    fullWidth
                    name="countryName"
                    id="countryName"
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  /> */}

                           {formik.touched.nodeName && formik.errors.nodeName ? (
                              <div style={{ color: "red", margin: "5px" }}>
                                 {formik.errors.nodeName}
                              </div>
                           ) : null}
                        </Grid>

                        <Grid item xs={5}>
                           <TextField
                              label={<CustomLabel text={t("text.EnterLocation")} />}
                              value={formik.values.location}
                              placeholder={t("text.EnterLocation")}
                              size="small"
                              fullWidth
                              name="location"
                              id="location"
                              style={{ backgroundColor: "white" }}
                              onChange={(e) => {
                                 formik.setFieldValue("location", e.target.value);
                              }}
                           />

                           {/* <TextField
                    label={<CustomLabel text={t("text.EnterCountryCode")} />}
                    value={formik.values.countryCode}
                    placeholder={t("text.EnterCountryCode")}
                    size="small"
                    fullWidth
                    name="countryCode"
                    id="countryCode"
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  /> */}
                        </Grid>
                        <Grid item xs={2} sx={{ m: -1 }}>
                           {editId === 0 && (
                              // {editId === -1 && permissionData?.isAdd && (
                              <ButtonWithLoader
                                 buttonText={t("text.save")}
                                 onClickHandler={handleSubmitWrapper}
                                 fullWidth={true}
                              />
                           )}

                           {editId !== 0 && (
                              <ButtonWithLoader
                                 buttonText={t("text.update")}
                                 onClickHandler={handleSubmitWrapper}
                                 fullWidth={true}
                              />
                           )}
                        </Grid>
                     </Grid>
                  </form>
                  {/* </Grid> */}
                  <Typography
                     variant="h6"
                     component="div"
                     sx={{ flexGrow: 1 }}
                  ></Typography>
                  {/* </Stack> */}
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
                     <DataGrids
                        isLoading={isLoading}
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialPageSize={5}
                     />
                  )}
               </Paper>
            </Card>
         </Grid>
         <ToastApp />
      </>
   );
}
