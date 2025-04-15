import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Input,
  Autocomplete,
  TextField,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
//import 'react-toastify/dist/ReactToastify.css';
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
//import { ToastContainer } from 'react-toastify';
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";

import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getISTDate } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import CustomDataGrid from "../../../utils/CustomDatagrid";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}
export default function CreateItemDetail() {
  const UserId = getId();
  const { t } = useTranslation();
  const Userid = getId();
  const { defaultValuestime } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
    const { defaultValues } = getISTDate();
  const [columns, setColumns] = useState<any>([]);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [option, setOption] = useState<any>([]);
  const [taxOptions, setTaxOptions] = useState<any>([]);
  const [itemCategoryOptions, setitemCategoryOptions] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  //  const [unitOptions, setUnitOptions] = useState<any>([
  //     { value: -1, label: t("text.SelectUnitId") },
  //   ]);
  let navigate = useNavigate();
  useEffect(() => {
    GetitemCategoryData();
    GetItemTypeData();
    GetTaxData();
    GetUnitData();
  }, []);
  const GetItemTypeData = async () => {
    const collectData = {
      itemTypeMasterId: -1,
    };
    const response = await api.post(`ItemCategory/GetItemType`, collectData);
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemType"],
        value: data[index]["itemTypeMasterId"],
      });
    }
    setOption(arr);
  };
  const GetitemCategoryData = async () => {
    const collectData = {
      itemCategoryId: -1,
    };
    const response = await api.post(`ItemCategory/GetItemCategory`, collectData);
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemCategory"],
        value: data[index]["itemCategoryId"],
      });
    }
    setitemCategoryOptions(arr);
  };
  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };
  const GetTaxData = async () => {
    const collectData = {
      taxId: -1,
    };
    const response = await api.post(`UnitMaster/GetTaxMaster`, collectData);
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["taxName"],
        value: data[index]["taxId"],
      });
    }
    setTaxOptions(arr);
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
  const validationSchema = Yup.object().shape({
    itemName: Yup.string()
      .required(t("text.itemNameRequired"))
      .min(2, t("text.itemNameMin"))
      .max(100, t("text.itemNameMax")),
      unitId: Yup.string()
      .required(t("text.unitNameRequired")),
      taxId: Yup.string()
      .required(t("text.taxRequired")),


  });
  const formik = useFormik({
    initialValues: {
      "itemMasterId": 0,
      "itemName": "",
      "itemCode": "",
      "itemTypeId": 0,
      "itemFlag": "I",
      "itemCategoryId": 0,
      "unitId": null,
      "empId": 0,
      "vZoneID": 0,
      "taxId": null,
      "purchaseYear": 0,
      "modelNo": "",
      "serialNo": "",
      "vehicleNo": "",
      "tankCapacity": 0,
      "actPrice": 0,
      "hsnCode": "",
      "filename": "",
      "chesisNo": "",
      "qcApplicable": true,
      "depreciationRate": 0,
      "createdBy": UserId,
      "updatedBy": "",
      "mileage": 0,
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      "zoneName": "",
      "vehiclePhotoFile": "",
      "vehicleTypeId": 0,
      "brandTypeId": 0,
      "fuelTypeId": 0,
      "devid": "",
      "vehicleWeight": 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post("ItemMaster/UpsertItemMaster", values);
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/ItemDetail");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });
  const back = useNavigate();
  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "lightgreen",
          border: ".5px solid #2B4593",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />
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
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.CreateItemDetail")}
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
          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
          {toaster && <ToastApp />}
            <Grid container item xs={12} spacing={2}>
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
                    label={t("text.QCApplicable")}
                  />
                </FormGroup>
              </Grid> */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.enteritemName")}
                  value={formik.values.itemName}
                  onChangeText={(text) => handleConversionChange("itemName", text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.itemName && formik.errors.itemName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.itemName}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enteritemCode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemCode"
                  id="itemCode"
                  value={formik.values.itemCode}
                  placeholder={t("text.enteritemCode")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterhsnCode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="hsnCode"
                  id="hsnCode"
                  value={formik.values.hsnCode}
                  placeholder={t("text.enterhsnCode")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={itemCategoryOptions}
                  value={itemCategoryOptions.find((option:any) => option.value === formik.values.itemCategoryId)?.label||""}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemCategoryId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectItemCategory")}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  value={option.find((option:any) => option.value === formik.values.itemTypeId)?.label||""}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemTypeId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectitemTypeId")}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={unitOptions}
                  value={unitOptions.find((option:any) => option.value === formik.values.unitId)?.label||""}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("unitId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectUnit")}
                          required={true}
                        />

                        
                      }
                    />
                  )}
                />
                {formik.touched.unitId && formik.errors.unitId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.unitId}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={taxOptions}
                  value={taxOptions.find((option:any) => option.value === formik.values.taxId)?.label||""}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("taxId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.tax")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.taxId && formik.errors.taxId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.taxId}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.entermodelNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="modelNo"
                  id="modelNo"
                  value={formik.values.modelNo}
                  placeholder={t("text.entermodelNo")}
                  onChange={(e: any) => formik.setFieldValue("modelNo", e.target.value.toString())}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterserialNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="serialNo"
                  id="serialNo"
                  value={formik.values.serialNo}
                  placeholder={t("text.enterserialNo")}
                  onChange={(e: any) => formik.setFieldValue("serialNo", e.target.value.toString())}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterdepreciationRate")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="depreciationRate"
                  id="depreciationRate"
                  value={formik.values.depreciationRate}
                  placeholder={t("text.enterdepreciationRate")}
                  onChange={(e) => formik.setFieldValue("depreciationRate", Number(e.target.value))}
                />
              </Grid>
              <Grid item sm={8} md={8} lg={8}>
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
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Card>
     
    </>
  );
};