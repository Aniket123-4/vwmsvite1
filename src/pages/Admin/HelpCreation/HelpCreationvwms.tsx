import Paper from "@mui/material/Paper";
import React from "react";
import { useEffect, useState } from "react";
import {
   Button,
   Card,
   Grid,
   TextField,
   Typography,
   Divider,
   Box,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { ConfirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { toast, ToastContainer } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import { Language, ReactTransliterate } from "react-transliterate";
import api from "../../../utils/Url";
import Languages from "../../../Languages";
import DataGrids from "../../../utils/Datagrids";

const style = {
   position: "absolute" as "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: "180vh",
   height: "85vh",
   bgcolor: "#f5f5f5",
   border: "1px solid #000",
   boxShadow: 24,
   p: 4,
   borderRadius: 10,
};

export default function HelpCreation() {
   const { i18n, t } = useTranslation();

   const [isLoading, setIsLoading] = useState(true);
   const [lang, setLang] = useState<Language>("en");

   const [PageTitle, setPageTitle] = useState([
      { value: "-1", label: t("text.PageTitle"), parentId: -1, pageUrl: "" },
   ]);

   const [totalFile, setTotalFile] = useState([]);
   const [columns, setColumns] = useState<any>([]);

   const [editorContent, setEditorContent] = useState<string>("");

   const handleEditorChange = (content: any) => {
      setEditorContent(content);
   };


   useEffect(() => {
      fetchTotalFile();
      getFileTypeData();
   }, []);

   const getFileTypeData = () => {
      const collectData = {
         "menuId": -1
      }
      api.post(`Menu/GetMenuMaster`, collectData).then((res) => {
         console.log("result" + JSON.stringify(res.data.data));
         const data = res.data.data;
         const arr = data.map((item: any, index: any) => ({
            value: item.menuId,
            label: item.menuName,
            parentId: item.parentId,
            pageUrl: item.pageUrl
         }));
         setPageTitle(arr);
      });
   };

   const fetchTotalFile = async () => {
      try {
         const collectData = {
            menuId: -1,
         };
         console.log("collectData", collectData);
         const response = await api.post(
            `Auth/GetHelpMenu`,
            collectData
         );

         console.log("result", response.data.data);
         const data = response.data.data;
         const DocsWithIds = data.map((doc: any, index: any) => ({
            ...doc,
            serialNo: index + 1,
            id: doc.menuId,
         }));

         setTotalFile(DocsWithIds);
         setIsLoading(false);

         if (data.length > 0) {
            const columns: GridColDef[] = [
               {
                  field: "serialNo",
                  headerName: t("text.SrNo"),
                  width: 120,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "helpedit",
                  headerName: t("text.Description"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "menuName",
                  headerName: t("text.PageName"),
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

   const [toaster, setToaster] = useState(false);

   const formik = useFormik({
      initialValues: {
         "sno": 0,
         "menuId": 0,
         "menuName": "",
         "parentId": null,
         "pageUrl": "",
         "icon": "",
         "displayNo": 0,
         "isMenu": true,
         "isAdd": true,
         "isEdit": true,
         "isDel": true,
         "isView": true,
         "isPrint": true,
         "isExport": true,
         "isRelease": true,
         "isPost": true,
         "helpedit": "",
         "childId": 0,
         "parentName": ""
      },

      onSubmit: async (values) => {
         values.helpedit = editorContent;
         console.log("checktext", values);
         const response = await api.post(`Auth/UpsertHelpMenu`, values);
         if (response.data.status === 1) {
            setToaster(false);
            toast.success(response.data.message);
            formik.resetForm();
            setEditorContent("");
            fetchTotalFile();
         } else {
            setToaster(true);
            toast.error(response.data.message);
         }
      },
   });
   const handleTransliterateChange = (text: string) => {
      setEditorContent(text);
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

                  <Grid item xs={12} container spacing={1}>
                     <Grid item lg={10} md={10} xs={12}>
                        <Typography
                           gutterBottom
                           variant="h5"
                           component="div"
                           sx={{ padding: "20px" }}
                           align="left"
                        >
                           {t("text.HelpCreation")}
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
                     <Grid item xs={12} container spacing={3}>
                        <Grid xs={12} sm={4} item>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={PageTitle}
                              value={
                                 PageTitle.find(
                                    (option: any) =>
                                       option.value === formik.values.menuId
                                 ) || null
                              }
                              fullWidth
                              size="small"
                              onChange={(event, newValue: any) => {
                                 console.log(newValue?.value);
                                 const rowdata = totalFile.find(
                                    (x: any) => x.menuId === newValue?.value
                                 );
                                 if (rowdata) {
                                    setEditorContent(rowdata["helpedit"]);
                                 }

                                 // setEditorContent(rowdata['frontDesign']);
                                 formik.setFieldValue("menuId", newValue?.value);
                                 formik.setFieldValue("menuName", newValue?.label);
                                 formik.setFieldValue("parentId", newValue?.parentId);
                                 formik.setFieldValue("pageUrl", newValue?.pageUrl);

                                 formik.setFieldTouched("menuId", true);
                                 formik.setFieldTouched("menuId", false);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.PageTitle")} />}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                           <ReactTransliterate
                              renderComponent={(props: any) => (
                                 <ReactQuill
                                    {...props}
                                    value={editorContent}
                                    onChange={handleEditorChange}
                                    modules={modules}
                                    formats={formats}
                                 />
                              )}
                              value={editorContent}
                              onChangeText={handleTransliterateChange}
                              lang={lang}
                           />
                        </Grid>

                        <Grid item lg={6} sm={6} xs={12}>
                           <Grid>
                              <Button
                                 type="submit"
                                 fullWidth
                                 style={{
                                    backgroundColor: "#059669",
                                    color: "white",
                                    marginTop: "10px",
                                 }}
                              >
                                 {t("text.save")}
                              </Button>
                           </Grid>
                        </Grid>

                        <Grid item lg={6} sm={6} xs={12}>
                           <Button
                              type="reset"
                              fullWidth
                              style={{
                                 backgroundColor: "#F43F5E",
                                 color: "white",
                                 marginTop: "10px",
                              }}
                              onClick={(e) => {
                                 formik.resetForm();
                                 setEditorContent("");
                              }}
                           >
                              {t("text.reset")}
                           </Button>
                        </Grid>

                        
                     </Grid>
                  </form>
               </Paper>
            </Card>
         </Grid>
         <ToastContainer />
         <ToastApp />
      </>
   );
}

const modules = {
   toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video", "formula"],
      ["clean"],
   ],
};

const formats = [
   "header",
   "font",
   "size",
   "bold",
   "italic",
   "underline",
   "strike",
   "color",
   "background",
   "script",
   "list",
   "bullet",
   "indent",
   "align",
   "link",
   "image",
   "video",
   "formula",
   "code-block",
];
