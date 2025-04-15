// import {
//     Button,
//     CardContent,
//     Grid,
//     Divider,
//     TextField,
//     Typography,
//     TableContainer,
//     TableCell,
//     TableRow,
//     TableHead,
//     Table,
//     TableBody,
//     Select,
//     MenuItem,
//     Paper,
// } from "@mui/material";
// import React, { useState, useEffect } from "react";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon
// import axios from "axios"; // If you're using axios, ensure to import it
// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import ToastApp from "../../ToastApp";
// import CustomLabel from "../../CustomLable";
// import api from "../../utils/Url";

// const PurchaseOrder = () => {
//     const navigate = useNavigate();
//     const { t } = useTranslation();

//     const [toaster, setToaster] = useState(false);
//     const [items, setItems] = useState<any>([
//         {
//             itemName: '', unit: '', quantity: 0,
//             rate: 0, amount: 0, tax: 0, taxAmount: 0,
//             discountType: 'P', discount: 0, discountAmount: 0, netAmount: 0
//         }
//     ]);

//     console.log("items", items)







//     const formik = useFormik({
//         initialValues: {
//             "id": -1,
//             "document_No": "",
//             "p_InvoiceNo": "",
//             "doc_Date": "",
//             "p_InvoiceDate": "",
//             "supplierName": "",
//             "orderNo": "",
//             "tax": "",
//             "freight": 0,
//             "amount": 0,
//             "acc_code": "",
//             "others": "",
//             "remark": "",
//             "instId": 0,
//             "sessionId": 0,
//             "purchaseinv": items
//         },
//         validationSchema: Yup.object().shape({
//             orderNo: Yup.string().required(t("validation.required")),
//             orderDt: Yup.date().required(t("validation.required")),
//             supplierName: Yup.string().required(t("validation.required")),
//             supplierRefNo: Yup.string().required(t("validation.required")),
//             billingAddress: Yup.string().required(t("validation.required")),
//             shippingAddress: Yup.string().required(t("validation.required")),
//             proposalNo: Yup.string().required(t("validation.required")),
//             indentNo: Yup.string().required(t("validation.required")),
//         }),
//         onSubmit: async (values) => {
//             try {
//                 const response = await api.post(`Department/AddUpdateDepartmentmaster`, {
//                     ...values,
//                     items, // Include items in the request
//                 });
//                 if (response.data.isSuccess) {
//                     setToaster(false);
//                     toast.success(response.data.mesg);
//                     navigate("/master/DepartmentMaster");
//                 } else {
//                     setToaster(true);
//                     toast.error(response.data.mesg);
//                 }
//             } catch (error) {
//                 setToaster(true);
//                 toast.error(t("error.network"));
//             }
//         },
//     });



//     // Function to handle item value changes
//     const handleItemChange = (index: any, field: any, value: any) => {
//         const updatedItems = [...items];
//         updatedItems[index][field] = value;

//         updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
//         updatedItems[index].taxAmount = (updatedItems[index].amount * updatedItems[index].tax) / 100;
//         updatedItems[index].discountAmount = updatedItems[index].discountType === 'P'
//             ? (updatedItems[index].amount * updatedItems[index].discount) / 100
//             : updatedItems[index].discount;
//         updatedItems[index].netAmount = updatedItems[index].amount + updatedItems[index].taxAmount - updatedItems[index].discountAmount;

//         setItems(updatedItems);


//         // if (index === items.length - 1 && field === 'quantity' && value) {
//         //     setItems([...updatedItems, { itemName: '', unit: '', quantity: '', rate: '', amount: 0, tax: '', taxAmount: 0, discountType: '', discount: '', discountAmount: 0, netAmount: 0 }]);
//         // }
//     };
//     const handleRemoveItem = (index: any) => {
//         const updatedItems = items.filter((_: any, i: any) => i !== index);
//         setItems(updatedItems);
//     };


//     const totalAmount = items.reduce((acc: any, item: { netAmount: any; }) => acc + item.netAmount, 0);


//     return (
//         <div>
//             <div style={{
//                 padding: "5px",
//                 backgroundColor: "#ffffff",
//                 borderRadius: "5px",
//                 border: ".5px solid #FF7722",
//                 marginTop: "3vh",
//             }}>
//                 <CardContent>
//                     <Typography
//                         variant="h5"
//                         textAlign="center"
//                         style={{ fontSize: "18px", fontWeight: 500 }}
//                     >
//                         {t("text.Purchaseorder")}
//                     </Typography>

//                     <Grid item sm={4} xs={12}>
//                         <Button
//                             type="button"
//                             onClick={() => navigate(-1)}
//                             variant="contained"
//                             style={{
//                                 marginBottom: 15,
//                                 marginTop: "45px",
//                                 backgroundColor: `var(--header-background)`,
//                                 width: "auto",
//                             }}
//                         >
//                             <ArrowBackSharpIcon />
//                         </Button>
//                     </Grid>
//                     <Divider />
//                     <br />
//                     <form onSubmit={formik.handleSubmit}>
//                         {toaster && <ToastApp />}
//                         <Grid item xs={12} container spacing={2}>
//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="orderNo"
//                                     name="orderNo"
//                                     label={<CustomLabel text={t("Order No")} required={true} />}
//                                     value={formik.values.orderNo}
//                                     placeholder={t("Order No")}
//                                     size="small"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={formik.touched.orderNo && Boolean(formik.errors.orderNo)}
//                                     helperText={formik.touched.orderNo && formik.errors.orderNo}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={4} lg={4}>
//                                 <TextField
//                                     label={
//                                         <CustomLabel
//                                             text={t("text.OrderDate")}
//                                             required={false}
//                                         />
//                                     }
//                                     variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                     name="OrderDate"
//                                     id="OrderDate"
//                                     type="date"
//                                     value={formik.values.doc_Date}
//                                     placeholder={t("text.enterOrderDate")}
//                                     onChange={formik.handleChange}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>

//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="supplierName"
//                                     name="supplierName"
//                                     label={<CustomLabel text={t("Supplier Name")} required={true} />}
//                                     value={formik.values.supplierName}
//                                     placeholder={t("Supplier Name")}
//                                     size="small"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={formik.touched.supplierName && Boolean(formik.errors.supplierName)}
//                                     helperText={formik.touched.supplierName && formik.errors.supplierName}
//                                 />
//                             </Grid>

//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="supplierRefNo"
//                                     name="supplierRefNo"
//                                     label={<CustomLabel text={t("Supplier Ref No")} required={true} />}
//                                     //value={formik.values.supplierRefNo}
//                                     placeholder={t("Supplier Ref No")}
//                                     size="small"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                  //   error={formik.touched.supplierRefNo && Boolean(formik.errors.supplierRefNo)}
//                                  //   helperText={formik.touched.supplierRefNo && formik.errors.supplierRefNo}
//                                 />
//                             </Grid>

//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="billingAddress"
//                                     name="billingAddress"
//                                     label={<CustomLabel text={t("Billing Address")} required={true} />}
//                                    // value={formik.values.billingAddress}
//                                     placeholder={t("Billing Address")}
//                                     size="small"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     // error={formik.touched.billingAddress && Boolean(formik.errors.billingAddress)}
//                                     // helperText={formik.touched.billingAddress && formik.errors.billingAddress}
//                                 />
//                             </Grid>

//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="shippingAddress"
//                                     name="shippingAddress"
//                                     label={<CustomLabel text={t("Shipping Address")} required={true} />}
//                                     //value={formik.values.shippingAddress}
//                                     placeholder={t("Shipping Address")}
//                                     size="small"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     // error={formik.touched.shippingAddress && Boolean(formik.errors.shippingAddress)}
//                                     // helperText={formik.touched.shippingAddress && formik.errors.shippingAddress}
//                                 />
//                             </Grid>

//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="proposalNo"
//                                     name="proposalNo"
//                                     label={<CustomLabel text={t("Proposal No")} required={true} />}
//                                     //value={formik.values.proposalNo}
//                                     placeholder={t("Proposal No")}
//                                     size="small"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     // error={formik.touched.proposalNo && Boolean(formik.errors.proposalNo)}
//                                     // helperText={formik.touched.proposalNo && formik.errors.proposalNo}
//                                 />
//                             </Grid>

//                             <Grid item lg={4} xs={12}>
//                                 <TextField
//                                     id="indentNo"
//                                     name="indentNo"
//                                     label={<CustomLabel text={t("Indent No")} required={true} />}
//                                    // value={formik.values.indentNo}
//                                     placeholder={t("Indent No")}
//                                     size="small"
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     // error={formik.touched.indentNo && Boolean(formik.errors.indentNo)}
//                                     // helperText={formik.touched.indentNo && formik.errors.indentNo}
//                                 />
//                             </Grid>
//                         </Grid>

//                         <Typography
//                             variant="h6"
//                             textAlign="center"
//                             style={{ marginTop: "20px", marginBottom: "10px" }}
//                         >
//                             text.Purchaseorder
//                         </Typography>

//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead style={{ backgroundColor: "#2B4593" }}>
//                                     <TableRow>
//                                         <TableCell style={{ color: '#fff' }}>Sr. No.</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Item Name")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Unit")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Quantity")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Rate")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Amount")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Tax")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Tax Amount")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Discount Type")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Discount")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Discount Amount")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Net Amount")}</TableCell>
//                                         <TableCell style={{ color: '#fff' }}>{t("Actions")}</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {items.map((item:any, index:any) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{index + 1}</TableCell>
//                                             <TableCell>
//                                                 <TextField
//                                                     value={item.itemName}
//                                                     onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
//                                                     size="small"
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Select
//                                                     value={item.unit}
//                                                     onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
//                                                     size="small"
//                                                 >
//                                                     <MenuItem value="kg">Kg</MenuItem>
//                                                     <MenuItem value="Ltr">Ltr</MenuItem>
//                                                     <MenuItem value="pcs">pcs</MenuItem>
//                                                 </Select>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <TextField
//                                                     type="number"
//                                                     value={item.quantity}
//                                                     onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
//                                                     size="small"
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <TextField
//                                                     type="number"
//                                                     value={item.rate}
//                                                     onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
//                                                     size="small"
//                                                 />
//                                             </TableCell>
//                                             <TableCell>{item.amount.toFixed(2)}</TableCell>
//                                             <TableCell>
//                                                 <TextField
//                                                     type="number"
//                                                     value={item.tax}
//                                                     onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value))}
//                                                     size="small"
//                                                 />
//                                             </TableCell>
//                                             <TableCell>{item.taxAmount.toFixed(2)}</TableCell>
//                                             <TableCell>
//                                                 <Select
//                                                     value={item.discountType}
//                                                     onChange={(e) => handleItemChange(index, 'discountType', e.target.value)}
//                                                     size="small"
//                                                 >
//                                                     <MenuItem value="P">Per(%)</MenuItem>
//                                                     <MenuItem value="F">Fix</MenuItem>
//                                                 </Select>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <TextField
//                                                     type="number"
//                                                     value={item.discount}
//                                                     onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
//                                                     size="small"
//                                                 />
//                                             </TableCell>
//                                             <TableCell>{item.discountAmount}</TableCell>
//                                             <TableCell>{item.netAmount}</TableCell>
//                                             <TableCell>
//                                                 <Button
//                                                     onClick={() => handleRemoveItem(index)}
//                                                     variant="text"
//                                                     color="secondary"
//                                                 >
//                                                     <DeleteIcon />
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                     <TableRow style={{ backgroundColor: "#2B4593" }}>
//                                         <TableCell colSpan={9} style={{ textAlign: 'right' }}>
//                                             <strong style={{ color: '#fff' }}>Total Amount:</strong>
//                                         </TableCell>
//                                         <TableCell colSpan={4}>
//                                             <strong style={{ color: '#fff' }}>{totalAmount.toFixed(2)}</strong>
//                                         </TableCell>
//                                     </TableRow>
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>



//                         <Grid item lg={6} sm={6} xs={12}>
//                             <Grid container spacing={2} justifyContent="center" style={{ marginTop: "20px" }}>
//                                 {/* Update Button */}
//                                 <Grid item xs={4}>
//                                     <Button
//                                         fullWidth
//                                         style={{
//                                             backgroundColor: `var(--header-background)`,
//                                             color: "white",
//                                             padding: "4px 8px",
//                                             fontSize: "12px", // Smaller font
//                                             marginTop: "20px", // Added margin to push buttons down
//                                         }}
//                                     >
//                                         {t("text.update")}
//                                     </Button>
//                                 </Grid>

//                                 {/* Delete Button */}
//                                 <Grid item xs={4}>
//                                     <Button
//                                         fullWidth
//                                         style={{
//                                             backgroundColor: `var(--header-background)`,
//                                             color: "white",
//                                             padding: "4px 8px",
//                                             fontSize: "12px", // Smaller font
//                                             marginTop: "20px", // Added margin to push buttons down
//                                         }}
//                                     >
//                                         {t("text.delete")}
//                                     </Button>
//                                 </Grid>

//                                 {/* Reset Button */}
//                                 <Grid item xs={4}>
//                                     <Button
//                                         fullWidth
//                                         style={{
//                                             backgroundColor: `var(--header-background)`,
//                                             color: "white",
//                                             padding: "4px 8px",
//                                             fontSize: "12px", // Smaller font
//                                             marginTop: "20px", // Added margin to push buttons down
//                                         }}
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

// export default PurchaseOrder;
