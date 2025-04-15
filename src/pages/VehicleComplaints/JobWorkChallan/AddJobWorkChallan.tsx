import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider, Table,
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
  FormControl,
  Modal,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from '@mui/icons-material/Delete';
import { getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

const AddJobWorkChallan = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [isEnable, setIsEnable] = useState(true);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const location = useLocation();

  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo"), name: "", empId: "" },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);
  const [serviceOption, setServiceOption] = useState([
    { value: -1, label: t("text.Services") },
  ]);
  const [unitOption, setUnitOption] = useState([
    { value: -1, label: t("text.Unit") },
  ]);
  const [taxOption, setTaxOption] = useState([
    { value: -1, label: t("text.Tax") },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const [jobCardData, setJobCardData] = useState([{
    label: "",
    value: -1,
    "jobCardId": 0,
    "jobCardNo": "",
    "fileNo": "",
    "imageFile": "",
    "jobCardDate": "2025-01-02T08:08:36.700Z",
    "complainId": 0,
    "complainDate": "2025-01-02T08:08:36.700Z",
    "empId": 0,
    "itemId": 0,
    "currenReading": 0,
    "complain": "",
    "status": "",
    "serviceType": "",
    "createdBy": "",
    "updatedBy": "",
    "createdOn": "2025-01-02T08:08:36.700Z",
    "updatedOn": "2025-01-02T08:08:36.700Z",
    "companyId": 0,
    "fyId": 0,
    "totalItemAmount": 0,
    "totalServiceAmount": 0,
    "netAmount": 0,
    "itemName": "",
    "empName": "",
    "serviceDetail": [
      {
        "id": 0,
        "jobCardId": 0,
        "serviceId": 0,
        "amount": 0,
        "jobWorkReq": true,
        "vendorId": 0,
        "challanRemark": "",
        "challanNo": 0,
        "challanDate": defaultValues,
        "challanRcvNo": 0,
        "challanRcvDate": "2025-01-02T08:08:36.700Z",
        "challanStatus": "",
        "netAmount": 0,
        "qty": 0,
        "unitRate": 0,
        "unitId": 0,
        "vendorName": "",
        "serviceName": "",
        "unitName": "",
        "cgstid": 0,
        "sgstid": 0,
        "gstid": 0,
        "gst": 0
      }
    ],
    "update": true
  }]);

  const [tableData, setTableData] = useState([
    {
      id: 0,
      challanNo: 0,
      jobCardId: location.state?.jobCardId || jobCardData[0].jobCardId,
      serviceId: 0,
      serviceCharge: 0,
      vendorId: 0,
      remark: "",
      qty: 0,
      unitId: 0,
      amount: 0,
      netAmount: 0,
      gstid: 0,
      cgstid: 0,
      sgstid: 0,
      gst: 0,
      cgst: 0,
      sgst: 0,
      serviceName: "",
      unitName: ""
    },
  ]);


  useEffect(() => {
    getVehicleDetails();
    getVendorData();
    getServiceData();
    getUnitData();
    getTaxData();
    getJobCardData();
    if (location.state?.jobCardId) {
      setTableDataValuesByLocation();
      return;
    }
    setTableDataValues(location.state?.jobCardId || -1);
    console.log("location.state==>" + JSON.stringify(location.state))
  }, []);


  const getTaxData = async () => {
    const collectData = {
      "taxId": -1
    };
    const response = await api.post(`UnitMaster/GetTaxMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["taxPercentage"],
        value: data[index]["taxId"],
      });
    }
    setTaxOption(arr);
  };


  const getUnitData = async () => {
    const collectData = {
      "unitId": -1
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
    setUnitOption(arr);
  };

  const getVehicleDetails = async () => {
    const response = await api.get(
      `Master/GetVehicleDetail?ItemMasterId=-1`,
    );
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.vehicleNo,
      name: Item.itemName,
      empId: Item.empId
    }));
    setVehicleOption(arr);
  };

  const getVendorData = async () => {
    const collectData = {
      "venderId": -1,
      "countryId": -1,
      "stateId": -1,
      "cityId": -1
    };
    const response = await api.post(`Master/GetVendorMaster`, collectData);
    const data = response.data.data;
    //console.log("Vendor data==>  ",data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["name"],
        value: data[index]["venderId"],
      });
    }
    setVendorOption(arr);
  };


  const getServiceData = async () => {
    const collectData = {
      "serviceId": -1
    };
    const response = await api.post(`ServiceMaster/GetServiceMaster`, collectData);
    const data = response.data.data;
    //console.log("Vendor data==>  ",data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["serviceName"],
        value: data[index]["serviceId"],
      });
    }
    setServiceOption(arr);
  };

  const getJobCardData = async (value = -1) => {
    const collectData = {
      "jobCardId": value,
      "status": ""
    };
    const response = await api.post(`Master/GetJobCard`, collectData);
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      ...Item,
      label: Item.itemName + `(JobCardNo:${Item.jobCardNo})`,
      value: Item.itemId
    }));
    setJobCardData(arr);
  };


  const setTableDataValuesByLocation = async (value = location.state?.jobCardId) => {
    const data = location.state.serviceDetail;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        id: 0,
        challanNo: data[index].challanNo,
        jobCardId: location.state?.jobCardId || jobCardData[0].jobCardId,
        serviceId: data[index].serviceId,
        serviceCharge: data[index].unitRate,
        vendorId: data[index]?.vendorId,
        remark: "",
        qty: data[index].qty,
        unitId: data[index].unitId,
        amount: data[index].amount,
        netAmount: data[index].netAmount,
        gstid: 0,
        cgstid: 0,
        sgstid: 0,
        gst: 0,
        cgst: 0,
        sgst: 0,
        serviceName: data[index].serviceName,
        unitName: data[index].unitName
      });
    }
    formik.setFieldValue("vendorId", data[0]?.vendorId);
    formik.setFieldValue("vendorName", data[0]?.vendorName);
    if (arr.length > 0) {
      setTableData(arr);
    }
    //console.log("tabledata"+JSON.stringify(tableData))
  }




  const setTableDataValues = async (value: number) => {
    if (value === -1 || value === null || value === undefined) {
      return;
    }
    const collectData = {
      "jobCardId": value,
      "status": ""
    };
    const response = await api.post(`Master/GetJobCard`, collectData);
    const data = response.data.data[0].serviceDetail;
    console.log("resData" + JSON.stringify(data));
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        id: 0,
        challanNo: data[index].challanNo,
        jobCardId: location.state?.jobCardId || jobCardData[0].jobCardId,
        serviceId: data[index].serviceId,
        serviceCharge: data[index].unitRate,
        vendorId: data[index]?.vendorId,
        remark: "",
        qty: data[index].qty,
        unitId: data[index].unitId,
        amount: data[index].amount,
        netAmount: data[index].netAmount,
        gstid: 0,
        cgstid: 0,
        sgstid: 0,
        gst: 0,
        cgst: 0,
        sgst: 0,
        serviceName: data[index].serviceName,
        unitName: data[index].unitName
      });
    }
    formik.setFieldValue("vendorId", data[0]?.vendorId);
    formik.setFieldValue("vendorName", data[0]?.vendorName);
    if (arr.length > 0) {
      setTableData(arr);
    } else {
      setTableData([
        {
          id: 0,
          challanNo: 0,
          jobCardId: location.state?.jobCardId || jobCardData[0].jobCardId,
          serviceId: 0,
          serviceCharge: 0,
          vendorId: 0,
          remark: "",
          qty: 0,
          unitId: 0,
          amount: 0,
          netAmount: 0,
          gstid: 0,
          cgstid: 0,
          sgstid: 0,
          gst: 0,
          cgst: 0,
          sgst: 0,
          serviceName: "",
          unitName: ""
        },
      ])
    }
    //console.log("tabledata"+JSON.stringify(tableData))
  }


  const validateRow = (row: any) => {
    return row.serviceId && row.serviceName && row.serviceCharge > 0;
  };




  const formik = useFormik({
    initialValues: {
      "challanNo": 0,
      "challanDate": dayjs(location.state?.challanDate || defaultValues).format("YYYY-MM-DD"),
      "complainId": location.state?.complainId || 0,
      "empId": location.state?.empId || 0,
      "itemId": location.state?.itemId || 0,
      "jobCardId": location.state?.jobCardId || 0,
      "vendorId": location.state?.serviceDetail[0]?.vendorId || 0,
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "serviceAmount": location.state?.totalServiceAmount || location.state?.serviceAmount || 0,
      "itemAmount": 0,
      "netAmount": location.state?.netAmount || 0,
      "status": location.state?.status || "",
      "rcvDate": defaultValues,
      "rcvNo": 0,
      "cgst": 0,
      "sgst": 0,
      "gst": 0,
      "cgstid": 0,
      "sgstid": 0,
      "gstid": 0,
      "challanDoc": "",
      "fileOldName": "",
      "file": "",
      "jobWorkChallanDetail": [],
      "vehicleNo": location.state?.itemName || "",
      "vendorName": location.state?.serviceDetail[0].vendorName || "",
      "empName": location.state?.empName || 0,
      "jobCardDate": location.state?.jobCardDate || defaultValues,
      "complainDate": location.state?.complainDate || defaultValues,
    },

    validationSchema: Yup.object({
      vehicleNo: Yup.string()
        .required(t("text.reqVehNum")),
    }),

    onSubmit: async (values) => {
      const validTableData = tableData.filter(validateRow);
      if (validTableData.length === 0) {
        toast.error("Please add some data in table for further process");
        return;
      }
      const response = await api.post(`Master/UpsertJobWorkChallan`, { ...values, jobWorkChallanDetail: validTableData });
      if (response.data.status === 1) {
        toast.success(response.data.message);
        setIsVisible(true);
        setIsEnable(false);
        //formik.setFieldValue("challanNo",response.data.data.challanNo);
        //navigate("/vehiclecomplaint/JobWorkChallan")
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });


  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: string) => {
    setPanOpen(true);
    const base64Prefix = "data:image/jpeg;base64,";

    let imageData = '';
    switch (event) {
      case "challanDoc":
        imageData = formik.values.challanDoc;
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
      formik.setFieldValue(params, base64String); // Store the complete base64 string with the prefix.
    };
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };







  // const handlePanClose = () => {
  //   setPanOpen(false);
  // };
  // const modalOpenHandle = (event: any) => {
  //   setPanOpen(true);
  //   if (event === "file") {
  //     setModalImg(formik.values.file);
  //   }
  // };
  // const ConvertBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // const base64ToByteArray = (base64: string): Uint8Array => {
  //   // Remove the data URL scheme if it exists
  //   const base64String = base64.split(",")[1];

  //   // Decode the Base64 string
  //   const binaryString = window.atob(base64String);
  //   const len = binaryString.length;
  //   const bytes = new Uint8Array(len);

  //   // Convert binary string to Uint8Array
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }

  //   return bytes;
  // };

  // const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  //   let binary = "";
  //   const len = uint8Array.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(uint8Array[i]);
  //   }
  //   return window.btoa(binary);
  // };

  // const otherDocChangeHandler = async (event: any, params: string) => {
  //   console.log("Image file change detected");

  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const fileNameParts = file.name.split(".");
  //     const fileExtension =
  //       fileNameParts[fileNameParts.length - 1].toLowerCase();

  //     if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
  //       alert(
  //         "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
  //       );
  //       event.target.value = null;
  //       return;
  //     }

  //     try {
  //       const base64Data = (await ConvertBase64(file)) as string;
  //       console.log("Base64 image data:", base64Data);

  //       // Convert Base64 to Uint8Array
  //       const byteArray = base64ToByteArray(base64Data);
  //       console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

  //       // Convert Uint8Array to base64 string
  //       const base64String = uint8ArrayToBase64(byteArray);
  //       console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

  //       // Set value in Formik
  //       formik.setFieldValue(params, base64String);

  //       let outputCheck =
  //         "data:image/png;base64," + formik.values.file;
  //       console.log(outputCheck);
  //     } catch (error) {
  //       console.error("Error converting image file to Base64:", error);
  //     }
  //   }
  // };

  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;
    let unitRate = 0;
    if (field === 'serviceId') {
      newData[index].serviceId = newData[index].serviceId;
    }
    if (field === 'serviceName') {
      newData[index].serviceName = newData[index].serviceName;
    }
    if (field === 'qty') {
      newData[index].qty = newData[index].qty;
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
      newData[index].netAmount = (newData[index].serviceCharge * newData[index].qty);
    }
    // if (field === 'cgst') {
    //   newData[index].cgst = newData[index].cgst;
    // }
    // if (field === 'sgst') {
    //   newData[index].sgst = newData[index].sgst;
    // }
    if (field === 'serviceCharge') {
      newData[index].serviceCharge = newData[index].serviceCharge;
    }
    newData[index].amount = newData[index].serviceCharge * newData[index].qty;

    newData[index].jobCardId = location.state?.jobCardId || 0;
    newData[index].challanNo = 0;

    setTableData(newData);

    if (newData[index].serviceId && newData[index].unitId > 0 && newData[index].qty && newData[index].amount > 0) {
      if (index === tableData.length - 1) {
        addRow();
      }
    }
    let total = 0;
    let netAmt = 0;
    tableData.forEach(row => {
      total += row.amount;
      netAmt += row.amount + row.amount * (row.gst / 100);
    })
    formik.setFieldValue("netAmount", netAmt);
    formik.setFieldValue("serviceAmount", total);
  };

  const addRow = () => {
    setTableData([...tableData, {
      id: 0,
      challanNo: location.state?.challanNo || 0,
      jobCardId: location.state?.jobCardId || jobCardData[0].jobCardId,
      serviceId: 0,
      serviceCharge: 0,
      vendorId: 0,
      remark: "",
      qty: 0,
      unitId: 0,
      amount: 0,
      netAmount: 0,
      gstid: 0,
      cgstid: 0,
      sgstid: 0,
      gst: 0,
      cgst: 0,
      sgst: 0,
      serviceName: "",
      unitName: ""
    },
    ]);
  };

  const deleteRow = (index: any) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };




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

          <Grid item xs={12} container spacing={2} >
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
                {t("text.AddJobWorkChallan")}
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
          <ToastContainer />
          <form onSubmit={formik.handleSubmit}>
            {/* {toaster === false ? "" : <ToastApp />} */}
            <Grid container spacing={2}>


              {/* VehicleNumber */}
              <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    jobCardData.filter((e) => {
                      return e;
                    })
                    //   vehicleOption.filter(e => {
                    //   for (let i = 0; i < jobCardData.length; i++) {
                    //     if (e.value == jobCardData[i].itemId) {
                    //       return e;
                    //     }
                    //   }
                    // })
                  }
                  value={formik.values.vehicleNo}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (!newValue) {
                      return;
                    } else {
                      console.log(newValue);
                      formik.setFieldValue("vehicleNo", newValue?.itemName);
                      formik.setFieldValue("itemId", newValue?.value);
                      setTableDataValues(newValue?.jobCardId || -1);
                      formik.setFieldValue("complainId", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.complainId);
                      formik.setFieldValue("empId", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.empId);
                      formik.setFieldValue("jobCardId", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.jobCardId);
                      formik.setFieldValue("serviceAmount", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.totalServiceAmount);
                      formik.setFieldValue("itemAmount", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.totalServiceAmount);
                      formik.setFieldValue("netAmount", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.netAmount);
                      formik.setFieldValue("status", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.status);
                      formik.setFieldValue("empName", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.empName);
                      formik.setFieldValue("jobCardDate", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.jobCardDate);
                      formik.setFieldValue("complainDate", jobCardData[jobCardData.findIndex(e => e.itemId === newValue?.value && e.jobCardId == newValue?.jobCardId)]?.complainDate);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.VehicleNo")} required={true} />}
                      name="vehicleNo"
                      id="vehicleNo"
                      placeholder={t("text.VehicleNo")}
                    />
                  )}
                />
                {!formik.values.vehicleNo && formik.touched.vehicleNo && formik.errors.vehicleNo && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.vehicleNo.toString()}</div>
                )}
              </Grid>

              {/* Challan Number */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanNo")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="challanNo"
                  id="challanNo"
                  value={formik.values.challanNo}
                  placeholder={t("text.ChallanNo")}
                  onChange={(e) => {
                    formik.setFieldValue("challanNo", parseInt(e.target.value) || 0)
                  }}
                />
              </Grid>


              {/* Challan Date */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ChallanDate")}
                    //required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="challanDate"
                  id="challanDate"
                  value={formik.values.challanDate}
                  placeholder={t("text.ChallanDate")}
                  onChange={(e) => {
                    formik.setFieldValue("challanDate", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              {/* Vendor */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Vendor")}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="vendorName"
                  id="vendorName"
                  value={formik.values.vendorName}
                  placeholder={t("text.Vendor")}
                  onChange={(e) => {
                    formik.setFieldValue("vendorName", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorOption}
                  value={formik.values.vendorName || ""}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue(" ", newValue?.value);
                    formik.setFieldValue("vendorName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.Vendor")}  />}
                      name="vendorName"
                      id="vendorName"
                      placeholder={t("text.Vendor")}
                    />
                  )}
                />
              </Grid> */}


              {/* attachment */}
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
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.AttachedImage")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e: any) => otherDocChangeHandler(e, "challanDoc")}
                  />
                </Grid>

                <Grid xs={12} md={4} sm={4} item></Grid>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.challanDoc ? (
                    <img
                      src={
                        formik.values.challanDoc.startsWith("data:image")
                          ? formik.values.challanDoc
                          : `data:image/jpeg;base64,${formik.values.challanDoc}`
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
                    onClick={() => modalOpenHandle("challanDoc")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                      padding: "20px",
                    }}
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>

                <Modal open={panOpens} onClose={handlePanClose}>
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


              <Grid item xs={12} md={12} lg={12}>
                <div style={{ overflowX: 'scroll', margin: 0, padding: 0 }}>
                  <Table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid black",
                    }}
                  >
                    <thead
                      style={{ backgroundColor: "#2196f3", color: "#f5f5f5" }}
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
                            width: "300px"
                          }}
                        >
                          {t("text.Name")}
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
                          {t("text.UnitRate")}
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
                          {t("text.GstRate")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.CGST")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.SGST")}
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
                        <tr key={row.id} style={{ border: '1px solid black' }}>
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
                              options={serviceOption}
                              value={row.serviceName}
                              fullWidth
                              sx={{ width: "230px" }}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }
                                console.log(newValue?.value);
                                handleInputChange(index, 'serviceId', newValue?.value);
                                handleInputChange(index, 'serviceName', newValue?.label);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // label={<CustomLabel text={t("text.ServiceName")} required={false} />}
                                  name="serviceName"
                                  id="serviceName"
                                  placeholder={t("text.ServiceName")}
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
                              options={unitOption}
                              value={row.unitName}
                              fullWidth
                              sx={{ width: "135px" }}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }
                                console.log(newValue?.value);
                                handleInputChange(index, 'unitId', newValue?.value);
                                handleInputChange(index, 'unitName', newValue?.label);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                // label={
                                //   <CustomLabel
                                //     text={t("text.Unit")}
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
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.qty}
                              onChange={(e) => handleInputChange(index, 'qty', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.serviceCharge}
                              onChange={(e) => handleInputChange(index, 'serviceCharge', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                              sx={{ width: "100px" }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.serviceCharge * row.qty}
                              onChange={(e) => handleInputChange(index, 'amount', (row.serviceCharge * row.qty) || 0)}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                              sx={{ width: "100px" }}
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
                              options={taxOption}
                              value={row.gst}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                }
                                handleInputChange(index, 'gst', parseFloat(newValue.label) || 0);
                                handleInputChange(index, 'gstId', newValue.value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                // label={<CustomLabel text={t("text.GstRate")} required={false} />}
                                // name="gst"
                                // id="gst"
                                // placeholder={t("text.GstRate")}
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.cgst}
                              onChange={(e) => handleInputChange(index, 'cgst', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.sgst}
                              onChange={(e) => handleInputChange(index, 'sgst', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem"
                            }}
                          >
                            <TextField
                              value={row.amount + row.amount * (row.gst / 100)}
                              //onChange={(e) => handleInputChange(index, 'netAmount', (row.serviceCharge * row.qty) || 0)}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold" }}>
                          {t("text.TotalServiceAmount")}
                        </td>
                        <td colSpan={1} style={{ textAlign: "end" }}>
                          <b>:</b>{formik.values.serviceAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={2} style={{ fontWeight: "bold", borderTop: "1px solid black" }}>
                          {t("text.NetAmount")}
                        </td>
                        <td colSpan={1} style={{ borderTop: "1px solid black", textAlign: "end" }}>
                          <b>:</b>{formik.values.netAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </Grid>


              {/* Submit Button */}
              <Grid item lg={6} sm={6} xs={12}>
                {isEnable ? (<Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.save")}
                </Button>) :
                  (<Button
                    type="submit"
                    fullWidth
                    disabled={true}
                    style={{
                      backgroundColor: `grey`,
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.save")}
                  </Button>)
                }
              </Grid>

              {/* Reset Button */}
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    formik.resetForm();
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
              {isVisible && (
                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "#0000ff",
                      color: "white",
                      marginTop: "10px",
                      padding: "8px 16px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      width: "100px",
                    }}
                    onClick={() => {
                      const validTableData = tableData.filter(validateRow);
                      if (validTableData.length === 0) {
                        toast.error("Please add some data in table for further process");
                        return;
                      }
                      navigate("/vehiclecomplaint/AddJobWorkChallanRecieve", {
                        state: { ...formik.values, jobWorkChallanDetail: tableData },
                      });
                    }}
                  >
                    {t("text.Next")}
                    <ArrowForwardIcon />
                  </Button>
                </Grid>
              )}

            </Grid>

          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default AddJobWorkChallan;