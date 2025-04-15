


import {
    Button,
    CardContent,
    Grid,
    Divider,
    TextField,
    Typography,
    TableContainer,
    TableCell,
    TableRow,
    TableHead,
    Table,
    TableBody,
    Select,
    MenuItem,
    Paper,
    Autocomplete,
    Box,
    Modal,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import nopdf from '../../../assets/images/imagepreview.jpg'
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import { getISTDate } from "../../../utils/Constant";

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
const StatusOption = [
    { value: 'open', label: 'Open' },
    { value: 'close', label: 'Close' },
    { value: 'cancel', label: 'Cancel' },
    { value: 'partialClose', label: 'Partial Close' }

];

const CreateOfficePurchaseOrder = () => {
    const [isIndentSelected, setIsIndentSelected] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { defaultValues } = getISTDate();
    const [lang, setLang] = useState<Language>("en");
    const [toaster, setToaster] = useState(false);
    // const initialRowData: any = {
    const [tableData, setTableData] = useState<any>([
        {
          

            "sno": 0,
            "id": -1,
            "orderId": 0,
            "itemId": 0,
            "unitId": 0,
            "quantity": 0,
            "rate": 0,
            "amount": 0,
            "gstId": 0,
            "gstRate": 0,
            "cgst": 0,
            "sgst": 0,
            "igst": 0,
            "cgstid": 0,
            "sgstid": 0,
            "igstid": 0,
            "gst": 0,
            "netAmount": 0,
            "fyId": 0,
            "srn": 0,
            "balQuantity": 0,
            "isDelete": true,
            "itemName": "",
            "unit": ""

        },

    ]);

    // const [tableData, setTableData] = useState([{ ...initialRowData }]);
    const [taxData, setTaxData] = useState<any>([]);

    const [orderOption, setorderOption] = useState([
        { value: -1, label: t("text.id") },
    ]);


    const mrnTypeOption = [
        { value: "-1", label: t("text.selectMRN") },
        { value: "1", label: "Bill" },
        { value: "2", label: "Challan" },
    ];
    const [indentOptions, setIndentOptions] = useState([
        { value: "-1", label: t("text.SelectindentNo") },
    ]);
    const [docOpen, setDocOpen] = useState(false);
    const [taxOption, setTaxOption] = useState<any>([]);
    const [itemOption, setitemOption] = useState<{ value: number; label: string; unitId?: number }[]>([
        { value: -1, label: t("text.itemMasterId") },
    ]);
    const [unitOptions, setUnitOptions] = useState<any>([]);
    const [vendorOptions, setVendorOptions] = useState<any>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [Img, setImg] = useState("");
    const [vendorData, setVendorData] = useState([
        { value: "-1", label: t("text.Selectvendor") },
    ]);


    useEffect(() => {
        getPurchaseOrderNo();
        getTaxData();
        GetitemData();
        GetUnitData();
        getVendorData();
        GetIndentID();
    }, []);

    const GetIndentID = async () => {
        const collectData = {
            indentId: -1,
            indentNo: "",
            empId: -1,
        };


        const response = await api.post(`Master/GetIndent`, collectData);
        const data = response.data.data;
        console.log("indent option", data)
        const arr:any = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["indentNo"],
                value: data[index]["indentId"],

            });
        };
        setIndentOptions(arr);
    };

    const getVendorData = async () => {
        const response = await api.post(`Master/GetVendorMaster`, {
            "venderId": -1,
            "countryId": -1,
            "stateId": -1,
            "cityId": -1
        });
        // const response = await api.post(`Master/GetIndent`, response);
        const data = response.data.data;
        console.log("vendor option", data)
        const arr:any = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["name"],
                value: data[index]["venderId"],

            });
        };
        setVendorData(arr);
        // if (result.data.isSuccess) {
        //     const arr =
        //         result?.data?.data?.map((item: any) => ({
        //             label: item.name,
        //             value: item.vendorId,
        //             details: item,
        //         })) || [];

        //     setVendorData([
        //         { value: "-1", label: t("text.SelectVendor")  },
        //         ...arr,
        //     ] as any);
        // }
    };


    //     const getPurchaseOrderNo = async () => {
    //         try {
    //             const result = await api.get(`PurchaseOrder/GetMaxPurchaseOrderNo
    // `);


    //             if (result?.data?.isSuccess && result?.data?.data?.orderNo) {
    //                 formik.setFieldValue("orderNo", result.data.data.orderNo);
    //             } else {
    //                 console.warn("Order number not found in the API response:", result);
    //                 formik.setFieldValue("orderNo", "");
    //             }
    //         } catch (error) {

    //             if (error instanceof Error) {
    //                 console.error("Error while fetching the order number:", error.message);
    //             } else {
    //                 console.error("An unexpected error occurred:", error);
    //             }
    //             formik.setFieldValue("orderNo", "");
    //         }
    //     };
    const getPurchaseOrderNo = async () => {
        try {
            const result = await api.get(`PurchaseOrder/GetMaxPurchaseOrderNo`);

            if (result?.data?.isSuccess && Array.isArray(result.data.data) && result.data.data.length > 0) {
                const orderNo = result.data.data[0]?.orderNo;
                if (orderNo) {
                    formik.setFieldValue("orderNo", orderNo);
                } else {
                    console.warn("Order number not found in the first data entry:", result);
                    formik.setFieldValue("orderNo", "");
                }
            } else {
                console.warn("API response is not in the expected format or data array is empty:", result);
                formik.setFieldValue("orderNo", "");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error while fetching the order number:", error.message);
            } else {
                console.error("An unexpected error occurred:", error);
            }
            formik.setFieldValue("orderNo", "");
        }
    };



    const GetUnitData = async () => {
        const collectData = {
            unitId: -1,
        };
        const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
        const data = response.data.data;
        const arr:any = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["unitName"],
                value: data[index]["unitId"],
            });
        }
        setUnitOptions([{ value: -1, label: t("text.selectUnit") }, ...arr]);
    };

    const getTaxData = async () => {
        const result = await api.post(`UnitMaster/GetTaxMaster
    `, {
            taxId: -1,
        });
        if (result.data.status === 1) {
            const arr =
                result?.data?.data?.map((item: any) => ({
                    label: `${item.taxPercentage}`,
                    value: item.taxId,
                })) || [];

            setTaxData([{ value: "-1", label: t("text.tax") }, ...arr]);
        }
    };
    const GetitemData = async () => {
        const collectData = {
            itemMasterId: -1,
        };
        const response = await api.get(`ItemMaster/GetItemMaster`, {});
        const data = response.data.data;
        const arr:any = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["itemName"],
                value: data[index]["itemMasterId"],
                unitId: data[index]["unitId"],
            });
        }
        setitemOption(arr);
    };
    const GetIndentIDById = async (itemId: any) => {
        const collectData = {
            indentId: itemId,

            //indentId: -1,
            indentNo: "",
            empId: -1,
        };
        const response = await api.post(`Master/GetIndent`, collectData);
        const data = response.data.data[0]['indentDetail'];

        console.log("indent option", data)
        // let arr: any = [];

        const indent = data.map((item: any, index: any) => ({

            id: index + 1,
            "orderId": 0,

            rate: item?.rate,
            batchNo: item?.batchNo,
            itemId: item?.itemId,
            unitId: item?.unitId,
            quantity: item?.approveQuantity,
            //reqQty: item?.quantity,
            amount: item?.amount,
            unitName: "",
            itemName: "",
            indentNo: "",
            "srn": 0,
            netAmount: item?.amount,
            "returnItem": true


        }))

        setTableData(indent);
        setIsIndentSelected(true);

    };



    console.log("tableData.....", tableData);

    // const isRowFilled = (row: any) => {
    //     console.log("isRowFilled", row);
    //     return (
    //         row.orderNo &&
    //         row.itemId &&
    //         // row.batchNo &&
    //         // row.balQuantity > 0 &&
    //         row.quantity > 0 &&
    //         row.rate > 0
    //     );
    // };

    const updateTotalAmounts = (data: any[]) => {
        console.log("updateTotalAmounts", data);
        const totals = data.reduce(
            (acc, row) => {
                //  acc.totalAmount += parseFloat(row.amount) || 0;
                acc.totalCGST += parseFloat(row.cgst) || 0;
                acc.totalSGST += parseFloat(row.sgst) || 0;
                acc.totalIGST += parseFloat(row.igst) || 0;
                acc.totalGrossAmount += parseFloat(row.netAmount) || 0;
                return acc;
            },
            // {
            //     // totalAmount: 0,
            //     totalCGST: 0,
            //     totalSGST: 0,
            //     totalIGST: 0,
            //     totalGrossAmount: 0,
            // }
        );

        formik.setValues({
            ...formik.values,
            ...totals,
        });
    };


    const handlePanClose1 = () => {
        setDocOpen(false);
    };

    const modalOpenHandle1 = (event: string) => {
        setDocOpen(true);
        const base64Prefix = "data:image/jpeg;base64,";

        let imageData = '';
        switch (event) {
            case "pOrderDoc":
                imageData = formik.values.pOrderDoc;
                break;
            default:
                imageData = '';
        }
        if (imageData) {
            const imgSrc = imageData.startsWith(base64Prefix) ? imageData : base64Prefix + imageData;
            console.log("imageData", imgSrc);
            setImg(imgSrc);
        } else {
            setImg('');
        }
    };

    const otherDocChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, params: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
            alert("Only .jpg, .jpeg, or .png image files are allowed.");
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            const base64Content = base64String.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");

            if (base64Content) {
                formik.setFieldValue(params, base64Content); // Store the stripped base64 string
            } else {
                alert("Error processing image data.");
            }

            //formik.setFieldValue(params, base64String); // Store the complete base64 string with the prefix.
        };
        reader.onerror = () => {
            alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(file);
    };




    const validateRow = (row: any) => {
        return row.itemId && row.unitId && row.rate > 0;
    };

    
    const formik = useFormik({
        initialValues: {
            "orderId": 0,
            "indentId": null,
            "orderNo": "",
            "orderDate": defaultValues,
            "vendorId": null,
            "name": "",
            "billingAddress": "",
            "shippingAddress": "",
            "totalAmount": 0,
            "totalCGST": 0,
            "totalSGST": 0,
            "totalIGST": 0,
            "netAmount": 0,
            "status": "open",
            "orderType": "Office",
            "createdBy": "adminvm",
            "updatedBy": "adminvm",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "companyId": 0,
            "fyId": 0,
            "releasedBy": "",
            "postedBy": "",
            "releasedOn": defaultValues,
            "postedOn": defaultValues,
            "pOrderDoc": "",
            "purchaseOrderDetail": [],
            "isSelected": true,
            "indentNo": "",
            "itemName": ""

        },

        validationSchema: Yup.object({
            // pOrderDoc: Yup.string()
            //     .required("Image required"),
            indentId: Yup.string().required("Indnet no required"),
            vendorId: Yup.string().required("Vendor is rquired"),


        }),
        onSubmit: async (values) => {
            const validTableData = tableData.filter(validateRow);

            if (validTableData.length === 0) {
                alert("Please add some data in table for further process");
                return;
            }
            console.log('values', values)

            const response = await api.post(`PurchaseOrder/UpsertPurchaseOrder`,
                //     ...values,
                //     purchaseOrderDetail: filteredTableData,
                // }

                { ...values, purchaseOrderDetail: validTableData });
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/storemanagement/purchaseorder/office");
            } else {
                setToaster(true);
                toast.error(response.data.message);
            }
        },
    });
    console.log("formik.values", formik.values);
    //  const back = useNavigate();
    const handleInputChange = (index: any, field: any, value: any) => {
        const newData: any = [...tableData];
        newData[index][field] = value;
        let rate = 0;
        if (field === "itemId") {
            const selectedItem = itemOption.find((item) => item.value === value);
            newData[index].itemId = selectedItem?.value || 0;
            newData[index].unitId = selectedItem?.unitId || 0; // Automatically set unitId

            console.log("Selected Item:", selectedItem);
        } else {
            newData[index][field] = value;
        }
        if (field === 'orderId') {
            newData[index].orderId = newData[index].orderId;
        }
        if (field === 'orderNo') {
            newData[index].orderNo = newData[index].orderNo;
        }
        if (field === 'quantity') {
            newData[index].quantity = newData[index].quantity;
        }
        if (field === 'unitId') {
            newData[index].unitId = newData[index].unitId;
        }
        if (field === 'unitName') {
            newData[index].unitName = newData[index].unitName;
        }
        if (field === 'amount') {
            newData[index].amount = newData[index].amount;
        }
        // if (field === 'netAmount') {
        //   newData[index].netAmount = newData[index].amount + newData[index].amount * (newData[index].gst / 100);
        // }
        if (field === 'gst' || field === 'gstId') {
            newData[index].gst = newData[index].gst;
            newData[index].cgst = (newData[index].amount * (newData[index].gst / 200)).toFixed(2);
            newData[index].sgst = (newData[index].amount * (newData[index].gst / 200)).toFixed(2);
            newData[index].netAmount = parseFloat((newData[index].amount + newData[index].amount * (newData[index].gst / 100)).toFixed(2));
        } else {
            newData[index].netAmount = (newData[index].rate * newData[index].quantity);
        }
        // if (field === 'cgst') {
        //   newData[index].cgst = newData[index].cgst;
        // }
        // if (field === 'sgst') {
        //   newData[index].sgst = newData[index].sgst;
        // }
        // if (field === 'serviceCharge') {
        //   newData[index].serviceCharge = newData[index].serviceCharge;
        // }
        newData[index].amount = newData[index].rate * newData[index].quantity;

        //newData[index].jobCardId = location.state?.jobCardId || 0;
        newData[index].challanNo = 0;

        setTableData(newData);

        // if (newData[index].unitId > 0 && newData[index].quantity && newData[index].amount > 0) {
        //     if (index === tableData.length - 1) {
        //         addRow();
        //     }
        // }
        let total = 0;
        let netAmt = 0;
        tableData.forEach((row: any) => {
            total += row.amount;
            netAmt += row.amount + row.amount * (row.gst / 100);
        })
        formik.setFieldValue("netAmount", netAmt);
        formik.setFieldValue("totalAmount", total);
    };

    // const handleInputChange = (index: number, field: string, value: any) => {
    //     const updatedItems = [...tableData];
    //     let item = { ...updatedItems[index] };

    //     if (field === "orderNo") {
    //         const selectedItem = orderOption.find(
    //             (option: any) => option.value === value
    //         );
    //         console.log(selectedItem);
    //         if (selectedItem) {
    //             item = {
    //                 ...item,
    //                 // mrnType: selectedItem?.value?.toString(),
    //                 orderId: selectedItem?.value,
    //                 orderNo: selectedItem?.label,
    //             };
    //         }
    //     } else if (field === "itemId") {
    //         const selectedItem = itemOption.find(
    //             (option: any) => option.value === value
    //         );
    //         console.log(selectedItem);
    //         if (selectedItem) {
    //             item = {
    //                 ...item,
    //                 itemId: selectedItem?.value,
    //                 itemName: selectedItem?.label,
    //                 item: selectedItem?.details,
    //             };
    //         }
    //     }

    //     else if (field === "quantity") {
    //         item.quantity = value === "" ? 0 : parseFloat(value);
    //     } else if (field === "rate") {
    //         item.rate = value === "" ? 0 : parseFloat(value);
    //     } else if (field === "gstId") {
    //         const selectedTax: any = taxData.find((tax: any) => tax.value === value);
    //         if (selectedTax) {
    //             item.gstRate = parseFloat(selectedTax.label) || 0;
    //             item.gstId = selectedTax.value || 0;
    //             item.cgstid = selectedTax.value || 0;
    //             item.sgstid = selectedTax.value || 0;
    //             item.igstid = 0;
    //             item.gst = item.gstRate;
    //         }
    //     } else {
    //         item[field] = value;
    //     }
    //     item.amount =
    //         (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    //     item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100);
    //     item.netAmount = (item.amount + (parseFloat(item.gst) || 0));
    //     item.sgst = item.gst / 2;
    //     item.cgst = item.gst / 2;
    //     item.igst = 0;

    //     formik.setFieldValue("totalAmount", item.netAmount);

    //     tableData[index] = item;
    //     setTableData(tableData);
    //     updateTotalAmounts(tableData);
    //     if (updatedItems[index].quantity >= 1 && updatedItems[index].rate > 0 && updatedItems[index].itemId >= 1) {
    //         if (index === tableData.length - 1) {
    //             addRow();
    //         }
    //     }
    //     // addRow();

    //     let total = 0;
    //     tableData.forEach((row: any) => {
    //         total += row.amount;
    //     })
    //     formik.setFieldValue("netAmount", total);
    //     formik.setFieldValue("totalServiceAmount", total);
    //     formik.setFieldValue("totalItemAmount", total);
    //     // if (isRowFilled(item) && index === updatedItems.length - 1) {
    //     //     addRow();
    //     // }
    // };

    const addRow = () => {
        setTableData([...tableData, {
            //   "id":  tableData.length + 1,
            "id": 0,
            "orderId": -1,
            "itemId": 0,
            "quantity": 0,
            "rate": 0,
            "amount": 0,
            "gstId": 0,
            "gstRate": 0,
            "cgst": 0,
            "sgst": 0,
            "igst": 0,
            "cgstid": 0,
            "sgstid": 0,
            "igstid": 0,
            "gst": 0,
            "netAmount": 0,
            "fyId": 0,
            "srn": 0,
            "balQuantity": 0,
            "isDelete": true,
            "itemName": ""

        }]);
    };


    const deleteRow = (index: any) => {
        const newData = tableData.filter((_: any, i: any) => i !== index);
        setTableData(newData);
    };


    const back = useNavigate();
    return (
        <div>
            <div
                style={{
                    padding: "5px",
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
                        <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="center"
                            >
                                {t("text.CreateOfficePurchaseOrder")}
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
                        {toaster && <ToastApp />}
                        <Grid item xs={12} container spacing={2}>




                            <Grid item lg={4} xs={12} sm={4}>
                                <TextField
                                    id="orderNo"
                                    name="orderNo"
                                    label={<CustomLabel text={t("text.orderNo")} required={false} />}
                                    value={formik.values.orderNo}
                                    size="small"
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="orderDate"
                                    name="orderDate"
                                    label={
                                        <CustomLabel
                                            text={t("text.orderDate")}
                                            required={true}
                                        />
                                    }
                                    value={formik.values.orderDate}
                                    placeholder={t("text.orderDate")}
                                    size="small"
                                    type="date"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={
                                        formik.touched.orderDate &&
                                        Boolean(formik.errors.orderDate)
                                    }
                                    helperText={
                                        formik.touched.orderDate && formik.errors.orderDate
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={indentOptions}
                                    value={indentOptions.find((opt) => opt.value == formik.values.indentId) || null}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log("check value", newValue);
                                        if (newValue) {
                                            GetIndentIDById(newValue?.value);
                                            formik.setFieldValue("indentId", newValue?.value);
                                            formik.setFieldValue("indentNo", newValue?.label?.toString() || "");
                                        }
                                    }}

                                    // value={
                                    //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
                                    // }
                                    renderInput={(params: any) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel text={t("text.enterIndentNo")} required={true} />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.indentId && formik.errors.indentId && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.indentId}</div>
                                )}
                            </Grid>




                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={vendorData}
                                    value={vendorData.find((opt) => opt.value == formik.values.vendorId) || null}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("vendorId", newValue?.value);
                                        formik.setFieldValue("name", newValue?.label);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel text={t("text.Vendorname")} required={true} />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.vendorId && formik.errors.vendorId && (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.vendorId}</div>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={["Open"]}
                                    fullWidth
                                    size="small"
                                    disabled
                                    onChange={(event: any, newValue: any) => {
                                        formik.setFieldValue("status", newValue?.value.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            disabled
                                            label={<CustomLabel text={t("text.SelectStatus")} required={false} />}
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid container spacing={1} item>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    item
                                    style={{ marginBottom: "30px", marginTop: "30px" }}
                                >
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        InputLabelProps={{ shrink: true }}
                                        label={<CustomLabel text={t("text.pOrderDoc")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e: any) => otherDocChangeHandler(e, "pOrderDoc")}
                                    // required
                                    />
                                </Grid>
                                <Grid xs={12} md={4} sm={4} item></Grid>

                                <Grid xs={12} md={4} sm={4} item>
                                    <Grid
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            alignItems: "center",
                                            margin: "10px",
                                        }}
                                    >
                                        {formik.values.pOrderDoc ? (
                                            <img
                                                src={
                                                    /^(data:image\/(jpeg|jpg|png);base64,)/.test(formik.values.pOrderDoc)
                                                        // formik.values.pOrderDoc.startsWith("data:image")
                                                        ? formik.values.pOrderDoc
                                                        : `data:image/jpeg;base64,${formik.values.pOrderDoc}`
                                                }
                                                alt="Preview"
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                    padding: "2px",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={nopdf}
                                                alt="No document"
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        )}
                                        <Typography
                                            onClick={() => modalOpenHandle1("pOrderDoc")}
                                            style={{
                                                textDecorationColor: "blue",
                                                textDecorationLine: "underline",
                                                color: "blue",
                                                fontSize: "15px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {t("text.Preview")}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Modal open={docOpen} onClose={handlePanClose1}>
                                    <Box sx={style}>
                                        {Img ? (
                                            <img
                                                src={Img}
                                                alt="Preview"
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        ) : (
                                            <Typography>No Image to Preview</Typography>
                                        )}
                                    </Box>
                                </Modal>
                            </Grid>;
                            {/* <Grid container spacing={1} item>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    item
                                    style={{ marginBottom: "30px", marginTop: "30px" }}
                                >
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        InputLabelProps={{ shrink: true }}
                                        label={<CustomLabel text={t("text.pOrderDoc")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e: any) => otherDocChangeHandler(e, "pOrderDoc")}
                                        required={true}
                                    />
                                </Grid>
                                <Grid xs={12} md={4} sm={4} item></Grid>

                                <Grid xs={12} md={4} sm={4} item>
                                    <Grid
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            alignItems: "center",
                                            margin: "10px",
                                        }}
                                    >
                                        {formik.values.pOrderDoc == "" ? (
                                            <img
                                                src={nopdf}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={`data:image/jpg;base64,${formik.values.pOrderDoc}`}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                    padding: "2px",
                                                }}
                                            />
                                        )}
                                        <Typography
                                            onClick={() => modalOpenHandle1("pOrderDoc")}
                                            style={{
                                                textDecorationColor: "blue",
                                                textDecorationLine: "underline",
                                                color: "blue",
                                                fontSize: "15px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {t("text.Preview")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Modal open={docOpen} onClose={handlePanClose1}>
                                    <Box sx={style}>
                                        {Img == "" ? (
                                            // eslint-disable-next-line jsx-a11y/alt-text
                                            <img
                                                // src={nopdf}
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                }}
                                            />
                                        ) : (
                                            <img
                                            src={formik.values.pOrderDoc.startsWith('data:image/jpeg;base64,') 
                                                ? formik.values.pOrderDoc 
                                                : `data:image/jpeg;base64,${formik.values.pOrderDoc}`}
                                            alt="Preview"
                                            style={{
                                                width: 150,
                                                height: 100,
                                                border: "1px solid grey",
                                                borderRadius: 10,
                                                padding: "2px",
                                            }}
                                        />
                                    //     <img
                                    //     alt="preview image"
                                    //     src={Img}
                                    //     style={{
                                    //       width: "170vh",
                                    //       height: "75vh",
                                    //       borderRadius: 10,
                                    //     }}
                                    //   />

                                        )}
                                    </Box>
                                </Modal>
                            </Grid> */}
                            <Grid item lg={12} md={12} xs={12} textAlign={"center"} fontSize={12} fontWeight={800}>

                            </Grid>

                            {isIndentSelected && (
                                <Grid item xs={12} md={12} lg={12}>
                                    <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
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
                                                            padding: "5px",
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
                                                        {t("text.ItemName")}
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
                                                        {t("text.Quantity")}
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid black",
                                                            textAlign: "center",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        {t("text.Rate")}
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid black",
                                                            textAlign: "center",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        {t("text.Amount")}
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid black",
                                                            textAlign: "center",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        {t("text.GSTRate")}
                                                    </th>

                                                    <th
                                                        style={{
                                                            border: "1px solid black",
                                                            textAlign: "center",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        {t("text.cgst")}

                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid black",
                                                            textAlign: "center",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        {t("text.sgst")}
                                                    </th>
                                                    {/* <th
                                                        style={{
                                                            border: "1px solid black",
                                                            textAlign: "center",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        IGST
                                                    </th > */}
                                                    {/* <th
                                                    style={{
                                                        border: "1px solid black",
                                                        textAlign: "center",
                                                        padding: "5px",
                                                    }}
                                                >
                                                    {t("text.totalTax")}
                                                </th> */}

                                                    <th
                                                        style={{
                                                            border: "1px solid black",
                                                            textAlign: "center",
                                                            padding: "5px",
                                                        }}
                                                    >
                                                        {t("text.NetAmount")}
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
                                                                        deleteRow(index)
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
                                                            }}
                                                        >
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={itemOption}
                                                                fullWidth
                                                                size="small"
                                                                sx={{ width: "175px" }}
                                                                value={
                                                                    itemOption.find((opt: any) => (opt.value) === parseInt(row?.itemId)) || null
                                                                }
                                                                onChange={(e: any, newValue: any) =>
                                                                    handleInputChange(
                                                                        index,
                                                                        "itemId",
                                                                        newValue?.value
                                                                    )
                                                                }
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}

                                                                    />
                                                                )}
                                                            />
                                                        </td>

                                                        <td
                                                            style={{
                                                                border: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <select
                                                                value={row.unitId}
                                                                onChange={(e: any) => handleInputChange(index, 'unitId', e.target.value)}
                                                                style={{ width: '95%', height: '35px' }}
                                                            >
                                                                <option value="">Select Unit</option>
                                                                {unitOptions.map((option: any) => (
                                                                    <option key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            <TextField
                                                                type="text"
                                                                value={row.quantity}
                                                                onChange={(event) => {
                                                                    const value: any = event.target.value;
                                                                    handleInputChange(index, "quantity", value);
                                                                    // if (!isNaN(value) || value === '' || value === '.') {
                                                                    // }
                                                                }}
                                                                onFocus={e => e.target.select()}
                                                                inputProps={{
                                                                    step: "any",
                                                                    min: "0"
                                                                }}
                                                                size="small"
                                                            />
                                                        </td>



                                                        <td
                                                            style={{
                                                                border: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <TextField
                                                                size="small"
                                                                value={row.rate}
                                                                onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                                                                inputProps={{ step: "any", min: "0" }}
                                                                onFocus={e => e.target.select()}
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <TextField
                                                                value={row.rate * row.quantity}
                                                                onChange={(e) => handleInputChange(index, 'amount', (row.rate * row.quantity) || 0)}
                                                                size="small"
                                                                inputProps={{ readOnly: true }}
                                                            // onFocus={e => e.target.select()}
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={taxData}
                                                                value={row.gst}
                                                                fullWidth
                                                                size="small"
                                                                sx={{ width: "80px" }}
                                                                onChange={(e: any, newValue: any) => {
                                                                    if (!newValue) {
                                                                        return;
                                                                    }
                                                                    handleInputChange(index, 'gst', parseFloat(newValue.label) || 0);
                                                                    handleInputChange(index, "gstId", newValue?.value)
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                    // label={
                                                                    //     <CustomLabel
                                                                    //         text={t("text.tax")}
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
                                                            }}
                                                        >
                                                            <TextField
                                                                value={row.cgst}
                                                                onChange={(e) => handleInputChange(index, 'cgst', parseFloat(e.target.value) || 0)}
                                                                onFocus={(e) => e.target.select()}
                                                                size="small"
                                                                sx={{ width: "80px" }}
                                                                inputProps={{ readOnly: true }}
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <TextField
                                                                value={row.sgst}
                                                                onChange={(e) => handleInputChange(index, 'sgst', parseFloat(e.target.value) || 0)}
                                                                onFocus={(e) => e.target.select()}
                                                                size="small"
                                                                sx={{ width: "80px" }}
                                                                inputProps={{ readOnly: true }}
                                                            />
                                                        </td>
                                                        {/* <td
                                                            style={{
                                                                border: "1px solid black",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <TextField
                                                                value={row.igst}
                                                                size="small"
                                                                inputProps={{ readOnly: true }}
                                                            />
                                                        </td> */}
                                                        <td
                                                            style={{
                                                                border: "1px solid black",
                                                                textAlign: "end",
                                                            }}
                                                        >
                                                            <TextField
                                                                value={row.netAmount}
                                                                // value={(row.amount + row.amount * (row.gst / 100)||0)}
                                                                size="small"
                                                                inputProps={{ readOnly: true }}
                                                            />
                                                        </td>
                                                    </tr>

                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={9} style={{ textAlign: "right", fontWeight: "bold" }}>
                                                        {t("text.TotalAmount")}

                                                    </td>
                                                    <td style={{ textAlign: "end", border: "1px solid black" }}>
                                                        <b></b>{formik.values.totalAmount}
                                                        {/* {tableData.reduce((acc:any, row:any) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)} */}
                                                    </td>
                                                </tr>
                                                {/* <tr>
                                                    <td colSpan={10} style={{ textAlign: "right", fontWeight: "bold" }}>
                                                        {t("text.Totaltaxamount")}


                                                    </td>
                                                    <td style={{ textAlign: "end", border: "1px solid black" }}>

                                                        {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.gst) || 0), 0)}
                                                    </td>
                                                </tr> */}
                                                <tr>
                                                    <td colSpan={9} style={{ textAlign: "right", fontWeight: "bold" }}>
                                                        {t("text.Totalnetamount")}

                                                    </td>
                                                    <td style={{ textAlign: "end", border: "1px solid black" }}>
                                                        {/* value={formik.values.netAmount} */}
                                                        <b></b>{(formik.values.netAmount) || 0}
                                                        {/* {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.netAmount) || 0), 0)} */}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    </div> </Grid>
                            )}
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
                                                "id": 0,
                                                "indentId": 0,
                                                "itemId": 0,
                                                "unitId": null,
                                                "quantity": 0,
                                                "rate": 0,
                                                "amount": 0,
                                                "approveQuantity": 0,
                                                "fyId": 0,
                                                "srn": 0,
                                                "isDelete": true,
                                                "unitName": "",
                                                "itemName": ""
                                            },
                                        ]); // Reset table data
                                        // setItemValue(null); // Reset Autocomplete selection
                                        //  setSelectedAction(null); // Reset selected action
                                        // setIsIndentSelected(false); // Reset indent selection
                                        getPurchaseOrderNo();
                                        setIsIndentSelected(false);

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

export default CreateOfficePurchaseOrder;


