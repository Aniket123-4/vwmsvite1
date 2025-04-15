

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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getISTDate } from "../../../utils/Constant";
import {

  Modal,
  Box,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import nopdf from "../../../assets/images/imagepreview.jpg";
import { getId} from "../../../utils/Constant";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";


type Props = {};


const CreateJobCardIndent = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [tableData, setTableData] = useState<any>([
    {


      "id": 0,
      "indentId": 0,
      "itemId": 0,
      "unitId": 0,
      "quantity": 0,
      "rate": 0,
      "amount": 0,
      "approveQuantity": 0,
      "fyId": 0,
      "srn": 0,
      "isDelete": true,
      "unitName": "",
      "item": ""
    },
    {


      "id": 0,
      "indentId": 0,
      "itemId": 0,
      "unitId": 0,
      "quantity": 0,
      "rate": 0,
      "amount": 0,
      "approveQuantity": 0,
      "fyId": 0,
      "srn": 0,
      "isDelete": true,
      "unitName": "",
      "item": ""
    }
  ]);


  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [itemOption, setitemOption] = useState([
    { value: -1, label: t("text.itemMasterId") },
  ]);

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: t("text.itemMasterId") },
  ]);
  const [maxindentOption, setmaxindentOption] = useState([
    { value: "-1", label: t("text.indentID") },
  ]);


  const UserId = getId();
  useEffect(() => {

    GetUnitData();
    GetitemData();
    getVnoData();
    GetmaxindentData();

  }, []);


  console.log("🚀 ~ CreateJobCardIndent ~ tableData:", tableData)


  const getVnoData = async () => {
    const response = await api.get(
      `Master/GetVehicleDetail?ItemMasterId=-1`,
    );
    const data = response.data.data;
    const arr = data.map((Item: any, index: any) => ({
      value: Item.itemMasterId,
      label: Item.vehicleNo
    }));
    setVnoOption(arr);
  };
  const GetitemData = async () => {
    const collectData = {
      itemMasterId: -1,
    };
    const response = await api.get(`ItemMaster/GetItemMaster`, {});
    const data = response.data.data;
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    }
    setitemOption(arr);
  };


  const GetmaxindentData = async () => {

    const response = await api.get(`Master/GetMaxindentNo`);
    const data = response.data.data;

    for (let index = 0; index < data.length; index++) {
      formik.setFieldValue("indentNo", data[index]['indentNo'])
    }
    //setmaxindentOption(arr);
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


  const validateRow = (row: any) => {
    return row.itemId && row.unitId && row.approveQuantity && row.rate > 0;
  };

  const formik = useFormik({
    initialValues: {
      //vehicleNo: 0,
      "sno": 0,
      "indentId": 0,
      "indentNo": "",
      "indentDate": defaultValues,
      "remark": "",
      "createdBy": UserId,
      "updatedBy": "",
      "createdOn": defaultValues,
      "updatedOn": defaultValues,
      "companyId": 0,
      "fyId": 0,
      "jobID": 0,
      "vehicleitem": null,
      "empId": 0,
      "status": "",
      "releasedBy": "",
      "indenttype": "",
      "postedBy": "",
      "releasedOn": defaultValues,
      "postedOn": defaultValues,
      indentDetail: [],
      srn: 0
    },


    validationSchema: Yup.object({
      vehicleitem: Yup.string()
        .required("Vehicle no required"),
    }),



    onSubmit: async (values) => {
      //values.indentDetail = tableData
      const validTableData = tableData.filter(validateRow);

      if (validTableData.length === 0) {
        alert("Please add some data in table for further process");
        return;
      }
      console.log('values', values)



      const response = await api.post(
        `Master/UpsertIndent`,
        { ...values, indentDetail: validTableData }
      );
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/workshopindent/jobcardindent");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  // const back = useNavigate();

  const handleInputChange = (index: number, field: string, value: number) => {
    const newData: any = [...tableData];


    const numericValue = parseFloat(value.toString());

    newData[index][field] = numericValue;


    if (field === 'quantity' && numericValue < 1) {
      newData[index].quantity = 1;
    }


    if (field === 'quantity' || field === 'rate' || field === 'approveQuantity' || field === 'unitId') {
      const quantity = newData[index].quantity;
      const rate = newData[index].rate;
      const approveQuantity = newData[index].approveQuantity;


      newData[index].amount = rate * approveQuantity;
    }


    setTableData(newData);


    if (newData[index].quantity >= 1 && newData[index].rate > 0 && newData[index].approveQuantity >= 1) {
      if (index === tableData.length - 1) {
        addRow();
      }
    }
  };


  const addRow = () => {
    setTableData([
      ...tableData,
      {

        id: tableData.length + 1,
        "indentId": 0,
        "itemId": 0,
        "unitId": 0,
        "quantity": 0,
        "rate": 0,
        "amount": 0,
        "approveQuantity": 0,
        "fyId": 0,
        "srn": 0,
        "isDelete": true,
        "unitName": "",
        "itemName": ""
      },
    ]);
  };


  const deleteRow = (index: any) => {
    const newData = tableData.filter((_: any, i: any) => i !== index);
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
                {t("text.CreateJobCardIndent")}

              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}>
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
          {/* <ToastContainer/> */}
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="indentNo"
                  name="indentNo"
                  label={<CustomLabel text={t("text.IndentNO")} required={true} />}
                  value={formik.values.indentNo}

                  size="small"
                  fullWidth


                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={VnoOption}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    // Check if newValue is valid
                    if (newValue && newValue.label) {
                      console.log(newValue?.value);
                      formik.setFieldValue("VehicleNo", newValue.label);
                      formik.setFieldValue("vehicleitem", newValue.value);
                    } else {
                      // Handle case where newValue is null or invalid
                      formik.setFieldValue("VehicleNo", "");
                    }
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() !== "") {
                      formik.setFieldValue("vehicleitem", value); // Allow manual input if needed
                    }
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.VehicleNos1")} required={true} />}

                    />
                  )}
                  popupIcon={null}
                />
                {formik.touched.vehicleitem && formik.errors.vehicleitem && (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.vehicleitem}
                  </div>
                )}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="indentDate"
                  name="indentDate"
                  label={<CustomLabel text={t("text.indentDate")} required={false} />}
                  value={formik.values.indentDate}
                  placeholder={t("text.indentDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>


                <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
                  <Table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                  <thead style={{
                      backgroundColor: `var(--grid-headerBackground)`,
                      color: `var(--grid-headerColor)`
                    }}>
                      <tr>

                        {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '5%', height: '35px' }}>{t("text.SrNo")}</th> */}
                        <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.itemName")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Unit")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.quantity")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.approveQuantity")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.Rate")}</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.totalAmount")}</th>


                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row: any, index: any) => (
                        <tr key={row.id} style={{ border: '1px solid black' }}>
                          {/* <td style={{ border: '1px solid black', textAlign: 'center' }}>{index + 1}</td> */}
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            <AddCircleIcon
                              onClick={() => {
                                addRow();
                              }}

                              style={{ cursor: "pointer" }}
                            />
                            <DeleteIcon
                              onClick={() => {
                                if (tableData.length > 1) {
                                  deleteRow(index)
                                } else {
                                  alert("Atleast one row should be there");
                                }
                              }}
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
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                } else {
                                  handleInputChange(
                                    index,
                                    "itemId",
                                    newValue?.value
                                  )
                                }
                              }
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}

                                />
                              )}
                            />
                          </td>
                          <td style={{ border: '1px solid black', textAlign: 'center' }}>

                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={unitOptions}
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                } else {
                                  handleInputChange(
                                    index,
                                    "unitId",
                                    newValue?.value
                                  )
                                }
                              }
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}

                                />
                              )}
                            />

                          </td>


                          <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
                            <TextField

                              size="small"
                              // type="text"
                              value={row.quantity}
                              onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>
                          <td style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '10%', height: '35px' }}>
                            <TextField

                              size="small"
                              // type="text"
                              value={row.approveQuantity}
                              onChange={(e) => handleInputChange(index, 'approveQuantity', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>
                          <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
                            <TextField

                              size="small"
                              // type="text"
                              value={row.rate}
                              onChange={(e) => handleInputChange(index, 'rate', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>

                          <td style={{ border: '1px solid black', textAlign: 'center', width: '10%', height: '35px' }}>
                            <TextField
                              // type="number"
                              value={row.amount.toFixed(2)}
                              size="small"
                              inputProps={{ "aria-readonly": true }}
                              onFocus={(e) => { e.target.select() }}
                            />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={7} style={{ textAlign: "right", fontWeight: "bold" }}>
                          {t("text.Totalnetamount")}

                        </td>
                        <td style={{ textAlign: "center", border: "1px solid black" }}>
                          {tableData.reduce((acc: any, row: any) => acc + (parseFloat(row.amount) || 0), 0).toFixed(2)}
                        </td>
                      </tr>


                    </tfoot>
                  </Table>
                </div>   </Grid>


              <Grid item xs={12} md={12} lg={12}>
                {/* <TextareaAutosize placeholder={t("text.remark")} minRows={1} */}
                <TextField
                  placeholder={t("text.Remark")}
                  onChange={(e) => formik.setFieldValue('remark', e.target.value)}
                  style={{
                    width: '100%',
                    height: 'auto',
                    border: '1px solid #ccc',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    resize: 'none',
                  }} />
              </Grid>

              <Grid item lg={4} sm={4} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.release")}
                </Button>
              </Grid>
              <Grid item lg={4} sm={4} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.post")}
                </Button>
              </Grid>

              <Grid item lg={4} sm={4} xs={12}>
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

export default CreateJobCardIndent;

