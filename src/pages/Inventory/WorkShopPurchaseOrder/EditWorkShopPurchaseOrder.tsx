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
  Modal,
  Box,
} from "@mui/material";
import nopdf from "../../../assets/images/imagepreview.jpg";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import dayjs from "dayjs";
import { getId, getISTDate } from "../../../utils/Constant";
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
interface VendorOption {
  value: number;
  label: string;
  details?: any; // Optional, depending on your API response structure
}
const StatusOption = [
  { value: "open", label: "Open" },
  { value: "close", label: "Close" },
  { value: "cancel", label: "Cancel" },
  { value: "partialClose", label: "Partial Close" },
];
const EditWorkShopPurchaseOrder = () => {
  const { defaultValues } = getISTDate();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);

  const initialRowData: any = {
    sno: 0,
    id: -1,
    orderId: 0,
    itemId: 0,
    unitId: 0,
    quantity: 0,
    rate: 0,
    amount: 0,
    gstId: 0,
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    cgstid: 0,
    sgstid: 0,
    igstid: 0,
    gst: 0,
    netAmount: 0,
    fyId: 0,
    srn: 0,
    balQuantity: 0,
    isDelete: true,
    itemName: "",
    unit: "",
  };
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
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
    { value: -1, label: t("text.SelectindentNo"), indenttype: "" },
  ]);
  const [docOpen, setDocOpen] = useState(false);
  const [taxOption, setTaxOption] = useState<any>([]);
  const [itemOption, setitemOption] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [vendorOptions, setVendorOptions] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const [vendorData, setVendorData] = useState([]);
const UserId =getId();
  useEffect(() => {
    getTaxData();
    GetitemData();
    GetUnitData();
    getVendorData();
    fetchImage(location.state?.orderId || formik.values.orderId);
    // getPurchaseInvoiceById(location.state.id);
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
    console.log("indent option", data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["indentNo"],
        value: data[index]["indentId"],
        indenttype: data[index]["indenttype"],
      });
    }
    setIndentOptions(arr);
  };

  const getVendorData = async () => {
    const result = await api.post(`Master/GetVendorMaster`, {
      venderId: -1,
      countryId: -1,
      stateId: -1,
      cityId: -1,
    });
    if (result.data.isSuccess) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.name}`,
          value: item.venderId,
          details: item,
        })) || [];

      setVendorData([
        { value: "-1", label: t("text.SelectVendor") },
        ...arr,
      ] as any);
    }
  };

  const getPurchaseOrderNo = async () => {
    try {
      const result = await api.get(`PurchaseOrder/GetPurchaseOrderNo`);

      if (result?.data?.status === 1 && result?.data?.data?.orderNo) {
        formik.setFieldValue("orderNo", result.data.data.orderNo);
      } else {
        console.warn("Order number not found in the API response:", result);
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
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOptions([{ value: -1, label: t("text.selectUnit") }, ...arr]);
  };

  const getTaxData = async () => {
    const result = await api.post(
      `UnitMaster/GetTaxMaster
`,
      {
        taxId: -1,
      }
    );
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
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    }
    setitemOption(arr);
  };
  const fetchImage = async (Id: any = location.state?.orderId || 0) => {
    const collectData = {
      orderId: Id,
      indentId: -1,
    };
    const response = await api.post(
      `PurchaseOrder/GetPurchaseOrder`,
      collectData
    );
    const data = response.data.data;
    formik.setFieldValue(
      "pOrderDoc",
      data[0].pOrderDoc.replace(/^data:image\/(jpeg|jpg|png|9j);base64,/, "")
    );
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
  //     //  else if (field === "batchNo") {
  //     //     item.batchNo = value?.toString();
  //     // }
  //     // else if (field === "balQuantity") {
  //     //     item.balQuantity = value === "" ? 0 : parseFloat(value);
  //     // }
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
  //     item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100).toFixed(
  //         2
  //     );
  //     item.netAmount = (item.amount + (parseFloat(item.gst) || 0)).toFixed(2);
  //     item.sgst = item.gst / 2;
  //     item.cgst = item.gst / 2;
  //     item.igst = 0;

  //     formik.setFieldValue("totalAmount", item.netAmount);

  //     updatedItems[index] = item;
  //     setTableData(updatedItems);
  //     updateTotalAmounts(updatedItems);

  //     // if (isRowFilled(item) && index === updatedItems.length - 1) {
  //     //     addRow();
  //     // }
  // };

  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;
    let rate = 0;
    if (field === "itemId") {
      const selectedItem = itemOption.find((item: any) => item.value === value);
      newData[index].itemId = selectedItem?.value || 0;
      newData[index].unitId = selectedItem?.unitId || 0; // Automatically set unitId

      console.log("Selected Item:", selectedItem);
    } else {
      newData[index][field] = value;
    }
    if (field === "orderId") {
      newData[index].orderId = newData[index].orderId;
    }
    if (field === "orderNo") {
      newData[index].orderNo = newData[index].orderNo;
    }
    if (field === "quantity") {
      newData[index].quantity = newData[index].quantity;
    }
    if (field === "unitId") {
      newData[index].unitId = newData[index].unitId;
    }
    if (field === "unitName") {
      newData[index].unitName = newData[index].unitName;
    }
    if (field === "amount") {
      newData[index].amount = newData[index].amount;
    }
    // if (field === 'netAmount') {
    //   newData[index].netAmount = newData[index].amount + newData[index].amount * (newData[index].gst / 100);
    // }
    if (field === "gst" || field === "gstId") {
      newData[index].gst = newData[index].gst;
      newData[index].cgst = (
        newData[index].amount *
        (newData[index].gst / 200)
      ).toFixed(2);
      newData[index].sgst = (
        newData[index].amount *
        (newData[index].gst / 200)
      ).toFixed(2);
      newData[index].netAmount = parseFloat(
        (
          newData[index].amount +
          newData[index].amount * (newData[index].gst / 100)
        ).toFixed(2)
      );
    } else {
      newData[index].netAmount = newData[index].rate * newData[index].quantity;
    }
    if (field === "cgst") {
      newData[index].cgst = newData[index].cgst;
    }
    if (field === "sgst") {
      newData[index].sgst = newData[index].sgst;
    }

    newData[index].amount = newData[index].rate * newData[index].quantity;

    newData[index].challanNo = 0;

    setTableData(newData);

    // if (newData[index].unitId > 0 && newData[index].quantity && newData[index].amount > 0) {
    //     if (index === tableData.length - 1) {
    //         addRow();
    //     }
    // }
    let cgst1 = 0;
    let sgst1 = 0;
    let total = 0;
    let netAmt = 0;
    tableData.forEach((row: any) => {
      total += row.amount;
      netAmt += row.amount + (row.amount * (row.gst / 100) || 0);
      cgst1 += parseFloat(row.cgst || 0);
      sgst1 += parseFloat(row.sgst || 0);
    });
    formik.setFieldValue("netAmount", netAmt);
    formik.setFieldValue("totalAmount", total);
    formik.setFieldValue("totalCGST", cgst1);
    formik.setFieldValue("totalSGST", sgst1);
  };

  console.log("tableData.....", tableData);

  const isRowFilled = (row: any) => {
    console.log("isRowFilled", row);
    return (
      row.orderNo &&
      row.itemId &&
      // row.batchNo &&
      // row.balQuantity > 0 &&
      row.quantity > 0 &&
      row.rate > 0
    );
  };

  const updateTotalAmounts = (data: any[]) => {
    console.log("updateTotalAmounts", data);
    const totals = data.reduce(
      (acc, row) => {
        acc.totalAmount += parseFloat(row.amount) || 0;
        acc.totalCGST += parseFloat(row.cgst) || 0;
        acc.totalSGST += parseFloat(row.sgst) || 0;
        acc.totalIGST += parseFloat(row.igst) || 0;
        acc.netAmount += parseFloat(row.netAmount) || 0;
        return acc;
      }
      // {
      //     // totalAmount: 0,
      //     totalCGST: 0,
      //     totalSGST: 0,
      //     totalIGST: 0,
      //     netAmount: 0,
      // }
    );

    formik.setValues({
      ...formik.values,
      ...totals,
    });
  };

  const deleteRow = (index: number) => {
    if (tableData.length === 1) {
      setTableData([{ ...initialRowData }]);
    } else {
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
    }
    updateTotalAmounts(tableData);
  };

  const addRow = () => {
    setTableData([...tableData, { ...initialRowData }]);
  };

  const handlePanClose1 = () => {
    setDocOpen(false);
  };

  const modalOpenHandle1 = (event: string) => {
    setDocOpen(true);
    const base64Prefix = "data:image/jpeg;base64,";

    let imageData = "";
    switch (event) {
      case "pOrderDoc":
        imageData = formik.values.pOrderDoc;
        break;
      default:
        imageData = "";
    }
    if (imageData) {
      const imgSrc = imageData.startsWith(base64Prefix)
        ? imageData
        : base64Prefix + imageData;
      console.log("imageData", imgSrc);
      setImg(imgSrc);
    } else {
      setImg("");
    }
  };

  const otherDocChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    params: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(fileExtension || "")) {
      alert("Only .jpg, .jpeg, or .png image files are allowed.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.replace(
        /^data:image\/(jpeg|jpg|png);base64,/,
        ""
      );

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
  const formik = useFormik({
    initialValues: {
      // sno: location?.state?.sno || 0,
      orderId: location?.state?.orderId || 0,
      indentId: location?.state?.indentId || 0,
      orderNo: location?.state?.orderNo || "",
      orderDate: dayjs(location.state.orderDate).format("YYYY-MM-DD"),
      vendorId: location?.state?.vendorId || 0,
      name: location?.state?.name || "",
      billingAddress: location?.state?.billingAddress || "",
      shippingAddress: location?.state?.shippingAddress || "",
      totalAmount: location?.state?.totalAmount || 0,
      totalCGST: location?.state?.totalCGST || 0,
      totalSGST: location?.state?.totalSGST || 0,
      totalIGST: location?.state?.totalIGST || 0,
      netAmount: location?.state?.netAmount || 0,
      status: location?.state?.status || "",
      orderType: location?.state?.orderType || "",
      createdBy: location?.state?.createdBy || "",
      updatedBy: UserId,
      createdOn: location?.state?.createdOn ,
      updatedOn: defaultValues,
      companyId: location?.state?.companyId || 0,
      fyId: location?.state?.fyId || 0,
      releasedBy: location?.state?.releasedBy || "",
      postedBy: location?.state?.postedBy || "",
      releasedOn: location?.state?.releasedOn || defaultValues,
      postedOn: location?.state?.postedOn || defaultValues,
      pOrderDoc: location?.state?.pOrderDoc || "",
      purchaseOrderDetail: location?.state?.purchaseOrderDetail || [],
      isSelected:
        location?.state?.isSelected !== undefined
          ? location.state.isSelected
          : true,
      // file: location?.state?.file || "",
      // fileOldName: location?.state?.fileOldName || "",
      indentNo: location?.state?.indentNo || "",
      //  unitId: location?.state?.unitId || 0,
      itemName: location?.state?.itemName || "",
      // unitName: location?.state?.unitName || "",
    },
    // validationSchema: Yup.object().shape({
    //   document_No: Yup.string().required(t("Document No. required")),
    //   orderNo: Yup.string().required(t("Order No. required")),
    //   doc_Date: Yup.date().required(t("Order Date required")),
    //   p_InvoiceDate: Yup.date().required(t("Invoice Date required")),
    //   supplierName: Yup.string().required(t("Supplier Name required")),
    // }),
    onSubmit: async (values) => {
      const filteredTableData = tableData.filter(
        (row) => !(row.itemId === 0 && row.quantity === 0)
      );
      const response = await api.post(`PurchaseOrder/UpsertPurchaseOrder`, {
        ...values,
        purchaseOrderDetail: filteredTableData,
      });
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/storemanagement/purchaseorder/workshop");
      } else {
        toast.error(response.data.message);
      }
    },
  });
  useEffect(() => {
    if (location?.state?.purchaseOrderDetail) {
      setTableData(location.state.purchaseOrderDetail);
    }
  }, [location.state]);

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
                {location.state.isView? t("text.WorkShopPurchaseOrder"):t("text.EditWorkShopPurchaseOrder")}
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
                  label={
                    <CustomLabel text={t("text.orderNo")} required={false} />
                  }
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
                    <CustomLabel text={t("text.orderDate")} required={true} />
                  }
                  value={formik.values.orderDate}
                  size="small"
                  type="date"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.orderDate && Boolean(formik.errors.orderDate)
                  }
                />

                {/* <TextField
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
                                    // helperText={
                                    //     formik.touched.orderDate && formik.errors.orderDate
                                    // }
                                /> */}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                {/* <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={indentOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log("check value", newValue);
                                        if (newValue) {
                                            //  GetIndentIDById(newValue?.value);
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
                                /> */}
                <Autocomplete
                  disablePortal
                  id="combo-box-indent"
                  options={indentOptions.filter((e: any) => {
                    if (e.indenttype == "WorkShopPurchase") {
                      return e;
                    }
                  })}
                  fullWidth
                  size="small"
                  value={
                    indentOptions.find(
                      (option) => option.value === formik.values.indentId
                    ) || null
                  }
                  onChange={(event: any, newValue: any) => {
                    if (newValue) {
                      formik.setFieldValue("indentId", newValue.value);
                      formik.setFieldValue("indentNo", newValue.label);
                    }
                  }}
                  renderInput={(params) => (
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

                {formik.touched.indentNo && formik.errors.indentNo && (
                  <div style={{ color: "red", margin: "5px" }}></div>
                )}
              </Grid>

              <Grid item lg={4} xs={12}>
                {/* <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={vendorData}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("name", newValue?.value?.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel text={t("text.Vendorname")} required={false} />
                                            }
                                        />
                                    )}
                                /> */}
                <Autocomplete
                  disablePortal
                  id="combo-box-vendor"
                  options={vendorData}
                  fullWidth
                  size="small"
                  value={formik.values.name}
                  // value={
                  //     vendorData.find((option: any) => option.value === formik.values.vendorId) || null
                  // }
                  onChange={(event: any, newValue: any) => {
                    if (newValue) {
                      formik.setFieldValue("vendorId", newValue.value);
                      formik.setFieldValue("name", newValue.label);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.vendorName")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StatusOption}
                  fullWidth
                  value={
                    StatusOption.find(
                      (opt: any) => opt.value === formik.values.status
                    ) || null
                  }
                  size="small"
                  disabled
                  onChange={(event: any, newValue: any) => {
                    formik.setFieldValue("status", newValue?.value.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      disabled
                      label={
                        <CustomLabel
                          text={t("text.SelectStatus")}
                          required={false}
                        />
                      }
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
                          /^(data:image\/(jpeg|jpg|png);base64,)/.test(
                            formik.values.pOrderDoc
                          )
                            ? // formik.values.pOrderDoc.startsWith("data:image")
                              formik.values.pOrderDoc
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
                        src={nopdf} // Default placeholder image
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
              </Grid>

              <Grid
                item
                lg={12}
                md={12}
                xs={12}
                textAlign={"center"}
                fontSize={12}
                fontWeight={800}
              ></Grid>

              <Grid item xs={12} md={12} lg={12}>
                <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
                  <Table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid black",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: `var(--grid-headerBackground)`,
                        color: `var(--grid-headerColor)`,
                      }}
                    >
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
                                itemOption.find(
                                  (opt: any) =>
                                    opt.value === parseInt(row?.itemId)
                                ) || null
                              }
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "itemId",
                                  newValue?.value
                                )
                              }
                              renderInput={(params) => (
                                <TextField {...params} />
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
                              onChange={(e: any) =>
                                handleInputChange(
                                  index,
                                  "unitId",
                                  e.target.value
                                )
                              }
                              style={{ width: "95%", height: "35px" }}
                            >
                              <option value=""></option>
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
                              }}
                              onFocus={(e) => e.target.select()}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                                step: "any",
                                min: "0",
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
                              onChange={(e) =>
                                handleInputChange(index, "rate", e.target.value)
                              }
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                                step: "any",
                                min: "0",
                              }}
                              onFocus={(e) => e.target.select()}
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
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "amount",
                                  row.rate * row.quantity || 0
                                )
                              }
                              size="small"
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              onFocus={(e) => e.target.select()}
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
                              value={
                                taxData.find((e: any) => e.value === row.gstId)
                                  ?.label || ""
                              }
                              fullWidth
                              size="small"
                              sx={{ width: "80px" }}
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }
                                handleInputChange(
                                  index,
                                  "gst",
                                  parseFloat(newValue.label) || 0
                                );
                                handleInputChange(
                                  index,
                                  "gstId",
                                  newValue?.value
                                );
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
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
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "cgst",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
                              sx={{ width: "80px" }}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
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
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "sgst",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
                              sx={{ width: "80px" }}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
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
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.TotalAmount1")}
                        </td>
                        <td
                          style={{
                            textAlign: "end",
                            border: "1px solid black",
                          }}
                        >
                          <b></b>
                          {formik.values.totalAmount}
                          {/* {tableData.reduce((acc:any, row:any) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)} */}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.TotalCGstAmt")}
                        </td>
                        <td
                          style={{
                            textAlign: "end",
                            border: "1px solid black",
                          }}
                        >
                          <b></b>
                          {formik.values.totalCGST}
                          {/* {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.gst) || 0), 0)} */}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.TotalSGstAmt")}
                        </td>
                        <td
                          style={{
                            textAlign: "end",
                            border: "1px solid black",
                          }}
                        >
                          <b></b>
                          {formik.values.totalSGST}
                          {/* {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.gst) || 0), 0)} */}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.Totalnetamount")}
                        </td>
                        <td
                          style={{
                            textAlign: "end",
                            border: "1px solid black",
                          }}
                        >
                          {/* value={formik.values.netAmount} */}
                          <b></b>
                          {formik.values.netAmount || 0}
                          {/* {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.netAmount) || 0), 0)} */}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </Grid>

              <Grid item xs={12}>
                {location.state.isView?"":(
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: `var(--header-background)`,
                      margin: "1%",
                    }}
                  >
                    {t("text.update")}
                  </Button>

                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default EditWorkShopPurchaseOrder;
