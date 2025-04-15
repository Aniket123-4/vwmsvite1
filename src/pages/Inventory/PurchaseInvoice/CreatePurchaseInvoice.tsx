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
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import { getISTDate } from "../../../utils/Constant";
import { lang } from "moment";
type Props = {};
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
  { value: "Immediately", label: "Immediately" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Repeated", label: "Repeated" },
  { value: "Complete", label: "Complete" },
];

const CreatePurchaseInvoice = () => {
  const [isIndentSelected, setIsIndentSelected] = useState(false);
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();

  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState<{ label: string; value: number; details: any }[]>([]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const [purchaseData, setPurchaseData] = useState<any>([]);
  // const initialRowData: any = {
  const [tableData, setTableData] = useState<any>([{
    id: -1,
    invoiceId: 0,
    orderId: 0,
    itemId: 0,
    quantity: 0,
    rate: 0,
    amount: 0,
    gstId: 0,
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    netAmount: 0,
    fyId: 0,
    srn: 0,
    balQuantity: 0,
    isDelete: true,
    itemName: "",
    unitName: "",
    unitId: 0,
  }]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  // const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);

  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);
  const [itemOption, setitemOption] = useState<any>([]);

  const mrnTypeOption = [
    { value: "-1", label: t("text.selectMRN") },
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];

  useEffect(() => {
    // getPurchaseOrderNo();
    // getTaxData();
    // GetitemData();
    // GetUnitData();
    // getVendorData();
    // GetIndentID();
    //   getMRNNo();
    getVendorData();
    getTaxData();
    GetitemData();
    GetorderData();
    GetUnitData();

  }, []);

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
      orderId: -1,
      indentId: -1,
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
          label: item.name,
          value: item.venderId,
          details: item,
        })) || [];

      setVendorData([
        { value: "-1", label: t("text.SelectVendor") },
        ...arr,
      ] as any);
    }
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
  const GetOrderIDById = async (itemId: any) => {
    const collectData = {
      orderId: itemId,
      indentId: -1,
    };

    const response = await api.post(`PurchaseOrder/GetPurchaseOrder`, collectData);

    if (response.data.data.length > 0) {
      const orderDetails = response.data.data[0]; // Extract order details
      const vendorId = orderDetails.vendorId; // Get vendor ID

      setPurchaseData(orderDetails.purchaseOrderDetail); // Update purchase data

      const purchase = orderDetails.purchaseOrderDetail.map((item: any, index: any) => ({
        id: index + 1,
        invoiceId: 0,
        gstId: item?.gstId,
        rate: item?.rate,
        cgst: item?.cgst,
        sgst: item?.sgst,
        igst: item?.igst,
        netAmount: item?.netAmount,
        itemId: item?.itemId,
        unitId: item?.unitId,
        quantity: item?.quantity,
        amount: item?.amount,
        unitName: "",
        itemName: "",
        srn: 0,
        isDelete: true,
      }));

      setTableData(purchase);
      setIsIndentSelected(true);

      return vendorId; // Return vendor ID for immediate use
    }

    return null;
  };

  // const GetOrderIDById = async (itemId: any) => {
  //   const collectData = {
  //     orderId: itemId,

  //     indentId: -1,

  //   };
  //   const response = await api.post(`PurchaseOrder/GetPurchaseOrder`, collectData);
  //   const data = response.data.data[0]['purchaseOrderDetail'];
  //   setPurchaseData(data);

  //   console.log("indent option", data)


  //   const purchase = data.map((item: any, index: any) => ({

  //     id: index + 1,
  //     "invoiceId": 0,
  //     gstId: item?.gstId,
  //     rate: item?.rate,
  //     cgst: item?.cgst,
  //     sgst: item?.sgst,
  //     igst: item?.igst,
  //     netAmount: item?.netAmount,

  //     itemId: item?.itemId,
  //     unitId: item?.unitId,
  //     quantity: item?.quantity,

  //     amount: item?.amount,
  //     unitName: "",
  //     itemName: "",
  //     //  indentNo: "",
  //     "srn": 0,

  //     isDelete: true,


  //   }))

  //   setTableData(purchase);
  //   setIsIndentSelected(true);

  // };

  // const handleVendorSelect = (event: any, newValue: any) => {
  //   if (newValue && newValue.value !== "-1") {
  //     setVendorDetail(newValue.details); // Set vendor details for display
  //     formik.setFieldValue("vendorId", newValue.value); // Set vendorId in formik
  //   } else {
  //     setVendorDetail(null); // Clear vendor details
  // //     formik.setFieldValue("vendorId", null); // Explicitly set vendorId to null
  //   }
  // };


  console.log("tableData.....", tableData);

  // const isRowFilled = (row: any) => {
  //   console.log("isRowFilled", row);
  //   return (
  //     row.orderNo &&
  //     row.itemId &&
  //     row.batchNo &&
  //     row.balQuantity > 0 &&
  //     row.quantityquantity > 0 &&
  //     row.rate > 0
  //   );
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
      {
        // totalAmount: 0,
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




  const validateRow = (row: any) => {
    return row.itemId && row.quantity && row.rate > 0;
  };
  const formik = useFormik({
    initialValues: {
      invoiceId: 0,
      orderId: 0,
      invoiceNo: "",
      invoiceDate: defaultValues,
      orderNo: "",
      orderDate: defaultValues,
      vendorId: 0,
      totalAmount: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      totalGrossAmount: 0,
      disPer: 0,
      disAmt: 0,
      netAmount: 0,
      createdBy: "adminvm",
      updatedBy: "adminvm",
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: 0,
      fyId: 0,
      releasedBy: "",
      postedBy: "",
      releasedOn: defaultValues,
      postedOn: defaultValues,
      srn: 0,
      purchaseInvoiceDetail: [],
    },
    validationSchema: Yup.object().shape({
      invoiceNo: Yup.string().required("Invoice No. is required"),
      // orderNo: Yup.string().required(t("text.reqOrderNum")),
      // vendorId: Yup.date().required("Vendor is required"),
      // p_InvoiceDate: Yup.date().required(t("text.reqInvDate")),
      // supplierName: Yup.string().required(t("text.reqSuppName")),
    }),


    onSubmit: async (values) => {

      const validTableData = tableData.filter(validateRow);

      if (validTableData.length === 0) {
        alert("Please add some data in table for further process");
        return;
      }


      const response = await api.post(`PurchaseInv/UpsertPurchaseInvoice`,
        //   ...values,
        //   purchaseInvoiceDetail: filteredTableData,
        // });
        { ...values, purchaseInvoiceDetail: validTableData });
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
          // mrnType: selectedItem?.value?.toString(),
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
    }
    //  else if (field === "batchNo") {
    //     item.batchNo = value?.toString();
    // } 
    // else if (field === "balQuantity") {
    //     item.balQuantity = value === "" ? 0 : parseFloat(value);
    // } 
    else if (field === "quantity") {
      item.quantity = value === "" ? 0 : parseFloat(value);
    } else if (field === "rate") {
      item.rate = value === "" ? 0 : parseFloat(value);
    } else if (field === "gstId") {
      const selectedTax: any = taxData.find((tax: any) => tax.value === value);
      if (selectedTax) {
        item.gstRate = parseFloat(selectedTax.label) || 0;
        item.gstId = selectedTax.value || 0;
        item.cgstid = selectedTax.value || 0;
        item.sgstid = selectedTax.value || 0;
        item.igstid = 0;
        item.gst = item.gstRate;
      }
    } else {
      item[field] = value;
    }
    item.amount =
      (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100);
    item.netAmount = (item.amount + (parseFloat(item.gst) || 0));
    item.sgst = item.gst / 2;
    item.cgst = item.gst / 2;
    item.igst = 0;

    formik.setFieldValue("totalAmount", item.netAmount);

    tableData[index] = item;
    setTableData(tableData);
    updateTotalAmounts(tableData);
    // if (updatedItems[index].quantity >= 1 && updatedItems[index].rate > 0 && updatedItems[index].approveQuantity >= 1) {
    //   if (index === tableData.length - 1) {
    //     addRow();
    //   }
    // }

    let total = 0;
    tableData.forEach((row: any) => {
      total += row.amount;
    })
    formik.setFieldValue("netAmount", total);
    formik.setFieldValue("totalServiceAmount", total);
    formik.setFieldValue("totalItemAmount", total);
    // if (isRowFilled(item) && index === updatedItems.length - 1) {
    //     addRow();
    // }
  };
  const deleteRow = (index: any) => {
    const newData = tableData.filter((_: any, i: any) => i !== index);
    setTableData(newData);
  };
  const addRow = () => {
    setTableData([...tableData, {
      id: 0,
      invoiceId: -1,
      orderId: 0,
      itemId: 0,
      quantity: 0,
      rate: 0,
      amount: 0,
      gstId: 0,
      gstRate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      netAmount: 0,
      fyId: 0,
      srn: 0,
      balQuantity: 0,
      isDelete: true,
      itemName: "",
      unitName: "",
      unitId: 0,
    }]);
  };

  const back = useNavigate();
  console.log("formik.values", formik.values);


  console.log("invoice", formik.values.invoiceNo);
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
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.CreatePurchaseInvoice")}
          </Typography>

          <Grid item sm={4} xs={12}>
            <Typography style={{ marginTop: "-75px" }}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  marginBottom: 15,
                  marginTop: "45px",
                  backgroundColor: `var(--header-background)`,
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Typography>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel text={t("text.invoiceno")} required={true} />

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
                  }}
                  error={
                    formik.touched.invoiceNo &&
                    Boolean(formik.errors.invoiceNo)
                  }
                  helperText={
                    formik.touched.invoiceNo && formik.errors.invoiceNo
                  }
                />
              </Grid>


              <Grid item lg={4} xs={12}>
                <TextField
                  id="invoiceDate"
                  name="invoiceDate"
                  label={
                    <CustomLabel text={t("text.invoiceDate")} required={true} />
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
                  value={orderOption.find((opt: any) => opt.value === formik.values.orderId)?.label || ""}
                  fullWidth
                  size="small"
                  onChange={async (event: any, newValue: any) => {
                    if (newValue) {
                      const vendorId = await GetOrderIDById(newValue?.value); // Get vendor ID from function

                      formik.setFieldValue("orderNo", newValue?.label);
                      formik.setFieldValue("orderId", newValue?.value);

                      if (vendorId) {
                        formik.setFieldValue("vendorId", vendorId);

                        // Find vendor name from vendorData
                        const selectedVendor = vendorData.find((vendor: any) => vendor.value === vendorId);
                        if (selectedVendor) {
                          formik.setFieldValue("name", selectedVendor.label);
                        }
                      }
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.orderno")} required={true} />}
                    />
                  )}
                />



                {/* <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={orderOption}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {

                    console.log("check value", newValue);
                    if (newValue) {
                      GetOrderIDById(newValue?.value);
                      formik.setFieldValue("orderNo", newValue?.label);
                      formik.setFieldValue("orderId", newValue?.value);
                      formik.setFieldValue("vendorId", purchaseData[0]?.vendorId);
                     // formik.setFieldValue("name", purchaseData[purchaseData.findIndex((item: any) => item.orderId === newValue?.value)]?.name);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.orderno")}
                          required={true}
                        />
                      }
                    />
                  )}
                /> */}
              </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="orderDate"
                  name="orderDate"
                  label={
                    <CustomLabel text={t("text.orderdate")} required={true} />
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
                    formik.touched.orderDate && Boolean(formik.errors.orderDate)
                  }
                  helperText={
                    formik.touched.orderDate && formik.errors.orderDate
                  }
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                {/* <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorData}
                 value={vendorData.find((opt: any) => opt.value === formik.values.vendorId) || null}
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
                        <CustomLabel text={t("text.Vendorname")} required={false} />
                      }
                    />
                  )}
                /> */}
                <Autocomplete
                  disablePortal
                  id="vendor-autocomplete"
                  options={vendorData}
                  fullWidth
                  size="small"
                  value={vendorData.find((opt: any) => opt.value === formik.values.vendorId) || null}
                  onChange={(event: any, newValue: any) => {
                    if (newValue) {
                      formik.setFieldValue("vendorId", newValue?.value);
                      formik.setFieldValue("name", newValue?.label);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.Vendorname")} required={false} />}
                    />
                  )}
                />



              </Grid>

              {/* <Grid item lg={4} xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  size="small"
                  id="combo-box-demo"
                  options={vendorData}
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
              </Grid> */}

              {/* {vendorDetail?.contactPerson && (
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


              <Grid
                item
                lg={12}
                md={12}
                xs={12}
                textAlign={"center"}
                fontSize={12}
                fontWeight={800}
              >

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

                            {/* <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => {
                              if (tableData.length > 1) {
                                deleteRow(index)
                              } else {
                                alert("There should be atleast one row")
                              }
                            }}>
                              <DeleteIcon />
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
                              }}
                            >
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={unitOptions}
                                value={
                                  unitOptions.find((opt: any) => (opt.value) === row?.unitId) || null
                                }
                                fullWidth
                                size="small"
                                sx={{ width: "145px" }}
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
                                onFocus={e => e.target.select()}
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
                                value={row.amount}
                                size="small"
                                // onFocus={e => e.target.select()}
                                inputProps={{ readOnly: true }}
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
                                fullWidth
                                size="small"
                                value={taxData.find((opt: any) => opt.value === row.gstId) || null}
                                onChange={(e: any, newValue: any) =>
                                  handleInputChange(index, "gstId", newValue?.value)
                                }
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
                                value={row.sgst}
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
                                value={row.igst}
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
                          <td style={{ textAlign: "end", border: "1px solid black" }}>
                            <b></b>{formik.values.netAmount}
                           
                          </td>
                        </tr> */}
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

                            {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.netAmount) || 0), 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div> </Grid>
              )}

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
                    {t("text.save")}
                  </Button>

                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => {
                      formik.resetForm(); // Reset form values
                      setTableData([
                        {
                          id: 0,
                          invoiceId: 0,
                          orderId: 0,
                          itemId: 0,
                          quantity: 0,
                          rate: 0,
                          amount: 0,
                          gstId: 0,
                          gstRate: 0,
                          cgst: 0,
                          sgst: 0,
                          igst: 0,
                          netAmount: 0,
                          fyId: 0,
                          srn: 0,
                          balQuantity: 0,
                          isDelete: true,
                          itemName: "",
                          unitName: "",
                          unitId: 0,
                        },
                      ]); // Reset table data
                      //   setItemValue(null); // Reset Autocomplete selection
                      // setSelectedAction(null); // Reset selected action
                      setIsIndentSelected(false); // Reset indent selection
                      //   setmrnNoOptions([]); // Reset MRN options
                   //   setVendorDetail(null); // Reset vendor details
                      //   GetQcData();
                    }}
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

export default CreatePurchaseInvoice;
