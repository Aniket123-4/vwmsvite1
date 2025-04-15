
import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Input,
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
import { getId } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";

import CustomDataGrid from "../../../utils/CustomDatagrid";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ZoneMaster() {
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });


  const { t } = useTranslation();

  useEffect(() => {

    fetchZonesData();
  }, []);


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    const collectData = {

      "id": value.id,
      "name": value.name,
      "email": value.email,
      "password": value.password,
      "host": value.host,
      "port": 0,
      "isTls": true,
      "isSSl": true,

      "srno": 0,
      isActive: event.target.checked,

    };
    console.log("collect Data addUpdate", collectData)
    api.post(`Comm/UpsertEmailSetting`, collectData).then((response) => {
      if (response.data.status === 1) {
        toast.success(response.data.message);
        fetchZonesData();
      } else {
        toast.error(response.data.message);
      }
    });
  };

  const routeChangeEdit = (row: any) => {
    console.log(row);
    formik.setFieldValue("id", row.id);
    formik.setFieldValue("name", row.name);
    formik.setFieldValue("email", row.email);
    formik.setFieldValue("isActive", row.isActive);
    setEditId(row.id);
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
       id :-1,
      };
      const response = await api.post(`Comm/GetAllEmailSetting`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
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

                  <Switch
                    checked={Boolean(params.row.isActive)}
                    style={{
                      color: params.row.isActive ? "green" : "#FE0000",
                    }}
                    onChange={(value: any) =>
                      handleSwitchChange(value, params.row)
                    }
                    inputProps={{
                      "aria-label": "Toggle Switch",
                    }}
                  />
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
            field: "name",
            headerName: t("text.name"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",

          },
          {
            field: "email",
            headerName: t("text.email12"),
            headerClassName: "MuiDataGrid-colCell",
            flex: 1,

          },
          {
            field: "isActive",
            headerName: t("text.Status"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => [
              <Stack direction="row" spacing={1}>
                {params.row.isActive ? (
                  <Chip
                    label={t("text.Active")}
                    color="success"
                    style={{ fontSize: "14px" }}
                  />
                ) : (
                  <Chip
                    label={t("text.InActive")}
                    color="error"
                    style={{ fontSize: "14px" }}
                  />
                )}
              </Stack>,
            ],
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

  const validationSchema = Yup.object({
    name: Yup.string().test(
      "required",
      t("text.reqname"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const requiredFields = ["name"];

  const formik = useFormik({
    initialValues: {
      "id": 0,
      "name": "",
      "email": "",
      "password": "",
      "host": "",
      "port": 0,
      "isTls": true,
      "isSSl": true,
      "isActive": true,
      "srno": 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.id = editId;

      console.log("before submitting value check", values);
      const response = await api.post(`Comm/UpsertEmailSetting`, values);
      if (response.data.isSuccess) {
        formik.setFieldValue("name", "");
        formik.setFieldValue("email", "");
        fetchZonesData();
        toast.success(response.data.message);
        setEditId(-1);
      } else {
        toast.error(response.data.message);
      }
    },
  });

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

 
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

          <Grid item xs={12} container spacing={1}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.Emailsettingmaster")}
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
            <CustomDataGrid
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
