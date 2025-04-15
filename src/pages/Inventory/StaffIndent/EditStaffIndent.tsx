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
import { getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";

type Props = {};

const EditStaffIndent = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const location = useLocation();
  console.log("CheckLocation", location);
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);

  const initialRowData: any = {
    id: -1,
    mrnId: 0,
    mrnType: "",
    orderId: "",
    orderNo: "",
    batchNo: "",
    serialNo: "",
    qcStatus: "",
    itemId: "",
    balQuantity: "",
    quantity: "",
    rate: "",
    amount: "",
    gstId: "",
    gstRate: "",
    cgst: "",
    sgst: "",
    igst: "",
    cgstid: "",
    sgstid: "",
    igstid: "",
    gst: "",
    netAmount: "",
    item: {},
  };

  const [tableData, setTableData] = useState([
    {
      id: -1,
      indentId: 0,
      itemId: 0,
      quantity: 0,
      rate: 0,
      amount: 0,
      approveQuantity: 0,
      fyId: 0,
      srn: 0,
      unitId: 0,
      unitName: "",
      isDelete: true,
    },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);

  const [itemOption, setitemOption] = useState<
    { value: number; label: string; unitId?: number }[]
  >([{ value: -1, label: t("text.itemMasterId") }]);

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: t("text.itemMasterId") },
  ]);
  const [empOption, setempOption] = useState([
    { value: "-1", label: t("text.empid") },
  ]);

  useEffect(() => {
    GetitemData();
    //  getVnoData();
    getTransDataById(location.state.id);
    GetUnitData();
    GetempData();
  }, []);

  console.log("🚀 ~ EditStaffIndent ~ tableData:", tableData);
  // const getVnoData = async () => {
  //     const response = await api.get(
  //         `Master/GetVehicleDetail?ItemMasterId=-1`,
  //     );
  //     const data = response.data.data;
  //     const arr = data.map((Item: any, index: any) => ({
  //         value: Item.itemMasterId,
  //         label: Item.vehicleNo
  //     }));
  //     setVnoOption(arr);
  // };
  const GetempData = async () => {
    const collectData = {
      empid: -1,
      userId: "",
    };
    const response = await api.post(`Employee/GetEmployee`, collectData);
    const data = response.data.data;
    // console.log('CheckEmp',data)
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["empName"],
        value: data[index]["empid"],
      });
    }
    setempOption(arr);
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

  const getTransDataById = async (id: any) => {
    const collectData = {
      indentId: id,
      indentNo: "",
      empId: -1,
    };
    try {
      const result = await api.post(`Master/GetIndent`, collectData);
      const data = result.data.data;

      console.log("🚀 ~ getTransDataById ~ data:", data);

      if (data.length > 0) {
        const formattedData = data[0]["indentDetail"].map(
          (item: any, index: number) => ({
            indentID: item.indentID,
            itemId: item.itemId,
            //id: index + 1,
            quantity: item.quantity,
            approveQuantity: item.approveQuantity,
            rate: item.rate,
            amount: item.amount,
            unitId: item.unitId,
            unitName: item.unitName,
          })
        );
        setTableData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetitemData = async () => {
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
      });
    }
    setitemOption(arr);
  };
  const validateRow = (row: any) => {
    if (row.approveQuantity <= 0) {
      alert("Approve Quantity must be greater than 0.");
      return false;
    }
    if (row.approveQuantity > row.quantity) {
      alert("Approve Quantity cannot be greater than Quantity.");
      return false;
    }
    return true;
  };
  const formik = useFormik({
    initialValues: {
      indentId: location.state.indentId,
      indentNo: location.state.indentNo,
      indentDate: dayjs(location.state.indentDate).format("YYYY-MM-DD"),
      remark: location.state.remark,
      createdBy: "adminvm",
      updatedBy: "adminvm",
      createdOn: defaultValues,
      updatedOn: defaultValues,
      companyId: 0,
      fyId: location.state.fyId,
      jobID: location.state.jobID,
      vehicleitem: location.state.vehicleitem,
      empId: location.state.empId,
      status: location.state.status,
      releasedBy: location.state.releasedBy,
      indenttype: location.state.indenttype,
      postedBy: "",
      releasedOn: defaultValues,
      postedOn: defaultValues,
      indentDetail: [],
      srn: location.state.srn,
    },
    // onSubmit: async (values) => {
    //   const response = await api.post(`Master/UpsertIndent`, {
    //     ...values,
    //     indentDetail: tableData,
    //   });
    //   if (response.data.status === 1) {
    //     setToaster(false);
    //     toast.success(response.data.message);
    //     navigate("/Inventory/StaffIndent");
    //   } else {
    //     setToaster(true);
    //     toast.error(response.data.message);
    //   }
    // },
    onSubmit: async (values) => {
      const validTableData = tableData.filter(validateRow);
      if (validTableData.length !== tableData.length) {
        return;
      }

      console.log("values", values);
      const response = await api.post(`Master/UpsertIndent`, {
        ...values,
        indentDetail: tableData,
      });
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/indentforstaff");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const back = useNavigate();
  const handleInputChange = (index: number, field: string, value: any) => {
    const newData: any = [...tableData];

    if (field === "itemId") {
      const selectedItem = itemOption.find((item) => item.value === value);
      newData[index].itemId = selectedItem?.value || 0;
      newData[index].unitId = selectedItem?.unitId || 0; // Automatically set unitId

      console.log("Selected Item:", selectedItem);
    } else {
      newData[index][field] = value;
    }
    const numericValue = parseFloat(value.toString());

    newData[index][field] = numericValue;

    if (field === "quantity" && numericValue < 1) {
      newData[index].quantity = 1;
    }
    if (
      field === "quantity" ||
      field === "rate" ||
      field === "approveQuantity"
    ) {
      const quantity = newData[index].quantity || 0;
      const rate = newData[index].rate || 0;
      const approveQuantity = newData[index].approveQuantity || 0;

      newData[index].amount = rate * approveQuantity;
    }

    // if (newData[index].quantity >= 1 && newData[index].rate > 0 && newData[index].approveQuantity >= 1) {
    //   if (index === tableData.length - 1) {
    //     addRow();
    //   }
    // }
    setTableData(newData);
  };
  // const handleInputChange = (index: number, field: string, value: number) => {
  //     const newData: any = [...tableData];

  //     const numericValue = parseFloat(value.toString());

  //     newData[index][field] = numericValue;

  //     if (field === 'quantity' && numericValue < 1) {
  //         newData[index].quantity = 1;
  //     }

  //     if (field === 'quantity' || field === 'rate' || field === 'approveQuantity') {
  //         const quantity = newData[index].quantity;
  //         const rate = newData[index].rate;
  //         const approveQuantity = newData[index].approveQuantity;

  //         newData[index].amount = rate * approveQuantity;
  //     }

  //     setTableData(newData);

  //     // if (newData[index].quantity >= 1 && newData[index].rate > 0 && newData[index].approveQuantity >= 1) {
  //     //     if (index === tableData.length - 1) {
  //     //         addRow();
  //     //     }
  //     // }
  // };

  const addRow = () => {
    setTableData([
      ...tableData,
      {
        id: tableData.length + 1,
        indentId: 0,
        itemId: 0,
        quantity: 0,
        rate: 0,
        amount: 0,
        approveQuantity: 0,
        fyId: 0,
        srn: 0,
        isDelete: true,
        unitId: 0,
        unitName: "",
      },
    ]);
  };

  const deleteRow = (index: any) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
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
                {t("text.EditStaffIndent")}
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
              <Grid item lg={4} xs={12}>
                <TextField
                  id="indentNo"
                  name="indentNo"
                  label={
                    <CustomLabel text={t("text.IndentNO")} required={false} />
                  }
                  value={formik.values.indentNo}
                  size="small"
                  fullWidth
                />
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  value={
                    empOption[empOption.findIndex(e => e.value == formik.values.empId)]?.label ||null
                }
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.selectemp_name")} />}
                    />
                  )}
                />

                {formik.touched.empId && formik.errors.empId && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.empId}</div>
                )}
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="indentDate"
                  name="indentDate"
                  label={
                    <CustomLabel text={t("text.indentDate")} required={false} />
                  }
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
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  value={
                    empOption[
                      empOption.findIndex((e) => e.value == formik.values.empId)
                    ]?.label || ""
                  }
                  //value={formik.values.vehicleitem||""}
                  onChange={(event: any, newValue: any) => {
                    // Check if newValue is valid
                    if (newValue && newValue.label) {
                      console.log(newValue?.value);
                      formik.setFieldValue("empName", newValue.label);
                      formik.setFieldValue("empId", newValue.value);
                    } else {
                      // Handle case where newValue is null or invalid
                      formik.setFieldValue("empName", "");
                    }
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() !== "" || value !== null) {
                    }
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectemp_name")}
                          required={true}
                        />
                      }
                    />
                  )}
                  popupIcon={null}
                />
                {/* {formik.touched.vehicleNo && formik.errors.vehicleNo && (
  <div style={{ color: "red", margin: "5px" }}>{formik.errors.vehicleNo}</div>
)} */}
              </Grid>

              <Grid item xs={12}>
                <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
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
                        color: `var(--grid-headerColor)`,
                      }}
                    >
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
                          {t("text.quantity")}
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.approveQuantity")}
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
                        <th
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {t("text.totalAmount")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row: any, index: any) => (
                        <tr key={row.id} style={{ border: "1px solid black" }}>
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
                            }}
                          >
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={itemOption}
                              fullWidth
                              size="small"
                              value={
                                itemOption.find(
                                  (opt: any) => opt.value === row.itemId
                                ) || null
                              }
                              onChange={(e: any, newValue: any) => {
                                if (!newValue) {
                                  return;
                                } else {
                                  handleInputChange(
                                    index,
                                    "itemId",
                                    newValue?.value
                                  );
                                }
                              }}
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
                            }}
                          >
                            <select
                              value={row.unitId}
                              onChange={(e: any) =>
                                handleInputChange(
                                  index,
                                  "unitId",
                                  e.target.value
                                )
                              }
                              style={{ width: "90%", height: "35px" }}
                            >
                              {unitOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {/* <select
                              value={row.unitId}
                              onChange={(e: any) => handleInputChange(index, 'unitId', e.target.value)}
                              style={{ width: '90%', height: '35px' }}
                            >
                              <option value="">{t("text.SelectUnit")}</option>
                              {unitOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select> */}
                          </td>

                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                              width: "10%",
                              height: "35px",
                            }}
                          >
                            <TextField
                              size="small"
                              // type="text"
                              value={row.quantity}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => {
                                e.target.select();
                              }}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                              width: "10%",
                              height: "35px",
                            }}
                          >
                            <TextField
                              size="small"
                              // type="text"
                              value={row.approveQuantity}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "approveQuantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              onFocus={(e) => {
                                e.target.select();
                              }}
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                            />
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10%",
                              height: "35px",
                            }}
                          >
                            <TextField
                              size="small"
                              // type="text"
                              value={row.rate}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "rate",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                              onFocus={(e) => {
                                e.target.select();
                              }}
                            />
                          </td>

                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              width: "10%",
                              height: "35px",
                            }}
                          >
                            <TextField
                              // type="number"
                              value={row.amount.toFixed(2)}
                              size="small"
                              inputProps={{
                                style: { textAlign: "right" },
                                "aria-readonly": true,
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={6}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          {t("text.Totalnetamount")}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          {tableData
                            .reduce(
                              (acc: any, row: any) =>
                                acc + (parseFloat(row.amount) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>{" "}
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <TextField
                  placeholder={t("text.Remark")}
                  onChange={(e) =>
                    formik.setFieldValue("remark", e.target.value)
                  }
                  value={formik.values.remark}
                  style={{
                    width: "100%",
                    height: "auto",
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "16px",
                    resize: "none",
                  }}
                />
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
                  {t("text.update")}
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
        </CardContent>
      </div>
    </div>
  );
};

export default EditStaffIndent;
