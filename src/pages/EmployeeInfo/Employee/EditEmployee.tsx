import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Modal,
  Box,
  Checkbox,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import nopdf from "../../../assets/images/imagepreview.jpg";
import api from "../../../utils/Url";
import CustomLabel from "../../../CustomLable";
import { getId } from "../../../utils/Constant";
import Languages from "../../../utils/Languages";
import TranslateTextField from "../../../TranslateTextField";
import { Language } from "react-transliterate";
import { getISTDate } from "../../../utils/Constant";
import Department from "../Department/Department";
import useLocalStorage from "use-local-storage";
import dayjs from "dayjs";

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

type Props = {};

const EditEmployee = (props: Props) => {
  const userId = getId();

  const { i18n, t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const location = useLocation();

  const [StateOption, setStateOption] = useState<any>([
    { value: "-1", label: t("text.SelectState") },
  ]);
  const [Country, setCountry] = useState<any>([
    { value: "-1", label: t("text.SelectCountry") },
  ]);
  const [City, setCity] = useState<any>([
    { value: "-1", label: t("text.SelectCity") },
  ]);
  const [deptOption, setDeptOption] = useState([
    { value: 1, label: t("text.Department") },
  ]);
  const [designationOption, setDesignationOption] = useState([
    { value: 1, label: t("text.Designation") },
  ]);
  const [zoneOption, setzoneOption] = useState([
    { value: 1, label: t("text.Zone") },
  ]);
  const [emailOption, setEmailOption] = useState([
    { value: 1, label: t("text.Email") },
  ]);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");


  useEffect(() => {
    getCountry();
    getDeptData();
    getDesignationData();
    getZoneData();
    getEmailData();

    console.log("location=>", JSON.stringify(location.state))
  }, []);

  const getZoneData = async () => {
    const collectData = {
      "zoneID": -1
    };
    const response = await api.post(`ZoneMaster/GetZone`, collectData);
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["zoneName"],
        value: data[index]["zoneID"],
      });
    }
    setzoneOption(arr);
  };

  const getState = (countryId: any) => {
    const collectData = {
      "stateId": -1
    };
    api.post(`StateMaster/GetState`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.stateName,
        value: item.stateId,
      }));
      setStateOption(arr);
    });
  };

  const getCountry = () => {
    const collectData = {
      "countryId": -1
    };
    api.post(`CountryMaster/GetCountry`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.countryName,
        value: item.countryId,
      }));
      setCountry(arr);
    });
  };

  const getCity = (stateId: any) => {
    const collectData = {
      "cityId": -1
    };
    api.post(`CityMaster/GetCityMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.cityName,
        value: item.cityId,
      }));
      setCity(arr);
    });
  };

  const getDeptData = async () => {
    const collectData = {
      "departmentId": -1
    };
    const response = await api.post(`Department/GetDepartment`, collectData);
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["departmentName"],
        value: data[index]["departmentId"],
      });
    }
    setDeptOption(arr);
  };

  const getDesignationData = async () => {
    const collectData = {
      "designationId": -1
    };
    const response = await api.post(`Department/GetDesignation`, collectData);
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["designationName"],
        value: data[index]["designationId"],
      });
    }
    setDesignationOption(arr);
  };

  const getEmailData = () => {
    const collectData = {
      "id": -1
    };
    api.post(`Comm/GetAllEmailSetting`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.email,
        value: item.id,
      }));
      setEmailOption(arr);
    });
  };



  const handlePanClose = () => {
    setPanOpen(false);
  };

  // const modalOpenHandle = (event: any) => {
  //     setPanOpen(true);
  //     let base = "data:image/jpg;base64";
  //     if (event === "imageFile") {
  //         setModalImg(base + formik.values.imageFile);
  //     }
  // };

  const handlePanClose1 = () => {
    setOpen(false);
  };

  const modalOpenHandle1 = (event: string) => {
    setOpen(true);
    const base64Prefix = "data:image/jpg;base64,";

    let imageData = '';
    switch (event) {
      case "imageFile":
        imageData = formik.values.imageFile;
        break;
      case "signatureFile":
        imageData = formik.values.signatureFile;
        break;
      case "panFile":
        imageData = formik.values.panFile;
        break;
      case "adharImageFile":
        imageData = formik.values.adharImageFile;
        break;
      case "driverLicenceFile":
        imageData = formik.values.driverLicenceFile;
        break;
    }

    if (imageData) {
      console.log("imageData", base64Prefix + imageData);
      setImg(base64Prefix + imageData);
    } else {
      setImg('');
    }
  };

  const otherDocChangeHandler = (event: any, params: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['jpg'].includes(fileExtension || '')) {
      alert("Only .jpg image file is allowed to be uploaded.");
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64String = e.target?.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      formik.setFieldValue(params, base64Data);
      console.log(`File '${file.name}' loaded as base64 string`);
      console.log("base64Data", base64Data);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  let navigate = useNavigate();



  const validationSchema = Yup.object({
    empName: Yup.string().test(
      "required",
      t("text.EmpNameRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    empCode: Yup.string().test(
      "required",
      t("text.EmpCodeRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    empMobileNo: Yup.string().test(
      "required",
      t("text.MobNoRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    empPanNumber: Yup.string()
      .matches(/^[A-Z]{3}[A-ZHPTCF][A-Z]\d{4}[A-Z]$/, "Invalid PAN format")
      .required(t("text.PanNoRequired")),
    // empPerAddress: Yup.string().test(
    //   "required",
    //   t("text.PermanentAddressRequired"),
    //   function (value: any) {
    //     return value && value.trim() !== "";
    //   }
    // ),
    // empPincode: Yup.string().test(
    //   "required",
    //   t("text.PincodeRequired"),
    //   function (value: any) {
    //     return value && value.trim() !== "";
    //   }
    // ),
    empAddharNo: Yup.string()
      .required(t("text.AdharNoRequired"))
      .test("len", "Aadhaar number must be exactly 12 digits", (val: any) =>
        val ? val.replace(/\D/g, "").length === 12 : true
      ),
  });

  const formik = useFormik({
    initialValues: {
      "empid": location.state?.empid,
      "empName": location.state?.empName,
      "empCode": location.state?.empCode,
      "empPerAddress": location.state?.empPerAddress,
      "empLocalAddress": location.state?.empLocalAddress,
      "empFatherName": location.state?.empFatherName,
      "empspauseName": location.state?.empspauseName,
      "empMotherName": location.state?.empMotherName,
      "empMobileNo": location.state?.empMobileNo,
      "empStatus": location.state?.empStatus,
      "empPanNumber": location.state?.empPanNumber,
      "empAddharNo": location.state?.empAddharNo,
      "empDob": dayjs(location.state?.empDob).format("YYYY-MM-DD"),
      "empJoiningDate": dayjs(location.state?.empJoiningDate || defaultValuestime).format("YYYY-MM-DD"),
      "empretirementDate": dayjs(location.state?.empretirementDate || defaultValuestime).format("YYYY-MM-DD"),
      "empDeptId": location.state?.empDeptId,
      "empDesignationId": location.state?.empDesignationId,
      "empStateId": location.state?.empStateId,
      "empCountryID": location.state?.empCountryID,
      "empCityId": location.state?.empCityId,
      "empPincode": location.state?.empPincode,
      "createdBy": location.state?.createdBy,
      "updatedBy": userId,
      "createdOn": location.state?.createdOn,
      "updatedOn": defaultValuestime || location.state?.updatedOn,
      "userId": location.state?.userId,
      "roleId": location.state?.roleId,
      "imageFile": location.state?.imageFile || "",
      "signatureFile": location.state?.signatureFile || "",
      "adharImageFile": location.state?.adharImageFile || "",
      "panFile": location.state?.panFile || "",
      "driverLicenceFile": location.state?.driverLicenceFile || "",
      "email": location.state?.email,
      "dlno": location.state?.dlno,
      "gender": location.state?.gender,
      "eZoneID": location.state?.eZoneID,
      "srno": location.state?.srno,
      "empDepName": location.state?.empDepName,
      "registerModel": {
        "id": "",
        "username": "",
        "email": "user@example.com",
        "password": "12345",
        "role": ""
      },
      "userPermission": [
        {
          "sno": 0,
          "userId": "",
          "menuId": 0,
          "parentId": 0,
          "isAdd": true,
          "isEdit": true,
          "isDel": true,
          "isView": true,
          "isPrint": true,
          "isExport": true,
          "isRelease": true,
          "isPost": true,
          "menuName": "",
          "srn": 0
        }
      ],
      "listCommGroup": [
        {
          "groupId": 0,
          "name": "",
          "description": "",
          "type": "",
          "isActive": true,
          "createdBy": "",
          "updatedBy": "",
          "createdOn": "2024-12-14T06:04:07.938Z",
          "updatedOn": "2024-12-14T06:04:07.938Z",
          "isSelected": true
        }
      ],
      // "registerModel": {
      //   "id": (location.state?.id || "").toString(),
      //   "username": location.state?.username,
      //   "email": location.state?.email,
      //   "password": location.state?.password,
      //   "role": location.state?.role
      // },
      // "userPermission": [
      //   {
      //     "sno": location.state?.sno,
      //     "userId": location.state?.userId,
      //     "menuId": location.state?.menuId,
      //     "parentId": location.state?.parentId,
      //     "isAdd": true,
      //     "isEdit": true,
      //     "isDel": true,
      //     "isView": true,
      //     "isPrint": true,
      //     "isExport": true,
      //     "isRelease": true,
      //     "isPost": true,
      //     "menuName": location.state?.menuName,
      //     "srn": location.state?.srn
      //   }
      // ],
      // "listCommGroup": [
      //   {
      //     "groupId": location.state?.groupId ,
      //     "name": location.state?.name,
      //     "description": location.state?.description,
      //     "type": location.state?.type,
      //     "isActive": true,
      //     "createdBy": location.state?.createdBy,
      //     "updatedBy": location.state?.updatedBy,
      //     "createdOn": location.state?.createdOn,
      //     "updatedOn": location.state?.updatedOn,
      //     "isSelected": true
      //   }
      // ],
      "zoneName": location.state?.zoneName,
      "designationName": location.state?.designationName,
      "departmentName": location.state?.departmentName,
      "empCityName": location.state?.empCityName,
      "empCountryName": location.state?.empCountryName,
      "empStateName": location.state?.empStateName
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {

      try {
        const response = await api.post(
          `Employee/UpsertEmployee`,
          values
        );
        if (response.data.status === 1) {
          setToaster(false);
          toast.success(response.data.message);
          navigate("/employeeInfo/Employee");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        setToaster(true);
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  const requiredFields = [
    "addharNo",
    "pincode",
    "permanentAddress",
    "panNumber",
    "mobileNo",
    "code",
    "name"
  ];

  const back = useNavigate();

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #00009c",
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
                {location.state.isView ? t("text.Employee") : t("text.EditEmployee")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
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
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>

              {/* emp name */}
              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterEmpName")}
                  value={formik.values.empName}
                  onChangeText={(text: string) =>
                    handleConversionChange("empName", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.empName && formik.errors.empName && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empName.toString()}</div>
                )}

              </Grid>

              {/* Code */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterEmpCode")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="empCode"
                  id="empCode"
                  value={formik.values.empCode}
                  placeholder={t("text.EnterEmpCode")}
                  onChange={(e) => {
                    formik.setFieldValue("empCode", e.target.value);
                  }}
                />
                {formik.touched.empCode && formik.errors.empCode && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empCode.toString()}</div>
                )}
              </Grid>

              {/* father name */}
              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterFatherName")}
                  value={formik.values.empFatherName}
                  onChangeText={(text: string) =>
                    handleConversionChange("empFatherName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              {/* Mother name */}
              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterMotherName")}
                  value={formik.values.empMotherName}
                  onChangeText={(text: string) =>
                    handleConversionChange("empMotherName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              {/* gender */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={["Male", "Female"]}
                  value={formik.values.gender}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    formik.setFieldValue("gender", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectGender")} required={false} />}
                      name="gender"
                      id="gender"
                      placeholder={t("text.Gender")}
                    />
                  )}
                />
              </Grid>

              {/* dob */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.DOB")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="empDob"
                  id="empDob"
                  value={formik.values.empDob}
                  placeholder={t("text.DOB")}
                  onChange={(e) => {
                    formik.setFieldValue("empDob", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />

              </Grid>

              {/* Mobile no */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="empMobileNo"
                  name="empMobileNo"
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  label={
                    <CustomLabel
                      text={t("text.EnterMobileNum")}
                      required={true}
                    />
                  }
                  value={formik.values.empMobileNo}
                  placeholder={t("text.EnterMobileNum")}
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    formik.setFieldValue("empMobileNo", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empMobileNo && formik.errors.empMobileNo && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empMobileNo.toString()}</div>
                )}
              </Grid>

              {/* email id */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="email"
                  name="email"
                  label={
                    <CustomLabel
                      text={t("text.EnterEmailId")}
                    />
                  }
                  value={formik.values.email}
                  placeholder={t("text.EnterEmailId")}
                  //type="email"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    formik.setFieldValue("email", e.target.value);
                    formik.setFieldValue("registerModel.email", e.target.value || "user@example.com");
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {/* pan no */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="empPanNumber"
                  name="empPanNumber"
                  label={
                    <CustomLabel
                      text={t("text.PanNo")}
                      required={true}
                    />
                  }
                  value={formik.values.empPanNumber}
                  placeholder={t("text.PanNo")}
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    formik.setFieldValue("empPanNumber", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empPanNumber && formik.errors.empPanNumber && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empPanNumber.toString()}</div>
                )}
              </Grid>

              {/* aadhar no */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="empAddharNo"
                  name="empAddharNo"
                  label={
                    <CustomLabel
                      text={t("text.AadharNo")}
                      required={true}
                    />
                  }
                  value={formik.values.empAddharNo}
                  placeholder={t("text.AadharNo")}
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    formik.setFieldValue("empAddharNo", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.empAddharNo && formik.errors.empAddharNo && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empAddharNo.toString()}</div>
                )}
              </Grid>

              {/* joining date */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.JoiningDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="empJoiningDate"
                  id="empJoiningDate"
                  value={formik.values.empJoiningDate}
                  placeholder={t("text.JoiningDate")}
                  onChange={(e) => {
                    formik.setFieldValue("empJoiningDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />

              </Grid>

              {/* Retirement Date */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.RetirementDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="empretirementDate"
                  id="empretirementDate"
                  value={formik.values.empretirementDate}
                  placeholder={t("text.RetirementDate")}
                  onChange={(e) => {
                    formik.setFieldValue("empretirementDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />

              </Grid>



              {/* status */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterStatus")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="empStatus"
                  id="empStatus"
                  value={formik.values.empStatus}
                  placeholder={t("text.EnterStatus")}
                  onChange={(e) => {
                    formik.setFieldValue("empStatus", e.target.value);
                  }}
                />
              </Grid>

              {/* driving licence */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="dlno"
                  name="dlno"
                  label={
                    <CustomLabel
                      text={t("text.EnterDrivingLicence")}
                    />
                  }
                  value={formik.values.dlno}
                  placeholder={t("text.EnterDrivingLicence")}
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    formik.setFieldValue("dlno", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {/* Department */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={deptOption}
                  value={formik.values.departmentName}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    console.log(newValue?.value);
                    formik.setFieldValue("departmentName", newValue?.label)
                    formik.setFieldValue("empDeptId", newValue?.value)

                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectDepartment")} required={false} />}
                      name=""
                      id=""
                      placeholder={t("text.SelectDepartment")}
                    />
                  )}
                />
              </Grid>

              {/* Designation */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={designationOption}
                  value={formik.values.designationName}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    console.log(newValue?.value);
                    formik.setFieldValue("designationName", newValue?.label);
                    formik.setFieldValue("empDesignationId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectDesignation")} required={false} />}
                      name=""
                      id=""
                      placeholder={t("text.SelectDesignation")}
                    />
                  )}
                />
              </Grid>



              {/* Permanent address */}
              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterPermanentAddress")}
                  onChangeText={(text: string) => formik.setFieldValue("empPerAddress", text)}
                  required={false}
                  lang={lang}
                  value={formik.values.empPerAddress}
                />

              </Grid>

              {/* Local address */}
              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterLocalAddress")}
                  onChangeText={(text: string) => formik.setFieldValue("empLocalAddress", text)}
                  required={false}
                  lang={lang}
                  value={formik.values.empLocalAddress}
                />

              </Grid>


              {/* country */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Country}
                  value={formik.values.empCountryName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    formik.setFieldValue("empCountryID", newValue?.value);
                    formik.setFieldValue("empCountryName", newValue?.label);
                    formik.setFieldTouched("empCountryID", true);
                    formik.setFieldTouched("empCountryID", false);
                    getState(newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectCountry")}
                        />
                      }
                    />
                  )}
                />

              </Grid>

              {/* state */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StateOption}
                  value={formik.values.empStateName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    formik.setFieldValue("empStateId", newValue?.value);
                    formik.setFieldValue("empStateName", newValue?.label);
                    formik.setFieldTouched("empStateId", true);
                    formik.setFieldTouched("empStateId", false);
                    getCity(newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectState")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {/* city */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={City}
                  value={formik.values.empCityName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    formik.setFieldValue("empCityId", newValue?.value);
                    formik.setFieldValue("empCityName", newValue?.label);
                    formik.setFieldTouched("empCityId", true);
                    formik.setFieldTouched("empCityId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectCity")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {/* zone */}
              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={zoneOption}
                  value={formik.values?.zoneName || zoneOption.find(e => e.value === formik.values.eZoneID)?.label || ""}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    if (!newValue) {
                      return;
                    }
                    formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldValue("eZoneID", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectZone")}
                        />
                      }
                      placeholder={t("text.SelectZone")}
                    />
                  )}
                />
              </Grid>


              {/* pincode */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="empPincode"
                  name="empPincode"
                  label={
                    <CustomLabel
                      text={t("text.pincode")}
                    />
                  }
                  value={formik.values.empPincode}
                  placeholder={t("text.pincode")}
                  inputProps={{ maxLength: 6 }}
                  type="number"
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => {
                    formik.setFieldValue("empPincode", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {/* Email group */}
              {/* <Grid item xs={12} sm={6} lg={6}>
                <Autocomplete
                  disableCloseOnSelect
                  multiple
                  id="combo-box-demo"
                  options={emailOption}
                  getOptionLabel={(option: any) => option.label}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    const groupID = newValue.map((item: any) => ({
                      id: 0,
                      campaignId: 0,
                      groupId: item.value,
                      memberId: 0,
                      message: "",
                      emailId: "",
                      mobileNo: "",
                      receiverType: "",
                      name: "",
                      isSelected: true,
                    }));
                    console.log("🚀 ~ groupID:", groupID);

                    formik.setFieldValue("listGroups", groupID);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        checked={selected}
                        style={{ marginRight: 8 }}
                      />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.EmailGroup")} />}
                    />
                  )}
                />
              </Grid> */}

              {/* Mobile number group */}
              {/* <Grid item xs={12} sm={6} lg={6}>
                <Autocomplete
                  disableCloseOnSelect
                  multiple
                  id="combo-box-demo"
                  options={[1, 2, 3, 4, 5, 6, 7]}
                  //getOptionLabel={(option: any) => option.label}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    const groupID = newValue.map((item: any) => ({
                      id: 0,
                      campaignId: 0,
                      groupId: item.value,
                      memberId: 0,
                      message: "",
                      emailId: "",
                      mobileNo: "",
                      receiverType: "",
                      name: "",
                      isSelected: true,
                    }));
                    console.log("🚀 ~ groupID:", groupID);

                    formik.setFieldValue("listGroups", groupID);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        checked={selected}
                        style={{ marginRight: 8 }}
                      />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.MobileNoGroup")} />}
                    />
                  )}
                />
              </Grid> */}




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
                    label={<CustomLabel text={t("text.AttachedImage")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "imageFile")}
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
                    {formik.values.imageFile == "" ? (
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
                        src={`data:image/jpg;base64,${formik.values.imageFile}`}
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
                      onClick={() => modalOpenHandle1("imageFile")}
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
                <Modal open={panOpens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {modalImg == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={modalImg}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
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
                    label={<CustomLabel text={t("text.AttachedSignature")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "signatureFile")}
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
                    {formik.values.signatureFile == "" ? (
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
                        src={`data:image/jpg;base64,${formik.values.signatureFile}`}
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
                      onClick={() => modalOpenHandle1("signatureFile")}
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

                <Modal open={Opens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={Img}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
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
                    label={<CustomLabel text={t("text.AttachedAadhar")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "adharImageFile")}
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
                    {formik.values.adharImageFile == "" ? (
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
                        // src={formik.values.adharImageFile}
                        src={`data:image/jpg;base64,${formik.values.adharImageFile}`}
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
                      onClick={() => modalOpenHandle1("adharImageFile")}
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

                <Modal open={Opens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={Img}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
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
                    label={<CustomLabel text={t("text.AttachedPan")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "panFile")}
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
                    {formik.values.panFile == "" ? (
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
                        // src={formik.values.panFile}
                        src={`data:image/jpg;base64,${formik.values.panFile}`}
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
                      onClick={() => modalOpenHandle1("panFile")}
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

                <Modal open={Opens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={Img}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
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
                    label={<CustomLabel text={t("text.AttachedDrivingLicence")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "driverLicenceFile")}
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
                    {formik.values.driverLicenceFile == "" ? (
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
                        // src={formik.values.driverLicenceFile}
                        src={`data:image/jpg;base64,${formik.values.driverLicenceFile}`}
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
                      onClick={() => modalOpenHandle1("driverLicenceFile")}
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

                <Modal open={Opens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={Img}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid>


              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  {location.state.isView ? "" :
                    (
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
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                {location.state.isView ? "" :
                  (
                    <Button
                      type="reset"
                      fullWidth
                      style={{
                        backgroundColor: "#F43F5E",
                        color: "white",
                        marginTop: "10px",
                      }}
                      onClick={(e) => formik.resetForm()}
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

export default EditEmployee;