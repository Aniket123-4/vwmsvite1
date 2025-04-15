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

const AddUtilizationLog = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const userId = getId();

  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo"), name: "" },
  ]);
  const [empOption, setEmpOption] = useState([
    { value: -1, label: t("text.EmpName") },
  ]);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "imageFile") {
      setModalImg("formik.values.imageFile");
    }
  };


  useEffect(() => {
    getVehicleDetails();
    getEmpData();
  }, []);

  const getVehicleDetails = async () => {
    const response = await api.get(
      `Master/GetVehicleDetail?ItemMasterId=-1`,
    );
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.vehicleNo,
      name: Item.itemName
    }));
    setVehicleOption(arr);
  };

  const getEmpData = async () => {
    const collectData = {
      "empid": -1,
      "userId": ""
    };
    const response = await api.post(`Employee/GetEmployee`, collectData);
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["empName"],
        value: data[index]["empid"],
      });
    }
    setEmpOption(arr);
  };



  const formatTime = (date: any) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };





  const formik = useFormik({
    initialValues: {
      "id": 0,
      "empId": null,
      "itemId": null,
      "fromDate": defaultValues,
      "toDate": defaultValues,
      "fromTime": "",
      "toTime": "",
      "remark": "",
      "createdBy": userId,
      "updatedBy": "",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "itemName": "",
      "empName": "",
      "vehicleNo": ""
    },
    validationSchema: Yup.object({
      empId: Yup.string()
        .required(t("text.reqEmpName")),
      itemId: Yup.string()
        .required(t("text.reqVehNum")),
    }),

    onSubmit: async (values) => {

      const response = await api.post(`Master/UpsertUtilizationLog`, values);
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/vehiclemanagement/vehiclemaster/UtilizationLog")
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });



  const ConvertBase64 = (file: Blob) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, params: any) => {
    console.log("check");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg)$/)) {
        alert("Only image files (jpg, jpeg) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }

      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    };
  }

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
                {t("text.AddUtilizationLog")}
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

              {/* UnderControlOf */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  value={formik.values.empName}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue.value);
                    formik.setFieldValue("empName", newValue.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.UnderControlOf")} required={true} />}
                      name="empId"
                      id="empId"
                      placeholder={t("text.UnderControlOf")}
                    />
                  )}
                />
                {formik.touched.empId && formik.errors.empId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
                )}
              </Grid>

              {/* Vehicle Number */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vehicleOption}
                  value={formik.values.vehicleNo}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("vehicleNo", newValue.label);
                    formik.setFieldValue("itemId", newValue.value);
                    formik.setFieldValue("itemName", newValue.name);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectVehicleNum")} required={true} />}
                      name="vehicleNo"
                      id="vehicleNo"
                      placeholder={t("text.SelectVehicleNum")}
                    />
                  )}
                />
                {formik.touched.itemId && formik.errors.itemId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.itemId}</div>
                )}
              </Grid>



              {/* from Date */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.fromDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="fromDate"
                  id="fromDate"
                  value={formik.values.fromDate}
                  placeholder={t("text.fromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("fromDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}

              </Grid>
              {/* from time */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.time")}
                      required={false}
                    />
                  }
                  type="time"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="fromTime"
                  id="fromTime"
                  value={formik.values.fromTime}
                  placeholder={t("text.time")}
                  onChange={(e) => {
                    formik.setFieldValue("fromTime", e.target.value + ":00");
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}

              </Grid>

              {/* to date  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.toDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="toDate"
                  id="toDate"
                  value={formik.values.toDate}
                  placeholder={t("text.toDate")}
                  onChange={(e) => {
                    formik.setFieldValue("toDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}
              </Grid>
              {/* to time */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.time")}
                      required={false}
                    />
                  }
                  type="time"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="toTime"
                  id="toTime"
                  value={formik.values.toTime}
                  placeholder={t("text.time")}
                  onChange={(e) => {
                    formik.setFieldValue("toTime", e.target.value + ":00");
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}

              </Grid>


              {/* remark */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.Remark")}
                  value={formik.values.remark}
                  onChangeText={(text: string) => formik.setFieldValue("remark", text)}
                  required={false}
                  lang={lang}
                />
              </Grid>


              <Grid item lg={8} sm={8} xs={12}></Grid>


              {/* attachment */}
              {/* <Grid container spacing={1} item>
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
              </Grid> */}


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

export default AddUtilizationLog;