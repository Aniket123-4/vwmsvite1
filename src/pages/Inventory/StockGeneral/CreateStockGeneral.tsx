


import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Grid,
    Divider,
    MenuItem,
    TextField,
    Typography,
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
import { getId, getISTDate } from "../../../utils/Constant";

type Props = {};

const CreateStockGeneral = (props: Props) => {
    const UserId =getId();
    let navigate = useNavigate();
    const { defaultValues, defaultValuestime } = getISTDate();
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const [toaster, setToaster] = useState(false);
    const [lang, setLang] = useState<Language>("en");

    const [option, setOption] = useState([
        { value: "-1", label: t("text.SelectItemType") },
    ]);
    const [taxOptions, setTaxOptions] = useState([
        { value: "-1", label: t("text.SelectTaxId") },
    ]);
    // const [itemCategoryOptions, setitemCategoryOptions] = useState([
    //     { value: "-1", label: t("text.itemCategory") },
    // ]);
    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [taxIds, setTaxIds] = useState(0);
    const [totalAmountafterTax, setTotalAmountafterTax] = useState(0);

    useEffect(() => {
       // GetitemCategoryData();
        GetItemTypeData();
        GetTaxData();
        GetUnitData()
    }, []);

    const GetItemTypeData = async () => {
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
                taxid: data[index]["taxId"],
            });
        }
        setOption(arr);
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
        const arr = [];
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
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["unitName"],
                value: data[index]["unitId"],
            });
        }
        setUnitOptions(arr);
    };
    const formik = useFormik({
        initialValues: {
    "sno": 0,
    "entryNo": 0,
    "batchNo": "",
    "itemId": 0,
    "unitID": 0,
    "rate": 0,
    "inQty": 0,
    "outQty": 0,
    "voucherId": 0,
    "stockBinId": 0,
    "voucherType": "",
    "voucherDate": defaultValues,
    "createdBy": UserId,
    "updatedBy": "",
    "createdOn": defaultValues,
    "updatedOn": defaultValues,
    "expiryDate": defaultValues,
    "companyId": 0,
    "gstRate": 0,
    "cgst": 0,
    "sgst": 0,
    "igst": 0,
    "gstid": 0,
    "cgstid": 0,
    "sgstid": 0,
    "igstid": 0,
    "fyearId": 0,
    "itemMaster": {
      "itemMasterId": 0,
      "itemName": "",
      "itemCode": "",
      "itemTypeId": 0,
      "itemFlag": "",
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
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "mileage": 0,
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "zoneName": "",
      "vehiclePhotoFile": "",
      "vehicleTypeId": 0,
      "brandTypeId": 0,
      "fuelTypeId": 0,
      "devid": "",
      "vehicleWeight": 0
    },
    "companyMaster": {
      "id": 0,
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
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "cityName": ""
    },
    "finnacialYear": {
      "fnId": 0,
      "financialYear": "",
      "fromDate": defaultValues,
      "toDate":defaultValues ,
      "currentYear": true,
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
    },
    "stockledgerlist": [],
    "unitName": ""

        },

        validationSchema: Yup.object({
            batchNo: Yup.string().required(t("text.reqBatchnum")),
            inQty: Yup.string().required(t("text.reqQuantity")),
        }),

        onSubmit: async (values) => {
            console.log("Formik", values);
            const response = await api.post(
                `StockLedger/UpsertStockLedger`,
                values
            );
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/storemanagement/stockopening");
            } else {
                setToaster(true);
                toast.error(response.data.message);
            }
        },
    });



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
                        {t("text.CreateStockGeneral")}
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
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterbatchNo")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="batchNo"
                                    id="batchNo"
                                    value={formik.values.batchNo}
                                    placeholder={t("text.enterbatchNo")}
                                    onChange={formik.handleChange}
                                />
                                
                                {formik.touched.batchNo && formik.errors.batchNo ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.batchNo}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-item"
                                    options={option}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        if (newValue) {
                                            console.log(newValue);
                                            formik.setFieldValue("itemId", newValue?.value);
                                            formik.setFieldValue("gstid", newValue?.taxid);
                                            formik.setFieldValue("itemName", newValue?.label);

                                            setTaxIds(newValue?.taxid);
                                        } else {
                                            formik.setFieldValue("itemId", "");
                                            setTaxIds(0);
                                        }
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectitemId")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-unit"
                                    options={unitOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue);
                                        formik.setFieldValue("unitId", newValue?.value);
                                        formik.setFieldValue("unitName", newValue?.label);
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.enterunitId")}
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
                                            text={t("text.enterrate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="rate"
                                    id="rate"
                                    value={formik.values.rate}
                                    placeholder={t("text.enterrate")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.inqty")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="inQty"
                                    id="inQty"
                                    type="text"
                                    value={formik.values.inQty}
                                    placeholder={t("text.inqty")}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e: any) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        formik.setFieldValue("inQty", value ? Number(value) : '');
                                        setTotalAmount(Number(value) * Number(formik.values.rate));
                                        const taxValue = taxOptions.find((x: any) => x.value === taxIds);
                                        let taxAmount = Number(value) * Number(formik.values.rate) * Number(taxValue?.label) / 100;
                                        console.log(taxValue);
                                        formik.setFieldValue("gstRate", taxValue?.label);
                                        setTotalTax(taxAmount);
                                        formik.setFieldValue("cgst", taxAmount / 2);
                                        formik.setFieldValue("sgst", taxAmount / 2);
                                        formik.setFieldValue("igst", 0);
                                        formik.setFieldValue("cgstid", -1);
                                        formik.setFieldValue("sgstid", -1);
                                        formik.setFieldValue("igstid", -1);
                                        setTotalAmountafterTax(Number(value) * Number(formik.values.rate) + taxAmount);
                                    }}
                                />
                                {formik.touched.inQty && formik.errors.inQty ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.inQty}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterexpiryDate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="expiryDate"
                                    id="expiryDate"
                                    type="date"
                                    value={formik.values.expiryDate}
                                    placeholder={t("text.enterexpiryDate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.totalAmount")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={totalAmount}
                                    placeholder={t("text.totalAmount")}
                                //onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.totalTax")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={totalTax}
                                    placeholder={t("text.totalTax")}
                                // onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.totalAmountafterTax")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={totalAmountafterTax}
                                    placeholder={t("text.totalAmountafterTax")}
                                // onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Grid>
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
                </CardContent>
            </div>
        </div>
    );
};

export default CreateStockGeneral;
