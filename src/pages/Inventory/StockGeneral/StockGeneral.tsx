


import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
// import api from "../../../utils/Url";

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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getISTDate } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";

// import CustomDataGrids from "../../../utils/CustomDataGrids";
// import CustomDataGrid from "../../../utils/CustomDatagrid";
import dayjs from "dayjs";
import api from "../../../utils/Url";
import DataGrids from "../../../utils/Datagrids";


interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function Stockledger() {
    const { t } = useTranslation();
    const { defaultValues, defaultValuestime } = getISTDate();
    const Userid = getId();
    const [editId, setEditId] = useState(-1);
    const [zones, setZones] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    console.log('location', location);
    const [lang, setLang] = useState<Language>("en");
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });
    const [taxOptions, setTaxOptions] = useState<any>([
        { value: "-1", label: t("text.SelectTaxId"), pcent: 0 },
    ]);
    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);
    const [contentOptions, setContentOptions] = useState([
        { value: "-1", label: t("text.SelectContentId") },
    ]);

    console.log(location)


    useEffect(() => {
        GetDigitalContentData();
        GetTaxData();
        GetUnitData()
        fetchStockData();
        if (location?.state && location?.state != null) {
            routeChangeEdit(location.state);
        }
    }, []);


    const GetTaxData = async () => {
        const collectData = {
            "taxId": -1,
        };
        const response = await api.post(`UnitMaster/GetTaxMaster`, collectData);
        const data = response.data.data;
        const arr: any = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["taxName"],
                value: data[index]["taxId"],
                pcent: data[index]['taxPercentage']
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


    const GetDigitalContentData = async () => {
        const collectData = {
            itemMasterId: -1,
        };
        const response = await api.get(`ItemMaster/GetItemMaster`, {});
        const data = response.data.data;
        console.log('data', data)
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["itemName"],
                value: data[index]["itemMasterId"],
            });
        }
        setContentOptions(arr);
    };



    const routeChangeEdit = (row: any) => {
        console.log("🚀 ~ routeChangeEdit ~ row:", row)
        formik.setFieldValue("entryNo", row.entryNo);
        formik.setFieldValue("batchNo", row.batchNo);
        formik.setFieldValue("itemId", row.itemId);
        formik.setFieldValue("unitId", row.unitId);
        formik.setFieldValue("rate", row.rate);
        formik.setFieldValue("inQty", row.inQty);
        formik.setFieldValue("outQty", row.outQty);
        formik.setFieldValue("voucherId", row.voucherId);
        formik.setFieldValue("stockBinId", row.stockBinId);
        formik.setFieldValue("voucherType", row.voucherType);
        formik.setFieldValue("voucherDate", dayjs(row.voucherDate).format("YYYY-MM-DD"));
        formik.setFieldValue("expiryDate", dayjs(row.expiryDate).format("YYYY-MM-DD"));
        formik.setFieldValue("companyId", row.companyId);
        formik.setFieldValue("gstRate", row.gstRate);
        formik.setFieldValue("cgst", row.cgst);
        formik.setFieldValue("sgst", row.sgst);
        formik.setFieldValue("igst", row.igst);
        formik.setFieldValue("gstid", row.gstid);
        formik.setFieldValue("sgstid", row.sgstid);
        formik.setFieldValue("igstid", row.igstid);
        formik.setFieldValue("fyearId", row.fyearId);
        formik.setFieldValue("isActive", row.isActive);
        setEditId(row.id);
    };



    let delete_id = "";

    const accept = () => {

        api
            .post(`StockLedger/DeleteStockLedger?filter=${delete_id}`, null)
            .then((response) => {
                if (response.data.status === 1) {
                    toast.success(response.data.message);
                    fetchStockData();
                } else {
                    toast.error(response.data.message);
                }
            });
    };

    const reject = () => {
        toast.warn("Rejected: You have rejected", { autoClose: 3000 });
    };

    const handledeleteClick = (del_id: any) => {
        delete_id = del_id;
        confirmDialog({
            message: "Do you want to delete this record ?",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            acceptClassName: "p=-button-danger",
            accept,
            reject,
        });
    };

    const fetchStockData = async () => {
        try {
            const collectData = {
                "entryNo": -1
            };
            const response = await api.post(
                `StockLedger/GetStockLedger`,
                collectData
            );
            const data = response.data.data;
            console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
            const zonesWithIds = data.map((zone: any, index: any) => ({
                ...zone,
                serialNo: index + 1,
                id: zone.entryNo,
            }));
            setZones(zonesWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        // headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width: 100,

                        renderCell: (params) => {
                            return [
                                <Stack
                                    spacing={1}
                                    direction="row"
                                    sx={{ alignItems: "center", marginTop: "5px" }}
                                >
                                    {/* {permissionData?.isEdit ? (  */}
                                    <EditIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "blue",
                                            cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => routeChangeEdit(params.row)}
                                    />
                                    {/* ) : (
                    ""
                  )}
                  {permissionData?.isDel ? ( */}
                                    <DeleteIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "red",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            handledeleteClick(params.row.id);
                                        }}
                                    />

                                </Stack>,
                            ];
                        },
                    },

                    {
                        field: "batchNo",
                        headerName: t("text.batchNo"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "itemName",
                        headerName: t("text.itemName"),
                        flex: 1.2,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "unitName",
                        headerName: t("text.unitName"),
                        flex: 1.2,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "rate",
                        headerName: t("text.rate"),
                        flex: 0.8,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "voucherType",
                        headerName: t("text.voucherType"),
                        flex: 1.4,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    {
                        field: "voucherDate",
                        headerName: t("text.voucherDate"),
                        flex: 1.3,
                        headerClassName: "MuiDataGrid-colCell",
                        renderCell(params) {
                            return dayjs(params.row.voucherDate).format("DD-MM-YYYY")
                        },
                    },

                ];
                setColumns(columns as any);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const adjustedColumns = columns.map((column: any) => ({
        ...column,
    }));

    const formik = useFormik({
        initialValues: {
            "sno": 0,
            "entryNo": 0,
            "batchNo": "",
            "itemId": null,
            "unitID": null,
            "rate": null,
            "inQty": null,
            "outQty": 0,
            "voucherId": 0,
            "stockBinId": 0,
            "voucherType": "",
            "voucherDate": defaultValues,
            "createdBy": Userid,
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "expiryDate": defaultValues,
            "companyId": 0,
            "gstRate": 0,

            "cgst": 0,
            "sgst": 0,
            "igst": 0,
            "gstid": null,
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
                "toDate": defaultValues,
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
                     rate: Yup.string().required(t("text.reqRate")),
                        gstid: Yup.string().required(t("text.reqGst")),
                        unitID: Yup.string().required(t("text.reqUnit")),
                        itemId: Yup.string().required(t("text.reqItem")),
               }),
        onSubmit: async (values) => {
            const response = await api.post(`StockLedger/UpsertStockLedger`, values);
            if (response.data.status === 1) {
                formik.resetForm();
                fetchStockData();
                toast.success(response.data.message);
                setEditId(-1);


                // formik.setFieldValue("entryNo", "");
                // formik.setFieldValue("batchNo", "");
                // formik.setFieldValue("itemId", "");
                // formik.setFieldValue("unitId","");
                // formik.setFieldValue("rate", "");
                // formik.setFieldValue("inQty", "");
                // formik.setFieldValue("outQty", "");
                // formik.setFieldValue("voucherId", "");
                // formik.setFieldValue("stockBinId", "");
                // formik.setFieldValue("voucherType", "");
                // formik.setFieldValue("voucherDate", "");
                // formik.setFieldValue("expiryDate", "");
                // formik.setFieldValue("companyId", "")
                // formik.setFieldValue("gstRate", "");
                // formik.setFieldValue("cgst", "");
                // formik.setFieldValue("sgst", "");
                // formik.setFieldValue("igst", "");
                // formik.setFieldValue("gstid","");
                // formik.setFieldValue("sgstid","");
                // formik.setFieldValue("igstid", "");
                // formik.setFieldValue("fyearId","");
                // formik.setFieldValue("isActive","");
            } else {
                toast.error(response.data.message);
            }
        },
    });



    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    useEffect(() => {
        const selectedOption = taxOptions.find((opt: any) => opt.value === formik.values.gstid);
        console.log("🚀 ~ useEffect ~ selectedOption:", selectedOption);

        if (selectedOption) {
            formik.setFieldValue("gstRate", selectedOption.pcent);

            const cgstResult = (Number(formik.values.rate) * Number(formik.values.inQty) * (selectedOption.pcent / 2)) / 100;
            formik.setFieldValue('cgst', cgstResult);
            formik.setFieldValue('sgstid', formik.values.gstid);
            formik.setFieldValue('cgstid', formik.values.gstid);
            formik.setFieldValue('sgst', cgstResult);
            formik.setFieldValue('igst', 0);
        } else {
            console.warn("GST rate not found for gstid:", formik.values.gstid);
        }
    }, [formik.values.gstid, formik.values.rate, formik.values.inQty, taxOptions]);



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

                    <Grid item xs={12} container spacing={1}>
                        <Grid item lg={10} md={10} xs={12}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="left"
                            >
                                {t("text.StockGeneral")}
                            </Typography>
                        </Grid>

                        <Grid item lg={2} md={2} xs={12} marginTop={2}>
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

                    <Box height={10} />
                    <form onSubmit={formik.handleSubmit}>
                        {/* <Grid container spacing={2}> */}
                        {/* First Row */}
                        <Grid container item xs={12} spacing={2}>
                          
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
                                    id="combo-box-demo"
                                    options={contentOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("itemId", newValue?.value);
                                        formik.setFieldValue("itemName", newValue?.label);
                                        // formik.setFieldValue("rate",newValue?.rate)
                                        // formik.setFieldValue("unitID",newValue?.unitId)
                                    }}
                                    value={
                                        contentOptions.find(
                                            (opt: any) => opt.value === formik.values.itemId
                                        ) || null
                                    }
                                    // value={}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectitemId")}
                                                    required={true}
                                                />
                                               
                                            }
                                        />
                                    )}
                                />
                                  {(!formik.values.itemId) && formik.touched.itemId && formik.errors.itemId ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.itemId}
                                    </div>
                                ) : null}
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
                                        formik.setFieldValue("unitID", newValue?.value);

                                    }}
                                    value={
                                        unitOptions.find(
                                            (opt: any) => opt.value === formik.values.unitID
                                        ) || null
                                    }
                                    // value={}
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
                                {formik.touched.unitID && formik.errors.unitID ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.unitID}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.Enterrate")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="rate"
                                    id="rate"
                                    value={formik.values.rate ||0}
                                    placeholder={t("text.Enterrate")}
                                    onChange={formik.handleChange}
                                />
                                  {formik.touched.rate && formik.errors.rate ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.rate}
                                    </div>
                                ) : null}
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.EnterinQty")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="inQty"
                                    id="inQty"
                                    value={formik.values.inQty||0}
                                    placeholder={t("text.EnterinQty")}
                                    onChange={formik.handleChange}
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
                                            text={t("text.EntervoucherDate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="voucherDate"
                                    id="voucherDate"
                                    type="date"
                                    value={formik.values.voucherDate||""}
                                    placeholder={t("text.EntervoucherDate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            {/* <Grid item xs={12} sm={4} lg={4}>
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
                            </Grid> */}




                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entergstRate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="gstRate"
                                    id="gstRate"
                                    value={formik.values.gstRate}
                                    placeholder={t("text.entergstRate")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={4} lg={4}>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={taxOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue);
                                        formik.setFieldValue("gstRate", newValue?.pcent);
                                        formik.setFieldValue("gstid", newValue?.value);
                                        if (newValue) {
                                            let cgstresult = (Number(formik.values.rate) * Number(formik.values.inQty) * (newValue?.pcent / 2)) / 100
                                            formik.setFieldValue('cgst', cgstresult);
                                            formik.setFieldValue('sgstid', newValue?.value);
                                            formik.setFieldValue('cgstid', newValue?.value);
                                            formik.setFieldValue('sgst', cgstresult);
                                            formik.setFieldValue('igst', 0);
                                        }
                                    }}
                                    value={
                                        taxOptions.find(
                                            (opt: any) => opt.value === formik.values.gstid
                                        ) || null
                                    }
                                    // value={}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectgst")}
                                                    required={true}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.gstid && formik.errors.gstid ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.gstid}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.cgst")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="cgst"
                                    disabled
                                    id="cgst"
                                    value={formik.values.cgst}
                                    placeholder={t("text.cgst")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.sgst")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="sgst"
                                    disabled
                                    id="sgst"
                                    value={formik.values.sgst}
                                    placeholder={t("text.sgst")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.igst")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    disabled
                                    name="igst"
                                    id="igst"
                                    value={formik.values.igst}
                                    placeholder={t("text.igst")}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        formik.setFieldValue(
                                            "igst",
                                            isNaN(value) ? "" : value
                                        );
                                    }}
                                    onFocus={(e) => e.target.select()}
                                />
                            </Grid> */}






                            <Grid item xs={12} sm={4} lg={4}></Grid>

                            <Grid container item xs={4}>
                                {editId === -1 && (
                                    // {editId === -1 && permissionData?.isAdd && (
                                    <ButtonWithLoader
                                        buttonText={t("text.save")}
                                        onClickHandler={handleSubmitWrapper}
                                        fullWidth={true}
                                    />
                                )}

                                {editId !== -1 && (
                                    <ButtonWithLoader
                                        buttonText={t("text.update")}
                                        onClickHandler={handleSubmitWrapper}
                                        fullWidth={true}
                                    />
                                )}
                            </Grid>

                        </Grid>
                    </form>

                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <DataGrids
                            isLoading={isLoading}
                            rows={zones}
                            columns={adjustedColumns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            initialPageSize={5}
                        />
                    )}
                </Paper>
            </Card>
            <ToastApp />
        </>
    );
};

