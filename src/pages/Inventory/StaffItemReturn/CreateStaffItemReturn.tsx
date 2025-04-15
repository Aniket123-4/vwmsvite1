// import {
//     Autocomplete,
//     Button,
//     Card,
//     CardContent,
//     Grid,
//     Divider, Table,
//     MenuItem,
//     TextField,
//     Typography,
//     TextareaAutosize,
//     FormControlLabel,
//     Checkbox,
//     RadioGroup,
//     Radio,
//     TableCell,
//     TableRow,
//     TableBody,
//     TableContainer,
//     TableHead,
//     Paper,
//     AutocompleteRenderInputParams,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Dialog,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import axios from "axios";
// import { Navigate, useNavigate, useLocation } from "react-router-dom";
// import HOST_URL from "../../../utils/Url";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import CustomLabel from "../../../CustomLable";
// import api from "../../../utils/Url";
// import { Language } from "react-transliterate";
// import Languages from "../../../Languages";
// import DeleteIcon from '@mui/icons-material/Delete';
// import { getISTDate } from "../../../utils/Constant";
// import dayjs from "dayjs";

// type Props = {};

// const CreateStaffItemReturn = (props: Props) => {

//     const [openDialog, setOpenDialog] = useState(false);

//     const handleShowDetails = () => setOpenDialog(true);
//     const handleCloseDialog = () => setOpenDialog(false);
//     let navigate = useNavigate();
//     const { t } = useTranslation();
//     const [lang, setLang] = useState<Language>("en");
//     const { defaultValues } = getISTDate();
//     const [toaster, setToaster] = useState(false);
//     const [isIndentSelected, setIsIndentSelected] = useState(false);
//     const [selectedAction, setSelectedAction] = useState(null);
//     const [items, setItems] = useState<any>([]);
//     //const [tableData, setTableData] = useState<any>([]);
//     const [tableData, setTableData] = useState<any>([
//         {
//             "id": 0,
//             "returnId": 0,
//             "itemID": 0,
//             "batchNo": "",
//             "indentId": 0,
//             "returnQty": 0,
//             "issueQty": 0
//         },

//     ]);

//     const [tableDatai, setTableDatai] = useState<any>([
//         {
//             "id": 0,
//             "issueId": 0,
//             "itemID": 0,
//             "unitId": 0,
//             "batchNo": "",
//             "indentId": 0,
//             "reqQty": 0,
//             "issueQty": 0,
//             "itemName": "",
//             "unitName": "",
//             "returnItem": true,
//             "indentNo": "",
//             "stockQty": 0
//         },

//     ]);

//     console.log("🚀 ~ CreateStaffItemReturn ~ tableData:", tableData)
//     const [indentOptions, setIndentOptions] = useState([
//         { value: "-1", label: t("text.SelectindentNo") },
//     ]);
//     const [itemOption, setitemOption] = useState([
//         { value: -1, label: t("text.itemMasterId") },
//     ]);
//     // const [openDialog, setOpenDialog] = useState(false);
//     const [unitOptions, setUnitOptions] = useState([
//         { value: "-1", label: t("text.SelectUnitId") },
//     ]);

//     const [empOption, setempOption] = useState([
//         { value: "-1", label: t("text.empid") },
//     ]);
//     useEffect(() => {
//         GetIndentID();
//         GetitemData();
//         GetUnitData();
//         GetempData();
//     }, []);

//     const GetIndentID = async () => {
//         const collectData = {
//            "issueId":-1,"indentId":-1,"empId":-1

//         };

//         const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
//         const data = response.data.data;
//         console.log("indent option", data)
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["indentNno"] || 0,
//                 value: data[index]["issueId"] || "",

//             });
//         };
//         setIndentOptions(arr);
//     };

//     const GetIndentIDById = async (id1: any) => {
//         const collectData = {
//             "issueId":id1,"indentId":-1,"empId":-1
//         };

//         try {
//             const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
//         const data = response.data.data[0]['itemIssueDetail'];
//         formik.setFieldValue('itemIssueDetail', data);

//             console.log("Fetched Data from API:", data);

//             const indentDetails = data.map((item: any, index: any) => ({
//                 id: index + 1,
//                 issueId: 0,
//                 itemID: item.itemId || 0,
//                 unitId: item.unitId || 0,
//                 batchNo: item.batchNo || "",
//                 indentId: id1,
//                 reqQty: item.quantity || 0,
//                 issueQty: item.approveQuantity || 0,
//                 itemName: item.itemName || "",
//                 unitName: item.unitName || "",
//                 indentNo: item.indentNo || "",
//                 stockQty: item.stockQty || 0,
//                 returnItem: true,
//             }));

//             console.log("Transformed Data for tableDatai:", indentDetails);

//             setTableDatai(indentDetails); // Set transformed data to tableDatai
//             setIsIndentSelected(indentDetails.length > 0); // Show table if data exists
//         } catch (error) {
//             console.error("Error fetching indent details:", error);
//             setTableDatai([]);
//             setIsIndentSelected(false);
//         }
//     };

//     console.log("check table", tableData)
//     const [showIndentField, setShowIndentField] = useState(false);
//     const GetitemData = async () => {
//         const collectData = {
//             itemMasterId: -1,
//         };
//         const response = await api.get(`ItemMaster/GetItemMaster`, {});
//         const data = response.data.data;
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["itemName"],
//                 value: data[index]["itemMasterId"],
//             });
//         };
//         setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
//     };
//     const GetUnitData = async () => {

//         const collectData = {
//             unitId: -1,
//         };
//         const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
//         const data = response.data.data;
//         const arr = [];
//         for (let index = 0; index < data.length; index++) {
//             arr.push({
//                 label: data[index]["unitName"],
//                 value: data[index]["unitId"],
//             });
//         }
//         setUnitOptions(arr);
//     };
//     const GetempData = async () => {
//         const collectData = {
//             empid: -1,
//             userId: "",

//         };
//         const response = await api.post(`Employee/GetEmployee`, collectData);
//         const data = response.data.data;
//         console.log('data', data)
//         const arr = data.map((item: any) => ({
//             label: item?.empName,
//             value: item?.empid

//         }))

//         setempOption(arr);
//     };

//     const handleActionChange = (event: any) => {
//         setSelectedAction(event.target.value);
//     };

//     const validateRow = (row: any) => {
//         // return row.itemName && row.unitId && row.reqQty >= 1;
//     };

//     const formik = useFormik({
//         initialValues: {
//             "returnId": 0,
//             "returnDate": defaultValues,
//             "returnType": "",
//             "returnIndentNo": "",
//             "createdBy": "",
//             "updatedBy": "",
//             "createdOn": defaultValues,
//             "updatedOn": defaultValues,
//             itemIssueDetail: [],
//             itemReturnDetail: []

//         },

//         // validationSchema: Yup.object({
//         //     indentNo: Yup.string()
//         //         .required(t("text.reqIndentNum")),
//         //     // empId: Yup.string()
//         //     //     .required(t("text.reqEmpName")),
//         // }),

//         onSubmit: async (values) => {
//             // Filter and format itemReturnDetail
//             const formattedItemReturnDetail = tableData.map((row: any) => ({
//                 id: row.id || 0,
//                 returnId: row.returnId || 0,
//                 itemID: row.itemID || 0,
//                 batchNo: row.batchNo || "",
//                 indentId: row.indentId || 0,
//                 returnQty: row.returnQty || 0,
//                 issueQty: row.issueQty || 0,
//             }));

//             // Prepare payload
//             const payload = {
//                 ...values,
//                 itemReturnDetail: formattedItemReturnDetail, // Ensure proper structure
//                 itemIssueDetail: tableDatai,                // Use as-is
//             };

//             console.log("Payload to Submit:", payload);

//             try {
//                 const response = await api.post(`Master/UpsertItemReturn`, payload);

//                 if (response.data.status === 1) {
//                     toast.success(response.data.message);
//                     navigate("/Inventory/StaffItemReturn");
//                 } else {
//                     toast.error(response.data.error?.errorMessage || "Submission failed!");
//                 }
//             } catch (error) {
//                 console.error("Error during submission:", error);
//                 toast.error("Failed to submit data. Please check the console for details.");
//             }
//         },

//     });

//     const handleOpenDialog = () => {
//         setOpenDialog(true);
//     };

//     const handleInputChange = (index: any, field: any, value: any) => {
//         const newData: any = [...tableData];
//         newData[index][field] = value;

//         if (field === 'returnId') {
//             newData[index].returnId = newData[index].returnId;
//             //  newData[index].serviceName = serviceOption[serviceOption.findIndex(e => e.value == newData[index].serviceId)].label;
//         }

//         if (field === 'itemID') {
//             newData[index].itemID = newData[index].itemID;
//         }
//         if (field === 'batchNo') {
//             newData[index].batchNo = newData[index].batchNo;
//             // newData[index].vendorName = vendorOption[vendorOption.findIndex(e => e.value == newData[index].vendorId)].label;
//         }
//         if (field === 'indentId') {
//             newData[index].indentId = newData[index].indentId;
//         }
//         if (field === 'returnQty') {
//             newData[index].returnQty = newData[index].returnQty;
//         }
//         if (field === 'issueQty') {
//             newData[index].issueQty = newData[index].issueQty;
//         }

//         //  newData[index].jobCardId = formik.values.jobCardId;

//         newData[index].id = index;
//         setTableData(newData);

//         if (newData[index].itemID && newData[index].batchNo && newData[index].indentId) {
//             if (index === tableData.length - 1) {
//                 addRow();

//             }
//         }

//     };

//     const handleInputChange1 = (index: any, field: any, value: any) => {
//         const newData: any = [...tableDatai];
//         newData[index][field] = value;

//         if (field === 'itemID') {
//             newData[index].itemID = newData[index].itemID;
//             // newData[index].serviceName = serviceOption[serviceOption.findIndex(e => e.value == newData[index].serviceId)].label;
//         }

//         if (field === 'unitId') {
//             newData[index].unitId = newData[index].unitId;
//         }

//         if (field === 'batchNo') {
//             newData[index].batchNo = newData[index].batchNo;
//         }

//         // newData[index].jobCardId = formik.values.jobCardId;

//         newData[index].id = index;
//         setTableDatai(newData);

//         if (newData[index].itemID && newData[index].unitId && newData[index].batchNo) {
//             if (index === tableDatai.length - 1) {
//                 handleAddItem();

//             }
//         }

//     };

//     const deleteRow = (index: number) => {
//         const updatedData = tableData.filter((_: any, i: number) => i !== index);
//         setTableData(updatedData);
//     };
//     const deleteRow1 = (index: number) => {
//         const updatedData1 = tableDatai.filter((_: any, i: number) => i !== index);
//         setTableDatai(updatedData1);
//     };

//     const [showTable, setShowTable] = useState(false); // State to control table visibility
//     const handleIndentChange = async (event: any, newValue: any) => {
//         if (newValue) {
//             console.log("Selected Indent:", newValue);
//             formik.setFieldValue("returnIndentNo", newValue.label.toString());
//             formik.setFieldValue("indentId", newValue.value);

//             await GetIndentIDById(newValue.value);

//             console.log("Updated tableDatai:", tableDatai);
//             console.log("Is Indent Selected:", isIndentSelected);
//         }
//     };

//     const back = useNavigate();

//     const addRow = () => {
//         setTableData([
//             ...tableData,
//             {
//                 "id": 0,
//                 "returnId": 0,
//                 "itemID": 0,

//                 "batchNo": "",
//                 "indentId": 0,
//                 "returnQty": 0,
//                 "issueQty": 0

//             },
//         ]);
//     };

//     const handleAddItem = () => {
//         setTableDatai([...tableDatai, {

//             "id": 0,
//             "issueId": -1,
//             "itemID": 0,
//             "unitId": 0,
//             "batchNo": "",
//             "indentId": 0,
//             "reqQty": 0,
//             "issueQty": 0,
//             "itemName": "",
//             "unitName": "",
//             "returnItem": true,
//             "indentNo": "",
//             "stockQty": 0
//         }]);
//     };
//     const handleAddIndent = () => {
//         // Merge `tableDatai` into `tableData` with additional fields like indentNo
//         const mergedData = [

//             ...tableDatai.map((item: any) => ({
//                 ...item,
//                 indentNo: formik.values.returnIndentNo,
//                 ...tableData,// Add the selected indent number
//             })),
//         ];

//         // Remove duplicates by ensuring unique `itemID`
//         const uniqueData = mergedData.filter(
//             (item, index, self) =>
//                 index === self.findIndex((t) => t.itemID === item.itemID)
//         );

//         setTableData(uniqueData); // Update tableData with merged rows
//         setOpenDialog(false);     // Close the dialog
//     };

//     return (
//         <div>
//             <div
//                 style={{
//                     padding: "-5px 5px",
//                     backgroundColor: "#ffffff",
//                     borderRadius: "5px",
//                     border: ".5px solid #FF7722",
//                     marginTop: "3vh",
//                 }}
//             >
//                 <CardContent>

//                     <Grid item xs={12} container spacing={2} >
//                         <Grid item lg={2} md={2} xs={2} marginTop={2}>
//                             <Button
//                                 type="submit"
//                                 onClick={() => back(-1)}
//                                 variant="contained"
//                                 style={{
//                                     backgroundColor: "blue",
//                                     width: 20,
//                                 }}
//                             >
//                                 <ArrowBackSharpIcon />
//                             </Button>
//                         </Grid>
//                         <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
//                             <Typography
//                                 gutterBottom
//                                 variant="h5"
//                                 component="div"
//                                 sx={{ padding: "20px" }}
//                                 align="center"
//                             >
//                                 {t("text.createStaffItemReturn")}
//                             </Typography>
//                         </Grid>

//                         <Grid item lg={3} md={3} xs={3} marginTop={3}>
//                             <select
//                                 className="language-dropdown"
//                                 value={lang}
//                                 onChange={(e) => setLang(e.target.value as Language)}
//                             >
//                                 {Languages.map((l: any) => (
//                                     <option key={l.value} value={l.value}>
//                                         {l.label}
//                                     </option>
//                                 ))}
//                             </select>

//                         </Grid>
//                     </Grid>
//                     <Divider />
//                     <br />
//                     <form onSubmit={formik.handleSubmit}>
//                         {toaster === false ? "" : <ToastApp />}
//                         <Grid item xs={12} container spacing={2}>
//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="returnDate"
//                                     name="returnDate"
//                                     label={<CustomLabel text={t("text.returnDate")} required={false} />}
//                                     value={formik.values.returnDate}
//                                     placeholder={t("text.returnDate")}
//                                     size="small"
//                                     fullWidth
//                                     type="date"
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>
//                             <Grid item lg={2} xs={12}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleShowDetails}
//                                     style={{ height: "100%" }}
//                                 >
//                                     Show Details
//                                 </Button>
//                             </Grid>
//                             <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
//                                 <DialogTitle>Add Item</DialogTitle>
//                                 <DialogContent>
//                                     <p>Selected Indent No: {formik.values.returnIndentNo || "No Indent Selected"}</p>

//                                     {/* Autocomplete to Select Indent */}
//                                     <Grid item lg={4} xs={12}>
//                                         <Autocomplete
//                                             disablePortal
//                                             id="combo-box-demo"
//                                             options={indentOptions}
//                                             fullWidth
//                                             size="small"
//                                             onChange={(event: any, newValue: any) => {
//                                                 console.log("check value", newValue);
//                                                 if (newValue) {
//                                                     GetIndentIDById(newValue?.value);
//                                                     formik.setFieldValue("indentId", newValue?.value);
//                                                     formik.setFieldValue("returnIndentNo", newValue?.label?.toString() || "");
//                                                 }
//                                             }}
//                                             // value={
//                                             //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
//                                             // }
//                                             renderInput={(params: any) => (
//                                                 <TextField
//                                                     {...params}
//                                                     label="Search Indent"
//                                                     placeholder="Search for an indent..."
//                                                 />
//                                             )}
//                                         />
//                                     </Grid>
//                                     {isIndentSelected && tableDatai.length > 0 ? (
//     <Grid item xs={12}>
//         <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
//             <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black', marginTop: "2%" }}>
//                 <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
//                     <tr>
//                         <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
//                         <th style={{ border: '1px solid black', textAlign: 'center' }}>Item Name</th>
//                         <th style={{ border: '1px solid black', textAlign: 'center' }}>Unit</th>
//                         <th style={{ border: '1px solid black', textAlign: 'center' }}>Batch No</th>
//                         <th style={{ border: '1px solid black', textAlign: 'center' }}>Pending Qty</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tableDatai.map((row: any, index: any) => (
//                         <tr key={row.id} style={{ border: '1px solid black' }}>
//                             <td style={{ border: "1px solid black", textAlign: "center" }}>
//                                 <DeleteIcon
//                                     onClick={() => deleteRow1(index)}
//                                     style={{ cursor: "pointer" }}
//                                 />
//                             </td>

//                             <td style={{ border: "1px solid black" }}>{row.itemName}</td>
//                             <td style={{ border: "1px solid black" }}>{row.unitName}</td>
//                             <td style={{ border: "1px solid black" }}>{row.batchNo}</td>
//                             <td style={{ border: "1px solid black" }}>{row.issueQty}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     </Grid>
// ) : (
//     <p>No indent data available or indent not selected</p>
// )}

//                                     <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         onClick={handleAddIndent}
//                                         style={{ marginTop: "10px" }}
//                                     >
//                                         Add Indent
//                                     </Button>
//                                 </DialogContent>
//                                 <DialogActions>
//                                     <Button onClick={handleCloseDialog} color="primary">
//                                         Close
//                                     </Button>
//                                 </DialogActions>
//                             </Dialog>
//                             <Grid item xs={12}>
//                                 <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
//                                     <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
//                                         <tr>
//                                             <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
//                                             {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}></th> */}
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Item</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.indentNo")}</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Unit</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Batch No.</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>stockQty</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Pending Qty</th>
//                                             <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>Return Qty</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {tableData.map((row: any, index: any) => (
//                                             <tr key={row.id} style={{ border: '1px solid black' }}>
//                                                 <td
//                                                     style={{
//                                                         border: "1px solid black",
//                                                         textAlign: "center",
//                                                     }}
//                                                 >
//                                                     <DeleteIcon
//                                                         onClick={() => {
//                                                             if (tableData.length > 1) {
//                                                                 deleteRow(index)
//                                                             } else {
//                                                                 alert("Atleast one row should be there");
//                                                             }
//                                                         }}
//                                                         style={{ cursor: "pointer" }}
//                                                     />
//                                                 </td>
//                                                 <td style={{ border: "1px solid black" }}>{row.itemName}</td>

//                                                 <td
//                                                     style={{
//                                                         border: "1px solid black",

//                                                     }}
//                                                 >
//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={indentOptions}
//                                                         value={
//                                                             indentOptions.find((opt: any) => (opt.value) === parseInt(row?.indentId)) || null
//                                                         }
//                                                         fullWidth
//                                                         size="small"
//                                                         sx={{ width: "175px" }}
//                                                         onChange={(e: any, newValue: any) => {
//                                                             console.log(newValue?.value);
//                                                             handleInputChange(index, 'indentId', newValue?.value);
//                                                             handleInputChange(index, 'indentNo', newValue?.label);
//                                                         }}

//                                                         renderInput={(params: any) => (
//                                                             <TextField
//                                                                 {...params}

//                                                             />
//                                                         )}
//                                                     />
//                                                 </td>
//                                                 <td style={{ border: "1px solid black", textAlign: "center" }}>
//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={unitOptions}
//                                                         value={
//                                                             unitOptions.find((opt) => (opt.value) === row?.unitId) || null
//                                                         }
//                                                         fullWidth
//                                                         size="small"
//                                                         sx={{ width: "175px" }}
//                                                         onChange={(e, newValue: any) =>
//                                                             handleInputChange(index, "unitId", newValue?.value)
//                                                         }
//                                                         renderInput={(params: any) => (
//                                                             <TextField
//                                                                 {...params}
//                                                             //   label={<CustomLabel text={t("text.selectUnit")} />}
//                                                             />
//                                                         )}
//                                                     />
//                                                 </td>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                     <TextField
//                                                         //  type="number"
//                                                         size="small"
//                                                         // type="text"
//                                                         value={row.batchNo}
//                                                         onChange={(e) => handleInputChange(index, 'batchNo', (e.target.value)||"")}
//                                                         onFocus={e => e.target.select()}
//                                                   />
//                                                 </td>

//     <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                         <TextField
//                                                            // type="number"
//                                                             size="small"
//                                                             value={(row.issueQty - row.returnQty) ||0}

//                                                         />
//                                                     </td>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                     <TextField
//                                                         //type="number"
//                                                         size="small"
//                                                         // type="text"
//                                                         value={row.issueQty}
//                                                         onChange={(e) => handleInputChange(index, 'issueQty', parseFloat(e.target.value)||0)}
//                                                         onFocus={e => e.target.select()}
//                                                    />
//                                                 </td>
//                                                 <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
//                                                     <TextField
//                                                         //   type="number"
//                                                         size="small"
//                                                         // type="text"
//                                                         value={row.returnQty}
//                                                         onChange={(e) => handleInputChange(index, 'returnQty', parseFloat(e.target.value)||0)}
//                                                         onFocus={e => e.target.select()}
//                                                    />
//                                                 </td>

//                                             </tr>
//                                         ))}
//                                     </tbody>

//                                 </Table>
//                             </Grid>

//                             <Grid container spacing={2} >
//                                 <Grid item lg={6} sm={6} xs={12}>
//                                     <Button
//                                         type="submit"
//                                         fullWidth
//                                         style={{

//                                             backgroundColor: `var(--header-background)`,
//                                             color: "white",
//                                             marginTop: "10px",
//                                             marginLeft: "10px",
//                                         }}
//                                     >
//                                         {t("text.save")}
//                                     </Button>
//                                 </Grid>
//                                 <Grid item lg={6} sm={6} xs={12}>
//                                     <Button
//                                         type="reset"
//                                         fullWidth
//                                         style={{
//                                             backgroundColor: "#F43F5E",
//                                             color: "white",
//                                             marginTop: "10px",
//                                         }}
//                                         onClick={(e) => formik.resetForm()}
//                                     >
//                                         {t("text.reset")}
//                                     </Button>
//                                 </Grid>
//                             </Grid>

//                         </Grid>
//                     </form>
//                 </CardContent>
//             </div>
//         </div>
//     );
// };

// export default CreateStaffItemReturn;

import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
  MenuItem,
  TextField,
  Typography,
  TextareaAutosize,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  AutocompleteRenderInputParams,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";

type Props = {};

const CreateStaffItemReturn = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [isIndentSelected, setIsIndentSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [items, setItems] = useState<any>([]);
  //const [tableData, setTableData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([
    {
      id: 0,
      returnId: 0,
      itemID: 0,
      batchNo: "",
      indentId: 0,
      returnQty: 0,
      issueQty: 0,
    },
  ]);
  console.log("🚀 ~ CreateStaffItemReturn ~ tableData:", tableData);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
  ]);
  const [itemOption, setitemOption] = useState([
    { value: -1, label: t("text.itemMasterId") },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);

  const [empOption, setempOption] = useState([
    { value: "-1", label: t("text.empid") },
  ]);
  useEffect(() => {
    GetIndentID();
    GetitemData();
    GetUnitData();
    //  GetempData();
  }, []);

  const GetIndentID = async () => {
    const collectData = {
      issueId: -1,
      indentId: -1,
      empId: -1,
    };

    const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
    const data = response.data.data;
    console.log("indent option", data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["indentNno"] || 0,
        value: data[index]["issueId"] || "",
      });
    }
    setIndentOptions(arr);
  };

  const GetIndentIDById = async (itemID: any) => {
    const collectData = {
      issueId: itemID,
      indentId: -1,
      empId: -1,
    };
    const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
    const data = response.data.data[0]["itemIssueDetail"];
    formik.setFieldValue("itemIssueDetail", data);

    // console.log("indent option", data)
    // let arr: any = [];

    const indent = data.map((item: any, index: any) => ({
      id: index + 1,
      returnId: -1,
      indentId: item?.indentId || 0,
      batchNo: item?.batchNo || "",
      itemID: item?.itemID,
      issueQty: item?.issueQty,

      unitId: item?.unitId,

      unitName: item?.unitName,
      itemName: item?.itemName,
      returnQty: 0,

      srn: 0,
    }));

    setTableData(indent);
    setIsIndentSelected(true);
  };

  console.log("check table", tableData);

  const GetitemData = async () => {
    const collectData = {
      itemMasterId: -1,
    };
    const response = await api.get(`ItemMaster/GetItemMaster`, {});
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    }
    setitemOption(arr);
  };
  const GetUnitData = async () => {
    const collectData = {
      unitId: -1,
    };
    const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOptions(arr);
  };
  // const GetempData = async () => {
  //     const collectData = {
  //         "id": -1,
  //         "unit": -1
  //     };
  //     const response = await api.post(`StoreMaster/GetStoreMaster`, collectData);
  //     const data = response.data.data;
  //     console.log('data', data)
  //     const arr = data.map((item: any) => ({
  //         label: item.storeName,
  //         value: item.id,

  //     }))

  //     setempOption(arr);
  // };

  const handleActionChange = (event: any) => {
    setSelectedAction(event.target.value);
  };

  const validateRow = (row: any) => {
    // return row.itemName && row.unitId && row.reqQty >= 1;
  };

  const formik = useFormik({
    initialValues: {
      returnId: 0,
      // "storeId": 0,
      returnDate: new Date().toISOString().slice(0, 10),
      returnType: "Staff",
      returnIndentNo: "",
      createdBy: "adminvm",
      updatedBy: "adminvm",
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      itemReturnDetail: [],
      itemIssueDetail: [],
      srn: 0,
      // "storeName": ""
    },

    validationSchema: Yup.object({
      returnIndentNo: Yup.string().required(t("text.reqIndentNum")),
    }),

    onSubmit: async (values) => {
      const validTableData = tableData;
      values.itemReturnDetail = tableData;

      // if (validTableData.length === 0) {
      //     toast.error("Please add some data in table for further process");
      //     return;
      // }

      const response = await api.post(`Master/UpsertItemReturn`, values);

      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/itemreturn/staffitemreturn");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const handleInputChange = (index: any, field: any, value: any) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;

    // if (field === 'reqQty' || field === 'issueQty') {
    //     updatedData[index].stockQty = updatedData[index].reqQty - updatedData[index].issueQty;

    //     // console.log("stockQty",updatedData[index].stockQty, updatedData[index].reqQty,updatedData[index].issueQty)

    // }

    setTableData(updatedData);
  };

  const deleteRow = (index: number) => {
    const updatedData = tableData.filter((_: any, i: number) => i !== index);
    setTableData(updatedData);
  };

  const back = useNavigate();

  const addRow = () => {
    setTableData([
      ...tableData,
      {
        id: 0,
        issueId: -1,
        itemID: 0,
        batchNo: "",
        indentId: 0,
        unitId: 0,
        reqQty: 0,
        issueQty: 0,
        stockQty: 0,
        itemName: "",
        indentNo: "",
        srn: 0,
        unitName: "",
        returnItem: true,
      },
    ]);
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid
              item
              lg={7}
              md={7}
              xs={7}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.createStaffItemReturn")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l: any) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={indentOptions}
                  // value={
                  //   indentOptions.find(
                  //     (opt: any) =>
                  //       opt.value === parseInt(formik.values.returnIndentNo)
                  //   ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log("check value", newValue);
                    if (newValue) {
                      GetIndentIDById(newValue?.value);
                      // formik.setFieldValue("indentId", newValue?.value);
                      formik.setFieldValue(
                        "returnIndentNo",
                        newValue?.label?.toString() || ""
                      );
                    }
                  }}
                  // value={
                  //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
                  // }
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.enterIndentNo")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.returnIndentNo &&
                  formik.errors.returnIndentNo && (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.returnIndentNo}
                    </div>
                  )}
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={empOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("storeId", newValue?.value);
                                        formik.setFieldValue("storeName", newValue?.label);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectStore")} required={true} />}
                                        />
                                    )}
                                />

                            </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="returnDate"
                  name="returnDate"
                  label={
                    <CustomLabel text={t("text.ReturnDate")} required={false} />
                  }
                  value={formik.values.returnDate}
                  placeholder={t("text.issueDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {isIndentSelected && (
                <Grid item xs={12}>
                  <Table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid black",
                    }}
                  >
                    <thead style={{
                      backgroundColor: `var(--grid-headerBackground)`,
                      color: `var(--grid-headerColor)`
                    }}>
                      <tr>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {t("text.Action")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.itemName")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Unit")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Batchno")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.stockQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Qty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.ReturnQty")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row: any, index: any) => (
                        <tr key={row.id} style={{ border: "1px solid black" }}>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <AddCircleIcon
                              onClick={() => {
                                addRow();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteIcon
                              onClick={() => {
                                if (tableData.length > 1) {
                                  deleteRow(index);
                                } else {
                                  alert("Atleast one row should be there");
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              // textAlign: "center",
                              width: "30%",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={itemOption}
                              value={
                                itemOption.find(
                                  (opt) => opt.value === parseInt(row?.itemID)
                                ) || null
                              }
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "itemID",
                                  newValue?.value
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // label={
                                  //     <CustomLabel
                                  //         text={t("text.selectItem")}
                                  //         required={false}
                                  //     />
                                  // }
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "20%",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={unitOptions}
                              value={
                                unitOptions.find(
                                  (opt) => opt.value === row?.unitId
                                ) || null
                              }
                              fullWidth
                              size="small"
                              onChange={(e, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "unitId",
                                  newValue?.value
                                )
                              }
                              renderInput={(params: any) => (
                                <TextField
                                  {...params}
                                  // label={<CustomLabel text={t("text.selectUnit")} />}
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              //width: "150px"
                            }}
                          >
                            <TextField
                              value={row.batchNo || ""} // Bind to row.batchNo
                              id="BatchNo"
                              name="BatchNo"
                              size="small"
                              sx={{ width: "150px" }}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "batchNo",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            <TextField
                              // type="number"
                              size="small"
                              value={row.issueQty - row.returnQty}
                              onFocus={(e) => e.target.select()}
                              // onChange={(e) => handleInputChange(index, 'stockQty', Number(row.srn - row.issueQty))}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            <TextField
                              // type="number"
                              size="small"
                              // type="text"
                              value={row.issueQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "issueQty",
                                  parseInt(row.issueQty) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            <TextField
                              // type="number"
                              size="small"
                              // type="text"
                              value={row.returnQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "returnQty",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                            />
                          </td>
                          {/* <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => deleteRow(index)}>
                                                        <DeleteIcon />
                                                    </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Grid>
              )}

              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
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
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="button"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    formik.resetForm(); // Reset form values
                    setTableData([
                      {
                        id: 0,
                        returnId: 0,
                        itemID: 0,
                        batchNo: "",
                        indentId: 0,
                        returnQty: 0,
                        issueQty: 0,
                      },
                    ]); // Reset table data
                    //   setItemValue(null); // Reset Autocomplete selection
                    setSelectedAction(null); // Reset selected action
                    setIsIndentSelected(false); // Reset indent selection
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default CreateStaffItemReturn;
