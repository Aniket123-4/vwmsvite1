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

const EditItemContract = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const location = useLocation();
  const userId = getId();

  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);
  const [itemOption, setItemOption] = useState([
    { value: -1, label: t("text.Services") },
  ]);
  const [tableData, setTableData] = useState([{
    contractId: 0,
    id: 0,
    itemId: 0,
    createdBy: userId,
    updatedBy: userId,
    createdOn: defaultValues,
    updatedOn: defaultValues,
    fyId: 0,
    rate: 0,
    srno: 0,
    itemName: ""
  }]);

  useEffect(() => {
    getTransDataById(location.state.contractId);
    getVendorData();
    getItemData();
  }, []);

  const getVendorData = async () => {
    const collectData = {
      "venderId": -1,
      "countryId": -1,
      "stateId": -1,
      "cityId": -1
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

  const getItemData = async () => {
    const response = await api.get(
      `ItemMaster/GetItemMaster?ItemMasterId=-1`,
    );
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.itemName
    }));
    setItemOption(arr);
  };

  const getTransDataById = async (id: any) => {
    const collectData = {
      "contractId": id,
      "serviceId": -1,
      "itemId": id
    };
    try {
      const result = await api.post(`ItemContract/GetItemContractInformation`, collectData);
      const data = result.data.data;

      console.log("🚀 ~ getTransDataById ~ data:", data);

      if (data.length > 0) {
        const formattedData = data[0]['itemDetail'].map((item: any, index: number) => ({
          contractId: item.contractId,
          id: item.id,
          itemId: item.itemId,
          createdBy: item.createdBy,
          updatedBy: item.updatedBy,
          createdOn: item.createdOn,
          updatedOn: item.updatedOn,
          fyId: item.fyId,
          rate: item.rate,
          srno: item.srno,
          itemName: item.itemName
        }));
        setTableData([...formattedData, {
          contractId: 0,
          id: 0,
          itemId: 0,
          createdBy: userId,
          updatedBy: userId,
          createdOn: defaultValues,
          updatedOn: defaultValues,
          fyId: 0,
          rate: 0,
          srno: 0,
          itemName: ""
        }]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const validateRow = (row: any) => {
    return row.itemId && row.itemName && row.rate > 0;
  };

  const formik = useFormik({
    initialValues: {
      "contractId": location.state?.contractId,
      "vendorId": location.state?.vendorId,
      "effectivedate": location.state.effectivedate,
      "createdBy": location.state.createdBy,
      "updatedBy": location.state.updatedBy,
      "type": location.state.type,
      "refDocNo": location.state.refDocNo,
      "createdOn": location.state.createdOn,
      "updatedOn": location.state.updatedOn,
      "fromDate": location.state.fromDate,
      "toDate": location.state.toDate,
      "companyId": location.state.companyId,
      "fyId": location.state.fyId,
      "rate": location.state.rate,
      "srno": location.state.srno,
      "serviceDetail": location.state.serviceDetail,
      "itemDetail": [],
      "vendorName": location.state.vendorName
    },

    validationSchema: Yup.object({
      vendorId: Yup.string()
        .required(t("text.reqVendorName")),
    }),



    onSubmit: async (values) => {
      const validTableData = tableData.filter(validateRow);
      if (validTableData.length === 0) {
        toast.error("Please add some data in table for further process");
        return;
      }
      const response = await api.post(`ItemContract/UpsertItemContractInformation`, { ...values, itemDetail: validTableData });
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/vendorinfo/ItemContract")
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const handleInputChange = (index: any, field: any, value: any) => {
    const newData: any = [...tableData];
    newData[index][field] = value;

    if (field === 'itemId') {
      newData[index].itemId = newData[index].itemId;
    }
    if (field === 'itemName') {
      newData[index].itemName = newData[index].itemName;
    }
    if (field === 'rate') {
      newData[index].rate = newData[index].rate;
    }

    setTableData(newData);

    if (newData[index].itemId && newData[index].rate > 0) {
      if (index === tableData.length - 1) {
        addRow();
      }
    }
  };

  const addRow = () => {
    setTableData([...tableData, {
      contractId: 0,
      id: 0,
      itemId: 0,
      createdBy: userId,
      updatedBy: userId,
      createdOn: defaultValues,
      updatedOn: defaultValues,
      fyId: 0,
      rate: 0,
      srno: 0,
      itemName: ""
    },
    ]);
  };

  const deleteRow = (index: any) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
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
                {location.state.isView ? t("text.ItemContract") : t("text.EditItemContract")}
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


              {/* Vendor */}
              <Grid item xs={12} md={4} sm={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorOption}

                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("vendorId", newValue?.value);
                    formik.setFieldValue("vendorName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.Vendor")} required={false} />}
                      name="vendorId"
                      id="vendorId"
                      placeholder={t("text.Vendor")}
                    />
                  )}
                />
                {formik.touched.vendorId && formik.errors.vendorId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.vendorId.toString()}</div>
                )}
              </Grid>


              {/* Effective Date */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EffectiveDate")}
                    //required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="effectivedate"
                  id="effectivedate"
                  value={formik.values.effectivedate}
                  placeholder={t("text.EffectiveDate")}
                  onChange={(e) => {
                    formik.setFieldValue("effectivedate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* from Date */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.FromDate")}
                    //required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="fromDate"
                  id="fromDate"
                  value={formik.values.fromDate}
                  placeholder={t("text.FromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("fromDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* to Date */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ToDate")}
                    //required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="toDate"
                  id="toDate"
                  value={formik.values.toDate}
                  placeholder={t("text.ToDate")}
                  onChange={(e) => {
                    formik.setFieldValue("toDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              {/* ref Doc no */}
              <Grid item xs={12} md={4} sm={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.RefDocNo")}
                    //required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="refDocNo"
                  id="refDocNo"
                  value={formik.values.refDocNo}
                  placeholder={t("text.RefDocNo")}
                  onChange={(e) => {
                    formik.setFieldValue("refDocNo", e.target.value);
                  }}
                />
              </Grid>





              <Grid item xs={12} md={12} lg={12}>
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
                      color: `var(--grid-headerColor)`
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                          width: "100px"
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
                        {t("text.ItemName")}
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
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={row.id} style={{ border: '1px solid black' }}>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <DeleteIcon
                            onClick={() => deleteRow(index)}
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
                            value={row.itemName}
                            fullWidth
                            size="small"
                            onChange={(e: any, newValue: any) => {
                              console.log(newValue?.value);
                              handleInputChange(index, 'itemId', newValue?.value);
                              handleInputChange(index, 'itemName', newValue?.label);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                //label={<CustomLabel text={t("text.SelectItem")} required={false} />}
                                name="itemName"
                                id="itemName"
                                placeholder={t("text.SelectItem")}
                              />
                            )}
                          />
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            width: "10rem"
                          }}
                        >
                          <TextField
                            value={row.rate}
                            onChange={(e) => handleInputChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            size="small"
                            inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* <tfoot>
                  </tfoot> */}
                </Table>
              </Grid>


              {/* Submit Button */}
              <Grid item lg={6} sm={6} xs={12}>
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

              {/* Reset Button */}
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
                      onClick={() => {
                        formik.resetForm();
                      }}
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

export default EditItemContract;

