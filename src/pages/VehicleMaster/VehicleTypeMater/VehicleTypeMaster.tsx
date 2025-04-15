import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
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
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import DataGrids from "../../../utils/Datagrids";
import dayjs from "dayjs";
import { getId, getISTDate } from "../../../utils/Constant";
import { useFormik } from "formik";
import CustomLabel from "../../../CustomLable";
import TranslateTextField from "../../../TranslateTextField";
import { Language } from "react-transliterate";
import * as Yup from "yup";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function VehicleTypeMaster() {
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const userId = getId();


  useEffect(() => {
    fetchVehicleTypeData();
  }, [isLoading])


  const formik = useFormik({
    initialValues: {
      "vehicleTypeId": 0,
      "vehicleTypename": "",
      "shortName": "",
      "vehicleCode": "",
      "createdBy": userId,
      "updatedBy": "",
      "createdOn": defaultValuestime,
      "updatedOn": defaultValuestime,
      "srno": 0
    },

    validationSchema: Yup.object({
      vehicleTypename: Yup.string()
        .required(t("text.reqVehicleType")),
    }),

    onSubmit: async (values) => {
      const response = await api.post(`Master/UpsertVehicleType`, values);
      if (response.data.status === 1) {
        formik.resetForm();
        setToaster(false);
        toast.success(response.data.message);
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
      fetchVehicleTypeData();
    }
  });

  const handleEdit = (row: any) => {
    console.log(row);
    formik.setFieldValue("vehicleTypeId", row.vehicleTypeId);
    formik.setFieldValue("vehicleTypename", row.vehicleTypename);
    formik.setFieldValue("vehicleCode", row.vehicleCode);
    formik.setFieldValue("shortName", row.shortName);
    formik.setFieldValue("updatedBy", userId);
    formik.setFieldValue("createdBy", row.createdBy);
    formik.setFieldValue("updatedOn", defaultValuestime);
  }

  let delete_id = "";
  let delete_name = "";
  const accept = () => {
    const collectData = {
      "vehicleTypeId": delete_id,
      "vehicleTypename": delete_name,
      "shortName": "",
      "vehicleCode": "",
      "createdBy": "adminvm",
      "updatedBy": "adminvm",
      "createdOn": defaultValuestime,
      "updatedOn": defaultValuestime,
      "srno": 0
    }
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`Master/DeleteVehicleType`, collectData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.success(response.data.message);
        }
        fetchVehicleTypeData();
      });
  };
  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (row: any) => {
    delete_id = row.vehicleTypeId;
    delete_name = row.vehicleTypename;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };

  const fetchVehicleTypeData = async () => {
    try {
      const response = await api.get(
        `Master/GetVehicleType?VehicleTypeId=-1`,
        //{ headers: { "vehicleTypeId": -1 } }
      );
      const data = response.data.data;
      const arr = data.map((Item: any, index: any) => ({
        ...Item,
        serialNo: index + 1,
        id: Item.vehicleTypeId,
      }));
      setItem(arr);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 100,

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
                    onClick={() => handleEdit(params.row)}
                  />
                  <DeleteIcon
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handledeleteClick(params.row);
                    }}
                  />
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: .3,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "vehicleTypename",
            headerName: t("text.VehicleTypeName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "vehicleCode",
            headerName: t("text.Vehiclecode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "shortName",
            headerName: t("text.ShortName"),
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


  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop: "3vh"
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
              fontWeight: 900
            },
          }}
          style={{ padding: "10px", }}
        >
          <ConfirmDialog />

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.VehicleTypeMaster")}
          </Typography>
          <Divider />

          <Box height={10} />

          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>

              {/* vehicle type name */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterVehType")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="vehicleTypename"
                  id="vehicleTypename"
                  value={formik.values.vehicleTypename}
                  placeholder={t("text.EnterVehType")}
                  onChange={(e) => {
                    formik.setFieldValue("vehicleTypename", e.target.value);
                  }}
                />
                {formik.touched.vehicleTypename && formik.errors.vehicleTypename && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.vehicleTypename}</div>
                )}
              </Grid>


              {/* vehicle code */}
              <Grid item xs={12} sm={4} lg={4}>
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
                  name="vehicleCode"
                  id="vehicleCode"
                  value={formik.values.vehicleCode}
                  placeholder={t("text.EnterVehCode")}
                  onChange={(e) => {
                    formik.setFieldValue("vehicleCode", e.target.value);
                  }}
                />
              </Grid>

              {/* vehicle short name */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterShortName")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="shortName"
                  id="shortName"
                  value={formik.values.shortName}
                  placeholder={t("text.EnterShortName")}
                  onChange={(e) => {
                    formik.setFieldValue("shortName", e.target.value);
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
                  {t("text.save")}
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
          <DataGrids
            isLoading={isLoading}
            rows={item}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />
        </Paper>
      </Card >
      <ToastApp />

    </>
  );
}

