import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,

} from "@mui/material";
import React, { useState, useEffect } from "react";
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
import { lang } from "moment";
import TranslateTextField from "../../../TranslateTextField";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Language } from "react-transliterate";
import Languages from "../../../utils/Languages";
import { getId } from "../../../utils/Constant";

type Props = {};

const EditItemDetail = (props: Props) => {
  console.log("useLocation " + useLocation());
  const location = useLocation();
  console.log("location", location.state);
  const UserId = getId();
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const userId = getId();
  const [toaster, setToaster] = useState(false);
  // const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);


  const [lang, setLang] = useState<Language>("en");

  const [option, setOption] = useState<any>([]);
  const [taxOptions, setTaxOptions] = useState<any>([]);
  //const [employeeOptions, setemployeeOptions] = useState<any>([]);
  const [itemCategoryOptions, setitemCategoryOptions] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  //const [itemgroupOptions, setitemgroupOptions] = useState<any>([]);

  useEffect(() => {
    GetitemCategoryData();
    //GetEmployeeData();
    // fetchZonesData();
    GetItemTypeData();
    GetTaxData();
    GetUnitData();
    // GetItemGroupData();
  }, []);
  // }, [isLoading]);  SelectEmployeeName

  // const GetEmployeeData = async () => {
  //   const collectData = {
  //     "empid": -1,
  //     "userId": "",
  //     "empName": "",
  //     "empMobileNo": "",
  //     "empDesignationId": -1,
  //     "empDeptId": -1,
  //     "empStateId": -1,
  //     "empCountryID": -1,
  //     "empCityId": -1,
  //     "empPincode": 0,
  //     "roleId": ""
  //   };
  //   const response = await api.post(`EmpMaster/GetEmpmaster`,collectData);
  //   const data = response.data.data;
  //   const arr = [];
  //   for (let index = 0; index < data.length; index++) {
  //     arr.push({
  //       label: data[index]["empName"],
  //       value: data[index]["empid"],
  //     });
  //   }
  //   setemployeeOptions([{ value: "-1", label: t("text.SelectEmployeeName")}, ...arr]);
  // }
  // const GetItemGroupData = async () => {
  //   const collectData = {
  //     groupid: -1,
  //   };
  //   const response = await api.post(`ItemGroup/GetItemGroup`, collectData);
  //   const data = response.data.data;
  //   const arr = [];
  //   for (let index = 0; index < data.length; index++) {
  //     arr.push({
  //       label: data[index]["group_name"],
  //       value: data[index]["groupid"],
  //     });
  //   }
  //   setitemgroupOptions([{ value: "-1", label: t("text.selectGroup") }, ...arr]);
  // };

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
  });

  const formik = useFormik({
    initialValues: {
      itemMasterId: location.state.itemMasterId,
      itemName: location.state.itemName,
      itemCode: location.state.itemCode,
      itemCategoryId: location.state.itemCategoryId,
      itemFlag: location.state.itemFlag,
      itemTypeId: location.state.itemTypeId,
      empId: location.state.empId,
      taxId: location.state.taxId,
      purchaseYear: location.state.purchaseYear,
      unitId: location.state.unitId,
      serialNo: String(location.state.serialNo),
      vehicleNo: location.state.vehicleNo,
      qcApplicable: location.state.qcApplicable,
      hsnCode: location.state.hsnCode,
      itemWeight: location.state.itemWeight,
      depreciationRate: location.state.depreciationRate,
      itemGroupId: location.state.itemGroupId,
      watt: location.state.watt,
      volt: location.state.volt,
      wire: location.state.wire,
      weight: location.state.weight,
      itemColor: location.state.itemColor,
      itemImg: location.state.itemImg,
      powerSource: location.state.powerSource,
      genericName: location.state.genericName,
      manufacture: location.state.manufacture,
      itemDimention: location.state.itemDimention,
      underGroundPoleHight: location.state.underGroundPoleHight,
      num_Of_Light_Attach: location.state.num_Of_Light_Attach,
      currentStatus: location.state.currentStatus,
      countryOfOrigen: location.state.countryOfOrigen,
      qc: location.state.qc,
      modelNo: location.state.modelNo,
      createdBy: location.state.createdBy,
      updatedBy: UserId,
      createdOn: location.state.createdOn,
      updatedOn: new Date().toISOString(),
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

      // if (response.data.status===1) {
      //   formik.resetForm();
      //   // fetchZonesData();
      //   toast.success(response.data.message);
      //   setEditId(-1);
      // } else {
      //   toast.error(response.data.message);
      // }
    },
  });

  //const requiredFields = ["dept_name"];

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
            // backgroundColor:"lightseagreen"
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
                {location.state.isView ? t("text.ItemDetail") : t("text.EditItemDetail")}
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

          <form onSubmit={formik.handleSubmit}>
            {/* <Grid container spacing={2}> */}
            {/* First Row */}
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
                    {String(formik.errors.itemName)}
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
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemCategoryId", newValue?.value);
                  }}
                  value={
                    itemCategoryOptions.find(
                      (opt: any) => opt.value === formik.values.itemCategoryId
                    ) || null
                  }
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
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemTypeId", newValue?.value);
                  }}
                  value={
                    option.find(
                      (opt: any) => opt.value === formik.values.itemTypeId
                    ) || null
                  }
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
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("unitId", newValue?.value);
                  }}
                  value={
                    unitOptions.find(
                      (opt: any) => opt.value === formik.values.unitId
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectUnit")}
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
                  options={taxOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("taxId", newValue?.value);
                  }}
                  value={
                    taxOptions.find(
                      (opt: any) => opt.value === formik.values.taxId
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.tax")}
                        />
                      }
                    />
                  )}
                />
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
        </Paper>
      </Card>

    </>
  );
};

export default EditItemDetail;
