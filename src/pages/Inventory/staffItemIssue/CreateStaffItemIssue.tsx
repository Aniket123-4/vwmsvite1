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
  AutocompleteRenderInputParams,
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

const CreateStaffItemIssue = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [isIndentSelected, setIsIndentSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [items, setItems] = useState<any>([]);
  const [itemValue, setItemValue] = useState<any>();
 // const [IsbatchNO, setBatchno] = useState("");
  //const [tableData, setTableData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([
    {
      id: 0,
      issueId: 0,
      itemID: 0,
      unitId: 0,
      batchNo: "",
      indentId: 0,
      reqQty: 0,
      issueQty: 0,
      itemName: "",
      unitName: "",
      returnItem: true,
      indentNo: "",
      stockQty: 0,
    },
  ]);
  console.log("🚀 ~ CreateStaffItemreturn ~ tableData:", tableData);
  const [indentOptions, setIndentOptions] = useState([
     { value: -1, label: t("text.SelectindentNo"), indenttype: "" },
   ]);
  const [itemOption, setitemOption] = useState<
    { value: number; label: string; unitId?: number }[]
  >([{ value: -1, label: t("text.itemMasterId") }]);
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
    GetempData();
    // getBATCHNo();
  }, []);

  // const getBATCHNo = async () => {
  //   try {
  //     const response = await api.get(`QualityCheck/GetMaxBatchNo`);
  //     if (response?.data?.status === 1 && response?.data?.data?.length > 0) {
  //       setBatchno(response.data.data[0].batchNo);
  //     } else {
  //       toast.error(response?.data?.message || "Failed to fetch batch number");
  //       return ""; // Return empty if no batch number is found
  //     }
  //   } catch (error) {
  //     toast.error("Error fetching batch number");
  //     return ""; // Return empty in case of an error
  //   }
  // };
  const GetIndentID = async () => {
    const collectData = {
      indentId: -1,
      indentNo: "",
      empId: -1,
    };

    const response = await api.post(`Master/GetIndent`, collectData);
    const data = response.data.data;
    console.log("indent option", data);
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["indentNo"],
        value: data[index]["indentId"],
        empId: data[index]["empId"],
        empName: data[index]["empName"],
        indenttype: data[index]["indenttype"],
      });
    }
    setIndentOptions(arr);
  };


  const GetIndentIDById = async (itemID: any) => {
    try {
      const collectData = { indentId: itemID, issueType: "JobCard" };
      const response = await api.post(`ItemIssue/GetItemOnIndent`, collectData);
  
      if (!response.data || response.data.data === null) {
        toast.error("Please add item");
        setTableData([]); // Clear table data if response is null
        return;
      }
  
      const data = response?.data?.data?.itemIssueDetail;
      if (!Array.isArray(data)) {
        console.warn("Invalid indent data received:", data);
        setTableData([]);
        return;
      }
  
      const indent = data.map((item: any, index: any) => ({
        id: index,
        issueId: -1,
        itemID: item?.itemID || 0,
        unitId: item?.unitId || 0,
        indentId: item?.indentId || 0,
        reqQty: item?.reqQty || 0,
        itemName: item?.itemName || "",
        unitName: item?.unitName || "",
        returnItem: true,
        stockQty: item?.stockQty || 0,
        issueQty: item?.issueQty || 0,
        batchNo: item?.batchNo || "",
        indentNo: "",
      }));
  
      setTableData(indent);
      setIsIndentSelected(true);
    } catch (error) {
      console.error("Error fetching indent data:", error);
      setTableData([]);
      toast.error("Failed to fetch item data");
    }
  };
  // const GetIndentIDById = async (itemID: any) => {
  //   const collectData = {
  //     indentId: itemID,

  //     //indentId: -1,
  //     indentNo: "",
  //     empId: -1,
  //   };
  //   const response = await api.post(`Master/GetIndent`, collectData);
  //   const data = response.data.data[0]["indentDetail"];

  //   console.log("indent option", data);
  //   // let arr: any = [];

  //   const indent = data.map((item: any, index: any) => ({
  //     id: index + 1,
  //     issueId: -1,
  //     itemID: item?.itemId,
  //     unitId: item?.unitId,
  //     // batchNo: item?.batchNo,
  //     indentId: item?.indentId,
  //     // stockQty: item?.approveQuantity,
  //     reqQty: item?.approveQuantity,
  //     //  "amount" : item?.amount,
  //     itemName: item?.itemName,
  //     unitName: item?.unitName,
  //     indentNo: "",
  //     srn: 0,
  //     // "unitName": "",
  //     returnItem: true,
  //     stockQty: 0,
  //     issueQty: 0,
  //     batchNo: IsbatchNO || "",
  //   }));

  //   setTableData(indent);
  //   setIsIndentSelected(true);
  // };

  console.log("check table", tableData);

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
        unitId: data[index]["unitId"],
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
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOptions(arr);
  };
  const GetempData = async () => {
    const collectData = {
      empid: -1,
      userId: "",
    };
    const response = await api.post(`Employee/GetEmployee`, collectData);
    const data = response.data.data;
    console.log("data", data);
    const arr = data.map((item: any) => ({
      label: item?.empName,
      value: item?.empid,
    }));
    // for (let index = 0; index < data.length; index++) {
    //   arr.push({
    //     label: data[index]["empName"],
    //     value: data[index]["empId"],
    //   });
    // }
    setempOption(arr);
  };

  const handleActionChange = (event: any) => {
    setSelectedAction(event.target.value);
  };

  const validateRow = (row: any) => {
    // return row.itemName && row.unitId && row.reqQty >= 1;
  };

  const formik = useFormik({
    initialValues: {
      issueId: 0,
      issueDate: defaultValues,
      indentId: 0,
      issueLocation: "",
      issueType: "staff",
      vehicleitem: -1,
      empId: null,
      createdBy: "adminvm",
      updatedBy: "adminvm",
      createdOn: defaultValues,
      updatedOn: defaultValues,
      indentNo: "",
      empName: "",
      vehicleNo: "",
      srn: 0,
      jobId: 0,
      jobCardNo: "",
      itemIssueDetail: [],
    },

    validationSchema: Yup.object({
      indentNo: Yup.string().required(t("text.reqIndentNum")),
      //empId: Yup.string().required(t("text.reqEmpName")),
    }),
    onSubmit: async (values) => {
      if (!tableData || tableData.length === 0) {
        toast.error("Please add item");
        return; // Stop form submission
      }
    
      values.itemIssueDetail = tableData;
      const response = await api.post(`ItemIssue/UpsertItemIssue`, values);
    
      if (response.data.mesg === null) {
        toast.error("Please add item");
        return; // Stop further execution
      }
    
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/storemanagement/itemissue/staffitemissue");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    }
    // onSubmit: async (values) => {
    //   const validTableData = tableData;
    //   values.itemIssueDetail = tableData;

    //   // if (validTableData.length === 0) {
    //   //     toast.error("Please add some data in table for further process");
    //   //     return;
    //   // }

    //   const response = await api.post(`ItemIssue/UpsertItemIssue`, values);

    //   if (response.data.status === 1) {
    //     setToaster(false);
    //     toast.success(response.data.message);
    //     navigate("/Inventory/StaffItemIssue");
    //   } else {
    //     setToaster(true);
    //     toast.error(response.data.message);
    //   }
    // },
  });

  const handleInputChange = async (index: any, field: any, value: any) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    if (field === "itemId") {
      const selectedItem = itemOption.find((item) => item.value === value);
      updatedData[index].itemId = selectedItem?.value || 0;
      updatedData[index].unitId = selectedItem?.unitId || 0; // Automatically set unitId

      console.log("Selected Item:", selectedItem);
    } else {
      updatedData[index][field] = value;
    }
    if (field === "reqQty" || field === "issueQty") {
      updatedData[index].stockQty =
        updatedData[index].reqQty - updatedData[index].issueQty;

      // console.log("stockQty",updatedData[index].stockQty, updatedData[index].reqQty,updatedData[index].issueQty)
    } else if (field === "reqQty") {
      updatedData[index].reqQty = parseInt(value);
    } else if (field === "issueQty") {
      updatedData[index].issueQty = parseInt(value);
    }
 //   const batchNo = await getBATCHNo();
    if (field === "batchNo") {
      updatedData[index].batchNo = parseInt(value);
    }
    // if (batchNo) {
    //   item.batchNo = batchNo; // Set the fetched batch number
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
        unitId: 0,
        batchNo: "",
        indentId: 0,
        reqQty: 0,
        issueQty: 0,
        itemName: "",
        unitName: "",
        returnItem: true,
        indentNo: "",
        stockQty: 0,
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
                {t("text.createStaffItemIssue")}
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
                  options={
                    
                    indentOptions.filter((e:any) =>
                    {
                      if(e.indenttype === "Staff")
                      {
                        return e;
                      }
                    })}
                  value={
                    indentOptions.find(
                      (opt: any) => opt.value === formik.values.indentId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log("check value", newValue);
                    if (newValue) {
                      GetIndentIDById(newValue?.value);
                      formik.setFieldValue("indentId", newValue?.value);
                      formik.setFieldValue(
                        "indentNo",
                        newValue?.label?.toString() || ""
                      );
                      formik.setFieldValue("empId", newValue?.empId);
                      formik.setFieldValue(
                        "empName",
                        newValue?.empName?.toString() || ""
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
                {(!formik.values.indentId) && formik.touched.indentNo && formik.errors.indentNo && (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.indentNo}
                  </div>
                )}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  disabled
                  value={
                    empOption.find(
                      (opt: any) => opt.value === formik.values.empId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectemp_name")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
                {/* {formik.touched.empId && formik.errors.empId && (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.empId}
                  </div>
                )} */}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="issueDate"
                  name="issueDate"
                  label={
                    <CustomLabel text={t("text.issueDate")} required={false} />
                  }
                  value={formik.values.issueDate}
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
                  <div style={{ overflowX: "scroll", margin: 0, padding: 0 }}>
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
                            {t("text.reqQty")}
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            {t("text.issueQty")}
                          </th>
                        
  
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row: any, index: any) => (
                          <tr
                            key={row.id}
                            style={{ border: "1px solid black" }}
                          >
                          
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
                                value={
                                 
                                   row.itemName
                                }
                                fullWidth
                                size="small"
                                sx={{ width: "175px" }}
                              
                                onChange={(e: any, newValue: any) => {
                                  if (!newValue) {
                                    return;
                                  } else {
                                    handleInputChange(
                                      index,
                                      "itemID",
                                      newValue?.value
                                    );
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
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
                                onChange={(e: any) => handleInputChange(index, 'unitId', e.target.value)}
                                style={{ width: '95%', height: '35px' }}
                              >
                              
                                {unitOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                      
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                textAlign: "center",
                                padding: "5px",
                              }}
                            >
                              <TextField
                                value={row.batchNo || ""} // Bind to row.batchNo
                                id="BatchNo"
                                name="BatchNo"
                                size="small"
                                sx={{ width: "150px" }}
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
                                value={row.stockQty}
                                onChange={(e) => handleInputChange(index, 'stockQty', parseInt(e.target.value))}
                                onFocus={(e) => {
                                  e.target.select();
                                }}
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
                                //type="number"
                                size="small"
                                // type="text"
                                value={row.reqQty}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "reqQty",
                                    e.target.value
                                  )
                                }
                                onFocus={(e) => {
                                  e.target.select();
                                }}
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
                                    e.target.value
                                  )
                                }
                                onFocus={(e) => {
                                  e.target.select();
                                }}
                              />
                            </td>
                         
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>{" "}
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
                        issueId: 0,
                        itemID: 0,
                        unitId: 0,
                        batchNo: "",
                        indentId: 0,
                        reqQty: 0,
                        issueQty: 0,
                        itemName: "",
                        unitName: "",
                        returnItem: true,
                        indentNo: "",
                        stockQty: 0,
                      },
                    ]); // Reset table data
                    setItemValue(null); // Reset Autocomplete selection
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

export default CreateStaffItemIssue;
