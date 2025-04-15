
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from "../../../utils/Url";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  height: "90vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  overflowX: "auto",
};

function createData(
  srno: number,
  id: string,
  name: string
  // rolePermission: string
): any {
  return { srno, id, name };
}

function childMenuCreateData(


  // "userId": "",
  //     "menuId": 2,
  //     "parentId": 1,
  //     "isAdd": true,
  //     "isEdit": true,
  //     "isDel": true,
  //     "isView": true,
  //     "isPrint": true,
  //     "isExport": true,
  //     "isRelease": true,
  //     "isPost": false,
  //     "menuName": "",
  //     "parentMenuName": "",
  //     "path": "",
  //     "icon": "",
  //     "displayNo": 0,
  //     "parentDisplayNo": 0
  //userId:any,    
  userId: any,
  menuId: string,
  menuName: string,
  parentId: number,
  isAdd: boolean,
  isEdit: boolean,
  isDel: boolean,
  isView: boolean,
  isPrint: boolean,
  isExport: boolean,
  isRelease: boolean,
  isPost: boolean,
  // parentMenuName:string,
  // path:any,
  // icon:any,
  // displayNo: number,
  // parentDisplayNo: number

): any {
  return {
    // userId,
    userId,
    menuId,
    menuName,
    parentId,
    isAdd,
    isEdit,
    isDel,
    isView,
    isPrint,
    isExport,
    isRelease,
    isPost,
    // parentMenuName,
    // path,
    // icon,
    // displayNo,
    // parentDisplayNo,
  };
}

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function UserPermissionMaster() {

  const [roleOption, setRoleOption] = useState([
    { value: "-1", label: "Select Role Name" },
  ]);
  const [empOption, setempOption] = useState([
    { value: -1, label: ("text.empid"), deptId: -1, desgId: -1, deptName: "", desgName: "" },
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<any>([]);
  const [records, setRecords] = useState(rows);
  const [childMenuRecords, setChildMenuRecords] = useState(rows);
  const [enteredrolename, setEnteredrolename] = useState("");
  const [editID, setEditID] = useState("-1");
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { defaultValues } = getISTDate();

  function handleFilter(event: any) {
    const newRows = rows.filter((rowss: { roleName: string }) => {
      return rowss.roleName
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setRecords(newRows);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const nameChangeHandler = (event: any) => {
    setEnteredrolename(event.target.value);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getroleData = () => {

    api
      .get(`Auth/GetRoles`,)
      .then((res) => {
        const arr = [];
        console.log("GetRoleMaster" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["name"],
            value: res.data.data[index]["id"],
          });
        }
        setRoleOption(arr);
      });
  };


  const getempData = async () => {
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
        deptId: data[index]["empDeptId"],
        desgId: data[index]["empDesignationId"],
        deptName: data[index]["departmentName"],
        desgName: data[index]["designationName"]
      });
    }
    setempOption(arr);
  };
  useEffect(() => {
    getroleData();
    getempData();
  }, []);


  // const validationSchema = Yup.object({
  //   "registerModel.password": Yup.string()
  //     .min(12, `Password should have minimum 6 characters`)
  //     .required(t("text.reqPassword"))
  //   // .test("len", "Password should have minimum 6 characters", (val: any) =>
  //   //   (val.length() >= 6) ? true : false
  //   // ),
  // });
  // // const validationSchema = Yup.object({
  // //   password: Yup.string().test(
  // //     "required",
  // //     t("text.reqname"),
  // //     function (value: any) {
  // //       return value && value.length() >= 6 ? value : "";
  // //     }
  // //   ),
  // // });


  const formik = useFormik({
    initialValues: {
      "empid": 0,
      "empName": "",
      // "empCode": "",
      // "empPerAddress": "",
      // "empLocalAddress": "",
      // "empFatherName": "",
      // "empspauseName": "",
      // "empMotherName": "",
      // "empMobileNo": "",
      // "empStatus": "",
      // "empPanNumber": "",
      // "empAddharNo": "",
      // "empDob": defaultValues,
      // "empJoiningDate": defaultValues,
      // "empretirementDate": defaultValues,
      // "empDesignationId": 0,
      // "empDeptId": 0,
      // "empStateId": 0,
      // "empCountryID": 0,
      // "empCityId": 0,
      // "empPincode": 0,
      // "createdBy": "",
      // "updatedBy": "",
      // "createdOn": defaultValues,
      // "updatedOn":defaultValues,
      "userId": "",
      "roleId": "",
      // "imageFile": "",
      // "signatureFile": "",
      // "email": "",
      // "dlno": "",
      // "gender": "",
      // "departmentName": "",
      // "designationName": "",
      // "empStateName": "",
      // "empCountryName": "",
      // "empCityName": "",
      // "srno": 0,
      // "empDepName": "",
      "registerModel": {
        "id": "",
        "username": "",
        "email": "user@example.com",
        "password": "",
        "role": ""
      },
      "userPermission": [],
      "checked": true,

    },
    //validationSchema: validationSchema,

    // validationSchema: Yup.object({
    //   password: Yup.string()
    //     .required(t("text.reqPassword"))
    // }),


    onSubmit: async (values: any) => {
      values.userPermission = childMenuRecords;
      if (editID !== "-1") {
        values.roleId = editID; // Include the roleId for updating
      }
      if (values.registerModel.password.length < 6) {
        toast.error("Password should have minimum 6 characters");
        return;
      }
      const response = await api.post(`Employee/UpsertEmpPermission`, values);
      if (response.data.status === 1) {
        toast.success(response.data.message);
        navigate("/admin/userpremission");
        formik.resetForm();
        getModalList();
        setOpen(false);
        getList();
      } else {
        toast.error(response.data.message);
      }
    },

  });

  //  const requiredFields = ["roleName"];
  useEffect(() => {
    getList();
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setEnteredrolename("");
    setEditID("-1");
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    //getModalList();
  };

  const getList = () => {
    api.get("Auth/GetRoles").then((res) => {
      const arr = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push(
          createData(
            index + 1,
            res.data.data[index]["id"],
            res.data.data[index]["name"]
            //res.data.data[index]["rolePermission"]
          )
        );
      }
      // console.log(arr);
      setRows(arr);
      setRecords(arr);
      // console.log(records);
      setIsLoading(false);
    });
  };

  const getModalList = (userId: any = -1, roleId: any = -1) => {


    const collectData = {
      RoleId: -1,
    };

    api.post(`Auth/GetUserPermissionRole?UserId=${userId}&RoleId=${roleId}`, { params: collectData }).then((res) => {
      const arr = [];

      for (let index = 0; index < res.data.data.length; index++) {
        arr.push(
          childMenuCreateData(
            "-1",

            res.data.data[index]["menuId"],
            res.data.data[index]["menuName"],
            res.data.data[index]["parentId"],

            res.data.data[index]["isAdd"],
            res.data.data[index]["isEdit"],
            res.data.data[index]["isDel"],
            res.data.data[index]["isView"],
            res.data.data[index]["isPrint"],
            res.data.data[index]["isExport"],
            res.data.data[index]["isRelease"],
            res.data.data[index]["isPost"]
          )
        );
      }

      setRows(arr);
      setChildMenuRecords(arr);

    });
  };

  const findArrayElementByTitle = (array: any[], title: any) => {
    return array.find((element) => {
      return element.id === title;
    });
  };

  const routeChangeEdit = (row: any) => {

    console.log(row.roleName);


    setEditID(row.id);
    setOpen(true);

    formik.setFieldValue("roleName", row.name);

  };


  let navigate = useNavigate();

  const handleSelectAll = (value: string, evnt: any) => {

    if (value == "isAdd") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isAdd: evnt,
        }))
      );
    } else if (value == "isEdit") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isEdit: evnt,
        }))
      );
    } else if (value == "isDel") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isDel: evnt,
        }))
      );
    } else if (value == "isView") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isView: evnt,
        }))
      );
    } else if (value == "isPrint") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isPrint: evnt,
        }))
      );
    } else if (value == "isExport") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isExport: evnt,
        }))
      );
    } else if (value == "isRelease") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isRelease: evnt,
        }))
      );
    } else if (value == "isPost") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isPost: evnt,
        }))
      );
    }
  };

  const handleCheckboxChange = (id: any, header: string) => {
    if (header == "isAdd") {

      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isAdd: !item.isAdd } : item
        )
      );
    } else if (header == "isEdit") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isEdit: !item.isEdit } : item
        )
      );
    } else if (header == "isDel") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isDel: !item.isDel } : item
        )
      );
    } else if (header == "isView") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isView: !item.isView } : item
        )
      );
    } else if (header == "isPrint") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isPrint: !item.isPrint } : item
        )
      );
    } else if (header == "isExport") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isExport: !item.isExport } : item
        )
      );
    } else if (header == "isRelease") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isRelease: !item.isRelease } : item
        )
      );
    } else if (header == "isPost") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === id ? { ...item, isPost: !item.isPost } : item
        )
      );
    }
  };
  const numberToBoolean = (num: any) => {
    return num !== 0;
  };

  // const columns = [
  //   {
  //     field: "action",
  //     headerClassName: "MuiDataGrid-colCell",
  //     headerName: t("text.Action"),
  //     minWidth: 150,
  //     renderCell: (params: any) => (
  //       <Stack spacing={2} direction="row">
  //         <EditIcon
  //           style={{
  //             fontSize: "20px",
  //             color: "blue",
  //             cursor: "pointer",
  //           }}
  //           onClick={() => routeChangeEdit(params.row)}
  //         />

  //       </Stack>
  //     ),
  //   },

  //   {
  //     field: "name",
  //     headerName: t("text.RoleName"),
  //     flex: 1,
  //     headerClassName: "MuiDataGrid-colCell",
  //   },
  // ];

  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            "& .MuiDataGrid-colCell": {
              backgroundColor: `var(--grid-headerBackground)`,
              color: `var(--grid-headerColor)`,
              fontSize: 17,
              fontWeight: 900,
            },
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.UserPermissionMaster")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">

            {/* <Button
              onClick={handleOpen}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{ backgroundColor: `var(--header-background)` }}
            >
              {t("text.add")}
            </Button> */}

          </Stack>
          {/* {isLoading ? (
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
            <Box>
              <br />
              <div
                style={{
                  width: "100%",
                  backgroundColor: `var(--grid-background)`,
                }}
              >
                 <DataGrid
                  rows={records}
                  columns={columns}
                  autoHeight
                  slots={{
                    toolbar: GridToolbar,
                  }}
                  rowSpacingType="border"
                  pagination={true}
                  pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                    value: size,
                    label: `${size}`,
                  }))}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                /> 
              </div>
            </Box>
          )} */}
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* <Grid md={5} item>
                <TextField
                  type="text"
                  value={formik.values.roleName}
                  label={
                    <span>
                      {t("text.enterRoleName")}{" "}
                      {requiredFields.includes("roleName") && (
                        <span
                          style={{
                            color: formik.values.roleName ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="roleName"
                  id="roleName"
                  style={{ marginBottom: "10px" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.roleName && formik.errors.roleName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.roleName)}
                  </div>
                ) : null}
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empName", newValue?.label);
                    formik.setFieldValue("empid", newValue?.value);

                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.selectempname")} />}
                    />
                  )}
                />
              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.Username")} required={true} />}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="registerModel.username"
                  id="registerModel.username"
                  value={formik.values.registerModel.username}
                  placeholder={t("text.Username")}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.password")} required={true} />}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="password"
                  id="password"
                  value={formik.values.registerModel.password}
                  placeholder={t("text.Password")}
                  onChange={(e) => {
                    formik.setFieldValue("registerModel.password", e.target.value)
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.values.registerModel.password && formik.touched.password && formik.errors.password && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.password.toString()}</div>
                )}

              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={roleOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    //formik.setFieldValue("role", newValue?.label);
                    formik.setFieldValue("roleId", newValue?.value);
                    formik.setFieldValue("registerModel.role", newValue?.label);
                    getModalList(formik.values?.userId || "-1", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.role")} />}
                    />
                  )}
                />
              </Grid>



              <Grid item lg={3} sm={3}>
                <Grid>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: `var(--header-color)`,
                      marginBottom: "10px",
                      marginTop: "3px",
                    }}
                  >
                    {editID == "-1" ? t("text.save") : t("text.update")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item lg={3} sm={3}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginBottom: "10px",
                    marginTop: "3px",
                  }}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    formik.resetForm();
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid md={12} item>
                <TableContainer sx={{ maxHeight: "65vh" }}>
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead style={{ position: "sticky" }}>
                      <tr
                        style={{
                          border: "1px solid black",
                          fontSize: "2.7vh",
                          fontWeight: "500",
                          backgroundColor: `var(--header-background)`,
                          color: `var(--header-color)`,
                          textAlign: "center",
                        }}
                      >
                        <td>{t("text.MenuName")}</td>
                        <td>
                          {t("text.Add1")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isAdd
                            )}
                            onChange={(e) =>
                              handleSelectAll("isAdd", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Edit")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isEdit
                            )}
                            onChange={(e) =>
                              handleSelectAll("isEdit", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.delete")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isDel
                            )}
                            onChange={(e) =>
                              handleSelectAll("isDel", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.View1")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isView
                            )}
                            onChange={(e) =>
                              handleSelectAll("isView", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Print")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isPrint
                            )}
                            onChange={(e) =>
                              handleSelectAll("isPrint", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Export")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isExport
                            )}
                            onChange={(e) =>
                              handleSelectAll("isExport", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Release")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isRelease
                            )}
                            onChange={(e) =>
                              handleSelectAll("isRelease", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Post")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isPost
                            )}
                            onChange={(e) =>
                              handleSelectAll("isPost", e.target.checked)
                            }
                          />
                        </td>
                      </tr>
                    </thead>
                    <tbody style={{ color: "#000000" }}>
                      {childMenuRecords.map(
                        (rows: any, key: string | number) => {
                          console.log(childMenuRecords);
                          return (
                            <>
                              {
                                <tr
                                  style={{
                                    border: "1px solid black",
                                    fontSize: "2.7vh",

                                  }}
                                >

                                  <td style={{ padding: "10px" }}>
                                    {rows.menuName}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isAdd"
                                        )
                                      }

                                      checked={
                                        childMenuRecords[key]["isAdd"]
                                          ? true
                                          : false
                                      }
                                      name="isAdd"
                                      className="isAdd"
                                    />
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isEdit"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isEdit"]
                                          ? true
                                          : false
                                      }
                                      name="isEdit"
                                      className="isEdit"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isDel"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isDel"]
                                          ? true
                                          : false
                                      }
                                      name="isDel"
                                      className="isDel"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isView"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isView"]
                                          ? true
                                          : false
                                      }
                                      name="isView"
                                      className="isView"
                                    />
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isPrint"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isPrint"]
                                          ? true
                                          : false
                                      }
                                      name="isPrint"
                                      className="isPrint"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isExport"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isExport"]
                                          ? true
                                          : false
                                      }
                                      name="isExport"
                                      className="isExport"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isRelease"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isRelease"]
                                          ? true
                                          : false
                                      }
                                      name="isRelease"
                                      className="isRelease"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isPost"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isPost"]
                                          ? true
                                          : false
                                      }
                                      name="isPost"
                                      className="isPost"
                                    />
                                  </td>
                                </tr>
                              }
                            </>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </TableContainer>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Card>

      <Modal open={open} style={{ height: "600px" }}>
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 10,
              top: 8,
              color: (theme) => theme.palette.grey[900],
            }}
          >
            <CloseIcon />
          </IconButton>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* <Grid md={5} item>
                <TextField
                  type="text"
                  value={formik.values.roleName}
                  label={
                    <span>
                      {t("text.enterRoleName")}{" "}
                      {requiredFields.includes("roleName") && (
                        <span
                          style={{
                            color: formik.values.roleName ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="roleName"
                  id="roleName"
                  style={{ marginBottom: "10px" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.roleName && formik.errors.roleName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.roleName)}
                  </div>
                ) : null}
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={empOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empName", newValue?.label);
                    formik.setFieldValue("empid", newValue?.value);

                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.selectempname")} />}
                    />
                  )}
                />
              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.Username")} required={true} />}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="registerModel.username"
                  id="registerModel.username"
                  value={formik.values.registerModel.username}
                  placeholder={t("text.Username")}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.password")} required={true} />}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="password"
                  id="password"
                  value={formik.values.registerModel.password}
                  placeholder={t("text.Password")}
                  onChange={(e) => {
                    formik.setFieldValue("registerModel.password", e.target.value)
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.values.registerModel.password.length < 6 && formik.touched.password ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {t("Password should have minimum 6 characters")}
                  </div>
                ) : null}

              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={roleOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    //formik.setFieldValue("role", newValue?.label);
                    formik.setFieldValue("roleId", newValue?.value);
                    formik.setFieldValue("registerModel.role", newValue?.label);
                    getModalList(formik.values?.userId || "-1", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.role")} />}
                    />
                  )}
                />
              </Grid>



              <Grid item lg={3} sm={3}>
                <Grid>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: `var(--header-color)`,
                      marginBottom: "10px",
                      marginTop: "3px",
                    }}
                  >
                    {editID == "-1" ? t("text.save") : t("text.update")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item lg={3} sm={3}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginBottom: "10px",
                    marginTop: "3px",
                  }}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    formik.resetForm();
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid md={12} item>
                <TableContainer sx={{ maxHeight: "65vh" }}>
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead style={{ position: "sticky" }}>
                      <tr
                        style={{
                          border: "1px solid black",
                          fontSize: "2.7vh",
                          fontWeight: "500",
                          backgroundColor: `var(--header-background)`,
                          color: `var(--header-color)`,
                          textAlign: "center",
                        }}
                      >
                        <td>{t("text.MenuName")}</td>
                        <td>
                          {t("text.add")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isAdd
                            )}
                            onChange={(e) =>
                              handleSelectAll("isAdd", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Edit")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isEdit
                            )}
                            onChange={(e) =>
                              handleSelectAll("isEdit", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.delete")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isDel
                            )}
                            onChange={(e) =>
                              handleSelectAll("isDel", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.View")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isView
                            )}
                            onChange={(e) =>
                              handleSelectAll("isView", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Print")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isPrint
                            )}
                            onChange={(e) =>
                              handleSelectAll("isPrint", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Export")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isExport
                            )}
                            onChange={(e) =>
                              handleSelectAll("isExport", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Release")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isRelease
                            )}
                            onChange={(e) =>
                              handleSelectAll("isRelease", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Post")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.isPost
                            )}
                            onChange={(e) =>
                              handleSelectAll("isPost", e.target.checked)
                            }
                          />
                        </td>
                      </tr>
                    </thead>
                    <tbody style={{ color: "#000000" }}>
                      {childMenuRecords.map(
                        (rows: any, key: string | number) => {
                          console.log(childMenuRecords);
                          return (
                            <>
                              {
                                <tr
                                  style={{
                                    border: "1px solid black",
                                    fontSize: "2.7vh",

                                  }}
                                >

                                  <td style={{ padding: "10px" }}>
                                    {rows.menuName}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isAdd"
                                        )
                                      }

                                      checked={
                                        childMenuRecords[key]["isAdd"]
                                          ? true
                                          : false
                                      }
                                      name="isAdd"
                                      className="isAdd"
                                    />
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isEdit"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isEdit"]
                                          ? true
                                          : false
                                      }
                                      name="isEdit"
                                      className="isEdit"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isDel"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isDel"]
                                          ? true
                                          : false
                                      }
                                      name="isDel"
                                      className="isDel"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isView"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isView"]
                                          ? true
                                          : false
                                      }
                                      name="isView"
                                      className="isView"
                                    />
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isPrint"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isPrint"]
                                          ? true
                                          : false
                                      }
                                      name="isPrint"
                                      className="isPrint"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isExport"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isExport"]
                                          ? true
                                          : false
                                      }
                                      name="isExport"
                                      className="isExport"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isRelease"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isRelease"]
                                          ? true
                                          : false
                                      }
                                      name="isRelease"
                                      className="isRelease"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.menuId,
                                          "isPost"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["isPost"]
                                          ? true
                                          : false
                                      }
                                      name="isPost"
                                      className="isPost"
                                    />
                                  </td>
                                </tr>
                              }
                            </>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </TableContainer>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <ToastApp />
    </>
  );
}
