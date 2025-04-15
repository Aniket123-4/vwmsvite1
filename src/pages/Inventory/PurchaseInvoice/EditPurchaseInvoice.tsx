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
  { value: 'Immediately', label: 'Immediately' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Repeated', label: 'Repeated' },
  { value: 'Complete', label: 'Complete' },
];

const EditPurchaseInvoice = () => {
  const [taxData, setTaxData] = useState<any>([]);

  const navigate = useNavigate();
  const initialRowData: any = {


    "id": -1,
    "invoiceId": 0,
    "orderId": 0,
    "itemId": 0,
    "quantity": 0,
    "rate": 0,
    "amount": 0,
    "gstId": 0,
    "gstRate": 0,
    "cgst": 0,
    "sgst": 0,
    "igst": 0,
    "netAmount": 0,
    "fyId": 0,
    "srn": 0,
    "balQuantity": 0,
    "isDelete": true,
    "itemName": "string",
    "unitName": "string",
    "unitId": 0


  };
  const [items, setItems] = useState<any>([{ ...initialRowData }]);
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const { t } = useTranslation();
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);
  const { defaultValues } = getISTDate();
  // const [items, setItems] = useState<any>([
  //   {
  //     id: -1,
  //     purchaseid: 1,
  //     user_Id: -1,
  //     ItemNameId: "",
  //     unit: "",
  //     qty: "",
  //     rate: "",
  //     amount: 0,
  //     tax1: 0,
  //     taxId1: 0,
  //     tax2: "P",
  //     discount: "",
  //     discountAmount: 0,
  //     netamount: 0,
  //     documentNo: "",
  //     documentDate: "",
  //     invoiceNo: "",
  //     supplier: "",
  //     orderNo: "",
  //     mrnNo: "",
  //     mrnDate: "",
  //     taxId3: "",
  //     tax3: "",
  //   },
  // ]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const [taxOption, setTaxOption] = useState<any>([]);
  const [itemOption, setitemOption] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [vendorOptions, setVendorOptions] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
  ]);
  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  // console.log("items", items);



  useEffect(() => {
    getTaxData();
    GetitemData();
    GetUnitData();
    GetorderData();
    getVendorData();
    getPurchaseInvoiceById(location.state.id);
    // GetIndentID();
  }, []);

  const getPurchaseInvoiceById = async (id: any) => {

    const collectData = {
      invoiceId: id,
    };
    try {
      const result = await api.post(`PurchaseInv/GetPurchaseInvoice`, collectData);
      const data = result.data.data;

      console.log("🚀 ~ getPurchaseInvoiceById ~ data:", data);

      if (data.length > 0) {
        const formattedData = data[0]['purchaseInvoiceDetail'].map((item: any, index: number) => ({
          invoiceId: item.invoiceId,
          orderId: item.orderId,
          id: index + 1,
          itemId: item.itemId,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          gstId: item.gstId,
          gstRate: item.gstRate,
          cgst: item.cgst,
          sgst: item.sgst,
          igst: item.igst,
          netAmount: item.netAmount,
          itemName: item.itemName,
          unitId: item.unitId,
          unitName: item.unitName,
        }));
        setTableData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  // API call



  const getVendorData = async () => {
    const result = await api.post(`Master/GetVendorMaster`, {
      "venderId": -1,
      "countryId": -1,
      "stateId": -1,
      "cityId": -1
    });
    if (result.data.isSuccess) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.venderId} - ${item.name}`,
          value: item.venderId,
          details: item,
        })) || [];

      setVendorOptions([
        { value: "-1", label: t("text.SelectVendor") },
        ...arr,
      ] as any);
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

      setTaxOption([{ value: "-1", label: t("text.tax") }, ...arr]);
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

  const GetorderData = async () => {
    const collectData = {
      "orderId": -1,
      "indentId": -1
    };
    const response = await api.post(
      `PurchaseOrder/GetPurchaseOrder`,
      collectData
    );
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["orderNo"],
        value: data[index]["orderId"],
      });
    }
    setorderOption(arr);
  };

  const validateItem = (item: any) => {
    return (
      item.itemNameId && item.itemNameId !== -1 &&
      (item.unit || item.unit === 0) &&
      parseFloat(item.qty) > 0 &&
      parseFloat(item.rate) > 0 &&
      parseFloat(item.amount) >= 0 &&
      (parseFloat(item.tax1) >= 0 || item.tax1 === "") &&
      (parseFloat(item.taxId1) >= 0 || item.taxId1 === "") &&
      (parseFloat(item.discount) >= 0 || item.discount === "") &&
      parseFloat(item.discountAmount) >= 0 &&
      parseFloat(item.netAmount) >= 0
    );
  };
  const handleVendorSelect = (event: any, newValue: any) => {
    if (newValue && newValue.value !== "-1") {
      setVendorDetail(newValue.details); // Set vendor details for display
      formik.setFieldValue("vendorId", newValue.value); // Set vendorId in formik
    } else {
      setVendorDetail(null); // Clear vendor details
      formik.setFieldValue("vendorId", null); // Explicitly set vendorId to null
    }
  };
  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedItems = [...tableData];
    let item = { ...updatedItems[index] };

    if (field === "orderNo") {
      const selectedItem = orderOption.find(
        (option: any) => option.value === value
      );
      console.log(selectedItem);
      if (selectedItem) {
        item = {
          ...item,
          mrnType: selectedItem?.value?.toString(),
          orderId: selectedItem?.value,
          orderNo: selectedItem?.label,
        };
      }
    } else if (field === "itemId") {
      const selectedItem = itemOption.find(
        (option: any) => option.value === value
      );
      console.log(selectedItem);
      if (selectedItem) {
        item = {
          ...item,
          itemId: selectedItem?.value,
          itemName: selectedItem?.label,
          item: selectedItem?.details,
        };
      }
    } else if (field === "batchNo") {
      item.batchNo = value?.toString();
    } else if (field === "balQuantity") {
      item.balQuantity = value === "" ? 0 : parseFloat(value);
    } else if (field === "quantity") {
      item.quantity = value === "" ? 0 : parseFloat(value);
    } else if (field === "rate") {
      item.rate = value === "" ? 0 : parseFloat(value);
    } else if (field === "gstId") {
      const selectedTax: any = taxData.find((tax: any) => tax.value === value);
      if (selectedTax) {
        item.gstRate = parseFloat(selectedTax.label) || 0;
        item.gstId = selectedTax.value || 0;
        item.cgst = selectedTax.value || 0;
        item.sgst = selectedTax.value || 0;
        item.igst = 0;
        // item.gst = item.gstRate;
      }
    } else {
      item[field] = value;
    }
    item.amount =
      (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100).toFixed(
      2
    );
    item.netAmount = (item.amount + (parseFloat(item.gst) || 0)).toFixed(2);
    item.sgst = item.gst / 2;
    item.cgst = item.gst / 2;
    item.igst = 0;

    formik.setFieldValue("totalAmount", item.netAmount);

    updatedItems[index] = item;
    setTableData(updatedItems);
    updateTotalAmounts(updatedItems);

    if (isRowFilled(item) && index === updatedItems.length - 1) {
      addRow();
    }
  };
  console.log("tableData.....", tableData);
  const isRowFilled = (row: any) => {
    console.log("isRowFilled", row);
    return (
      row.orderNo &&
      row.itemId &&
      row.batchNo &&
      row.balQuantity > 0 &&
      row.quantityquantity > 0 &&
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
        acc.totalGrossAmount += parseFloat(row.netAmount) || 0;
        return acc;
      },
      {
        totalAmount: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        totalGrossAmount: 0,
      }
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
  const formik = useFormik({
    initialValues: {
      invoiceId: location.state.invoiceId,
      // invoiceId: location.state.invoiceId,
      orderId: location.state.orderId || 0,
      invoiceNo: location.state.invoiceNo || "",
      invoiceDate: dayjs(location.state.invoiceDate || defaultValues).format("YYYY-MM-DD"),
      orderNo: location.state.orderNo || "",
      orderDate: dayjs(location.state.orderDate || defaultValues).format("YYYY-MM-DD"),
      vendorId: location.state.vendorId || 0,
      totalAmount: location.state.totalAmount || 0,
      totalCGST: location.state.totalCGST || 0,
      totalSGST: location.state.totalSGST || 0,
      totalIGST: location.state.totalIGST || 0,
      totalGrossAmount: location.state.totalGrossAmount || 0,
      disPer: location.state.disPer || 0,
      disAmt: location.state.disAmt || 0,
      netAmount: location.state.netAmount || 0,
      createdBy: location.state.createdBy || "",
      updatedBy: location.state.updatedBy || "",
      createdOn: dayjs(location.state.createdOn || defaultValues).format("YYYY-MM-DD"),
      updatedOn: dayjs(location.state.updatedOn || defaultValues).format("YYYY-MM-DD"),
      companyId: location.state.companyId || 0,
      fyId: location.state.fyId || 0,
      releasedBy: location.state.releasedBy || "",
      postedBy: location.state.postedBy || "",
      releasedOn: dayjs(location.state.releasedOn || defaultValues).format("YYYY-MM-DD"),
      postedOn: dayjs(location.state.postedOn || defaultValues).format("YYYY-MM-DD"),
      srn: location.state.srn || 0,
      purchaseInvoiceDetail: [],

    },

    onSubmit: async (values) => {

      const isFirstRowDefault = tableData[0] &&
        tableData[0].id === -1 &&
        tableData[0].invoiceId === 0 &&
        //  tableData[0].mrnType === "" &&
        tableData[0].orderId === 0 &&
        tableData[0].orderNo === "" &&
        tableData[0].batchNo === "" &&
        tableData[0].serialNo === "" &&
        tableData[0].qcStatus === "" &&
        tableData[0].itemId === 0 &&
        tableData[0].balQuantity === 0 &&
        tableData[0].quantity === 0 &&
        tableData[0].rate === 0 &&
        tableData[0].amount === 0 &&
        tableData[0].gstId === 0 &&
        tableData[0].gstRate === 0 &&
        tableData[0].cgst === 0 &&
        tableData[0].sgst === 0 &&
        tableData[0].igst === 0 &&
        tableData[0].cgstid === 0 &&
        tableData[0].sgstid === 0 &&
        tableData[0].igstid === 0 &&
        //   tableData[0].gst === "" &&
        tableData[0].netAmount === 0 &&
        Object.keys(tableData[0].item).length === 0;

      if (isFirstRowDefault) {
        alert("Please add values in the table before submitting.");
        return;
      }

      const filteredTableData = tableData.filter(row => {
        return !(
          row.id === -1 &&
          row.invoiceId === 0 &&
          //   row.mrnType === "" &&
          row.orderId === 0 &&
          row.orderNo === "" &&
          row.batchNo === "" &&
          row.serialNo === "" &&
          row.qcStatus === "" &&
          row.itemId === 0 &&
          row.balQuantity === 0 &&
          row.quantity === 0 &&
          row.rate === 0 &&
          row.amount === 0 &&
          row.gstId === 0 &&
          row.gstRate === 0 &&
          row.cgst === 0 &&
          row.sgst === 0 &&
          row.igst === 0 &&
          row.cgstid === 0 &&
          row.sgstid === 0 &&
          row.igstid === 0 &&
          row.gst === 0 &&
          row.netAmount === "" &&
          Object.keys(row.item).length === 0
        );

      });
      const payload = { ...values };
      console.log("Payload:", payload);
      const response = await api.post(`PurchaseInv/UpsertPurchaseInvoice`, {
        ...values,
        purchaseInvoiceDetail: filteredTableData,
      });
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/PurchaseInvoice");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });
  const back = useNavigate();
  console.log("formik.values", formik.values);


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
                {t("text.EditPurchaseInvoice")}
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

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.invoiceno")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="invoiceNo"
                  id="invoiceNo"
                  value={formik.values.invoiceNo}
                  placeholder={t("text.invoiceno")}
                  onChange={(e) => {
                    formik.setFieldValue("invoiceNo", e.target.value);
                  }
                  }
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="invoiceDate"
                  name="invoiceDate"
                  label={
                    <CustomLabel
                      text={t("text.invoiceDate")}
                      required={true}
                    />
                  }
                  value={formik.values.invoiceDate}
                  placeholder={t("text.invoiceDate")}
                  size="small"
                  type="date"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.invoiceDate &&
                    Boolean(formik.errors.invoiceDate)
                  }
                  helperText={
                    formik.touched.invoiceDate && formik.errors.invoiceDate
                  }
                />
              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={orderOption}
                  fullWidth
                  size="small"
                  value={
                    orderOption.find((option: any) => option.value === formik.values.orderId) || null
                  }
                  onChange={(event: any, newValue: any) => {
                    formik.setFieldValue("orderNo", newValue?.value.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.orderno")} required={false} />}
                    />
                  )}
                />
              </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="orderDate"
                  name="orderDate"
                  label={
                    <CustomLabel
                      text={t("text.orderdate")}
                      required={true}
                    />
                  }
                  value={formik.values.orderDate}
                  placeholder={t("text.orderdate")}
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





              <Grid item lg={4} xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  size="small"
                  id="combo-box-demo"
                  options={vendorOptions}
                  value={vendorOptions.find((option: any) => option.value === formik.values.vendorId) || null}
                  onChange={handleVendorSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectVendor")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {/* {vendorDetail?.gstinNo && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorGstin")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.gstinNo}
                    placeholder={t("text.vendorGstin")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {vendorDetail?.contactPerson && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorContactPerson")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.contactPerson}
                    placeholder={t("text.vendorContactPerson")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {vendorDetail?.permanentAddress && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorAddress")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.permanentAddress}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {vendorDetail?.mobileNo && (
                <Grid item lg={4} xs={12} md={6}>
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.vendorMobileNo")}
                        required={false}
                      />
                    }
                    value={vendorDetail?.mobileNo}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )} */}

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
                      {tableData.map((row, index) => (
                        <tr key={row.id} style={{ border: "1px solid black" }}>
                          {/* <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <DeleteIcon
                              onClick={() => deleteRow(index)}
                              style={{ cursor: "pointer" }}
                            />
                          </td> */}
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
                              textAlign: "center",
                              width: "170px"
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={itemOption}
                              fullWidth
                              size="small"
                              value={itemOption.find((opt: any) => opt.value === row.itemId) || null}
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
                                // label={
                                //     // <CustomLabel
                                //     //     text={t("text.selectItem")}
                                //     //     required={false}
                                //     // />
                                // }
                                />
                              )}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "170px"
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={unitOptions}
                              fullWidth
                              size="small"
                              value={unitOptions.find((opt: any) => opt.value === row.unitId) || null}
                              onChange={(e: any, newValue: any) => handleInputChange(index, "unitId", newValue?.value)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                //   label={
                                //       <CustomLabel text={t("text.selectUnit")} required={false} />
                                //   }
                                />
                              )}
                            />
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
                              value={row.amount}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>
                        <td style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <TextField
                                                      size="small"
                                                      value={row.gstRate || 0}
                                                      onChange={(e) => handleInputChange(index, "gstRate", e.target.value)} // ✅ Allow editing
                                                      onBlur={(e) => handleInputChange(index, "gstRate", e.target.value)}
                                                      inputProps={{ step: "any", min: "0" }}
                                                    />
                                                  </td>

                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={row.cgst.toFixed(2)}
                              size="small"
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
                              value={row.sgst.toFixed(2)}
                              size="small"
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
                                                        value={row.igst.toFixed(2)}
                                                        size="small"
                                                        inputProps={{ readOnly: true }}
                                                    />
                                                </td> */}
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={row.netAmount}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>
                        </tr>

                      ))}
                    </tbody>
                    <tfoot>
                      {/* <tr>
                                            <td colSpan={10} style={{ textAlign: "right", fontWeight: "bold" }}>
                                                {t("text.TotalAmount")}

                                            </td>
                                            <td style={{ textAlign: "center", border: "1px solid black" }}>
                                                {tableData.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
                                            </td>
                                        </tr> */}
                      {/* <tr>
                                            <td colSpan={10} style={{ textAlign: "right", fontWeight: "bold" }}>
                                                {t("text.Totaltaxamount")}


                                            </td>
                                            <td style={{ textAlign: "center", border: "1px solid black" }}>
                                                {tableData.reduce((acc, row) => acc + (parseFloat(row.gst) || 0), 0).toFixed(2)}
                                            </td>
                                        </tr> */}
                      <tr>
                        <td colSpan={9} style={{ textAlign: "right", fontWeight: "bold" }}>
                          {t("text.Totalnetamount")}

                        </td>
                        <td style={{ textAlign: "center", border: "1px solid black" }}>
                          {tableData.reduce((acc, row) => acc + (parseFloat(row.netAmount) || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>   </Grid>


              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default EditPurchaseInvoice;