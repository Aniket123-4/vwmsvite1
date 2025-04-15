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
import 'react-toastify/dist/ReactToastify.css';
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

type Props = {};

const EditQualityCheck = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValues } = getISTDate();
  const location = useLocation();
  const userId = getId();

  const [toaster, setToaster] = useState(false);
  const [vendorData, setVendorData] = useState<any>([]);
  // const [vendorDetail, setVendorDetail] = useState<any>();
  const initialRowData: any = {
    "id": -1,
    "qcId": 0,
    "mrnId": 0,
    "orderId": 0,
    "orderNo": "",
    "itemId": 0,
    "mrnQty": 0,
    "acceptQty": 0,
    "rejectQty": 0,
    "rate": 0,
    "amount": 0,
    "gstId": 0,
    "gstRate": 0,
    "cgst": 0,
    "sgst": 0,
    "igst": 0,
    "netAmount": 0,
    "reason": "",
    "batchNo": "",
    "unitId": 0,
    mrnNo: 0

  };
  type MrnOption = {
    label: string;
    value: number;
  };
  const [tableData, setTableData] = useState([{ ...initialRowData }]);
  const [taxData, setTaxData] = useState<any>([]);
  const [mrnNoOptions, setmrnNoOptions] = useState<MrnOption[]>([]);
  const [orderOption, setorderOption] = useState([
    { value: -1, label: t("text.id") },
  ]);
  const [unitOptions, setUnitOptions] = useState<any>([
    { value: -1, label: t("text.SelectUnitId") },
  ]);
  const [itemOption, setitemOption] = useState<any>([]);
  const [qcOptions, setQcOptions] = useState([]);


  const mrnTypeOption = [
    { value: "-1", label: t("text.selectMRN") },
    { value: "1", label: "Bill" },
    { value: "2", label: "Challan" },
  ];

  useEffect(() => {
    getQcById(location.state.qcId);
    // getVendorDatabyID(location.state.vendorId);
    getVendorData();
    getTaxData();
    GetitemData();
    GetorderData();
    GetmrnData();
    GetUnitData();
    //GetQcData();

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
    setUnitOptions(arr);
  };
  const GetmrnData = async () => {
    const collectData = {
      "mrnId": -1
    };
    const response = await api.post(`QualityCheck/GetMrn`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["mrnNo"],
        value: data[index]["mrnId"],
      });
    }
    setmrnNoOptions(arr);
  };

  // const GetQcData = async () => {
  //   try {
  //     const response = await api.get(`Qc/GetMaxQcNo`,
  //       { headers: { 'QcId': '-1' } },
  //     );

  //     const data = response.data.data;

  //     // Assuming the first item in data has the latest QC number
  //     if (data && data.length > 0) {
  //       const latestQcNo = data[0]["qcNo"];

  //       // Set QC number in formik and options
  //       formik.setFieldValue('qcNo', latestQcNo);
  //       const arr = data.map((item: any) => ({
  //         label: item.qcNo,
  //         value: item.qcId,
  //       }));

  //       setQcOptions(arr);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching QC data:", error);
  //   }
  // };





  const getQcById = (id: any) => {


    api.post(`QualityCheck/GetQc`, { QcId: id })
      .then((response) => {
        if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const data = response.data.data[0]['qcDetail'];
          if (data != null) {
            const arr = data?.map((item: any) => {
              return {
                id: item.id,
                qcId: item.qcId,
                mrnId: item.mrnId,
                orderId: item.orderId,
                orderNo: item.orderNo,
                batchNo: item.batchNo,
                mrnQty: item.mrnQty,
                acceptQty: item.acceptQty,
                itemId: item.itemId,
                itemName: item.itemName || "",
                rejectQty: item.rejectQty,
                unitId: item.unitId,
                unitName: item.unitName,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
                gstId: item.gstId,
                gstRate: item.gstRate,
                cgst: item.cgst,
                sgst: item.sgst,
                igst: item.igst,
                gst: item.gst,
                mrnNo: "",
                reason: item.reason,
                netAmount: item.netAmount
                //  item: {},
              }
            })
            setTableData(arr);
            updateTotalAmounts(arr);
            // if (arr.length > 0 ) {
            //   addRow();
            // }
          }
        } else {

          console.error("No MRN data found or the data structure is incorrect.");
        }
      })
      .catch((error) => {
        console.error("Error fetching MRN data:", error);
      });
  };

  useEffect(() => {
    // if (tableData.length > 0 && isRowFilled(tableData[tableData.length - 1]) && tableData[tableData.length - 1].id !== -1) {
    //   addRow(); // Call addRow to add a new initial row
    // }
  }, [tableData]);



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
      indentId: -1
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

  // const getVendorData = async () => {
  //   const result = await api.post(`Master/GetVendorMaster`, {
  //    "venderId": -1,
  // "countryId": -1, 
  // "stateId": -1,
  // "cityId": -1
  //   });
  //   if (result.data.isSuccess) {
  //     const arr =
  //       result?.data?.data?.map((item: any) => ({
  //         label: item.name,
  //         value: item.venderId,
  //         details: item,
  //       }));

  //     setVendorData(arr);
  //   }
  // };

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

      setVendorData(arr);
    }
  };


  const getTaxData = async () => {
    const result = await api.post(`UnitMaster/GetTaxMaster`, {
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


  // const handleVendorSelect = (event: any, newValue: any) => {
  //   if (newValue) {
  //     // Set vendorId and vendor name correctly
  //     formik.setFieldValue("vendor", newValue.details?.name || ""); // Set vendor name
  //     formik.setFieldValue("vendorId", newValue?.value || 0); // Set vendorId
  //   } else {
  //     // Reset values when no vendor is selected
  //     formik.setFieldValue("vendor", ""); // Reset vendor name
  //     formik.setFieldValue("vendorId", 0); // Reset vendorId
  //   }
  // };
  const handleVendorSelect = (event: any, newValue: any) => {
    if (newValue) {
      // Set vendorId and vendor name correctly
      formik.setFieldValue("vendor", newValue.details?.name || ""); // Set vendor name
      formik.setFieldValue("vendorId", newValue?.value || 0); // Set vendorId
    } else {
      // Reset values when no vendor is selected
      formik.setFieldValue("vendor", ""); // Reset vendor name
      formik.setFieldValue("vendorId", 0); // Reset vendorId
    }
  };



  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedItems = [...tableData];
    let item = { ...updatedItems[index] };

    if (field === "orderNo" || field === "vendor") {
      const selectedItem = orderOption.find(
        (option: any) => option.value === value
      );
      if (selectedItem) {
        item = {
          ...item,
          mrnType: selectedItem.value.toString(),
          orderId: selectedItem.value,
          orderNo: selectedItem.label,
        };
      }
    } else if (field === "itemId") {
      const selectedItem = itemOption.find(
        (option: any) => option.value === value
      );
      if (selectedItem) {
        item = {
          ...item,
          itemId: selectedItem.value,
          itemName: selectedItem.label,
          item: selectedItem.details,
        };
      }
    } else if (field === "batchNo") {
      item.batchNo = value.toString();
    }
    else if (field === "unitId") {
      item.unitId = value.toString();

    } else if (field === "mrnQty") {
      item.mrnQty = value === "" ? 0 : parseFloat(value);
    } else if (field === "acceptQty") {
      item.acceptQty = value === "" ? 0 : parseFloat(value);
    } else if (field === "rejectQty") {
      item.rejectQty = value === "" ? 0 : parseFloat(value);
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
      }
    } else {
      item[field] = value;
    }

    // Fill in default quantities if editing row
    if (field === "edit" && item) {
      item.mrnQty = item.mrnQty || 0;
      item.acceptQty = item.acceptQty || 0;
      item.rejectQty = item.rejectQty || 0;
    }

    // Calculate amount if required fields are filled
    if (item.mrnQty && item.rate) {
      item.amount = (parseFloat(item.mrnQty) || 0) * (parseFloat(item.rate) || 0);
    }

    // Calculate GST and total amount if gstRate is selected
    if (item.gstRate) {
      item.gst = ((item.amount * (parseFloat(item.gstRate) || 0)) / 100).toFixed(2);
      item.sgst = (parseFloat(item.gst) / 2).toFixed(2);
      item.cgst = (parseFloat(item.gst) / 2).toFixed(2);
      item.igst = 0;
    }

    // Calculate net amount
    item.netAmount = (parseFloat(item.amount) + parseFloat(item.gst || "0")).toFixed(2);

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
      totalAmount: totals.totalAmount,
      totalCGST: totals.totalCGST,
      totalSGST: totals.totalSGST,
      totalIGST: totals.totalIGST,
      totalGrossAmount: totals.totalGrossAmount,
    });
  };



  const deleteRow = (index: number) => {
    if (tableData.length === 1) {
      // If there's only one row, reset it to initial values
      setTableData([{ ...initialRowData }]);
    } else {
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
    }
    updateTotalAmounts(tableData);
  };

  const addRow = () => {
    console.log("HI")
    // setTableData([...tableData, { ...initialRowData }]);
    setTableData((prevData) => [...prevData, { ...initialRowData }]);
  };

  console.log(location)
  const formik = useFormik({
    initialValues: {
      qcId: location.state.id,
      qcNo: location.state.qcNo,
      qcDate: dayjs(location.state.qcDate).format("YYYY-MM-DD"),
      mrnId: location.state.mrnId,
      mrnType: location.state.mrnType,
      // vendorId: location.state.vendorId,
      bill_ChalanNo: location.state.bill_ChalanNo,
      bill_ChalanDate: dayjs(location.state.bill_ChalanDate).format("YYYY-MM-DD"),
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
      // qcApplicable: location.state.qcApplicable,
      // qcStatus: location.state.qcStatus,
      createdBy: location.state.createdBy,
      updatedBy: userId,
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: location.state.companyId,
      fyId: location.state.fyId,
      qcDetail: [],
      vendorId: location.state.vendorId || "",
      vendor: location.state.vendor || "",
      mrnDate: defaultValues,
      mrnNo: location.state.mrnNo,
      srn: location.state.srn,
    },


    onSubmit: async (values) => {
      const isFirstRowDefault = tableData[0] &&
        tableData[0].id === -1 &&
        tableData[0].qcId === 0 &&
        tableData[0].mrnId === 0 &&
        tableData[0].orderId === 0 &&
        tableData[0].orderNo === "" &&
        tableData[0].itemId === 0 &&
        tableData[0].itemName === "" &&
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
        tableData[0].gst === "" &&
        tableData[0].netAmount === "" &&
        tableData[0].reason === "" &&
        tableData[0].batchNo === "" &&
        tableData[0].mrnNo === "" &&
        Object.keys(tableData[0].item).length === 0;

      if (isFirstRowDefault) {
        alert("Please add values in the table before submitting.");
        return;
      }

      const filteredTableData = tableData.filter(row => {
        return !(
          row.id === -1 &&
          row.qcId === 0 &&
          row.mrnId === "" &&
          row.orderId === "" &&
          row.orderNo === "" &&
          row.batchNo === "" &&
          row.itemId === "" &&
          row.itemName === "" &&
          row.mrnQty === "" &&
          row.acceptQty === "" &&
          row.rejectQty === "" &&
          row.mrnNo === "" &&
          row.rate === "" &&
          row.amount === "" &&
          row.gstId === "" &&
          row.gstRate === "" &&
          row.cgst === "" &&
          row.sgst === "" &&
          row.igst === "" &&
          row.gst === "" &&
          row.netAmount === "" &&
          row.reason === "" &&
          Object.keys(row.item).length === 0
        );
      });
      // values.vendor = vendorDetail;

      const response = await api.post(`QualityCheck/UpsertQc`, {
        ...values,
        qcDetail: filteredTableData,
      });
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
  useEffect(() => {
    console.log("Vendor Data:", vendorData);
    console.log("Formik Values:", formik.values.vendorId);
  }, [vendorData, formik.values.vendorId]);


  const back = useNavigate();

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
            {location.state.isView ? t("text.qc") : t("text.EditQualityCheck")}
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
              {/* <Grid item lg={12} xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.qcApplicable}
                        onChange={formik.handleChange}
                        name="qcApplicable"
                      />
                    }
                    label="QC Applicable"
                  />
                </FormGroup>
              </Grid> */}

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


              <Grid item lg={4} xs={12}>
                <TextField
                  id="qcDate"
                  name="qcDate"
                  label={
                    <CustomLabel text={t("text.qcDate1")} required={false} />
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
              </Grid>
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={mrnNoOptions}
                  fullWidth
                  size="small"
                  value={mrnNoOptions.find((opt: any) => opt.value === formik.values.mrnId) || null} // Set initial value
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("mrnNo", newValue?.value?.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectmrnNo")}
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
                      required={false}
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
                      required={false}
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
                    <CustomLabel text={t("text.EntershipmentNo")} required={false} />
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
                {/* <Grid item lg={12} xs={12}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    {t("text.Vendordetails")}
                  </Typography>
                </Grid> */}
                <Divider />

                <Grid item lg={4} xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={vendorData}
                    value={
                      vendorData.find((vendor: any) => vendor.value === formik.values.vendorId) || null
                    } // Find the vendor based on vendorId
                    getOptionLabel={(option: any) => option.label || ""} // Display the vendor name
                    onChange={(event, newValue) => handleVendorSelect(event, newValue)} // Handle selection
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.SelectVendor")} required={false} />}
                      />
                    )}
                  />

                  {/* <Autocomplete
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={vendorData}
                    value={
                      vendorData[vendorData.findIndex((e:any) => e.value == formik.values.vendorId)]?.label || ""
                  }
                    getOptionLabel={(option: any) => option.label}  // Display vendor name
                    // value={
                    //   vendorData.find((vendor: any) => vendor.value === formik.values.vendorId) || null
                    // }  // Select the vendor object based on vendorId from Formik state
                    onChange={(event, newValue) => handleVendorSelect(event, newValue)}  // Call the select handler
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.SelectVendor")} required={false} />}
                      />
                    )}
                  /> */}
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
                )} */}

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
                )} */}

                {/* {vendorDetail?.permanentAddress && (
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
                )} */}

                {/* {vendorDetail?.mobileNo && (
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
                          {t("text.MrnQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.AcceptQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
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
                        {/* <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Amount")}
                        </th> */}
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
                                orderOption[orderOption.findIndex((e: any) => e.value == row.orderId)]?.label || ""
                              }
                              //  value={orderOption.find((opt: any) => opt.value == row.orderId)}
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
                                // label={
                                //   <CustomLabel
                                //     text={t("text.selectOrder")}
                                //     required={false}
                                //   />
                                // }
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
                              value={
                                itemOption[itemOption.findIndex((e: any) => e.value == row.itemId)]?.label || ""
                              }

                              //value={itemOption.find((opt: any) => opt.value == row.itemId)}
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
                                //   <CustomLabel
                                //     text={t("text.selectItem")}
                                //     required={false}
                                //   />
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
                              value={row.batchNo}
                              disabled={true}
                              size="small"
                              sx={{ width: "150px" }}
                              onChange={(e) => handleInputChange(index, "batchNo", e.target.value)}
                              onFocus={e => e.target.select()}
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
                              disabled={true}
                              value={unitOptions.find((opt: any) => (opt.value) == row?.unitId)?.label || ""}
                              // value={
                              //   unitOptions.find((opt) => (opt.value) == row?.unitId) || null
                              // }
                              fullWidth
                              size="small"
                              sx={{ width: "130px" }}
                              onChange={(e, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }

                                handleInputChange(index, "unitId", newValue?.value)
                              }
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
                              value={row.mrnQty}
                              disabled={true}
                              onChange={(e) => handleInputChange(index, "mrnQty", e.target.value)}
                              onFocus={e => e.target.select()}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                                step: "any", min: "0"
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
                          {/* <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={row.amount}
                              size="small"
                              inputProps={{ readOnly: true }}
                              onFocus={e => e.target.select()}
                            />
                          </td> */}
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              disabled={true}
                              options={taxData}
                              fullWidth
                              size="small"
                              value={
                                taxData[taxData.findIndex((e: any) => e.value == row.gstId)]?.label || ""
                              }
                              //value={taxData.find((opt: any) => opt.value == row.gstId)}
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(index, "gstId", newValue?.value)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                // label={
                                //   <CustomLabel
                                //     text={t("text.tax")}
                                //     required={false}
                                //   />
                                // }
                                />
                              )}
                            />
                          </td>
                          {/* <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={(row.cgst + row.sgst + row.igst) || 0}
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
                              disabled={true}
                              value={row.cgst}
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
                              disabled={true}
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
                              disabled={true}
                              value={row.netAmount}
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
                    {/* <tfoot>
                      <tr>
                        <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
                          {t("text.TotalAmount")}
                        </td>
                        <td style={{ textAlign: "center", border: "1px solid black" }}>
                          {tableData.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                     
                      <tr>
                        <td colSpan={12} style={{ textAlign: "right", fontWeight: "bold" }}>
                          {t("text.Totalnetamount")}
                        </td>
                        <td style={{ textAlign: "center", border: "1px solid black" }}>
                          {tableData.reduce((acc, row) => acc + (parseFloat(row.netAmount) || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot> */}
                  </Table>
                </div>
              </Grid>



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

export default EditQualityCheck;