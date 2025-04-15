


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
  TextareaAutosize,
  Table,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { getId, getISTDate } from "../../../utils/Constant";

type Props = {};



const CreateQualityCheck = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();
  const userId = getId();
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);
  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState<{ label: string; value: string; details: any }[]>([]);
  const [vendorDetail, setVendorDetail] = useState<any>();
  const initialRowData: any = {
    id: -1,
    qcId: 0,
    mrnId: 0,
    orderId: 0,
    orderNo: "",
    itemId: 0,
    mrnQty: 0,
    acceptQty: 0,
    rejectQty: 0,
    rate: 0,
    amount: 0,
    gstId: 0,
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    netAmount: 0,
    reason: "",
    batchNo: "",
    "unitId": 0,
    "unitName": "",
    "itemName": "",
    "mrnNo": ""
    //  totalGst: 0,

    // item: {},
  };
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);
  const [qcOptions, setQcOptions] = useState([]);
  const [itemOption, setitemOption] = useState<{ value: number; label: string; unitId?: number }[]>([
    { value: -1, label: t("text.itemMasterId") },
  ]);
  const [mrnNoOptions, setmrnNoOptions] = useState([
    { value: "-1", label: t("text.selectMRN") },
  ]);
  const [storeOptions, setstoreOptions] = useState([]);

  const mrnTypeOption = [
    { value: "-1", label: t("text.selectMRN") },
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];

  useEffect(() => {
    // getMRNNo();
    GetorderData();
    getVendorData();
    getTaxData();
    GetitemData();
    GetUnitData();
    GetmrnData();
    GetQcData();
  }, []);

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
  const GetmrnData = async () => {
    try {
      const collectData = {
        "mrnId": -1,
        // "show": true,
        // "exportOption": "",
        // "type": 0
      }
      const response = await api.post(`QualityCheck/GetMrn`, collectData);
      const data = response.data.data;
      if (data && data.length > 0) {


        // Set QC number in formik and options

        const arr = data.map((item: any) => ({
          label: item.mrnNo,
          value: item.mrnId,
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          bill_ChalanNo: item.bill_ChalanNo,
          shipmentNo: item.shipmentNo


        }));

        setmrnNoOptions(arr);
      }
    } catch (error) {
      console.error("Error fetching QC data:", error);
    }
  };




  const GetQcData = async () => {
    try {
      const response = await api.get(`QualityCheck/GetMaxQcNo`,
        { headers: {} },
      );

      const data = response.data.data;

      // Assuming the first item in data has the latest QC number
      if (data && data.length > 0) {
        const latestQcNo = data[0]["qcNo"];

        // Set QC number in formik and options
        formik.setFieldValue('qcNo', latestQcNo);
        const arr = data.map((item: any) => ({
          label: item.qcNo,
          value: item.qcId,
        }));

        setQcOptions(arr);
      }
    } catch (error) {
      console.error("Error fetching QC data:", error);
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
        unitId: data[index]["unitId"],
      });
    }
    setitemOption(arr);
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
    const result = await api.post(`UnitMaster/GetTaxMaster`, {
      taxId: -1,
    });
    if (result.data.isSuccess) {
      const arr =
        result?.data?.data?.map((item: any) => ({
          label: `${item.taxPercentage}`,
          value: item.taxId,
        })) || [];

      setTaxData(arr);
    }
  };

  // const handleVendorSelect = (event: any, newValue: any) => {
  //   console.log(newValue?.value);

  // };
  const handleVendorSelect = (event: any, newValue: any) => {
    if (newValue && newValue.value !== "-1") {
      setVendorDetail(newValue.details); // Set vendor details for display
      formik.setFieldValue("vendorId", newValue.value); // Set vendorId in formik
    } else {
      setVendorDetail(null); // Clear vendor details
      formik.setFieldValue("vendorId", null); // Explicitly set vendorId to null
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
    // const batchNo = await getBATCHNo();
    // if (batchNo) {
    //   item.batchNo = batchNo; // Set the fetched batch number
    // }
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
  // const handleInputChange = (index: number, field: string, value: any) => {
  //   const updatedItems = [...tableData];

  //   let item = { ...updatedItems[index] };
  //   if (field === "itemId") {
  //     const selectedItem = itemOption.find((item) => item.value === value);
  //     updatedItems[index].itemId = selectedItem?.value || 0;
  //     updatedItems[index].unitId = selectedItem?.unitId || 0; // Automatically set unitId

  //     console.log("Selected Item:", selectedItem);
  //   } else {
  //     updatedItems[index][field] = value;
  //   }

  //   if (field === "itemId") {
  //     const selectedItem = itemOption.find(
  //       (option: any) => option.value === value
  //     );
  //     if (selectedItem) {
  //       item = {
  //         ...item,
  //         itemId: selectedItem.value,
  //         itemName: selectedItem.label,
  //         // item: selectedItem.details,
  //       };
  //     }
  //   }
  //    else if (field === "batchNo") {
  //     item.batchNo = value.toString();
  //   } else if (field === "mrnQty") {
  //     item.mrnQty = value === "" ? 0 : parseFloat(value);
  //   } else if (field === "acceptQty") {
  //     item.acceptQty = value === "" ? 0 : parseFloat(value);
  //   } else if (field === "rejectQty") {
  //     item.rejectQty = value === "" ? 0 : parseFloat(value);
  //   } else if (field === "rate") {
  //     item.rate = value === "" ? 0 : parseFloat(value);
  //   } else if (field === "totalGst") {
  //     item.totalGst = value === "" ? 0 : parseInt(value);
  //   }
  //   else if (field === "gstId") {
  //     const selectedTax: any = taxData.find((tax: any) => tax.value === value);
  //     if (selectedTax) {
  //       item.gstRate = parseFloat(selectedTax.label) || 0;
  //       item.gstId = selectedTax.value || 0;
  //       item.cgstid = selectedTax.value || 0;
  //       item.sgstid = selectedTax.value || 0;
  //       item.igstid = 0;
  //     }
  //   } else {
  //     item[field] = value;
  //   }

  //   // Calculate amount if required fields are filled
  //   if (item.mrnQty && item.rate) {
  //     item.amount = (parseFloat(item.mrnQty) || 0) * (parseFloat(item.rate) || 0);
  //   }

  //   // Calculate GST and total amount if gstRate is selected
  //   if (item.gstRate) {
  //     item.totalGst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100)
  //       ;
  //     item.sgst = (parseFloat(item.totalGst) / 2)
  //       ;
  //     item.cgst = (parseFloat(item.totalGst) / 2)
  //       ;
  //     item.igst = 0;
  //   }

  //   // Calculate net amount
  //   item.netAmount = (parseFloat(item.amount) + parseFloat(item.totalGst || "0"))
  //     ;

  //   formik.setFieldValue("totalAmount", item.netAmount);

  //   updatedItems[index] = item;
  //   setTableData(updatedItems);
  //   updateTotalAmounts(updatedItems);

  //   // if (isRowFilled(item) && index === updatedItems.length - 1) {
  //   //   addRow();
  //   // }
  // };


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
      qcId: 0,
      qcNo: "",
      qcDate: defaultValues,
      mrnId: 0,
      //storeid: 0,
      mrnType: "",
      vendorId: 0,
      bill_ChalanNo: "",
      bill_ChalanDate: defaultValues,
      shipmentNo: "",
      remark: "",
      totalAmount: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      totalGrossAmount: 0,
      disPer: 0,
      disAmt: 0,
      netAmount: 0,
      createdBy: userId,
      updatedBy: "",
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: 0,
      fyId: 0,
      qcDetail: [],
      srn: 0,
      amount: 0,
      vendor: "",
      mrnDate: defaultValues,
      mrnNo: "",
      //storeName: ""
    },

    validationSchema: Yup.object({
      mrnNo: Yup.string()
        .required(t("text.reqmrnNo")),
    }),


    onSubmit: async (values: any) => {

      const isFirstRowDefault = tableData[0] &&
        tableData[0].id === -1 &&
        tableData[0].qcId === 0 &&
        tableData[0].mrnId === 0 &&
        tableData[0].orderId === 0 &&
        tableData[0].orderNo === "" &&
        tableData[0].itemId === 0 &&
        tableData[0].mrnQty === "" &&
        tableData[0].acceptQty === "" &&
        tableData[0].rejectQty === "" &&
        tableData[0].rate === "" &&
        tableData[0].amount === "" &&
        tableData[0].gstId === "" &&
        tableData[0].gstRate === "" &&
        tableData[0].cgst === "" &&
        tableData[0].sgst === "" &&
        tableData[0].igst === "" &&
        tableData[0].unitId === "" &&
        tableData[0].unitName === "" &&
        tableData[0].itemName === "" &&
        // "unitId": 0,
        // "unitName": "string",
        // "itemName": "string",
        tableData[0].netAmount === "" &&
        tableData[0].reason === "" &&
        tableData[0].batchNo === "" &&
        tableData[0].mrnNo === "" &&

        Object.keys(tableData[0].item).length === 0;

      if (isFirstRowDefault) {
        alert("Please add values in the table before submitting.");
        return;
      }

      values.qcDetail = tableData
      values.vendor = vendorDetail?.label || "";
      //values.vendor = vendorDetail;

      const response = await api.post(`QualityCheck/UpsertQc`,
        values

      );
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/qualitycheck");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const back = useNavigate();
  // const getPurchaseOrderByIndent = async (id: any) => {
  //   const collectData = {
  //     mrnId: id,
  //   };

  //   const response = await api.post(`QualityCheck/GetMrn`, collectData);
  //   const transData = response?.data?.data[0]["mrnDetail"];
  //   console.log("mrnDetail", transData);

  //   let arr: any = [];
  //   for (let i = 0; i < transData.length; i++) {
  //     arr.push({
  //       id: transData[i]["id"],
  //       qcId: transData[i]["mrnId"],
  //       mrnId: transData[i]["mrnId"],
  //       orderId: transData[i]["orderId"],
  //       orderNo: transData[i]["orderNo"],
  //       itemId: transData[i]["itemId"],
  //       mrnQty: Number(transData[i]["quantity"]) + Number(transData[i]["balQuantity"]),
  //       acceptQty: transData[i]["quantity"],
  //       rejectQty: transData[i]["balQuantity"],
  //       rate: transData[i]["rate"],
  //       amount: transData[i]["amount"],
  //       gstId: transData[i]["gstId"], // Ensure GST ID is set
  //       gstRate: transData[i]["gstRate"], // ✅ Fix: Set gstRate from API
  //       cgst: transData[i]["cgst"],
  //       sgst: transData[i]["sgst"],
  //       igst: transData[i]["igst"],
  //       netAmount: transData[i]["netAmount"],
  //       reason: formik.values.remark,
  //       batchNo: transData[i]["batchNo"],
  //       unitId: transData[i]["unitId"],
  //       unitName: transData[i]["unitName"],
  //       itemName: transData[i]["itemName"],
  //       mrnNo: "",
  //     });
  //   }

  //   setTableData(arr);
  // };


  const getPurchaseOrderByIndent = async (id: any) => {
    const collectData = {
      "mrnId": id,
      // "show": true,
      // "exportOption": "",
      // "type": 0
    }


    const response = await api.post(`QualityCheck/GetMrn`, collectData);
    //const data = response.data.data;
    const transData = response?.data?.data[0]["mrnDetail"];
    console.log("mrnDetail", transData);

    let arr: any = [];
    for (let i = 0; i < transData.length; i++) {
      arr.push({
        id: transData[i]["id"],
        qcId: transData[i]["mrnId"],
        mrnId: transData[i]["mrnId"],



        orderId: transData[i]["orderId"],
        orderNo: transData[i]["orderNo"],
        itemId: transData[i]["itemId"],

        // mrnQty: transData[i]["quantity"],
        mrnQty: Number(transData[i]["quantity"]) + Number(transData[i]["balQuantity"]),
        acceptQty: transData[i]["quantity"],
        rejectQty: transData[i]["balQuantity"],
        rate: transData[i]["rate"],
        amount: transData[i]["amount"],
        //gst: transData[i]["gst"],
        gstId: transData[i]["gstId"],
        gstRate: transData[i]["gstRate"],
        cgst: transData[i]["cgst"],
        sgst: transData[i]["sgst"],
        igst: transData[i]["igst"],
        netAmount: transData[i]["netAmount"],
        reason: formik.values.remark,
        //totalGst: transData[i]["totalGst"],
        batchNo: transData[i]["batchNo"],
        unitId: transData[i]["unitId"],
        unitName: transData[i]["unitName"],
        itemName: transData[i]["itemName"],
        // mrnNo: transData[i]["mrnNo"],
        mrnNo: "",

      });
    }
    // arr.push({ ...initialRowData });
    setTableData(arr);
    formik.setFieldValue("totalAmount", response?.data?.data[0]["totalAmount"]);
    formik.setFieldValue("totalCGST", response?.data?.data[0]["totalCGST"]);
    formik.setFieldValue("totalSGST", response?.data?.data[0]["totalSGST"]);
    formik.setFieldValue("netAmount", response?.data?.data[0]["netAmount"]);
    formik.setFieldValue("totalGrossAmount", response?.data?.data[0]["netAmount"]);
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
            {t("text.createQualityCheck")}
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
              {/* Qc No Field */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="qcNo"
                  name="qcNo"
                  label={
                    <CustomLabel text={t("text.qcNo1")} required={false} />
                  }
                  value={formik.values.qcNo}
                  placeholder={t("text.qcNo1")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              {/* Qc Date Field */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="qcDate"
                  name="qcDate"
                  label={
                    <CustomLabel text={t("text.qcDate1")} required={true} />
                  }
                  value={formik.values.qcDate}
                  placeholder={t("text.qcDate1")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.qcDate && formik.errors.qcDate && (
                  <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.qcDate)}</div>
                )}

              </Grid>
              {/* MRN No DropDown */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={mrnNoOptions}
                  value={mrnNoOptions.find((option: any) => option.value === formik.values.mrnId)?.label || ""}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (newValue) {
                      formik.setFieldValue("mrnNo", newValue.label);
                      formik.setFieldValue("mrnId", newValue.value);
                      formik.setFieldValue("vendorId", newValue.vendorId);
                      formik.setFieldValue("vendor", newValue.vendorName);
                      formik.setFieldValue("bill_ChalanNo", newValue.bill_ChalanNo);
                      formik.setFieldValue("shipmentNo", newValue.shipmentNo);

                      // Update vendorDetail
                      const selectedVendor = vendorData.find(
                        (vendor: any) => vendor.value === newValue.vendorId
                      );
                      setVendorDetail(selectedVendor ? selectedVendor.details : null);

                      getPurchaseOrderByIndent(newValue.value);
                    }
                  }}

                  // onChange={(event: any, newValue: any) => {
                  //   console.log(newValue?.value);
                  //   formik.setFieldValue('mrnNo', newValue?.label);
                  //   formik.setFieldValue('mrnId', newValue?.value);
                  //   formik.setFieldValue('vendorId', newValue?.vendorId);
                  //   formik.setFieldValue('vendor', newValue?.vendor);
                  //   formik.setFieldValue('bill_ChalanNo', newValue?.bill_ChalanNo);
                  //   formik.setFieldValue('shipmentNo', newValue?.shipmentNo);



                  //   getVendorData()



                  //   getPurchaseOrderByIndent(newValue?.value)
                  //   //formik.setFieldValue("mrnNo", newValue?.value.toString());
                  // }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectmrnNo")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.mrnNo && formik.errors.mrnNo && (
                  <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.mrnNo)}</div>
                )}
              </Grid>
              {/* Challan No Field */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="bill_ChalanNo"
                  name="bill_ChalanNo"
                  label={
                    <CustomLabel
                      text={t("text.Enterbill_ChalanNo")}
                      required={false}
                    />
                  }
                  value={formik.values.bill_ChalanNo}
                  placeholder={t("text.Enterbill_ChalanNo")}
                  disabled
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
              {/* Challan Date Field */}
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
                {formik.touched.bill_ChalanDate && formik.errors.bill_ChalanDate && (
                  <div style={{ color: "red", margin: "5px" }}>{String(formik.errors.bill_ChalanDate)}</div>
                )}

              </Grid>
              {/* Shipment No Field */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="shipmentNo"
                  name="shipmentNo"
                  label={
                    <CustomLabel text={t("text.EntershipmentNo")} required={false} />
                  }
                  value={formik.values.shipmentNo}
                  placeholder={t("text.EntershipmentNo")}
                  size="small"
                  fullWidth
                  disabled
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
                <Grid item lg={4} xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    disabled
                    options={vendorData}
                    value={vendorData.find((opt: any) => opt.value === formik.values.vendorId) || null}
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
                      disabled
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
                      disabled
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
                      disabled
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
                      disabled
                      style={{ backgroundColor: "white" }}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                )}
                {/* <Grid item lg={4} xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={vendorData}
                    value={vendorData.find((opt: any) => opt.value === formik.values.vendorId) || null}
                    onChange={(event: any, newValue: any) => {
                      console.log(newValue?.value);

                      formik.setFieldValue("vendor", newValue?.label || "");
                      formik.setFieldValue("vendorId", newValue?.value || -1);
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
                </Grid> */}

              </Grid>

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
                          title="MRN Quantity"
                        >
                          {t("text.MrnQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}


                          title="Accept Quantity"
                        >
                          {t("text.AcceptQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}

                          title="Reject Quantity"
                        >
                          {t("text.RejectQty")}
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
                        {t("text.Amount")}
                      </th> */}

                        {


                        }
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
                              disabled={true}
                              value={orderOption.find((opt: any) => opt.value === row.orderId) || null}
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
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
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
                              size="small"
                              disabled={true}
                              value={
                                row.mrnQty
                              }
                              onChange={(e) => handleInputChange(index, "mrnQty", e.target.value)}
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
                              size="small"
                              value={row.acceptQty}
                              onChange={(e) => handleInputChange(index, "acceptQty", e.target.value)}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                                step: "any", min: "0"
                              }}
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
                              size="small"
                              disabled={true}
                              value={Number(row.mrnQty) - Number(row.acceptQty)}
                              onChange={(e) => {
                                const newvalue = Number(row.mrnQty) - Number(row.acceptQty)
                                handleInputChange(index, "rejectQty", newvalue)
                              }}
                              onFocus={e => e.target.select()}
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
                              size="small"
                              value={row.rate}
                              disabled={true}
                              sx={{ width: "70px" }}
                              onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                                step: "any", min: "0"
                              }}
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
                              fullWidth
                              size="small"
                              value={
                                taxData[taxData.findIndex((e: any) => e.value == row.gstId)] || ""
                              }
                              //value={taxData.find((opt: any) => opt.value == row.gstId)}
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

                          {/* <td style={{ border: "1px solid black", textAlign: "center" }}>
                            <TextField
                              size="small"
                              disabled={true}
                              value={row.gstRate || 0}
                              onChange={(e) => handleInputChange(index, "gstRate", e.target.value)} // ✅ Allow editing
                              onBlur={(e) => handleInputChange(index, "gstRate", e.target.value)}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                                step: "any", min: "0"
                              }}
                            />
                          </td> */}



                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={row.cgst}
                              disabled={true}
                              size="small"
                              sx={{ width: "100px" }}
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
                              disabled={true}
                              size="small"
                              sx={{ width: "100px" }}
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
                              value={row.netAmount}
                              disabled={true}
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
                        <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
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
                        <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
                          {t("text.TotalCGstAmt")}


                        </td>
                        <td style={{ textAlign: "right", border: "1px solid black" }}>
                          {tableData.reduce((acc, row) => acc + (parseFloat(row.cgst) || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
                          {t("text.TotalSGstAmt")}


                        </td>
                        <td style={{ textAlign: "right", border: "1px solid black" }}>
                          {tableData.reduce((acc, row) => acc + (parseFloat(row.sgst) || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
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
                </div>   </Grid>



              <Grid item xs={12} md={12} lg={12}>
                <TextareaAutosize
                  placeholder="Remark"
                  minRows={1}
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
                    setTableData([
                      {
                        id: 0,
                        qcId: 0,
                        mrnId: 0,
                        orderId: 0,
                        orderNo: "",
                        itemId: 0,
                        mrnQty: 0,
                        acceptQty: 0,
                        rejectQty: 0,
                        rate: 0,
                        amount: 0,
                        gstId: 0,
                        gstRate: 0,
                        cgst: 0,
                        sgst: 0,
                        igst: 0,
                        netAmount: 0,
                        reason: "",
                        batchNo: "",
                        "unitId": 0,
                        "unitName": "",
                        "itemName": "",
                        "mrnNo": ""
                      },
                    ]); // Reset table data

                    setVendorDetail(null); // Reset vendor details
                    GetQcData();
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

export default CreateQualityCheck;
