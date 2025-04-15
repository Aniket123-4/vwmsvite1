import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
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
import React, { useEffect, useRef, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
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
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";
import { json } from "stream/consumers";
import ReactQuill from "react-quill";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormatItalic } from "@mui/icons-material";
import { setTimeout } from "timers/promises";
import ItemDetail from "../../Inventory/ItemDetail/ItemDetail";

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

const AddJobCard1 = (props: Props) => {
  const [isIndentGenerateEnabled, setIsIndentGenerateEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isIndentPrintEnabled, setIsIndentPrintEnabled] = useState(false);
  const [isChallanEnabled, setIsChallanEnabled] = useState(false);
  const [isIndentEnabled, setIsIndentEnabled] = useState(false);
  const location = useLocation();
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [btnEnable1, setBtnEnable1] = useState(false);
  const [btnEnable2, setBtnEnable2] = useState(false);
  const [taxData, setTaxData] = useState<any>([]);
  // const [unitOptions, setUnitOptions] = useState<any>([]);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [itemOption, setitemOption] = useState<
    { value: number; label: string; unitID?: number }[]
  >([{ value: -1, label: t("text.itemMasterId") }]);
  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo"), vehicleName: "", empId: "" },
  ]);
  const [empOption, setEmpOption] = useState([
    { value: 1, label: t("text.EmpName"), department: "", designation: "" },
  ]);
  const [serviceOption, setServiceOption] = useState([
    { value: -1, label: t("text.Services") },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);
  const [unitOptions, setUnitOption] = useState([
    { value: -1, label: t("text.Unit") },
  ]);
  const [complainOption, setComplainOption] = useState([
    {
      sno: 0,
      compId: 0,
      itemID: 0,
      complaintType: "",
      complaintDoc: "",
      empId: 0,
      approveEmp4: 0,
      approveEmp3: 0,
      approveEmp2: 0,
      approveEmp1: 0,
      complaint: "",
      complaintNo: "",
      createdBy: "",
      updatedBy: "",
      status: "Initial",
      currentReading: 0,
      createdOn: defaultValues,
      complaintDate: defaultValues,
      updatedOn: defaultValues,
      compAppdt: defaultValues,
      jobCardNo: "",
      file: "",
      fileOldName: "",
      vehicleNo: "",
      vehicleName: "",
      empName: "",
    },
  ]);
  const [deptValue, setDeptValue] = useState("");
  const [desgValue, setDesgValue] = useState("");
  const [jobCardId, setJobCardId] = useState(0);

  const [jobCardData, setJobCardData] = useState([
    {
      jobCardId: 0,
      jobCardNo: "",
      fileNo: "",
      imageFile: "",
      jobCardDate: defaultValues,
      complainId: 0,
      complainDate: defaultValues,
      empId: 0,
      itemId: 0,
      currenReading: 0,
      complain: "",
      status: "",
      serviceType: "",
      createdBy: "",
      updatedBy: "",
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: 0,
      fyId: 0,
      totalItemAmount: 0,
      totalServiceAmount: 0,
      netAmount: 0,
      vehicleNo: "",
      empName: "",
      serviceDetail: [
        {
          id: 0,
          jobCardId: 0,
          serviceId: 0,
          amount: 0,
          jobWorkReq: true,
          vendorId: 0,
          challanRemark: "",
          challanNo: 0,
          challanDate: defaultValues,
          challanRcvNo: 0,
          challanRcvDate: defaultValues,
          challanStatus: "",
          netAmount: 0,
          cgstid: 0,
          sgstid: 0,
          gstid: 0,
        },
      ],
      itemDetail: [
        {
          id: 0,
          jobCardId: 0,
          itemId: 0,
          unitID: null,
          indentId: 0,
          indentNo: "",
          qty: 0,
          rate: 0,
          batchNo: "",
          amount: 0,
          gstId: 0,
          gstRate: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          netAmount: 0,
          srno: 0,
          isDelete: false,
          prevReading: 0,
          unitName: "",
        },
      ],
      update: true,
    },
  ]);

  const [tableData1, setTableData1] = useState<any>([
    {
      id: 0,
      jobCardId: 0,
      itemId: null,
      unitID: null,
      indentId: 0,
      indentNo: "",
      qty: 0,
      rate: 0,
      batchNo: "",
      amount: 0,
      gstId: 0,
      gstRate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      netAmount: 0,
      srno: 0,
      isDelete: false,
      prevReading: 0,
      unitName: "",
    },
    // {
    //   "id": 0,
    //   "jobCardId": 0,
    //   "itemId": 0,
    //   "indentId": 0,
    //   "indentNo": "",
    //   "qty": 0,
    //   "rate": 0,
    //   "batchNo": "",
    //   "amount": 0,
    //   "gstId": 0,
    //   "gstRate": 0,
    //   "cgst": 0,
    //   "sgst": 0,
    //   "igst": 0,
    //   "netAmount": 0,
    //   "srno": 0,
    //   "isDelete": true,
    //   "prevReading": 0
    // },
  ]);
  const [tableData, setTableData] = useState([
    {
      id: 0,
      jobCardId: 0,
      serviceId: 0,
      amount: 0,
      jobWorkReq: true,
      vendorId: 0,
      challanRemark: "",
      challanNo: 0,
      challanDate: defaultValues,
      challanRcvNo: 0,
      challanRcvDate: defaultValues,
      challanStatus: "",
      netAmount: 0,
      cgstid: 0,
      sgstid: 0,
      gstid: 0,
    },
  ]);

  const [vehicleName, setVehicleName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemId, setItemId] = useState(0);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const [serviceGridDisable, setServiceGridDisable] = useState(false);

  useEffect(() => {
    getJobCardData();
    getVehicleDetails();
    getEmpData();
    getServiceData();
    getVendorData();
    getUnitData();
    getComplainData();
    GetitemData();
    getTaxData();
    GetIndentID();
    setVehicleName(location.state?.vehicleName || "");
    setDesgValue(location.state?.designation || "");
    setDeptValue(location.state?.department || "");
    let total = 0;
    tableData.forEach((row) => {
      total += row.amount;
    });
    formik.setFieldValue("totalServiceAmount", total);
    formik.setFieldValue("netAmount", total);
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
      });
    }
    setIndentOptions(arr);
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

      setTaxData(arr);
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
        unitID: data[index]["unitId"],
      });
    }
    setitemOption(arr);
  };

  const getVehicleDetails = async () => {
    const response = await api.get(`Master/GetVehicleDetail?ItemMasterId=-1`);
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.vehicleNo,
      vehicleName: Item.itemName,
      empId: Item.empId,
    }));
    setVehicleOption(arr);
  };

  const getUnitData = async () => {
    const collectData = {
      unitId: -1,
    };
    const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
    const data = response.data.data;
    //console.log("Vendor data==>  ",data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOption(arr);
  };
  const getServiceData = async () => {
    const collectData = {
      serviceId: -1,
    };
    const response = await api.post(
      `ServiceMaster/GetServiceMaster`,
      collectData
    );
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
  const getVendorData = async () => {
    const collectData = {
      venderId: -1,
      countryId: -1,
      stateId: -1,
      cityId: -1,
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

  const getEmpData = async () => {
    const collectData = {
      empid: -1,
      userId: "",
    };
    const response = await api.post(`Employee/GetEmployee`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["empName"],
        value: data[index]["empid"],
        department: data[index]["departmentName"],
        designation: data[index]["designationName"],
      });
    }
    setEmpOption(arr);
  };

  const getComplainData = async () => {
    const collectData = {
      compId: -1,
      empid: -1,
    };
    const response = await api.post(`Master/GetComplaint`, collectData);
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      ...Item,
      value: Item.compId,
      compId: Item.compId,
      complaintDate: Item.complaintDate,
      complaint: Item.complaint,
      complaintNo: Item.complaintNo,
      vehicleNo: Item.vehicleNo,
      label: Item.vehicleNo + `(ComplainNo:${Item.complaintNo})`,
    }));
    setComplainOption(arr);
  };

  const getJobCardData = async () => {
    const collectData = {
      jobCardId: -1,
      status: "",
    };
    const response = await api.post(`Master/GetJobCard`, collectData);
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      ...Item,
    }));
    setJobCardData(arr);
  };

  const validateRow = (row: any) => {
    return row.serviceId && row.vendorId && row.amount > 0;
  };

  const formik = useFormik({
    initialValues: {
      jobCardId: 0,
      jobCardNo: "",
      fileNo: "",
      imageFile: "",
      jobCardDate: defaultValues,
      complainId: 0,
      complainDate: defaultValues,
      empId: 0,
      itemId: 0,
      currenReading: 0,
      complain: "",
      status: "inprogress",
      serviceType: "",
      createdBy: "",
      updatedBy: "",
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: 0,
      fyId: 0,
      totalItemAmount: 0,
      totalServiceAmount: 0,
      netAmount: 0,
      vehicleNo: "",
      empName: "",
      serviceDetail: [],
      itemDetail: [],
    },
    validationSchema: Yup.object({
      // fileNo: Yup.string()
      //   .required(t("text.reqFilenumber")),
      vehicleNo: Yup.string().required(t("text.reqVehNum")),
    }),

    // onSubmit: async (values) => {

    //   const validServiceDetails = tableData.filter(
    //     (row) => row.serviceId && row.challanStatus
    //   );
    //   const validItemDetails = tableData1.filter(
    //     (row: any) => row.itemId && row.qty > 0 && row.rate > 0
    //   );

    //   // if (validServiceDetails.length === 0) {
    //   //   toast.error("Add valid service details.");
    //   //   return;
    //   // }

    //   // if (validItemDetails.length === 0) {
    //   //   toast.error("Add valid item details.");
    //   //   return;
    //   // }

    //   if (validServiceDetails.length > 0 && validServiceDetails[0].challanStatus === "JobWork") {
    //     setBtnEnable1(true);
    //   }

    //   if (validItemDetails.length > 0) {
    //     setBtnEnable2(true);
    //   }

    //   const payload = {
    //     ...values,
    //     serviceDetail: validServiceDetails,
    //     itemDetail: validItemDetails,
    //   };

    //   try {
    //     const response = await api.post(`Master/UpsertJobCardInhouse`, payload);
    //     if (response.data.status === 1) {
    //       toast.success(response.data.message);
    //       formik.setFieldValue("jobCardId", response.data.data.jobCardId);

    //       if (validServiceDetails.length > 0 && validServiceDetails[0].challanStatus === "JobWork") {
    //         setBtnEnable1(true);
    //       }

    //       if (validItemDetails.length > 0) {
    //         setBtnEnable2(true);
    //       }
    //       //setIsIndentGenerateEnabled(true);
    //       //  setIsIndentEnabled(true);
    //     } else {
    //       toast.error(response.data.message);
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //     toast.error("Failed to submit.");
    //   }
    // },
    onSubmit: async (values) => {
      setIsSubmitting(true); // Disable the Save button on submit

      const validServiceDetails = tableData.filter(
        (row) => row.serviceId && row.challanStatus
      );
      const validItemDetails = tableData1.filter(
        (row: any) => row.itemId && row.qty > 0 && row.rate > 0
      );

      if (validServiceDetails.length > 0 && validServiceDetails[0].challanStatus === "JobWork") {
        setBtnEnable1(true);
      }

      if (validItemDetails.length > 0) {
        setBtnEnable2(true);
      }

      const payload = {
        ...values,
        serviceDetail: validServiceDetails,
        itemDetail: validItemDetails,
      };

      try {
        const response = await api.post(`Master/UpsertJobCardInhouse`, payload);
        if (response.data.status === 1) {
          toast.success(response.data.message);
          formik.setFieldValue("jobCardId", response.data.data.jobCardId);

          if (validServiceDetails.length > 0 && validServiceDetails[0].challanStatus === "JobWork") {
            setBtnEnable1(true);
          }

          if (validItemDetails.length > 0) {
            setBtnEnable2(true);
          }

          // Keep Save button disabled after success
        } else {
          toast.error(response.data.message);
          setIsSubmitting(false); // Re-enable Save button on failure
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to submit.");
        setIsSubmitting(false); // Re-enable Save button on error
      }
    },

  });
  const handleGenerateIndent = async (values: any) => {
    const validServiceDetails = tableData.filter(
      (row) => row.serviceId && row.vendorId && row.amount > 0
    );
    const validItemDetails = tableData1.filter(
      (row: any) => row.itemId && row.qty > 0 && row.rate > 0
    );

    try {
      const response = await api.post(`Master/GenerateIndent`, {
        ...values,
        serviceDetail: validServiceDetails,
        itemDetail: validItemDetails,
      });

      if (response.data.status === 1) {
        toast.success(response.data?.message || "JOBCARD Indent Generated");
        setIsIndentGenerateEnabled(false);
        setIsIndentPrintEnabled(true);
        setJobCardId(response.data.data.jobCardId);

        // Extract and slice indentNo from response data
        const responseData = response.data.data; // Example: "32,20250130/I/32"
        const indentNo = responseData.split(",")[1]; // Extract "20250130/I/32"

        // Update `indentNo` in tableData1
        setTableData1((prevTableData: any) =>
          prevTableData.map((row: any) => ({
            ...row,
            indentNo: indentNo, // Set extracted value in indentNo field
          }))
        );
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error generating indent:", error);
      toast.error("Failed to generate indent.");
    }
  };

  // const handleGenerateIndent = async (values: any) => {
  //   const validServiceDetails = tableData.filter(row => row.serviceId && row.vendorId && row.amount > 0);
  //   const validItemDetails = tableData1.filter((row: any) => row.itemId && row.qty > 0 && row.rate > 0);
  //   // if (validTableData.length === 0) {
  //   //   toast.error("Please add some data in table for further process");
  //   //   return;
  //   // }
  //   const response = await api.post(`Master/GenerateIndent`, { ...values, serviceDetail: validServiceDetails, itemDetail: validItemDetails });
  //   if (response.data.status === 1) {
  //     toast.success(response.data?.message || "JOBCARD Indent Generated");
  //     setIsIndentGenerateEnabled(false); // Disable "Indent Generate"
  //     setIsIndentPrintEnabled(true); // Enable "Indent Print"
  //     setJobCardId(response.data.data.jobCardId);
  //   } else {
  //     setToaster(true);
  //     toast.error(response.data.message);
  //   }
  // };
  const handleGenerateChallan = async (values: any) => {
    const validTableData = tableData.filter(validateRow);
    if (validTableData.length === 0) {
      toast.error("Please add some data in table for further process");
      return;
    }
    const response = await api.post(`Master/GenerateJobWorkChallan`, {
      ...values,
      serviceDetail: validTableData,
    });
    if (response.data.status === 1) {
      toast.success(response.data.message);
      setJobCardId(response.data.data.jobCardId);
    } else {
      setToaster(true);
      toast.error(response.data.message);
    }
  };
  // const handleServiceChange = (index: any, field: any, value: any) => {
  //   const updatedServiceDetails: any = [...formik.values.serviceDetail];
  //   updatedServiceDetails[index][field] = value;
  //   formik.setFieldValue("serviceDetail", updatedServiceDetails);

  // };

  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;

    if (field === "serviceId") {
      newData[index].serviceId = newData[index].serviceId;
      newData[index].serviceName =
        serviceOption[
          serviceOption.findIndex((e) => e.value == newData[index].serviceId)
        ].label;
    }

    if (field === "amount") {
      newData[index].amount = newData[index].amount;
      newData[index].netAmount = newData[index].amount;
    }
    if (field === "vendorId") {
      newData[index].vendorId = newData[index].vendorId;
      newData[index].vendorName =
        vendorOption[
          vendorOption.findIndex((e) => e.value == newData[index].vendorId)
        ].label;
    }
    if (field === "challanRemark") {
      newData[index].challanRemark = newData[index].challanRemark;
    }
    if (field === "challanNo") {
      newData[index].challanNo = newData[index].challanNo;
    }
    if (field === "challanStatus") {
      newData[index].challanStatus = newData[index].challanStatus;
    }
    if (field === "netAmount") {
      newData[index].netAmount = newData[index].netAmount;
    }

    newData[index].jobCardId = formik.values.jobCardId;

    newData[index].id = index;
    setTableData(newData);

    // if (newData[index].serviceId && newData[index].vendorId && newData[index].amount) {
    //   if (index === tableData.length - 1) {
    //     addRow();

    //   }
    // }

    let total = 0;
    let netAmt = 0;
    tableData.forEach((row) => {
      total += row.amount;
      netAmt += row.amount;
    });
    tableData1.forEach((row: any) => {
      netAmt += row.amount;
    });
    formik.setFieldValue("totalServiceAmount", total);
    formik.setFieldValue("netAmount", netAmt);
  };

  // const handleItemChange = (index: any, field: any, value: any) => {
  //   const updatedItems: any = [...formik.values.itemDetail];
  //   updatedItems[index][field] = value;

  //   // Update calculations if needed
  //   if (field === "qty" || field === "rate") {
  //     updatedItems[index].amount = updatedItems[index].qty * updatedItems[index].rate;
  //     updatedItems[index].netAmount = updatedItems[index].amount;
  //   }

  //   formik.setFieldValue("itemDetail", updatedItems);
  // };

  const handleInputChange1 = (index: any, field: any, value: any) => {
    const newData: any = [...tableData1];
    newData[index][field] = value;
    if (field === "itemId") {
      const selectedItem = itemOption.find((item) => item.value === value);
      newData[index].itemId = selectedItem?.value || 0;
      newData[index].unitID = selectedItem?.unitID || 0; // Automatically set unitId

      console.log("Selected Item:", selectedItem);
    } else {
      newData[index][field] = value;
    }
    // if (field === 'itemId') {
    //   newData[index].itemId = newData[index].itemId;
    //   // newData[index].serviceName = serviceOption[serviceOption.findIndex(e => e.value == newData[index].serviceId)].label;
    // }

    if (field === "amount") {
      newData[index].amount = newData[index].amount;
    }

    if (field === "netAmount") {
      newData[index].netAmount = newData[index].netAmount;
    }

    newData[index].jobCardId = formik.values.jobCardId;
    newData[index].amount = newData[index].qty * newData[index].rate;
    newData[index].netAmount = newData[index].qty * newData[index].rate;

    newData[index].id = index;
    setTableData1(newData);

    // if (newData[index].itemId && newData[index].qty && newData[index].rate) {
    //   if (index === tableData1.length - 1) {
    //     handleAddItem();

    //   }
    // }

    let total = 0;
    let netAmt = 0;
    tableData1.forEach((row: any) => {
      total += row.amount;
      netAmt += row.amount;
    });
    tableData.forEach((row: any) => {
      netAmt += row.amount;
    });
    formik.setFieldValue("totalItemAmount", total);
    formik.setFieldValue("netAmount", netAmt);
  };

  const addRow = () => {
    setTableData([
      ...tableData,
      {
        id: 0,
        jobCardId: 0,
        serviceId: 0,
        amount: 0,
        jobWorkReq: true,
        vendorId: 0,
        challanRemark: "",
        challanNo: 0,
        challanDate: defaultValues,
        challanRcvNo: 0,
        challanRcvDate: defaultValues,
        challanStatus: "",
        netAmount: 0,

        cgstid: 0,
        sgstid: 0,
        gstid: 0,
      },
    ]);
  };

  const saveJobWorkChallanData = async () => {
    console.log("savejobworkchallan");
    const uniqueVendor: any = [];
    const validTableData = tableData.filter(validateRow);

    // Extract unique vendor IDs
    validTableData.forEach((data: any) => {
      if (!uniqueVendor.includes(data.vendorId)) {
        uniqueVendor.push(data.vendorId);
      }
    });

    for (let i = 0; i < uniqueVendor.length; i++) {
      const challanChildData: any = [];
      let totalAmt = 0;
      let netAmt = 0;

      tableData.forEach((item: any) => {
        if (item.vendorId === uniqueVendor[i]) {
          challanChildData.push({
            id: 0,
            challanNo: 0,
            jobCardId: formik.values.jobCardId,
            serviceId: item.serviceId,
            serviceCharge: item?.amount || 0,
            vendorId: item.vendorId,
            remark: item.challanRemark,
            qty: 1,
            unitId: item?.unitId || 0,
            amount: item.amount,
            netAmount: item.amount,
            gstid: 0,
            cgstid: 0,
            sgstid: 0,
            gst: 0,
            cgst: 0,
            sgst: 0,
            serviceName:
              item.serviceName ||
              serviceOption.find((e) => e.value === item.serviceId)?.label,
            unitName:
              item.unitName ||
              unitOptions.find((e) => e.value === item.unitId)?.label,
          });
          totalAmt += item.amount;
          netAmt += item.netAmount;
        }
      });

      const values = {
        challanNo: 0,
        challanDate: defaultValues,
        complainId: formik.values.complainId,
        empId: formik.values.empId,
        itemId: formik.values.itemId,
        jobCardId: formik.values.jobCardId,
        vendorId: uniqueVendor[i],
        createdBy: "adminvm",
        updatedBy: "adminvm",
        createdOn: defaultValues,
        updatedOn: defaultValues,
        companyId: 0,
        fyId: 0,
        serviceAmount: totalAmt,
        itemAmount: 0,
        netAmount: netAmt || totalAmt,
        status: "JobWork",
        rcvDate: defaultValues,
        rcvNo: 0,
        cgst: 0,
        sgst: 0,
        gst: 0,
        cgstid: 0,
        sgstid: 0,
        gstid: 0,
        challanDoc: "",
        fileOldName: "",
        file: "",
        jobWorkChallanDetail: [...challanChildData],
        vehicleNo: "",
        vendorName: "",
        empName: "",
        jobCardDate: formik.values.jobCardDate,
        complainDate: formik.values.complainDate,
      };

      try {
        const response = await api.post(`Master/UpsertJobWorkChallan`, {
          ...values,
          jobWorkChallanDetail: [...challanChildData],
        });

        if (response.data.status === 1) {
          toast.success("JobWorkChallan generated successfully!");
          //toast.success(response.data.message);
          // setChallanNum(response.data.data);

          // Update tableData with new challanNo for the matching vendor
          // setTableData((prevData) =>
          //   prevData.map((data) =>
          //     data.vendorId === uniqueVendor[i] ? { ...data, challanNo: response.data.data } : data
          //   )
          // );
          setTableData((prevData) =>
            prevData.map((data) =>
              data.vendorId === uniqueVendor[i]
                ? { ...data, challanNo: response.data.data }
                : data
            )
          );

          // ✅ Log inside useEffect after state update to verify
          console.log(
            `Updated challan number for vendor ${uniqueVendor[i]}: ${response.data.data}`
          );
        } else {
          setToaster(true);
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Failed to save job work challan.");
      }

      //await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleAddItem = () => {
    setTableData1([
      ...tableData1,
      {
        id: 0,
        jobCardId: 0,
        itemId: 0,
        indentId: 0,
        indentNo: "",
        qty: 0,
        rate: 0,
        batchNo: "",
        amount: 0,
        gstId: 0,
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        netAmount: 0,
        srno: 0,
        isDelete: true,
        prevReading: 0,
      },
    ]);
  };
  const deleteRow = (index: any) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const deleteRow1 = (index: any) => {
    const newData = tableData1.filter((_: any, i: any) => i !== index);
    setTableData1(newData);
  };

  const validateItem = (item: any) => {
    console.log("item validateItem", item);
    return (
      item.itemId &&
      item.unit &&
      item.qty > 0 &&
      item.rate > 0 &&
      item.amount >= 0 &&
      item.gstRate >= 0 &&
      item.netAmount >= 0
    );
  };
  const buttonStyle = (enabled: any) => ({
    backgroundColor: enabled ? `var(--header-background)` : "#e0e0e0", // Faded color for disabled
    color: enabled ? "white" : "#9e9e9e", // Text color for disabled
    padding: "6px 12px",
    fontSize: "12px",
    borderRadius: "8px",
    minWidth: "120px",
    cursor: enabled ? "pointer" : "not-allowed", // Change cursor for disabled
  });

  const handleSave = async (values: any) => {
    const validTableData = tableData.filter(validateRow);

    // if (validTableData.length === 0) {
    //   alert("Please add some data in the table for further processing");
    //   return;
    // }

    // Simulate Save logic here (e.g., API call)
    await api.post(`Master/UpsertJobCardInhouse`, values);

    // Enable Indent buttons after saving
    setIsIndentEnabled(true);
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
                {t("text.AddJobCard")}
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
            <Grid container spacing={2}>
              {/* RadioButton */}
              <Grid item xs={12} sm={12} lg={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="status"
                    name="status"
                    value={formik.values.status}
                    onChange={(event) =>
                      formik.setFieldValue("status", event.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Complete"
                      control={<Radio color="primary" />}
                      label={t("text.Complete")}
                    />
                    <FormControlLabel
                      value="JobWork"
                      control={<Radio color="primary" />}
                      label={t("text.JobWork")}
                    />
                    <FormControlLabel
                      value="inprogress"
                      control={<Radio color="primary" />}
                      label={t("text.InProgress")}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* File number */}
              {/* <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.jobCardNo")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="jobCardNo"
                  id="jobCardNo"
                  value={formik.values.jobCardNo}
                  placeholder={t("text.jobCardNo")}
                  onChange={(e) => {
                    formik.setFieldValue("jobCardNo", e.target.value.toString());
                    setDesgValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.designation || "");
                    setDeptValue(empOption[empOption.findIndex(e => e.value === location.state?.empId)]?.department || "");
                  }}
                />
              </Grid> */}

              {/* job card Date */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel text={t("text.JobCardDate")} required={true} />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="jobCardDate"
                  id="jobCardDate"
                  value={formik.values.jobCardDate}
                  placeholder={t("text.JobCardDate")}
                  onChange={(e) => {
                    formik.setFieldValue("jobCardDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* VehicleNumber */}

              <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    complainOption.filter((e) => {
                      if (e.status === "inprogress") {
                        return e;
                      }
                    })
                    // vehicleOption.filter((e) => {
                    //   for (let i = complainOption.length - 1; i >= 0; i--) {
                    //     if (e.value == complainOption[i].itemID && complainOption[i].compId) {
                    //       if (e.label === e.label2) {
                    //         e.label = e.label + `(ComplainNo : ${complainOption[i].complaintNo})`
                    //       }
                    //       return e;
                    //     }
                    //   }
                    // })
                    // vehicleOption.filter(e => {
                    //   for (let i = 0; i < complainOption.length; i++) {
                    //     if (e.value == complainOption[i].itemID && complainOption[i].compId) {
                    //       return (e);
                    //     }
                    //   }
                    // })
                  }
                  ref={inputRef}
                  value={
                    formik.values.vehicleNo || location.state?.vehicleNo || ""
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    if (!newValue) {
                      return;
                    } else {
                      setItemId(newValue?.value);
                      console.log("newValue" + JSON.stringify(newValue));
                      console.log(
                        "newValue" +
                        JSON.stringify(
                          jobCardData[
                            jobCardData.findIndex(
                              (e) =>
                                e.itemId == newValue?.itemID &&
                                e.complainId == newValue?.compId
                            )
                          ]?.itemDetail
                        )
                      );
                      //formik.setFieldValue("itemName", newValue?.label2);
                      formik.setFieldValue("vehicleNo", newValue?.vehicleNo);
                      formik.setFieldValue("itemId", newValue?.itemID);
                      formik.setFieldValue("empId", newValue?.empId);
                      formik.setFieldValue("empName", newValue?.empName);
                      setDesgValue(
                        empOption[
                          empOption.findIndex((e) => e.value == newValue?.empId)
                        ]?.designation
                      );
                      setDeptValue(
                        empOption[
                          empOption.findIndex((e) => e.value == newValue?.empId)
                        ]?.department
                      );
                      setVehicleName(newValue?.vehicleName);

                      formik.setFieldValue("complainId", newValue?.compId);
                      formik.setFieldValue("complain", newValue?.complaint);
                      formik.setFieldValue(
                        "complainDate",
                        newValue?.complaintDate
                      );
                      formik.setFieldValue(
                        "currenReading",
                        newValue?.currentReading
                      );
                      formik.setFieldValue("status", newValue?.status);
                      // formik.setFieldValue("jobCardId", jobCardData[jobCardData.findIndex(e => (e.itemId == newValue?.itemID && e.complainId == newValue?.compId))]?.jobCardId || 0);
                      // formik.setFieldValue("jobCardNo", jobCardData[jobCardData.findIndex(e => (e.itemId == newValue?.itemID && e.complainId == newValue?.compId))]?.jobCardNo || "");
                      // formik.setFieldValue("fileNo", jobCardData[jobCardData.findIndex(e => (e.itemId == newValue?.itemID && e.complainId == newValue?.compId))]?.fileNo || "");
                      // formik.setFieldValue("totalServiceAmount", jobCardData[jobCardData.findIndex(e => (e.itemId == newValue?.itemID && e.complainId == newValue?.compId))]?.totalServiceAmount || "");
                      // formik.setFieldValue("netAmount", jobCardData[jobCardData.findIndex(e => (e.itemId == newValue?.itemID && e.complainId == newValue?.compId))]?.netAmount || 0);
                      // setTableData(jobCardData[jobCardData.findIndex(e => (e.itemId == newValue?.itemID && e.complainId == newValue?.compId))]?.serviceDetail || [
                      //   {
                      //     id: 0,
                      //     jobCardId: 0,
                      //     serviceId: 0,
                      //     amount: 0,
                      //     jobWorkReq: true,
                      //     vendorId: 0,
                      //     challanRemark: "",
                      //     challanNo: 0,
                      //     challanDate: defaultValues,
                      //     challanRcvNo: 0,
                      //     challanRcvDate: defaultValues,
                      //     challanStatus: "",
                      //     netAmount: 0,
                      //     qty: 0,
                      //     unitRate: 0,
                      //     unitId: 0,
                      //     vendorName: "",
                      //     serviceName: "",
                      //     unitName: "",
                      //     cgstid: 0,
                      //     sgstid: 0,
                      //     gstid: 0,
                      //     gst: 0
                      //   }]);
                      // setTableData([...jobCardData[jobCardData.findIndex(e => (e.itemId == newValue?.itemID && e.complainId == newValue?.compId) || (e.itemId == newValue?.itemID))]?.serviceDetail, {
                      //   id: 0,
                      //   jobCardId: 0,
                      //   serviceId: 0,
                      //   amount: 0,
                      //   jobWorkReq: true,
                      //   vendorId: 0,
                      //   challanRemark: "",
                      //   challanNo: 0,
                      //   challanDate: defaultValues,
                      //   challanRcvNo: 0,
                      //   challanRcvDate: defaultValues,
                      //   challanStatus: "",
                      //   netAmount: 0,
                      //   qty: 0,
                      //   unitRate: 0,
                      //   unitId: 0,
                      //   vendorName: "",
                      //   serviceName: "",
                      //   unitName: "",
                      //   cgstid: 0,
                      //   sgstid: 0,
                      //   gstid: 0,
                      //   gst: 0
                      // }]);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.VehicleNo")}
                          required={true}
                        />
                      }
                      name="vehicleNo"
                      id="vehicleNo"
                      placeholder={t("text.VehicleNo")}
                    />
                  )}
                />
                {!formik.values.vehicleNo &&
                  formik.touched.vehicleNo &&
                  formik.errors.vehicleNo && (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.vehicleNo.toString()}
                    </div>
                  )}
              </Grid>
              {/* <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    complainOption.filter((e) => {
                      if (e.status !== "pending") {
                        return e;
                      }
                    })
                    //   vehicleOption.filter(e => {
                    //   for (let i = 0; i < complainOption.length; i++) {
                    //     if (e.value == complainOption[i].itemID) {
                    //       return e;
                    //     }
                    //   }
                    // })
                  }
                  ref={inputRef}
                  value={formik.values.vehicleNo}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (!newValue) {
                      return;
                    } else {
                      setItemId(newValue?.value);
                      formik.setFieldValue("vehicleNo", newValue?.vehicleNo);
                      formik.setFieldValue("itemId", newValue?.itemID);
                      formik.setFieldValue("empId", newValue?.empId);
                      formik.setFieldValue("empName", empOption[empOption.findIndex(e => e.value == newValue?.empId)].label);
                      setDesgValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].designation);
                      setDeptValue(empOption[empOption.findIndex(e => e.value == newValue?.empId)].department);
                      setVehicleName(newValue?.vehicleName);
                      console.log(complainOption);
                      formik.setFieldValue("complainId", newValue?.compId);
                      formik.setFieldValue("complain", newValue?.complaint);
                      formik.setFieldValue("complainDate", newValue?.complaintDate);
                      formik.setFieldValue("currenReading", newValue?.currentReading);
                      formik.setFieldValue("status", newValue?.status);
                      // setTableData([...(jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.itemID)]?.serviceDetail), {
                      //   id: 0,
                      //   jobCardId: 0,
                      //   serviceId: 0,
                      //   amount: 0,
                      //   jobWorkReq: true,
                      //   vendorId: 0,
                      //   challanRemark: "",
                      //   challanNo: 0,
                      //   challanDate: defaultValues,
                      //   challanRcvNo: 0,
                      //   challanRcvDate: defaultValues,
                      //   challanStatus: "",
                      //   netAmount: 0,

                      //   cgstid: 0,
                      //   sgstid: 0,
                      //   gstid: 0,

                      // }]);
                      // setTableData1([...(jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.itemID)]?.serviceDetail), {
                      //   "id": 0,
                      //   "jobCardId": 0,
                      //   "itemId": 0,
                      //   "indentId": 0,
                      //   "indentNo": "",
                      //   "qty": 0,
                      //   "rate": 0,
                      //   "batchNo": "",
                      //   "amount": 0,
                      //   "gstId": 0,
                      //   "gstRate": 0,  
                      //   "cgst": 0,
                      //   "sgst": 0,
                      //   "igst": 0,
                      //   "netAmount": 0,
                      //   "srno": 0,
                      //   "isDelete": true,
                      //   "prevReading": 0
                      // }])
                      formik.setFieldValue("jobCardId", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.jobCardId || 0);
                      formik.setFieldValue("jobCardNo", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.jobCardNo || "");
                      formik.setFieldValue("fileNo", jobCardData[jobCardData.findIndex(e => e.itemId == newValue?.value)]?.fileNo || "");
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
              </Grid> */}

              {/* Vehicle name */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.VehicleName")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="VehicleName"
                  id="VehicleName"
                  value={vehicleName}
                  placeholder={t("text.VehicleName")}
                  onChange={(e) => { }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* UnderControlOf */}
              <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  value={formik.values.empName}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                    formik.setFieldValue("empName", newValue?.label);
                    setDesgValue(newValue?.designation);
                    setDeptValue(newValue?.department);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.UnderControlOf")}
                          required={true}
                        />
                      }
                      name="empName"
                      id="empName"
                      placeholder={t("text.UnderControlOf")}
                    />
                  )}
                />
              </Grid>

              {/* Department*/}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Department")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="deptValue"
                  id="deptValue"
                  value={deptValue}
                  placeholder={t("text.Department")}
                  onChange={(e) => { }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Designation*/}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Designation")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="desgValue"
                  id="desgValue"
                  value={desgValue}
                  placeholder={t("text.Designation")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* CurrentReadingKM */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ReadingKM")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="currenReading"
                  id="currenReading"
                  value={formik.values.currenReading}
                  placeholder={t("text.ReadingKM")}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "currenReading",
                      parseFloat(e.target.value) || 0
                    );
                  }}
                />
              </Grid>
              {/* 
              <Grid item lg={12} md={12} xs={12} >
                <ReactQuill
                  id="complaint"
                  theme="snow"
                  value={formik.values.complain}
                  onChange={(content) => formik.setFieldValue("complain", content)}
                  onBlur={() => formik.setFieldTouched("complain", true)}
                  modules={modules}
                  formats={formats}
                  //  style={{ backgroundColor: "white", minHeight: "200px" }} 
                  placeholder="Enter your complaint here"
                />
              </Grid> */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterComplaint")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="complain"
                  id="complain"
                  value={formik.values.complain}
                  placeholder={t("text.enterComplaint")}
                  onChange={(e) => {
                    formik.setFieldValue("complain", e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
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
                          }}
                        >
                          {t("text.Action")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                            width: "20rem",
                          }}
                        >
                          {t("text.Services")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                            width: "20rem",
                          }}
                        >
                          {t("text.Status")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                            width: "20rem",
                          }}
                        >
                          {t("text.Vendor")}
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
                          {t("text.NetAmount")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Reading")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.ChallanNo")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Remark1")}
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
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={serviceOption}
                              sx={{ width: "225px" }}
                              size="small"
                              onChange={(_, newValue: any) => {
                                if (newValue) {
                                  console.log(newValue?.value);
                                  handleInputChange(
                                    index,
                                    "serviceId",
                                    newValue?.value
                                  );
                                  handleInputChange(
                                    index,
                                    "serviceName",
                                    newValue?.label
                                  );
                                }
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid black",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["inhouse", "JobWork", "Complete"]}
                              value={row.challanStatus}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                handleInputChange(
                                  index,
                                  "challanStatus",
                                  newValue
                                );
                                if (newValue === "inhouse") {
                                  setBtnEnable1(false);
                                  setServiceGridDisable(true);
                                }
                                if (newValue === "JobWork") {
                                  setBtnEnable2(false);
                                  setServiceGridDisable(false);
                                }
                              }}
                              sx={{ width: "140px" }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={vendorOption}
                              fullWidth
                              size="small"
                              disabled={serviceGridDisable}
                              onChange={(_, newValue: any) => {
                                if (newValue) {
                                  handleInputChange(
                                    index,
                                    "vendorId",
                                    newValue.value
                                  );
                                  handleInputChange(
                                    index,
                                    "vendorName",
                                    newValue.label
                                  );
                                }
                              }}
                              sx={{ width: "330px" }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <TextField
                              value={row.amount}
                              disabled={serviceGridDisable}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "amount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              size="small"
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <TextField
                              value={row.amount}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "netAmount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              size="small"
                              disabled={serviceGridDisable}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <TextField
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "netAmount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              disabled={serviceGridDisable}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <TextField
                              value={row.challanNo}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "challanNo",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              //onFocus={e => e.target.select()}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              size="small"
                              disabled={true}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <TextField
                              value={row.challanRemark}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "challanRemark",
                                  e.target.value
                                )
                              }
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                              onFocus={(e) => e.target.select()}
                              disabled={serviceGridDisable}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>{" "}
              </Grid>

              {true && (
                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="button"
                    //disabled={!btnEnable1} // Disable initially
                    style={buttonStyle(btnEnable1)}
                    onClick={() => {
                      saveJobWorkChallanData();
                      setBtnEnable1(false);
                      //const validTableData = tableData.filter(validateRow);
                      // if (validTableData.length === 0) {
                      //   alert("Please add some data in table for further process");
                      //   return;
                      // } else {
                      formik.setFieldValue("status", "jobwork");
                      //   handleGenerateChallan(formik.values);
                      // }
                    }}
                  >
                    {t("text.JobWorkChallan")}
                  </Button>
                </Grid>
              )}

              <Grid item xs={12}>
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
                          {t("text.itemName")}
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
                            width: "20rem",
                          }}
                        >
                          {t("text.quantity")}
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
                          {t("text.indentNo")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.preReading")}
                        </th>
                        {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.gst")}</th> */}
                        {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.gstRate")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Sgst")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Cgst")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Igst")}</th> */}
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.netAmount")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData1.map((row: any, index: any) => (
                        <tr key={row.id} style={{ border: "1px solid black" }}>
                          {/* <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <DeleteIcon
                              onClick={() => {
                                if (tableData1.length > 1) {
                                  deleteRow1(index)
                                } else {
                                  alert("Atleast one row should be there");
                                }
                              }}
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
                                handleAddItem();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteIcon
                              onClick={() => {
                                if (tableData1.length > 1) {
                                  deleteRow1(index);
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
                              value={
                                itemOption[
                                  itemOption.findIndex(
                                    (e: any) => e.value === row.itemId
                                  )
                                ]?.label || ""
                              }
                              fullWidth
                              size="small"
                              sx={{ width: "210px" }}
                              onChange={(e: any, newValue: any) =>
                                handleInputChange1(
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
                              // textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <select
                              value={row.unitID}
                              onChange={(e: any) =>
                                handleInputChange(
                                  index,
                                  "unitID",
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

                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <TextField
                              value={row.qty}
                              size="small"
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              onChange={(e) =>
                                handleInputChange1(
                                  index,
                                  "qty",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10rem",
                            }}
                          >
                            <TextField
                              value={row.rate}
                              onChange={(e) =>
                                handleInputChange1(
                                  index,
                                  "rate",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
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
                              value={row.rate * row.qty}
                              onChange={(e) =>
                                handleInputChange1(index, "amount", parseFloat(e.target.value) || 0)
                              }
                              onFocus={e => e.target.select()}
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td> */}
                          <td
                            style={{
                              border: "1px solid black",
                            }}
                          >
                            <TextField
                              value={row.indentNo}
                              onChange={(e) =>
                                handleInputChange1(
                                  index,
                                  "indentNo",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              size="small"
                              sx={{ width: "225px" }}
                              disabled
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid black",
                            }}
                          >
                            <TextField
                              value={row.prevReading}
                              onChange={(e) =>
                                handleInputChange1(
                                  index,
                                  "prevReading",
                                  e.target.value
                                )
                              }
                              size="small"
                              sx={{ width: "155px" }}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              onFocus={(e) => e.target.select()}
                            />
                          </td>

                          {/* <td
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
                              disabled
                              onChange={(e: any, newValue: any) =>
                                handleInputChange1(index, "gstId", newValue?.value)
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
                              value={row.cgst}
                              size="small"
                              inputProps={{ readOnly: true }}
                              disabled
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              value={row.gstRate / 2}
                              size="small"
                              inputProps={{ readOnly: true }}
                              disabled
                            />
                          </td>*/}
                          {/* <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                             
                              size="small"
                              inputProps={{ readOnly: true }}
                            />
                          </td>  */}
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <TextField
                              // value={row.qty * row.rate}
                              value={row.amount + row.gstRate}
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
                        <td colSpan={6}></td>
                        <td
                          colSpan={1}
                          style={{
                            fontWeight: "bold",
                            borderTop: "1px solid black",
                          }}
                        >
                          {t("text.TotalItemAmount")}
                        </td>
                        <td colSpan={6} style={{ textAlign: "end" }}>
                          <b>:</b>
                          {formik.values.totalItemAmount}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={6}></td>
                        <td colSpan={1} style={{ fontWeight: "bold" }}>
                          {t("text.TotalServiceAmount")}
                        </td>
                        <td colSpan={6} style={{ textAlign: "end" }}>
                          <b>:</b>
                          {formik.values.totalServiceAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6}></td>
                        <td colSpan={1} style={{ fontWeight: "bold" }}>
                          {t("text.TotalAmount")}
                        </td>
                        <td colSpan={6} style={{ textAlign: "end" }}>
                          <b>:</b>
                          {formik.values.netAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>{" "}
              </Grid>
              {true && (
                <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
                  container
                  spacing={2} // Adds spacing between buttons
                  justifyContent="flex-start" // Aligns buttons to the left; use 'center' or 'flex-end' as needed
                  alignItems="center"
                >
                  {/* Indent Generate Button */}

                  <Grid item>
                    <Button
                      type="button"
                      disabled={!isIndentGenerateEnabled && !btnEnable2}
                      style={buttonStyle(btnEnable2)}
                      onClick={() => {
                        handleGenerateIndent(formik.values);
                        setBtnEnable2(false);
                      }}
                    >
                      {t("text.indentGenerate")}
                    </Button>
                  </Grid>

                  {/* <Grid item>
                    <Button
                      type="button"
                      disabled={!isIndentPrintEnabled}
                      style={buttonStyle(isIndentPrintEnabled)}
                      onClick={() => {
                        //   formik.setFieldValue("status", "indentPrint");
                      }}
                    >
                      {t("text.indentprint")}
                    </Button>
                  </Grid> */}
                </Grid>
              )}
              <Grid container spacing={3} item></Grid>
              {/* vendor evaluation*/}
              <Grid
                container
                spacing={2}
                justifyContent="flex-end" // Align buttons to the right
                alignItems="center"
                style={{ marginTop: "10px" }}
              >
                {/* Vendor Evaluation Button */}
                {/* <Grid item>
                  <Button
                    type="button"
                    disabled={!isIndentEnabled} // Disable initially
                    style={buttonStyle(isIndentEnabled)}
                    onClick={() => {
                      // Indent Generate logic
                      formik.setFieldValue("status", "vendorevaluation");
                    }}
                  >
                    {t("text.vendorevaluation")}
                  </Button>
                </Grid> */}

                {/* Submit Button */}
                <Grid item>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: isSubmitting ? "#ccc" : `var(--header-background)`, // Change color when disabled
                      color: "white",
                      minWidth: "120px", // Set a fixed width
                      textAlign: "center",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                    disabled={isSubmitting} // Disable button when submitting
                  >
                    {t("text.save")}
                  </Button>

                  {/* <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      minWidth: "120px", // Set a fixed width
                      textAlign: "center",
                    }}
                  //onClick={() => handleSave(formik.values)}
                  >
                    {t("text.save")}
                  </Button> */}
                </Grid>

                {/* Reset Button */}
                <Grid item>
                  <Button
                    type="reset"
                    fullWidth
                    style={{
                      backgroundColor: "#F43F5E",
                      color: "white",
                      minWidth: "120px", // Set a fixed width
                      textAlign: "center",
                    }}
                    onClick={() => {
                      formik.resetForm();
                      setTableData1([
                        {
                          id: 0,
                          jobCardId: 0,
                          itemId: 0,
                          unitID: null,
                          indentId: 0,
                          indentNo: "",
                          qty: 0,
                          rate: 0,
                          batchNo: "",
                          amount: 0,
                          gstId: 0,
                          gstRate: 0,
                          cgst: 0,
                          sgst: 0,
                          igst: 0,
                          netAmount: 0,
                          srno: 0,
                          isDelete: true,
                          prevReading: 0,
                          unitName: "",
                        },
                      ]);
                      setDeptValue("");
                      setDesgValue("");
                      setVehicleName("");
                      //  setIsIndentSelected(false);
                      console.log(totalAmount);
                    }}
                  >
                    {t("text.reset")}
                  </Button>
                </Grid>
              </Grid>

              {/* {isVisible && (
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
                      const validTableData = tableData1.filter(validateRow);
                      if (validTableData.length === 0) {
                        toast.error("Please add some data in table for further process");
                        return;
                      }
                      navigate("/vehiclecomplaint/AddJobWorkChallan", {
                        state: { ...formik.values, serviceDetail: validTableData, jobCardId: jobCardId, challanNo: validTableData[0].challanNo },
                      });

                    }}
                  >
                    {t("text.Next")}
                    <ArrowForwardIcon />
                  </Button>
                </Grid>
              )} */}
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "formula",
  "code-block",
];
export default AddJobCard1;
