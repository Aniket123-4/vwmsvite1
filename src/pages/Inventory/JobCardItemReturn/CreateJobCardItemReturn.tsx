

import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
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
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getId, getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";

type Props = {};

const CreateJobCardItemReturn = (props: Props) => {
  const UserId =getId();
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [isIndentSelected, setIsIndentSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [items, setItems] = useState<any>([]);
  //const [tableData, setTableData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([
    {
      id: 0,
      returnId: 0,
      itemID: 0,
      batchNo: "",
      indentId: 0,
      returnQty: 0,
      issueQty: 0,
    },
  ]);
  console.log("🚀 ~ CreateJobCardItemReturn ~ tableData:", tableData);
  const [indentOptions, setIndentOptions] = useState([
    { value: "-1", label: t("text.SelectindentNo") },
  ]);
  const [itemOption, setitemOption] = useState([
    { value: -1, label: t("text.itemMasterId") },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);

  const [empOption, setempOption] = useState([
    { value: "-1", label: t("text.empid") },
  ]);
  useEffect(() => {
    GetIndentID();
    GetitemData();
    GetUnitData();
    //  GetempData();
  }, []);

  const GetIndentID = async () => {
    const collectData = {
      issueId: -1,
      indentId: -1,
      empId: -1,
    };

    const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
    const data = response.data.data;
    console.log("indent option", data);
    const arr:any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["indentNno"] || 0,
        value: data[index]["issueId"] || "",
      });
    }
    setIndentOptions(arr);
  };

  const GetIndentIDById = async (itemID: any) => {
    const collectData = {
      issueId: itemID,
      indentId: -1,
      empId: -1,
    };
    const response = await api.post(`ItemIssue/GetItemIssue`, collectData);
    const data = response.data.data[0]["itemIssueDetail"];
    formik.setFieldValue("itemIssueDetail", data);

    // console.log("indent option", data)
    // let arr: any = [];

    const indent = data.map((item: any, index: any) => ({
      id: index + 1,
      returnId: -1,
      indentId: item?.indentId || 0,
      batchNo: item?.batchNo || "",
      itemID: item?.itemID,
      issueQty: item?.issueQty,

      unitId: item?.unitId,

      unitName: item?.unitName,
      itemName: item?.itemName,
      returnQty: 0,

      srn: 0,
    }));

    setTableData(indent);
    setIsIndentSelected(true);
  };

  console.log("check table", tableData);

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
  // const GetempData = async () => {
  //     const collectData = {
  //         "id": -1,
  //         "unit": -1
  //     };
  //     const response = await api.post(`StoreMaster/GetStoreMaster`, collectData);
  //     const data = response.data.data;
  //     console.log('data', data)
  //     const arr = data.map((item: any) => ({
  //         label: item.storeName,
  //         value: item.id,

  //     }))

  //     setempOption(arr);
  // };

  const handleActionChange = (event: any) => {
    setSelectedAction(event.target.value);
  };

  const validateRow = (row: any) => {
    // return row.itemName && row.unitId && row.reqQty >= 1;
  };

  const formik = useFormik({
    initialValues: {
      returnId: 0,
      // "storeId": 0,
      returnDate: new Date().toISOString().slice(0, 10),
      returnType: "JobCard",
      returnIndentNo: "",
      createdBy: UserId,
      updatedBy: "",
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      itemReturnDetail: [],
      itemIssueDetail: [],
      srn: 0,
      // "storeName": ""
    },

    validationSchema: Yup.object({
      returnIndentNo: Yup.string().required(t("text.reqIndentNum")),
    }),

    onSubmit: async (values) => {
      const validTableData = tableData;
      values.itemReturnDetail = tableData;

      // if (validTableData.length === 0) {
      //     toast.error("Please add some data in table for further process");
      //     return;
      // }

      const response = await api.post(`Master/UpsertItemReturn`, values);

      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/itemreturn/jobcarditemreturn");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const handleInputChange = (index: any, field: any, value: any) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;

    // if (field === 'reqQty' || field === 'issueQty') {
    //     updatedData[index].stockQty = updatedData[index].reqQty - updatedData[index].issueQty;

    //     // console.log("stockQty",updatedData[index].stockQty, updatedData[index].reqQty,updatedData[index].issueQty)

    // }

    setTableData(updatedData);
  };

  const deleteRow = (index: number) => {
    const updatedData = tableData.filter((_: any, i: number) => i !== index);
    setTableData(updatedData);
  };

  const back = useNavigate();

  const addRow = () => {
    setTableData([
      ...tableData,
      {
        id: 0,
        issueId: -1,
        itemID: 0,
        batchNo: "",
        indentId: 0,
        unitId: 0,
        reqQty: 0,
        issueQty: 0,
        stockQty: 0,
        itemName: "",
        indentNo: "",
        srn: 0,
        unitName: "",
        returnItem: true,
      },
    ]);
  };

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
                {t("text.CreateJobCardItemReturn")}
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
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={indentOptions}
                  // value={
                  //   indentOptions.find(
                  //     (opt: any) =>
                  //       opt.value == parseInt(formik.values.returnIndentNo)
                  //   ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log("check value", newValue);
                    if (newValue) {
                      GetIndentIDById(newValue?.value);
                      // formik.setFieldValue("indentId", newValue?.value);
                      formik.setFieldValue(
                        "returnIndentNo",
                        newValue?.label?.toString() || ""
                      );
                    }
                  }}
                  // value={
                  //     indentOptions.find((opt) => (opt.value) == (formik.values.indentNo)) || null
                  // }
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.enterIndentNo")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.returnIndentNo &&
                  formik.errors.returnIndentNo && (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.returnIndentNo}
                    </div>
                  )}
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={empOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("storeId", newValue?.value);
                                        formik.setFieldValue("storeName", newValue?.label);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectStore")} required={true} />}
                                        />
                                    )}
                                />

                            </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="returnDate"
                  name="returnDate"
                  label={
                    <CustomLabel text={t("text.ReturnDate")} required={false} />
                  }
                  value={formik.values.returnDate}
                  placeholder={t("text.issueDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {isIndentSelected && (
                <Grid item xs={12}>
                  <Table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid black",
                    }}
                  >
                    <thead style={{
                      backgroundColor: `var(--grid-headerBackground)`,
                      color: `var(--grid-headerColor)`
                    }}>
                      <tr>
                        {/* <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '5%', height: '35px' }}>{t("text.SrNo")}</th> */}
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
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
                          {t("text.itemName")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Unit")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Batchno")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.stockQty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.Qty")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.ReturnQty")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row: any, index: any) => (
                        <tr key={row.id} style={{ border: "1px solid black" }}>
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
                                  deleteRow(index);
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
                              width: "30%",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={itemOption}
                              value={
                                itemOption.find(
                                  (opt) => opt.value === parseInt(row?.itemID)
                                ) || null
                              }
                              fullWidth
                              size="small"
                              onChange={(e: any, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "itemID",
                                  newValue?.value
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // label={
                                  //     <CustomLabel
                                  //         text={t("text.selectItem")}
                                  //         required={false}
                                  //     />
                                  // }
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "20%",
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={unitOptions}
                              value={
                                unitOptions.find(
                                  (opt) => opt.value === row?.unitId
                                ) || null
                              }
                              fullWidth
                              size="small"
                              onChange={(e, newValue: any) =>
                                handleInputChange(
                                  index,
                                  "unitId",
                                  newValue?.value
                                )
                              }
                              renderInput={(params: any) => (
                                <TextField
                                  {...params}
                                  // label={<CustomLabel text={t("text.selectUnit")} />}
                                />
                              )}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              //width: "150px"
                            }}
                          >
                            <TextField
                              value={row.batchNo || ""} // Bind to row.batchNo
                              id="BatchNo"
                              name="BatchNo"
                              size="small"
                              sx={{ width: "150px" }}
                              inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "batchNo",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            <TextField
                              // type="number"
                              size="small"
                              value={row.issueQty - row.returnQty}
                              onFocus={(e) => e.target.select()}
                              // onChange={(e) => handleInputChange(index, 'stockQty', Number(row.srn - row.issueQty))}
                              inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            <TextField
                              // type="number"
                              size="small"
                              // type="text"
                              value={row.issueQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "issueQty",
                                  parseInt(row.issueQty) || 0
                                )
                              }
                              inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
                              onFocus={(e) => e.target.select()}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            <TextField
                              // type="number"
                              size="small"
                              // type="text"
                              value={row.returnQty}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "returnQty",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              inputProps={{ style: { textAlign: "right" }, "aria-readonly": true }}
                            />
                          </td>
                          {/* <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => deleteRow(index)}>
                                                        <DeleteIcon />
                                                    </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Grid>
              )}

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
                  type="button"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    formik.resetForm(); // Reset form values
                    setTableData([
                      {
                        id: 0,
                        returnId: 0,
                        itemID: 0,
                        batchNo: "",
                        indentId: 0,
                        returnQty: 0,
                        issueQty: 0,
                      },
                    ]); // Reset table data
                    //   setItemValue(null); // Reset Autocomplete selection
                    setSelectedAction(null); // Reset selected action
                    setIsIndentSelected(false); // Reset indent selection
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

export default CreateJobCardItemReturn;
