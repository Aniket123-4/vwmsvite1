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
  // AutocompleteRenderInputParams,
  FormControl,
  Modal,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import DeleteIcon from '@mui/icons-material/Delete';
import { getId, getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";

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

const AddOrganization = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const userId = getId();


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

  const formik = useFormik({
    initialValues: {

      "id": 0,
      "countryId": 0,
      "stateId": 0,
      "name": "",
      "cityId": 0,
      "establishYear": 0,
      "address": "",
      "pincode": 0,
      "officeNo": "",
      "mobileNo": "",
      "emailId": "",
      "websiteName": "",
      "director": "",
      "companyLogo": "",
      "gstnNo": "",
      "panNo": "",
      "createdBy": userId,
      "updatedBy": "",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "cityName": "",
      "stateName": "",
      "countryName": ""
      // "id": 0,
      // "name": "",
      // "cityId": 0,
      // "establishYear": 0,
      // "address": "",
      // "pincode": 0,
      // "officeNo": "",
      // "mobileNo": "",
      // "emailId": "",
      // "websiteName": "",
      // "director": "",
      // "companyLogo": "",
      // "gstnNo": "",
      // "panNo": "",
      // "createdBy": "adminvm",
      // "updatedBy": "adminvm",
      // "createdOn": defaultValues,
      // "updatedOn": defaultValues,
      // "cityName": ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(t("text.reqCompanyName")),
      address: Yup.string()
        .required(t("text.reqAddress")),
    }),

    onSubmit: async (values) => {

      const response = await api.post(`CampanyMaster/UpsertCompanyMaster`, values);
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/employeeInfo/Organization")
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });


  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "companyLogo") {
      setModalImg(formik.values.companyLogo);
    }
  };
  const ConvertBase64 = (companyLogo: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(companyLogo);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const base64ToByteArray = (base64: string): Uint8Array => {
    // Remove the data URL scheme if it exists
    const base64String = base64.split(",")[1];

    // Decode the Base64 string
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    // Convert binary string to Uint8Array
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  };

  const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  };

  const otherDocChangeHandler = async (event: any, params: string) => {
    console.log("Image file change detected");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
        alert(
          "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
        );
        event.target.value = null;
        return;
      }

      try {
        const base64Data = (await ConvertBase64(file)) as string;
        console.log("Base64 image data:", base64Data);

        // Convert Base64 to Uint8Array
        const byteArray = base64ToByteArray(base64Data);
        console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

        // Convert Uint8Array to base64 string
        const base64String = uint8ArrayToBase64(byteArray);
        console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

        // Set value in Formik
        formik.setFieldValue(params, base64String);

        let outputCheck =
          "data:image/png;base64," + formik.values.companyLogo;
        console.log(outputCheck);
      } catch (error) {
        console.error("Error converting image file to Base64:", error);
      }
    }
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
                {t("text.AddOrganization")}
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
            {toaster === false ? "" : <ToastApp />}
            <Grid container spacing={2}>



              {/* CompanyName  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterCompanyName")}
                  value={formik.values.name}
                  onChangeText={(text: string) => formik.setFieldValue("name", text)}
                  required={true}
                  lang={lang}
                />

                {formik.touched.name && formik.errors.name && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.name}</div>
                )}

              </Grid>


              {/* Address */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterAddress")}
                  value={formik.values.address}
                  onChangeText={(text: string) => formik.setFieldValue("address", text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.address && formik.errors.address && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.address}</div>
                )}
              </Grid>

              {/* country */}
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
                  value={formik.values.stateName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("stateId", newValue.value);
                    formik.setFieldValue("stateName", newValue.label);
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
                  value={formik.values.cityName}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("cityName", newValue.label.toString());
                    formik.setFieldValue("cityId", newValue.value)
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

              {/* establish Year */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterEstablishYear")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="establishYear"
                  id="establishYear"
                  value={formik.values.establishYear}
                  placeholder={t("text.EnterEstablishYear")}
                  onChange={(e) => {
                    formik.setFieldValue("establishYear", e.target.value.toString());
                  }}
                />
              </Grid>


              {/* Pincode */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterPincode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="pincode"
                  id="pincode"
                  value={formik.values.pincode}
                  placeholder={t("text.EnterPincode")}
                  onChange={(e) => {
                    formik.setFieldValue("pincode", parseInt(e.target.value) || "");
                  }}
                />
              </Grid>


              {/* Office number */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterOfficeNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="officeNo"
                  id="officeNo"
                  value={formik.values.officeNo}
                  placeholder={t("text.EnterOfficeNo")}
                  onChange={(e) => {
                    formik.setFieldValue("officeNo", e.target.value.toString());
                  }}
                />
              </Grid>


              {/* Mobile No */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterMobileNum")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="mobileNo"
                  id="mobileNo"
                  value={formik.values.mobileNo}
                  placeholder={t("text.EnterMobileNum")}
                  onChange={(e) => {
                    formik.setFieldValue("mobileNo", e.target.value.toString());
                  }}
                />
              </Grid>


              {/* email id */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterEmailId")}
                      required={false}
                    />
                  }
                  type="email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="emailId"
                  id="emailId"
                  value={formik.values.emailId}
                  placeholder={t("text.EnterEmailId")}
                  onChange={(e) => {
                    formik.setFieldValue("emailId", e.target.value.toString());
                  }}
                />
              </Grid>


              {/* Website name */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterWebSite")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="websiteName"
                  id="websiteName"
                  value={formik.values.websiteName}
                  placeholder={t("text.EnterWebSite")}
                  onChange={(e) => {
                    formik.setFieldValue("websiteName", e.target.value.toString());
                  }}
                />
              </Grid>


              {/* Director */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterDirector")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="director"
                  id="director"
                  value={formik.values.director}
                  placeholder={t("text.EnterDirector")}
                  onChange={(e) => {
                    formik.setFieldValue("director", e.target.value.toString());
                  }}
                />
              </Grid>


              {/* GSTIN */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterGSTIN")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="gstnNo"
                  id="gstnNo"
                  value={formik.values.gstnNo}
                  placeholder={t("text.EnterGSTIN")}
                  onChange={(e) => {
                    formik.setFieldValue("gstnNo", e.target.value.toString());
                  }}
                />
              </Grid>


              {/* Pan number */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.PanNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="panNo"
                  id="panNo"
                  value={formik.values.panNo}
                  placeholder={t("text.PanNo")}
                  onChange={(e) => {
                    formik.setFieldValue("panNo", e.target.value.toString());
                  }}
                />
              </Grid>



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
                    onChange={(e) => otherDocChangeHandler(e, "companyLogo")}
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
                    {formik.values.companyLogo == "" ? (
                      <img
                        // src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img

                        src={"data:image/png;base64," + formik.values.companyLogo}
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
                      onClick={() => modalOpenHandle("companyLogo")}
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
                <Modal open={panOpens} onClose={handlePanClose}>
                  <Box sx={style}>
                    {modalImg == "" ? (
                      <img
                        //  src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={"data:image/png;base64," + modalImg}
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



              {/* Submit Button */}
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

            </Grid>

          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default AddOrganization;