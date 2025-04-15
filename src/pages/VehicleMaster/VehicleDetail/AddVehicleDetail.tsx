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

const AddVehicleDetail = (props: Props) => {
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const { defaultValues, defaultValuestime } = getISTDate();
   const [toaster, setToaster] = useState(false);
   const userId = getId();

   const [zoneOption, setzoneOption] = useState([
      { value: -1, label: t("text.zoneID") },
   ]);

   const [categoryOption, setCategoryOption] = useState([
      { value: -1, label: t("text.Category") },
   ]);

   const [itemTypeOption, setitemTypeOption] = useState([
      { value: -1, label: t("text.Type") },
   ]);

   const [unitOption, setUnitOption] = useState([
      { value: -1, label: t("text.Unit") },
   ]);

   const [taxOption, setTaxOption] = useState([
      { value: -1, label: t("text.Tax") },
   ]);

   const [vehicleTypeOption, setVehicleTypeOption] = useState([
      { value: -1, label: t("text.VehicleType") },
   ]);

   const [brandOption, setBrandOption] = useState([
      { value: -1, label: t("text.BrandName") },
   ]);

   const [fuelTypeOption, setFuelTypeOption] = useState([
      { value: -1, label: t("text.FuelType") },
   ]);

   const [empValue, setEmpValue] = useState("");

   const [empOption, setEmpOption] = useState([
      { value: 1, label: t("text.EmpName"), department: "", designation: "" },
   ]);

   const [panOpens, setPanOpen] = React.useState(false);
   const [modalImg, setModalImg] = useState("");
   const [Opens, setOpen] = React.useState(false);
   const [Img, setImg] = useState("");

   useEffect(() => {
      getzoneData();
      getCategoryData();
      getItemTypeData();
      getUnitData();
      getTaxData();
      getVehicletypeData();
      getBrandData();
      getFuelTypeData();
      getEmpData();
   }, []);

   const getzoneData = async () => {
      const collectData = {
         "zoneID": -1
      };
      const response = await api.post(`ZoneMaster/GetZone`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["zoneName"],
            value: data[index]["zoneID"],
         });
      }
      setzoneOption(arr);
   };

   const getCategoryData = async () => {
      const collectData = {
         "itemCategoryId": -1
      };
      const response = await api.post(`ItemCategory/GetItemCategory`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["itemCategory"],
            value: data[index]["itemCategoryId"],
         });
      }
      setCategoryOption(arr);
   };

   const getItemTypeData = async () => {
      const collectData = {
         "itemTypeMasterId": -1
      };
      const response = await api.post(`ItemCategory/GetItemType`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["itemType"],
            value: data[index]["itemTypeMasterId"],
         });
      }
      setitemTypeOption(arr);
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

   const getTaxData = async () => {
      const collectData = {
         "taxId": -1
      };
      const response = await api.post(`UnitMaster/GetTaxMaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["taxName"],
            value: data[index]["taxId"],
         });
      }
      setTaxOption(arr);
   };

   const getVehicletypeData = async () => {
      const response = await api.get(`Master/GetVehicleType?VehicleTypeId=-1`);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["vehicleTypename"],
            value: data[index]["vehicleTypeId"],
         });
      }
      setVehicleTypeOption(arr);
   }

   const getBrandData = async () => {
      const response = await api.get(`Master/GetBrand?brandid=-1`);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["brandname"],
            value: data[index]["brandId"],
         });
      }
      setBrandOption(arr);
   }

   const getFuelTypeData = async () => {
      const response = await api.get(`Master/GetFuelType?brandid=-1`);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["fuelTypename"],
            value: data[index]["fuelTypeId"],
         });
      }
      setFuelTypeOption(arr);
   }

   const getEmpData = async () => {
      const collectData = {
         "empid": -1,
         "userId": ""
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





   const formik = useFormik({
      initialValues: {
         "itemMasterId": 0,
         "itemName": "",
         "itemCode": "",
         "itemTypeId": 0,
         "itemFlag": "v",
         "itemCategoryId": 0,
         "unitId": 0,
         "empId": 0,
         "vZoneID": 0,
         "taxId": 0,
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
         "createdBy": userId,
         "updatedBy": "",
         "mileage": 0,
         "createdOn": defaultValues,
         "updatedOn": defaultValues,
         vehicleRegistrationDate: defaultValues,
         "zoneName": "",
         "vehiclePhotoFile": "",
         "deptName": "",
         "desigName": "",
         "vehicleTypeId": 0,
         "brandTypeId": 0,
         "fuelTypeId": 0,
         "devid": "",
         "vehicleWeight": 0,
         "empName": "",
         "unitName": "",
         "itemCatName": "",
         "taxName": "",
         "vehicleType": "",
         "fuelName": "",
         "brandName": ""
      },
      validationSchema: Yup.object({
         itemName: Yup.string()
            .required(t("text.reqVehName")),
         vehicleNo: Yup.string()
            .required(t("text.reqVehNum")),
      }),

      onSubmit: async (values) => {
         const response = await api.post(`Master/UpsertVehicleDetail`, values);
         if (response.data.isSuccess) {
            toast.success(response.data.mesg);
            navigate("/vehiclemanagement/VehicleDetail")
         } else {
            setToaster(true);
            toast.error(response.data.mesg);
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
         case "filename":
            imageData = formik.values.filename;
            break;
         case "vehiclePhotoFile":
            imageData = formik.values.vehiclePhotoFile;
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

      // Validate file type (only allow images)
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
         alert("Only .jpg, .jpeg, or .png image files are allowed.");
         event.target.value = ''; // Clear input field
         return;
      }

      const reader = new FileReader();
      reader.onload = () => {
         const base64String = reader.result as string;

         // Use regex to remove the base64 prefix dynamically
         const base64Content = base64String.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");

         if (base64Content) {
            formik.setFieldValue(params, base64Content); // Store the stripped base64 string
         } else {
            alert("Error processing image data.");
         }
      };

      reader.onerror = () => {
         alert("Error reading file. Please try again.");
      };

      reader.readAsDataURL(file);
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
                        {t("text.AddVehicleDetail")}
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


                     {/* zone */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={zoneOption}
                           value={formik.values.zoneName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("vZoneID", parseInt(newValue?.value || -1));
                              formik.setFieldValue("zoneName", newValue.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectZone")} required={false} />}
                                 name="vZoneID"
                                 id="vZoneID"
                                 placeholder={t("text.SelectZone")}
                              />
                           )}
                        />
                     </Grid>

                     {/* Vehicle name */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TranslateTextField
                           label={t("text.EnterVehName")}
                           value={formik.values.itemName}
                           onChangeText={(text: string) => formik.setFieldValue("itemName", text)}
                           required={true}
                           lang={lang}
                        />

                        {formik.touched.itemName && formik.errors.itemName && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.itemName}</div>
                        )}

                     </Grid>

                     {/* code */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterVehCode")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="itemCode"
                           id="itemCode"
                           value={formik.values.itemCode}
                           placeholder={t("text.EnterVehCode")}
                           onChange={(e) => {
                              formik.setFieldValue("itemCode", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* hsn code */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterHSNCode")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="hsnCode"
                           id="hsnCode"
                           value={formik.values.hsnCode}
                           placeholder={t("text.EnterHSNCode")}
                           onChange={(e) => {
                              formik.setFieldValue("hsnCode", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* category */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={categoryOption}
                           value={formik.values.itemCatName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("itemCategoryId", parseInt(newValue.value));
                              formik.setFieldValue("itemCatName", newValue.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectCategory")} required={false} />}
                                 name="itemCategoryId"
                                 id="itemCategoryId"
                                 placeholder={t("text.SelectCategory")}
                              />
                           )}
                        />
                     </Grid>

                     {/* type */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={itemTypeOption}
                           value={itemTypeOption[itemTypeOption.findIndex(item => item.value === formik.values.itemTypeId)]?.label || ""}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              console.log(newValue?.value);
                              formik.setFieldValue("itemTypeId", parseInt(newValue.value))

                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectType")} required={false} />}
                                 name="itemTypeId"
                                 id="itemTypeId"
                                 placeholder={t("text.SelectType")}
                              />
                           )}
                        />
                     </Grid>

                     {/* unit */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={unitOption}
                           value={formik.values.unitName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("unitId", parseInt(newValue.value));
                              formik.setFieldValue("unitName", newValue.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectUnit")} required={false} />}
                                 name="unitId"
                                 id="unitId"
                                 placeholder={t("text.SelectUnit")}
                              />
                           )}
                        />
                     </Grid>

                     {/* tax */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={taxOption}
                           value={formik.values.taxName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("taxId", parseInt(newValue.value));
                              formik.setFieldValue("taxName", newValue.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectTax")} required={false} />}
                                 name="taxId"
                                 id="taxId"
                                 placeholder={t("text.SelectTax")}
                              />
                           )}
                        />
                     </Grid>

                     {/* model no */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterModelNo")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="modelNo"
                           id="modelNo"
                           value={formik.values.modelNo}
                           placeholder={t("text.EnterModelNo")}
                           onChange={(e) => {
                              formik.setFieldValue("modelNo", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* vehicle number */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterVehicleNum")}
                                 required={true}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="vehicleNo"
                           id="vehicleNo"
                           value={formik.values.vehicleNo}
                           placeholder={t("text.EnterVehicleNum")}
                           onChange={(e) => {
                              formik.setFieldValue("vehicleNo", e.target.value.toString());
                           }}
                        />
                        {formik.touched.vehicleNo && formik.errors.vehicleNo && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.vehicleNo}</div>
                        )}
                     </Grid>

                     {/* serial no */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterSerialNum")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="serialNo"
                           id="serialNo"
                           value={formik.values.serialNo}
                           placeholder={t("text.EnterSerialNum")}
                           onChange={(e) => {
                              formik.setFieldValue("serialNo", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* chesis no */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterChesisNo")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="chesisNo"
                           id="chesisNo"
                           value={formik.values.chesisNo}
                           placeholder={t("text.EnterChesisNo")}
                           onChange={(e) => {
                              formik.setFieldValue("chesisNo", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* purchase year */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterPurYear")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="purchaseYear"
                           id="purchaseYear"
                           value={formik.values.purchaseYear || 0}
                           placeholder={t("text.EnterPurYear")}
                           onChange={(e) => {
                              formik.setFieldValue("purchaseYear", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* vehicle registration date */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.VehRegDate")}
                                 required={false}
                              />
                           }
                           type="date"
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="vehicleRegistrationDate"
                           id="vehicleRegistrationDate"
                           value={formik.values.vehicleRegistrationDate}
                           placeholder={t("text.VehRegDate")}
                           onChange={(e) => {
                              formik.setFieldValue("vehicleRegistrationDate", e.target.value);
                           }}
                        />
                     </Grid>

                     {/* under control of */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={empOption}
                           value={formik.values.empName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("empId", parseInt(newValue.value));
                              formik.setFieldValue("empName", newValue.label);
                              formik.setFieldValue("deptName", newValue?.department);
                              formik.setFieldValue("desigName", newValue?.designation);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.UnderControlOf")} required={false} />}
                                 name="empId"
                                 id="empId"
                                 placeholder={t("text.UnderControlOf")}
                              />
                           )}
                        />
                     </Grid>

                     {/* department */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Department")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="Department"
                           id="Department"
                           value={formik.values.deptName}
                           placeholder={t("text.Department")}
                           disabled={true}
                        />
                     </Grid>

                     {/* designation */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Designation")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="Designation"
                           id="Designation"
                           value={formik.values.desigName}
                           placeholder={t("text.Designation")}
                           disabled={true}
                        />
                     </Grid>

                     {/* vehicle type */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={vehicleTypeOption}
                           value={formik.values.vehicleType}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              console.log(newValue?.value);
                              formik.setFieldValue("vehicleTypeId", parseInt(newValue.value));
                              formik.setFieldValue("vehicleType", newValue.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectVehicleType")} required={false} />}
                                 name="vehicleTypeId"
                                 id="vehicleTypeId"
                                 placeholder={t("text.SelectVehicleType")}
                              />
                           )}
                        />
                     </Grid>

                     {/* brand */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={brandOption}
                           value={formik.values.brandName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("brandTypeId", parseInt(newValue.value));
                              formik.setFieldValue("brandName", newValue.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectBrand")} required={false} />}
                                 name="brandTypeId"
                                 id="brandTypeId"
                                 placeholder={t("text.SelectBrand")}
                              />
                           )}
                        />
                     </Grid>

                     {/* fuel type */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={fuelTypeOption}
                           value={formik.values.fuelName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              formik.setFieldValue("fuelTypeId", parseInt(newValue.value));
                              formik.setFieldValue("fuelName", newValue.label);

                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.FuelType")} required={false} />}
                                 name="fuelTypeId"
                                 id="fuelTypeId"
                                 placeholder={t("text.FuelType")}
                              />
                           )}
                        />
                     </Grid>

                     {/* vehicle weight */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterVehicleWeight")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="vehicleWeight"
                           id="vehicleWeight"
                           value={formik.values.vehicleWeight || 0}
                           placeholder={t("text.EnterVehicleWeight")}
                           onChange={(e) => {
                              formik.setFieldValue("vehicleWeight", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* vehicle mileage */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterVehMileage")}
                                 required={false}
                              />
                           }

                           variant="outlined"
                           fullWidth
                           size="small"
                           name="mileage"
                           id="mileage"
                           value={formik.values.mileage || 0}
                           placeholder={t("text.EnterVehMileage")}
                           onChange={(e) => {
                              formik.setFieldValue("mileage", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* vehicle device id */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterVehicleDeviceId")}
                                 required={false}
                              />
                           }
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="devid"
                           id="devid"
                           value={formik.values.devid}
                           placeholder={t("text.EnterVehicleDeviceId")}
                           onChange={(e) => {
                              formik.setFieldValue("devid", e.target.value.toString());
                           }}
                        />
                     </Grid>

                     {/* Actual price */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterActualPrice")}
                                 required={false}
                              />
                           }

                           variant="outlined"
                           fullWidth
                           size="small"
                           name="actPrice"
                           id="actPrice"
                           value={formik.values.actPrice || 0}
                           placeholder={t("text.EnterActualPrice")}
                           onChange={(e) => {
                              formik.setFieldValue("actPrice", parseInt(e.target.value));
                           }}
                        />
                     </Grid>

                     {/* Tank capacity */}
                     <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.EnterTankCapacity")}
                                 required={false}
                              />
                           }

                           variant="outlined"
                           fullWidth
                           size="small"
                           name="tankCapacity"
                           id="tankCapacity"
                           value={formik.values.tankCapacity || ""}
                           placeholder={t("text.EnterTankCapacity")}
                           onChange={(e) => {
                              formik.setFieldValue("tankCapacity", parseInt(e.target.value));
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
                                    {t("text.RCDocument")}
                                 </strong>
                              }
                              size="small"
                              fullWidth
                              style={{ backgroundColor: "white" }}
                              onChange={(e: any) => otherDocChangeHandler(e, "filename")}
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
                           {formik.values.filename ? (
                              <img
                                 src={
                                    /^(data:image\/(jpeg|jpg|png);base64,)/.test(formik.values.filename)
                                       ? formik.values.filename
                                       : `data:image/jpeg;base64,${formik.values.filename}`
                                 }
                                 alt="Complaint Document Preview"
                                 style={{
                                    width: 150,
                                    height: 100,
                                    border: "1px solid grey",
                                    borderRadius: 10,
                                    padding: "2px",
                                    objectFit: "cover",  // Ensures proper scaling
                                 }}
                              />
                           ) : (
                              <img
                                 src={nopdf}
                                 alt="No document available"
                                 style={{
                                    width: 150,
                                    height: 100,
                                    border: "1px solid grey",
                                    borderRadius: 10,
                                 }}
                              />
                           )}

                           <Typography
                              onClick={() => modalOpenHandle("filename")}
                              style={{
                                 textDecorationColor: "blue",
                                 textDecorationLine: "underline",
                                 color: "blue",
                                 fontSize: "15px",
                                 cursor: "pointer",
                                 padding: "20px",
                              }}
                              role="button"
                              aria-label="Preview Document"
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
                                    {t("text.VehicleImage")}
                                 </strong>
                              }
                              size="small"
                              fullWidth
                              style={{ backgroundColor: "white" }}
                              onChange={(e: any) => otherDocChangeHandler(e, "vehiclePhotoFile")}
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
                           {formik.values.vehiclePhotoFile ? (
                              <img
                                 src={
                                    /^(data:image\/(jpeg|jpg|png);base64,)/.test(formik.values.vehiclePhotoFile)
                                       ? formik.values.vehiclePhotoFile
                                       : `data:image/jpeg;base64,${formik.values.vehiclePhotoFile}`
                                 }
                                 alt="Complaint Document Preview"
                                 style={{
                                    width: 150,
                                    height: 100,
                                    border: "1px solid grey",
                                    borderRadius: 10,
                                    padding: "2px",
                                    objectFit: "cover",  // Ensures proper scaling
                                 }}
                              />
                           ) : (
                              <img
                                 src={nopdf}
                                 alt="No document available"
                                 style={{
                                    width: 150,
                                    height: 100,
                                    border: "1px solid grey",
                                    borderRadius: 10,
                                 }}
                              />
                           )}

                           <Typography
                              onClick={() => modalOpenHandle("vehiclePhotoFile")}
                              style={{
                                 textDecorationColor: "blue",
                                 textDecorationLine: "underline",
                                 color: "blue",
                                 fontSize: "15px",
                                 cursor: "pointer",
                                 padding: "20px",
                              }}
                              role="button"
                              aria-label="Preview Document"
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

export default AddVehicleDetail;