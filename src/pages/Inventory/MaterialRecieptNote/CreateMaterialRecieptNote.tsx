import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  MenuItem,
  TextField,
  Typography,
  Table,
} from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { getId, getISTDate } from "../../../utils/Constant";

type Props = {};



const CreateMaterialRecieptNote = (props: Props) => {
  let navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();
  const userId = getId();
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [isIndentSelected, setIsIndentSelected] = useState(false);
  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState<any>([]);
  const [orderData, setOrderData] = useState([]);
  const [orderVendorData, setOrderVendorData] = useState([]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const [IsbatchNO, setBatchno] = useState("");
  const initialRowData: any = {
    "sno": 0,
    "id": 0,
    "mrnId": 0,
    "orderId": 0,
    "orderNo": "",
    "batchNo": "",
    "serialNo": "",
    "qcStatus": "",
    "itemId": 0,
    "balQuantity": 0,
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
    "netAmount": 0,
    "unitId": null,
    "totalGst": 0,
    "qcApplicable": true,
    "isDelete": false,
    "itemName": "",
    "unitName": ""
  };
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);

  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);
  const [itemOption, setitemOption] = useState<{ value: number; label: string; unitId?: number }[]>([
    { value: -1, label: t("text.itemMasterId") },
  ]);
  const mrnTypeOption = [
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];

  useEffect(() => {
    getPurchaseOrder()
    getMRNNo();
    getVendorData();
    getTaxData();
    GetitemData();
    GetorderData();
    GetUnitData();
    getBATCHNo();
  }, []);
 
  const handleOrderSelect = (event: any, newValue: any) => {
    if (newValue.length > 0) {
      setSelectedOrder(newValue); // Store selected orders
      setOpenDialog(true); // Open the confirmation dialog
    }
  };

  const handleConfirm = async () => {
    if (selectedOrder && selectedOrder.length > 0) {
      let mergedTableData: any[] = [];

      for (const order of selectedOrder) {
        const items = await getPurchaseOrderById(order.orderId); // ✅ Fetch items
        mergedTableData = [...mergedTableData, ...items]; // ✅ Merge data
      }

      setTableData(mergedTableData); // ✅ Update table with all selected orders
      setIsIndentSelected(true);
    }
    setOpenDialog(false); // Close dialog
  };


  // const handleConfirm = () => {
  //   if (selectedOrder) {
  //     getPurchaseOrderById(selectedOrder.orderId);
  //   }
  //   setOpenDialog(false); // Close dialog
  // };

  const handleCancel = () => {
    setSelectedOrder(null); // Clear selection
    setOpenDialog(false); // Close dialog
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
    setUnitOptions(arr);
  };

  // const GetUnitData =async()=>{
  //   const response= await api.post(`UnitMaster/GetUnitMaster`,{unitId:-1});
  //   const data=response.data.data;
  //   const unitOptions=data.map((unit:any)=>({
  //     label: unit.unitName,
  //     value: unit.unitId}));
  //   setUnitOptions(unitOptions);
  // };
  const getMRNNo = async () => {
    const result = await api.get(`QualityCheck/GetMaxcMrnNo`);
    if (result?.data.status === 1) {
      formik.setFieldValue("mrnNo", result.data.data[0]["mrnNo"]);
    }
  };


  const getBATCHNo = async () => {
    try {
      const response = await api.get(`QualityCheck/GetMaxBatchNo`);
      if (response?.data?.status === 1 && response?.data?.data?.length > 0) {

        setBatchno(response.data.data[0].batchNo)
      } else {
        toast.error(response?.data?.message || "Failed to fetch batch number");
        return ""; // Return empty if no batch number is found
      }
    } catch (error) {
      toast.error("Error fetching batch number");
      return ""; // Return empty in case of an error
    }
  };

  console.log("Fetching batchNo from API...");




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
    const arr:any = [];
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
      "venderId": -1,
      "countryId": -1,
      "stateId": -1,
      "cityId": -1
    });
    if (result.data.isSuccess) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.name}`,
          value: item.venderId,
          details: item,
        })) || [];

      setVendorData(arr);
    }
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

      setTaxData(arr);
    }
  };
  const handleVendorSelect = (event: any, newValue: any) => {
    if (newValue && newValue.value !== "-1") {
      setVendorDetail(newValue.details);
      formik.setFieldValue("vendorId", newValue.value);

      // Filter orders by vendorId instead of orderId
      const filteredOrders = orderData.filter(
        (order: any) => order.vendorId === newValue.value
      );

      setOrderVendorData(filteredOrders);
    } else {
      setVendorDetail(null);
      formik.setFieldValue("vendorId", null);
      setOrderVendorData([]);
    }
  };
  const handleInputChange = async (index: number, field: string, value: any) => {
    const updatedItems = [...tableData];
    let item = { ...updatedItems[index] };
    if (field === "itemId") {
      const selectedItem = itemOption.find((item) => item.value === value);
      updatedItems[index].itemId = selectedItem?.value || 0;
      updatedItems[index].unitId = selectedItem?.unitId || 0; // Automatically set unitId

      console.log("Selected Item:", selectedItem);
    } else {
      updatedItems[index][field] = value;
    }
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
    }
    //  else if (field === "itemId") {
    //   const selectedItem = itemOption.find(
    //     (option: any) => option.value === value
    //   );
    //   console.log(selectedItem);
    //   if (selectedItem) {
    //     item = {
    //       ...item,
    //       itemId: selectedItem?.value,
    //       itemName: selectedItem?.label,
    //       item: selectedItem?.details,
    //     };
    //   }
    // }
    else if (field === "batchNo") {
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
    item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100).toFixed(
      2
    );
    const batchNo = await getBATCHNo();
    if (batchNo) {
      item.batchNo = batchNo; // Set the fetched batch number
    }
    item.netAmount = (item.amount + (parseFloat(item.gst) || 0)).toFixed(2);
    item.sgst = item.gst / 2;
    item.cgst = item.gst / 2;
    item.igst = 0;

    formik.setFieldValue("totalAmount", item.netAmount);

    updatedItems[index] = item;
    setTableData(updatedItems);
    updateTotalAmounts(updatedItems);

    // if (isRowFilled(item) && index === updatedItems.length - 1) {
    //   addRow();
    // }
  };

  console.log("tableData.....", tableData);

  const isRowFilled = (row: any) => {
    console.log("isRowFilled", row);
    return (
      row.orderNo &&
      row.itemId &&
      row.batchNo &&
      row.balQuantity > 0 &&
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
      },
      {
        totalAmount: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        netAmount: 0,
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

      "sno": 0,
      "mrnId": 0,
      "mrnNo": "",
      "mrnDate": defaultValues,
      "mrnType": "",
      "vendorId": null,
      "bill_ChalanNo": "",
      "bill_ChalanDate": defaultValues,
      "shipmentNo": "",
      "remark": "",
      "totalAmount": 0,
      "totalCGST": 0,
      "totalSGST": 0,
      "totalIGST": 0,
      "totalGrossAmount": 0,
      "disPer": 0,
      "disAmt": 0.0,
      "netAmount": 0,
      "qcApplicable": true,
      "qcStatus": "",
      "createdBy": userId,
      "updatedBy": "",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "purOrderId": 0,
      "vendorName": "",
      "name": "",
      "netAmountv": 0,
      "mrnDetail": []


    },

    validationSchema: Yup.object({
      // bill_ChalanNo: Yup.string()
      //  .required(t("text.reqBillNum")),
      bill_ChalanNo: Yup.string()
        .required(t("text.reqBillNum")),
      vendorId: Yup.string()
        .required(t("text.reqvendor")),
      shipmentNo: Yup.string()
        .required(t("text.reqshipmentNo")),
    }),

    onSubmit: async (values) => {
      updateTotalAmounts(tableData);

      const isFirstRowDefault = tableData[0] &&
        tableData[0].id === -1 &&
        tableData[0].mrnId === 0 &&
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
        tableData[0].unitId === 0 &&
        tableData[0].totalGst === 0 &&
        tableData[0].itemName === 0 &&
        tableData[0].unitName === 0 &&
        tableData[0].netAmount === 0 &&

        Object.keys(tableData[0].item).length === 0;

      if (isFirstRowDefault) {
        alert("Please add values in the table before submitting.");
        return;
      }

      const filteredTableData = tableData.filter(row => {
        return !(
          row.id === -1 &&
          row.mrnId === 0 &&
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
          row.unitId === "" &&
          tableData[0].totalGst === 0 &&
          tableData[0].itemName === 0 &&
          tableData[0].unitName === 0 &&
          //  tableData[0].netAmount === 0 &&
          Object.keys(row.item).length === 0
        );
      });


      const payload = { ...values };
      console.log("Payload:", payload);


      const response = await api.post(`QualityCheck/UpsertMrn`, {
        ...values,
        mrnDetail: filteredTableData,
      });
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/materialreceiptnote");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const back = useNavigate();
  const getPurchaseOrderById = async (id: any) => {
    const collectData = {
      orderId: id,
      indentId: -1,
    };

    const result = await api.post(`PurchaseOrder/GetPurchaseOrder`, collectData);
    const transData = result?.data?.data[0]?.purchaseOrderDetail || [];
    const orderData = result?.data?.data[0]; // Get overall order details

    let arr = transData.map((item: any, i: number) => ({
      id: i + 1,
      // id: i + 1,
      mrnId: 0,
      orderId: transData[i]["orderId"],
      itemId: transData[i]["itemId"],
      unitId: transData[i]["unitId"],
      quantity: transData[i]["quantity"],
      rate: transData[i]["rate"],
      amount: transData[i]["amount"],
      gstId: transData[i]["gstId"],
      gstRate: transData[i]["gstRate"],
      "cgst": transData[i]["cgst"],
      "sgst": transData[i]["sgst"],
      "igst": transData[i]["igst"],
      "cgstid": transData[i]["cgstid"],
      "sgstid": transData[i]["sgstid"],
      "igstid": transData[i]["igstid"],
      netAmount: transData[i]["netAmount"],
      batchNo: IsbatchNO || "",
      orderNo: "",
      // "batchNo": "",
      "serialNo": "",
      "qcStatus": "",
      "balQuantity": 0,
      "itemName": "",
      "unitName": "",
      "totalGst": 0,
      "qcApplicable": true
    }));

    // ✅ Set Formik values
    formik.setFieldValue("totalAmount", orderData?.totalAmount || 0);
    formik.setFieldValue("totalCGST", orderData?.totalCGST || 0);
    formik.setFieldValue("totalSGST", orderData?.totalSGST || 0);
    formik.setFieldValue("netAmount", orderData?.netAmount || 0);
    formik.setFieldValue("totalGrossAmount", orderData?.netAmount || 0);

    return arr; // ✅ Return items to be used in `handleConfirm`
  };


 

  const getPurchaseOrder = async () => {

    const collectData = {
      "orderId": -1,
      "indentId": -1
    };

    const result = await api.post(`PurchaseOrder/GetPurchaseOrder`, collectData);
    const transData = result?.data?.data[0]["purchaseOrderDetail"];

    const data = result.data.data;
    const orderArr = data.map((item: any) => ({
      ...item,
      id: item.orderId,
      value: item.orderId,
      label: item.orderNo,
    }));
    setOrderData(orderArr);
  };



  console.log("formik.values", formik.values);

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
            {t("text.createMaterialRecieptNote")}
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
              <Grid item lg={12} xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.qcApplicable}
                        onChange={(e) => formik.setFieldValue("qcApplicable", e.target.checked)}
                      />
                    }
                    label={t("text.QCApplicable")}
                  />
                </FormGroup>
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="mrnNo"
                  name="mrnNo"
                  label={
                    <CustomLabel text={t("text.mrnNo")} required={false} />
                  }
                  value={formik.values.mrnNo}
                  size="small"
                  fullWidth
                  InputLabelProps={{ "aria-readonly": true }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="mrnDate"
                  name="mrnDate"
                  label={
                    <CustomLabel text={t("text.mrnDate")} required={true} />
                  }
                  value={formik.values.mrnDate}
                  placeholder={t("text.mrnDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={mrnTypeOption}
                  value={mrnTypeOption.find((option) => option.value === formik.values.mrnType)?.label || null}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("mrnType", newValue?.value.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectmrnType")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="bill_ChalanNo"
                  name="bill_ChalanNo"
                  label={
                    <CustomLabel
                      text={t("text.Enterbill_ChalanNo")}
                      required={true}
                    />
                  }
                  value={formik.values.bill_ChalanNo}
                  placeholder={t("text.Enterbill_ChalanNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bill_ChalanNo && formik.errors.bill_ChalanNo && (
                  <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.bill_ChalanNo)}</div>
                )}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="bill_ChalanDate"
                  name="bill_ChalanDate"
                  label={
                    <CustomLabel
                      text={t("text.bill_ChalanDate")}
                      required={true}
                    />
                  }
                  type="date"
                  value={formik.values.bill_ChalanDate}
                  placeholder={t("text.bill_ChalanDate")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="shipmentNo"
                  name="shipmentNo"
                  label={
                    <CustomLabel text={t("text.EntershipmentNo")} required={true} />
                  }
                  value={formik.values.shipmentNo}
                  placeholder={t("text.EntershipmentNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.shipmentNo && formik.errors.shipmentNo && (
                  <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.shipmentNo)}</div>
                )}
              </Grid>

              <Grid container item spacing={2} xs={12} md={12} lg={12}>
                <Grid item lg={12} xs={12}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    {t("text.Vendordetails")}
                  </Typography>
                </Grid>
                <Divider />



                <Grid item lg={4} xs={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={vendorData}
                    value={vendorData.find((option: any) => option.value === formik.values.vendorId)?.label || ""}
                    fullWidth
                    size="small"
                    onChange={(event: any, newValue: any) => {
                      handleVendorSelect(event, newValue);
                      console.log(newValue?.value);
                      formik.setFieldValue("vendorId", newValue?.value);
                      const filteredOrders = orderData.filter(
                        (order: any) => order.vendorId === newValue?.value
                      );
                      setOrderVendorData(filteredOrders);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel text={t("text.SelectVendor")} required={true} />
                        }
                      />
                    )}
                  />
                  {formik.touched.vendorId && formik.errors.vendorId && (
                    <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.vendorId)}</div>
                  )}
                </Grid>
                {vendorDetail?.gstinNo && (
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
                )}
                {vendorDetail?.mobileNo && (
                  <Grid item lg={4} xs={12} md={6}>
                    <Autocomplete
                      multiple
                      disablePortal
                      size="small"
                      id="combo-box-demo"
                      options={orderVendorData} // Show all orders for selected vendor
                      getOptionLabel={(option: any) => option.orderNo}
                      onChange={(event, newValue: any) => {
                        if (newValue.length === 0) {
                          alert("Please select at least one order number.");
                        } else {
                          handleOrderSelect(event, newValue);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<CustomLabel text={t("text.SelectOrderNO")} required={true} />}
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
              <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>Confirm Order Selection</DialogTitle>
                <DialogContent>
                  Are you sure you want to proceed with Order No: <b>{selectedOrder?.orderNo}</b>?
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCancel} color="secondary">Cancel</Button>
                  <Button onClick={handleConfirm} color="primary" autoFocus>Proceed</Button>
                </DialogActions>
              </Dialog>
              {isIndentSelected && (
                <Grid item xs={12} md={12} lg={12}>
                  <div style={{ overflow: "scroll", margin: 0, padding: 0 }}>

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
                            {t("text.OrderNo")}
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
                            {t("text.BatchNo")}
                          </th>

                          <th
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            {t("text.unit")}
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            {t("text.BalQty")}
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            {t("text.ApproveQty")}
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

                            <td
                              style={{
                                border: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              <AddCircleIcon
                                onClick={() => {
                                  //addRow();
                                  alert("Can't add row")
                                }}

                                style={{ cursor: "pointer" }}
                              />
                              <DeleteIcon
                                onClick={() => {
                                  // if (tableData.length > 1) {
                                  //   deleteRow(index)
                                  // } else {
                                  //   alert("Atleast one row should be there");
                                  // }
                                  alert("Can't delete row")
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                //width: "135px"
                              }}
                            >
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={orderOption}
                                value={orderOption.find((opt: any) => opt.value === row.orderId) || null}
                                disabled={true}
                                fullWidth
                                size="small"
                                sx={{ width: "155px" }}
                                onChange={(e: any, newValue: any) =>
                                  handleInputChange(
                                    index,
                                    "orderNo",
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
                                // textAlign: "center",
                              }}
                            >
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={itemOption}
                                disabled={true}
                                fullWidth
                                size="small"
                                sx={{ width: "155px" }}
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
                                disabled={true}
                                value={row.batchNo || ""} // Bind to row.batchNo
                                id="BatchNo"
                                name="BatchNo"
                                size="small"
                                sx={{ width: "150px" }}
                                onChange={(e) => handleInputChange(index, "batchNo", e.target.value)}
                              />
                            </td>



                            <td style={{ border: "1px solid black", textAlign: "center" }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={unitOptions}
                                value={
                                  unitOptions.find((opt) => (opt.value) === row?.unitId) || null
                                }
                                disabled={true}
                                fullWidth
                                size="small"
                                sx={{ width: "130px" }}
                                onChange={(e, newValue: any) =>
                                  handleInputChange(index, "unitId", newValue?.value)
                                }

                                renderInput={(params: any) => (
                                  <TextField
                                    {...params}
                                  //  label={<CustomLabel text={t("text.selectUnit")} />}
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
                                disabled={true}
                                size="small"
                                sx={{ width: "70px" }}
                                value={row.quantity}
                                onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                                onFocus={e => e.target.select()}
                                inputProps={{ style: { textAlign: "right" }, "aria-readonly": true, step: "any", min: "0" }}
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
                                value={row.quantity}
                                sx={{ width: "70px" }}
                                onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                                inputProps={{ style: { textAlign: "right" }, "aria-readonly": true, step: "any", min: "0" }}
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
                                disabled={true}
                                size="small"
                                value={row.rate}
                                sx={{ width: "70px" }}
                                onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                                inputProps={{ style: { textAlign: "right" }, "aria-readonly": true, step: "any", min: "0" }}
                                onFocus={e => e.target.select()}
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
                                disabled={true}
                                fullWidth
                                size="small"
                                sx={{ width: "80px" }}
                                value={taxData.find((opt: any) => opt.value === row.gstId) || null}
                                onChange={(e: any, newValue: any) =>
                                  handleInputChange(index, "gstId", newValue?.value)
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
                              <TextField
                                value={row.cgst.toFixed(2)}
                                size="small"
                                sx={{ width: "100px" }}
                                inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
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
                                sx={{ width: "100px" }}
                                inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
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
                                sx={{ width: "100px" }}
                                inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
                              />
                            </td>
                          </tr>

                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={11} style={{ textAlign: "right", fontWeight: "bold" }}>
                            {t("text.TotalAmount1")}

                          </td>
                          {/* <td colSpan={6} style={{ textAlign: "end" }}>
                          <b>:</b>{formik.values.totalAmount}
                        </td> */}
                          <td style={{ textAlign: "right", border: "1px solid black" }}>
                            {tableData.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={11} style={{ textAlign: "right", fontWeight: "bold" }}>
                            {t("text.TotalCGstAmt")}


                          </td>
                          <td style={{ textAlign: "right", border: "1px solid black" }}>
                            {tableData.reduce((acc, row) => acc + (parseFloat(row.cgst) || 0), 0).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={11} style={{ textAlign: "right", fontWeight: "bold" }}>
                            {t("text.TotalSGstAmt")}


                          </td>
                          <td style={{ textAlign: "right", border: "1px solid black" }}>
                            {tableData.reduce((acc, row) => acc + (parseFloat(row.sgst) || 0), 0).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={11} style={{ textAlign: "right", fontWeight: "bold" }}>
                            {t("text.Totalnetamount")}

                          </td>

                          {/* <td colSpan={6} style={{ textAlign: "end" }}>
                          <b>:</b>{formik.values.netAmount}
                        </td> */}
                          <td style={{ textAlign: "right", border: "1px solid black" }}>
                            {tableData.reduce((acc, row) => acc + (parseFloat(row.netAmount) || 0), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                </Grid>)}
              <Grid item xs={12} md={12} lg={12}>
                <TextField
                  placeholder={t("text.Remark")}

                  value={formik.values.remark}
                  onChange={(e: any) => formik.setFieldValue("remark", e.target.value)}
                  style={{
                    width: "100%",
                    height: "auto",
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "16px",
                    resize: "none",
                  }}
                />
              </Grid>

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

                    getMRNNo();
                    setIsIndentSelected(false);
                    setVendorDetail(null); // Reset vendor details

                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div >
  );
};

export default CreateMaterialRecieptNote;

