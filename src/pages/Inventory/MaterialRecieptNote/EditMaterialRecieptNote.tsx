import {
  Autocomplete,
  Button,
  CardContent,
  Grid,
  Divider,
  TextField,
  Typography,
  Table,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { getId, getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import React from "react";

type Props = {};

const EditMaterialRecieptNote = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();
  const location = useLocation();
  const [orderData, setOrderData] = useState([]);
  const [orderVendorData, setOrderVendorData] = useState([]);
  const [toaster, setToaster] = useState(false);
  const userId = getId();
  const [vendorData, setVendorData] = useState<any>([]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const initialRowData: any = {
    sno: 0,
    id: 0,
    mrnId: 0,
    orderId: 0,
    orderNo: "",
    batchNo: "",
    serialNo: "",
    qcStatus: "",
    itemId: 0,
    balQuantity: 0,
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
    netAmount: 0,
    unitId: 0,
    totalGst: 0,
    qcApplicable: true,
    isDelete: false,
    itemName: "",
    unitName: "",
  };
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);

  const [itemOption, setitemOption] = useState<any>([]);

  const mrnTypeOption = [
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];

  useEffect(() => {
    getMrnById(location.state.mrnId);
    getVendorDatabyID(location.state.vendorId);
    getVendorData();
    getTaxData();
    GetitemData();
    GetorderData();
    GetUnitData();
    getPurchaseOrder();
    console.log("@@@@@@@@@@@@", location.state);
    const arr: any = [];
    orderData.map((item: any) => {
      if (item.id === location.state.vendorId) {
        arr.push(item);
      }
    });
    setOrderVendorData(arr);
  }, []);

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
  const getMrnById = (id: any) => {
    api
      .post(`QualityCheck/GetMrn`, { MrnId: id })
      .then((response) => {
        if (response.data.data.length > 0) {
          const data = response.data.data[0]?.mrnDetail || [];
          const formattedData = data.map((item: any) => ({
            ...item,
            mrnId: id, // Ensure mrnId is set for each row
          }));

          setTableData(formattedData);

          // Set mrnId in formik values
          formik.setFieldValue("mrnId", id);
        } else {
          console.error(
            "No MRN data found or the data structure is incorrect."
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching MRN data:", error);
      });
  };

  useEffect(() => { }, [tableData]);

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
      venderId: -1,
      countryId: -1,
      stateId: -1,
      cityId: -1,
    });
    if (result.data.isSuccess) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.venderId} - ${item.name}`,
          value: item.venderId,
          details: item,
        })) || [];

      setVendorData(arr);
    }
  };

  const getVendorDatabyID = async (id: any) => {
    const result = await api.post(`Master/GetVendorMaster`, {
      venderId: id,
    });
    if (result.data.isSuccess) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          details: item,
        })) || [];

      setVendorDetail(arr[0]["details"]);
    }
  };

  console.log("setVendorDetail", vendorDetail);

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

      setTaxData(arr);
    }
  };

  const handleVendorSelect = (event: any, newValue: any) => {
    console.log(newValue?.value);
    formik.setFieldValue("vendor.venderId", newValue?.value);
    formik.setFieldValue("vendorId", newValue?.value);
    if (newValue && newValue.value !== "-1") {
      setVendorDetail(newValue.details);
      formik.setFieldValue("vendor.venderId", newValue.value);
    } else {
      setVendorDetail([]);
      formik.setFieldValue("vendor.venderId", "");
    }
  };

  const handleInputChange = async (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedItems = [...tableData];
    let item = { ...updatedItems[index] };
    if (field === "itemId") {
      const selectedItem = itemOption.find((item: any) => item.value === value);
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

    item.netAmount = (item.amount + (parseFloat(item.gst) || 0)).toFixed(2);
    item.sgst = item.gst / 2;
    item.cgst = item.gst / 2;
    item.igst = 0;

    formik.setFieldValue("totalAmount", item.netAmount);

    updatedItems[index] = item;
    setTableData(updatedItems);
    updateTotalAmounts(updatedItems);
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
        // totalGrossAmount:0
      }
    );

    formik.setValues({
      ...formik.values,
      totalAmount: totals.totalAmount,
      totalCGST: totals.totalCGST,
      totalSGST: totals.totalSGST,
      totalIGST: totals.totalIGST,
      netAmount: totals.netAmount,
      totalGrossAmount: totals.netAmount,
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
    console.log("HI");
    // setTableData([...tableData, { ...initialRowData }]);
    setTableData((prevData) => [...prevData, { ...initialRowData }]);
  };

  console.log(location);
  const formik = useFormik({
    initialValues: {
      mrnId: location.state.mrnId || "", // Set mrnId from location.state
      mrnNo: location.state.mrnNo || "",
      mrnDate: dayjs(location.state.mrnDate).format("YYYY-MM-DD"),
      mrnType: location.state.mrnType || null,
      vendorId: location.state.vendorId,
      bill_ChalanNo: location.state.bill_ChalanNo,
      bill_ChalanDate: dayjs(location.state.bill_ChalanDate).format(
        "YYYY-MM-DD"
      ),
      shipmentNo: location.state.shipmentNo,
      remark: location.state.remark,
      totalAmount: location.state.totalAmount,
      totalCGST: location.state.totalCGST,
      totalSGST: location.state.totalSGST,
      totalIGST: location.state.totalIGST,
      totalGrossAmount: location.state.totalGrossAmount,
      disPer: location.state.disPer,
      disAmt: location.state.disAmt,
      netAmount: location.state.netAmount,
      qcApplicable: location.state.qcApplicable,
      qcStatus: location.state.qcStatus,
      createdBy: location.state.createdBy,
      updatedBy: userId,
      createdOn: location.state.createdOn || defaultValues,
      updatedOn: defaultValues,
      companyId: location.state.companyId,
      fyId: location.state.fyId,
      purOrderId: location.state.purOrderId,
      vendorName: location.state.vendorName,
      // vendor: {},
      name: location.state.name || "",
      netAmountv: location.state.netAmountv,
      mrnDetail: [],
    },
    onSubmit: async (values) => {
      // Filter or map tableData to include mrnId
      const filteredTableData = tableData.map((row) => ({
        ...row,
        mrnId: formik.values.mrnId, // Ensure mrnId is included in submission
      }));

      const response = await api.post(`QualityCheck/UpsertMrn`, {
        ...values,
        mrnDetail: filteredTableData,
      });

      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/storemanagement/materialreceiptnote");
      } else {
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

    const result = await api.post(
      `PurchaseOrder/GetPurchaseOrder`,
      collectData
    );
    const transData = result?.data?.data[0]["purchaseOrderDetail"];
    let arr: any = [];
    for (let i = 0; i < transData.length; i++) {
      arr.push({
        id: i + 1,
        mrnId: 0,
        orderId: transData[i]["orderId"],
        itemId: transData[i]["itemId"],
        unitId: transData[i]["unitId"],
        quantity: transData[i]["quantity"],
        rate: transData[i]["rate"],
        amount: transData[i]["amount"],
        gstId: transData[i]["gstId"],
        gstRate: transData[i]["gstRate"],
        cgst: transData[i]["cgst"],
        sgst: transData[i]["sgst"],
        igst: transData[i]["igst"],
        cgstid: transData[i]["cgstid"],
        sgstid: transData[i]["sgstid"],
        igstid: transData[i]["igstid"],
        netAmount: transData[i]["netAmount"],

        orderNo: "",
        batchNo: "",
        serialNo: "",
        qcStatus: "",
        balQuantity: 0,
        qcApplicable: true,
      });
    }
    // arr.push({ ...initialRowData });
    setTableData(arr);
  };

  const getPurchaseOrder = async () => {
    const collectData = {
      orderId: -1,
      indentId: -1,
    };

    const result = await api.post(
      `PurchaseOrder/GetPurchaseOrder`,
      collectData
    );
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
            {location.state.isView ? t("text.mrn") : t("text.EditMaterialRecieptNote")}
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
                        onChange={formik.handleChange}
                        name="qcApplicable"
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
                  fullWidth
                  size="small"
                  value={mrnTypeOption.find(
                    (opt: any) => opt.value === formik.values.mrnType
                  )}
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
                    <CustomLabel
                      text={t("text.EntershipmentNo")}
                      required={false}
                    />
                  }
                  value={formik.values.shipmentNo}
                  placeholder={t("text.EntershipmentNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
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
                    value={
                      vendorData[
                        vendorData.findIndex(
                          (e: any) => e.value == formik.values.vendorId
                        )
                      ]?.label || ""
                    }
                    fullWidth
                    size="small"
                    onChange={(event: any, newValue: any) => {
                      if (!newValue) {
                        return;
                      }
                      handleVendorSelect(event, newValue);
                      console.log(newValue?.value);
                      //getPurchaseOrderById(newValue?.value);
                      formik.setFieldValue("vendorId", newValue?.value);
                      const arr: any = [];
                      orderData.map((item: any) => {
                        if (item.id === newValue?.value) {
                          arr.push(item);
                        }
                      });
                      setOrderVendorData(arr);
                    }}
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

                {/* {vendorDetail?.mobileNo && (
                  <Grid item lg={4} xs={12} md={6}>
                    <Autocomplete
                      disablePortal
                      size="small"
                      id="combo-box-demo"
                      options={orderVendorData}
                      onChange={(e, newValue: any) => {
                        if (!newValue) {
                          return;
                        }
                        getPurchaseOrderById(newValue?.id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <CustomLabel
                              text={t("text.SelectOrderNO")}
                              required={false}
                            />
                          }
                        />
                      )}
                    />


                  </Grid>
                )} */}
              </Grid>

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
                                //addRow();
                                alert("Can't add row")
                              }}
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteIcon
                              onClick={() => {
                                // if (tableData.length > 1) {
                                //   deleteRow(index);
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
                              // textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={orderOption}
                              disabled={true}
                              fullWidth
                              size="small"
                              sx={{ width: "155px" }}
                              value={
                                orderOption[
                                  orderOption.findIndex(
                                    (e: any) => e.value == row.orderId
                                  )
                                ]?.label || ""
                              }
                              // value={orderOption.find((opt: any) => opt.value == row.orderId)}
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "orderId",
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
                              value={
                                itemOption[
                                  itemOption.findIndex(
                                    (e: any) => e.value == row.itemId
                                  )
                                ]?.label || ""
                              }
                              //value={itemOption.find((opt: any) => opt.value === row.itemId)}
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
                            <TextField
                              disabled={true}
                              value={row.batchNo}
                              size="small"
                              sx={{ width: "150px" }}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "batchNo",
                                  e.target.value
                                )
                              }
                              onFocus={(e) => {
                                e.target.select();
                              }}
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
                                unitOptions[
                                  unitOptions.findIndex(
                                    (e: any) => e.value == row.unitId
                                  )
                                ]?.label || ""
                              }
                              // value={
                              //   unitOptions.find((opt) => (opt.value) === row?.unitId) || null
                              // }
                              disabled={true}
                              fullWidth
                              size="small"
                              sx={{ width: "130px" }}
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
                              size="small"
                              sx={{ width: "70px" }}
                              value={row.quantity}
                              disabled={true}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              onFocus={(e) => {
                                e.target.select();
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
                              size="small"
                              value={row.quantity}
                              sx={{ width: "70px" }}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
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
                              size="small"
                              sx={{ width: "90px" }}
                              value={row.rate}
                              disabled={true}
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
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={taxData}
                              disabled={true}
                              fullWidth
                              size="small"
                              sx={{ width: "80px" }}
                              value={
                                taxData[
                                  taxData.findIndex(
                                    (e: any) => e.value == row.gstId
                                  )
                                ]?.label || ""
                              }
                              // value={taxData.find((opt: any) => opt.value == row.gstId)}
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "gstId",
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
                            <TextField
                              value={row.cgst}
                              sx={{ width: "100px" }}
                              size="small"
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
                              size="small"
                              sx={{ width: "100px" }}
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
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={row.netAmount}
                              size="small"
                              sx={{ width: "100px" }}
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
                          colSpan={11}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.TotalAmount1")}
                        </td>
                        {/* <td colSpan={6} style={{ textAlign: "end" }}>
                          <b>:</b>{formik.values.totalAmount}
                        </td> */}
                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          {tableData
                            .reduce(
                              (acc, row) => acc + (parseFloat(row.amount) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={11}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.TotalCGstAmt")}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          {tableData
                            .reduce(
                              (acc, row) => acc + (parseFloat(row.cgst) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={11}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.TotalSGstAmt")}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          {tableData
                            .reduce(
                              (acc, row) => acc + (parseFloat(row.sgst) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={11}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.Totalnetamount")}
                        </td>

                        {/* <td colSpan={6} style={{ textAlign: "end" }}>
                          <b>:</b>{formik.values.netAmount}
                        </td> */}
                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          {tableData
                            .reduce(
                              (acc, row) =>
                                acc + (parseFloat(row.netAmount) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>{" "}
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <TextField
                  placeholder={t("text.Remark")}
                  value={formik.values.remark}
                  onChange={(e: any) =>
                    formik.setFieldValue("remark", e.target.value)
                  }
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
                {/* <Button
                  disabled
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: "#e0e0e0", // Faded color for disabled
                    color: "#9e9e9e", // Text color for disabled
                    //  backgroundColor: `var(--header-background)`,
                    //color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.update")}
                </Button> */}

                {location.state.isView ? "" : (
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.update")}
                  </Button>
                )}

              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                {location.state.isView ? "" : (
                  <Button
                    type="reset"
                    fullWidth
                    style={{
                      backgroundColor: "#F43F5E",
                      color: "white",
                      marginTop: "10px",
                    }}
                    onClick={(e: any) => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default EditMaterialRecieptNote;
