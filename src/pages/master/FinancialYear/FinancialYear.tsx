import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast, ToastContainer } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";
import dayjs from "dayjs";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function FinancialYear() {
  const UserId=getId();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [editId, setEditId] = useState(-1);
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");
  let navigate = useNavigate();

  useEffect(() => {
    // const dataString = localStorage.getItem("userdata");
    // if (dataString) {
    //   const data = JSON.parse(dataString);
    //   if (data && data.length > 0) {
    //     const userPermissionData = data[0]?.userPermission;
    //     if (userPermissionData && userPermissionData.length > 0) {
    //       const menudata = userPermissionData[0]?.parentMenu;
    //       for (let index = 0; index < menudata.length; index++) {
    //         const childMenudata = menudata[index]?.childMenu;
    //         const pathrow = childMenudata.find(
    //           (x: any) => x.path === location.pathname
    //         );
    //         console.log("data", pathrow);
    //         if (pathrow) {
    //           setPermissionData(pathrow);
    //         }
    //       }
    //     }
    //   }
    // }
    fetchZonesData();
    //getCountryName();
  }, [isLoading]);

  //   const getCountryName = () => {
  //     const collectData = {
  //       countryId: -1,
  //     };
  //     api.post(`Country/GetCountryMaster`, collectData).then((res) => {
  //       const arr = [];
  //       //console.log("result" + JSON.stringify(res.data.data));
  //       for (let index = 0; index < res.data.data.length; index++) {
  //         arr.push({
  //           label: res.data.data[index]["countryName"],
  //           value: res.data.data[index]["countryId"],
  //         });
  //       }
  //       setOption(arr);
  //     });
  //   };

  const validationSchema = Yup.object({
    itemType: Yup.string().test(
      "required",
      t("text.reqItemType"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      "fnId": 0,
      "financialYear": "",
      "fromDate": dayjs(defaultValuestime).format("YYYY-MM-DD"),
      "toDate": dayjs(defaultValuestime).format("YYYY-MM-DD"),
      "currentYear": true,
      "createdBy": UserId,
      "updatedBy":UserId ,
      "createdOn": defaultValuestime,
      "updatedOn": defaultValuestime
    },
    validationSchema: Yup.object({
      financialYear: Yup.string().required(
        t("text.reqFinYear")
      ),
    }),
    onSubmit: async (values) => {
      const response = await api.post(
        `FinnacialYear/UpsertFinnacialYear`,
        values
      );
      if (response.data.status === 1) {
        toast.success(response.data.message);
        formik.resetForm();
        fetchZonesData();
        setEditId(-1);
      } else {
        toast.error(response.data.message);
      }
    },
  });

  const requiredFields = ["itemType"];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("fnId", row.fnId);
    formik.setFieldValue("financialYear", row.financialYear);
    formik.setFieldValue("fromDate", dayjs(row.fromDate).format("YYYY-MM-DD"));
    formik.setFieldValue("toDate", dayjs(row.toDate).format("YYYY-MM-DD"));


    setEditId(row.id);
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      "fnId": delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`FinnacialYear/DeleteFinnacialYear`, collectData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
          fetchZonesData();
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

  const fetchZonesData = async () => {
    try {
      const collectData = {
        "fnId": -1
      };
      const response = await api.post(
        `FinnacialYear/GetFinnacialYear`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.fnId,
        fromDate: dayjs(zone.fromDate).format("DD-MM-YYYY"),
        toDate: dayjs(zone.toDate).format("DD-MM-YYYY")
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 150,

            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  {/* {permissionData?.isEdit ? ( */}
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
                  )} */}
                  {/* {permissionData?.isDel ? ( */}
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
                  {/* ) : (
                    ""
                  )} */}
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "financialYear",
            headerName: t("text.FinancialYear"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "fromDate",
            headerName: t("text.fromDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "toDate",
            headerName: t("text.toDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // setLoading(false);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #2B4593 ",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Grid item xs={12} container spacing={2}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.FinancialYear")}
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

          <Stack direction="row" spacing={2} classes="my-2 mb-2"></Stack>
          <ToastContainer />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={3}>
              <Grid xs={12} md={6} lg={6} item>
                <TextField
                  label={<CustomLabel text={t("text.FromDate")} />}
                  value={formik.values.fromDate}
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  placeholder={t("text.FromDate")}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} md={6} lg={6} item>
                <TextField
                  label={<CustomLabel text={t("text.ToDate")} />}
                  value={formik.values.toDate}
                  type="date"
                  name="toDate"
                  id="toDate"
                  placeholder={t("text.ToDate")}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} md={6} lg={6} item>
                <TextField
                  label={<CustomLabel text={t("text.FinancialYear")} required={true} />}
                  value={formik.values.financialYear}
                  name="financialYear"
                  id="financialYear"
                  placeholder={t("text.FinancialYear")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.financialYear && formik.errors.financialYear ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.financialYear}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} md={6} lg={6} item>
                <FormControlLabel
                  control={<Checkbox />}
                  label={t("text.currFinYear")}
                />
              </Grid>

              <Grid item xs={2} sx={{ m: -1 }}>
                {/*  {permissionData?.isAdd == true ? ( */}

                {/* <ButtonWithLoader buttonText={editId == -1 ? t("text.save") : t("text.update")} onClickHandler={handleSubmitWrapper} fullWidth={true} /> */}
                {/* ) : ( */}
                {/*   "" */}
                {/* )} */}

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

          <DataGrids
            isLoading={isLoading}
            rows={zones}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
