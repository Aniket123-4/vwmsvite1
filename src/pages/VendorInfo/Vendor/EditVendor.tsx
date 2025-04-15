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

const EditVendor = (props: Props) => {
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

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");


  useEffect(() => {
    getCountry();
  }, []);

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


  const handlePanClose = () => {
    setPanOpen(false);
  };

 

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
      case "gstInFile":
        imageData = formik.values.gstInFile;
        break;
      case "tanFile":
        imageData = formik.values.tanFile;
        break;
      case "adharImageFile":
        imageData = formik.values.adharImageFile;
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
    name: Yup.string().test(
      "required",
      t("text.EmpNameRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    code: Yup.string().test(
      "required",
      t("text.EmpCodeRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    mobileNo: Yup.string().test(
      "required",
      t("text.MobNoRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    panNumber: Yup.string()
      .matches(/^[A-Z]{3}[A-ZHPTCF][A-Z]\d{4}[A-Z]$/, "Invalid PAN format")
      .required(t("text.PanNoRequired")),
 
    addharNo: Yup.string()
      .required(t("text.AdharNoRequired"))
      .test("len", "Aadhaar number must be exactly 12 digits", (val: any) =>
        val ? val.replace(/\D/g, "").length === 12 : true
      ),
  });

  const formik = useFormik({
    initialValues: {
      "venderId": location.state.venderId,
      "name": location.state.name,
      "code": location.state.code,
      "permanentAddress": location.state.permanentAddress,
      "contactPerson": location.state.contactPerson,
      "mobileNo": location.state.mobileNo,
      "panNumber": location.state.panNumber,
      "addharNo": location.state.addharNo,
      "gstinNo": location.state.gstinNo,
      "stateId": location.state.stateId,
      "countryId": location.state.countryId,
      "cityId": location.state.cityId,
      "pincode": location.state.pincode,
      "createdBy": location.state.createdBy,
      "updatedBy": userId,
      "createdOn": location.state.createdOn,
      "updatedOn": defaultValuestime,
      "imageFile": location.state.imageFile,
      "signatureFile": location.state.signatureFile,
      "panFile": location.state.panFile,
      "gstInFile": location.state.gstInFile,
      "adharImageFile": location.state.adharImageFile,
      "tanFile": location.state.tanFile,
      "tanno": location.state.tanno,
      "stateName": location.state.stateName,
      "countryName": location.state.countryName,
      "cityName": location.state.cityName
    },
    //validationSchema: validationSchema,

    onSubmit: async (values) => {
      // console.log("Before submission formik values", values);

      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== "")
      );

   
      try {
        const response = await api.post(
          `Master/UpsertVendorMaster`,
          filteredValues
        );
        if (response.data.status === 1) {
          toast.success(response.data.message);
          navigate("/vendorinfo/Vendor");
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
                {location.state.isView ? t("text.Vendor") : t("text.EditVendor")}
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

              {/* organisation name */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={t("text.vendorName")}
                  value={formik.values.name}
                  size="small"
                  fullWidth
                  variant="outlined"
                  onChange={(event) => formik.setFieldValue("name", event.target.value)}
                 
                />
              </Grid>

              {/* Code */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="code"
                  name="code"
                  label={
                    <CustomLabel
                      text={t("text.vendorCode")}
                      required={requiredFields.includes("code")}
                    />
                  }
                  value={formik.values.code}
                  placeholder={t("text.vendorCode")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.code && formik.errors.code
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

              </Grid>

              {/* contact Person */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={t("text.contactPerson")}
                  value={formik.values.contactPerson}
                  size="small"
                  fullWidth
                  variant="outlined"
                  onChange={(event) => formik.setFieldValue("name", event.target.value)}
                />
              </Grid>
              {/* mobile */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.MobileNum")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="mobileNo"
                  id="mobileNo"
                  value={formik.values.mobileNo}
                  placeholder={t("text.MobileNum")}
                  onChange={(e) => {
                    formik.setFieldValue("mobileNo", e.target.value);
                  }}
                />

              </Grid>

              {/* Pan number */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="panNumber"
                  name="panNumber"
                  inputProps={{ maxLength: 10 }}
                  label={
                    <CustomLabel
                      text={t("text.PanNo")}
                      required={requiredFields.includes("panNumber")}
                    />
                  }
                  value={formik.values.panNumber}
                  placeholder={t("text.PanNo")}
                  // type="number"
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.panNumber && formik.errors.panNumber
                        ? "red"
                        : "initial",
                  }}
                  onChange={(e: any) => {
                    let num = e.target.value;
                    formik.setFieldValue("panNumber", String(num));
                  }}
                  onBlur={formik.handleBlur}
                />

              </Grid>

              {/* aadhar no */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="addharNo"
                  name="addharNo"
                  label={
                    <CustomLabel
                      text={t("text.AadharNo")}
                      required={requiredFields.includes("addharNo")}
                    />
                  }
                  value={formik.values.addharNo}
                  placeholder={t("text.AadharNo")}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.addharNo && formik.errors.addharNo
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

              </Grid>

              {/* gstin No */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="gstinNo"
                  name="gstinNo"
                  label={
                    <CustomLabel
                      text={t("text.gstin")}
                      required={requiredFields.includes("gstinNo")}
                    />
                  }
                  value={formik.values.gstinNo}
                  placeholder={t("text.gstin")}
                  size="small"
                  // type="number"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e: any) => {
                    let num = e.target.value;
                    formik.setFieldValue("gstinNo", String(num));
                  }}
                  onBlur={formik.handleBlur}
                // inputProps={{ maxLength: 12 }}
                />

              </Grid>

              {/* Tan No */}
              <Grid item lg={4} xs={12}>
                <TextField
                  id="tanno"
                  name="tanno"
                  label={
                    <CustomLabel
                      text={t("text.tanno")}
                      required={requiredFields.includes("tanno")}
                    />
                  }
                  value={formik.values.tanno}
                  placeholder={t("text.tanno")}
                  size="small"
                  // type="number"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e: any) => {
                    let num = e.target.value;
                    formik.setFieldValue("tanno", String(num));
                  }}
                  onBlur={formik.handleBlur}
                // inputProps={{ maxLength: 12 }}
                />

              </Grid>

              {/* office address */}
              <Grid item lg={4} xs={12}>
                <TextField
                  label={t("text.OfficeAddress")}
                  size="small"
                  fullWidth
                  variant="outlined"
                  onChange={(event) => formik.setFieldValue("permanentAddress", event.target.value)}

                  // onChangeText={(text: string) => formik.setFieldValue("permanentAddress", text)}
                
                  value={formik.values.permanentAddress}
                />

              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Country}
                  value={formik.values.countryName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("countryId", newValue?.value);
                    formik.setFieldValue("countryName", newValue?.label);
                    formik.setFieldTouched("countryId", true);
                    formik.setFieldTouched("countryId", false);
                    getState(newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectCountry")}
                          required={requiredFields.includes("countryId")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StateOption}
                  value={formik.values.stateName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("stateId", newValue?.value);
                    formik.setFieldValue("stateName", newValue?.label);
                    formik.setFieldTouched("stateId", true);
                    formik.setFieldTouched("stateId", false);
                    getCity(newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectState")}
                          required={requiredFields.includes("stateId")}
                        />
                      }
                    />
                  )}
                />

              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={City}
                  value={formik.values.cityName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("cityId", newValue?.value);
                    formik.setFieldValue("cityName", newValue?.label);
                    formik.setFieldTouched("cityId", true);
                    formik.setFieldTouched("cityId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectCity")}
                          required={requiredFields.includes("cityId")}
                        />
                      }
                    />
                  )}
                />
              </Grid>



              <Grid item lg={4} xs={12}>
                <TextField
                  id="pincode"
                  name="pincode"
                  label={
                    <CustomLabel
                      text={t("text.pincode")}
                    //required={requiredFields.includes("pincode")}
                    />
                  }
                  value={formik.values.pincode}
                  placeholder={t("text.pincode")}
                  inputProps={{ maxLength: 6 }}
                  type="number"
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                    label={<CustomLabel text={t("text.AttachedGSTIN")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "gstInFile")}
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
                    {formik.values.gstInFile == "" ? (
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
                        // src={formik.values.gstInFile}
                        src={`data:image/jpg;base64,${formik.values.gstInFile}`}
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
                      onClick={() => modalOpenHandle1("gstInFile")}
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
                    label={<CustomLabel text={t("text.AttachedTan")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "tanFile")}
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
                    {formik.values.tanFile == "" ? (
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
                        // src={formik.values.tanFile}
                        src={`data:image/jpg;base64,${formik.values.tanFile}`}
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
                      onClick={() => modalOpenHandle1("tanFile")}
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

export default EditVendor;