

import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Autocomplete,
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

export default function Store() {
  const UserId =getId();
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  const [option, setOption] = useState([
    { value: "-1", label: t("text.binId") },
  ]);

  useEffect(() => {
    fetchVehicleTypeData();
    GetBinData()
  }, [isLoading])

  const GetBinData = async () => {
    const collectData = {
      binId: -1,
    };
    const response = await api.post(`StockBin/GetStockBin`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["binName"],
        value: data[index]["binId"],
      });
    };
    setOption(arr);
  };
  const formik = useFormik({
    initialValues: {
      sno: 0,
      storeId: 0,
      storeName: "",
      storeCode: "",
      binId: 0,
      createdBy: UserId,
      updatedBy: UserId,
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      binName: "",
    },

    validationSchema: Yup.object({
      storeName: Yup.string()
        .required(t("text.reqStoreName")),
    }),

    onSubmit: async (values) => {
      const response = await api.post(`StoreMaster/UpsertStore`, values);
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
    formik.setFieldValue("storeId", row.storeId);
    formik.setFieldValue("storeName", row.storeName);
    formik.setFieldValue("storeCode", row.storeCode);
    formik.setFieldValue("binId", row.binId);
    formik.setFieldValue("binName", row.binName);
  }

  let delete_id = "";
  let delete_name = "";
  const accept = () => {
    const collectData = {
      storeId: delete_id
    }
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`StoreMaster/DeleteStore`, collectData)
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
    delete_id = row.storeId;
    //delete_name = row.vehicleTypename;
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
      const collectData = {
        storeId: -1,
      };
      const response = await api.post(
        `StoreMaster/GetStore`, collectData
        //{ headers: { "vehicleTypeId": -1 } }
      );
      const data = response.data.data;
      const arr = data.map((Item: any, index: any) => ({
        ...Item,
        serialNo: index + 1,
        id: Item.storeId,
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
            field: "storeName",
            headerName: t("text.storeName"),
            flex: 1,
          },

          {
            field: "storeCode",
            headerName: t("text.StoreCode1"),
            flex: 1,
          },

          {
            field: "binName",
            headerName: t("text.BinName1"),
            flex: 1,
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
            {t("text.StoreMaster")}
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
                      text={t("text.EnterStoreName")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="storeName"
                  id="storeName"
                  value={formik.values.storeName}
                  placeholder={t("text.storeName")}
                  onChange={(e) => {
                    formik.setFieldValue("storeName", e.target.value);
                  }}
                />
                {formik.touched.storeName && formik.errors.storeName && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.storeName}</div>
                )}
              </Grid>


              {/* vehicle code */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.StoreCode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="storeCode"
                  id="storeCode"
                  value={formik.values.storeCode}
                  placeholder={t("text.storeCode")}
                  onChange={(e) => {
                    formik.setFieldValue("storeCode", e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("binId", newValue?.value);
                  }}
                  value={
                    option.find((opt) => String(opt.value) === String(formik.values.binId)) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.BinName")} />
                      }
                    />
                  )}
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

