import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import HOST_URL from '../../../utils/Url';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Import Add Icon
import IconButton from "@mui/material/IconButton";
import {
  GridColDef,
} from "@mui/x-data-grid";
import DataGrids from "../../../utils/Datagrids";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import * as Yup from "yup";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}
export default function Services() {
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");
  const userId = getId();


  const [isDialogOpen, setDialogOpen] = useState(false);

  const [typedServiceType, setTypedServiceType] = useState("");


  const { defaultValuestime } = getISTDate();
  const [toaster, setToaster] = useState(false);

  const [serviceTypeOption, setServiceTypeOption] = useState([
    { value: -1, label: t("text.VehicleNo") },
  ]);


  useEffect(() => {
    getServiceTypeData();
    fetchServicesData();
  }, [isLoading]);

  const getServiceTypeData = async () => {
    const collectData = {
      "serviceTypeID": -1,
      "serviceTypeName": ""
    };
    const response = await api.post(`ServiceMaster/GetServiceType`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["serviceTypeName"],
        value: data[index]["serviceTypeID"],
      });
    }
    setServiceTypeOption(arr);
  };

  const formik = useFormik({
    initialValues:
    {
      "sno": 0,
      "serviceId": 0,
      "serviceName": "",
      "serviceCode": "",
      "serviceTypeid": 0,
      "serviceItem": "",
      "unitId": 0,
      "createdBy": userId,
      "updatedBy": userId,
      "createdOn": defaultValuestime,
      "updatedOn": defaultValuestime,
      "serviceTypeName": "",
      "unitName": ""
    },

    validationSchema: Yup.object({
      serviceName: Yup.string()
        .required(t("text.reqServiceName")),

    }),

    onSubmit: async (values) => {
      try {
        const response = await api.post(`ServiceMaster/UpsertServiceMaster`, values);
        if (response.data.status === 1) {
          formik.resetForm();
          setToaster(false);
          toast.success(response.data.message);
        } else {
          setToaster(true);
          toast.error(response.data.message);
        }
        fetchServicesData();

      } catch (error) {
        setToaster(true);
        toast.error("An error occurred while saving. Please try again.");
        console.error("API Error:", error);
      }
    },
  });

  const handleEdit = (row: any) => {
    console.log("row:--", row);
    formik.setFieldValue("serviceId", row.serviceId);
    formik.setFieldValue("serviceName", row.serviceName);
    formik.setFieldValue("serviceCode", row.serviceCode);
    formik.setFieldValue("serviceTypeid", row.serviceTypeid);
    formik.setFieldValue("serviceTypeName", row.serviceTypeName);
  }


  let delete_id = "";
  const accept = () => {
    const collectData = {
      "serviceId": delete_id
    }
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`ServiceMaster/DeleteServiceMaster`, collectData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.success(response.data.message);
        }
        fetchServicesData();
      });
  };
  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    console.log(del_id + " del_id ");
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




  const fetchServicesData = async () => {
    try {
      const collectData = {
        "serviceId": -1
      };
      const response = await api.post(`ServiceMaster/GetServiceMaster`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchServicesData ~ response.data.data:", response.data.data)
      const arr = data.map((Item: any, index: any) => ({
        ...Item,
        serialNo: index + 1,
        id: Item.serviceId
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
                      handledeleteClick(params.row.id);
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
            field: "serviceName",
            headerName: t("text.ServiceName"),
            flex: 2,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "serviceCode",
            headerName: t("text.ServiceCode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "serviceTypeName",
            headerName: t("text.ServiceType"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      //setLoading(false);
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
            {t("text.Services")}
          </Typography>
          <Divider />
          <Box height={10} />

          <form onSubmit={formik.handleSubmit}>
            {toaster && <ToastApp />}
            <Grid container spacing={2}>

              {/* Service Type */}
              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={serviceTypeOption}
                  value={serviceTypeOption.find(option => option.label === formik.values.serviceTypeName) || null}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("serviceTypeid", newValue?.value);
                    formik.setFieldValue("serviceTypeName", newValue?.label);

                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.ServiceType")} required={false} />}
                      name="serviceTypeName"
                      id="serviceTypeName"
                      placeholder={t("text.ServiceType")}
                    />
                  )}
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  options={[
                    ...serviceTypeOption,
                    ...(typedServiceType && !serviceTypeOption.some(opt => opt.label === typedServiceType)
                      ? [{ value: "add-new", label: `${typedServiceType}` }]
                      : []),
                  ]}
                  fullWidth
                  size="small"
                  onInputChange={(event, newValue) => {
                    setTypedServiceType(newValue);
                  }}
                  onChange={(event, newValue) => {
                    if (newValue?.value === "add-new") {
                      setDialogOpen(true);
                    } else {
                      formik.setFieldValue("serviceTypeid", newValue?.value);
                      formik.setFieldValue("serviceTypeName", newValue?.label);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={<CustomLabel text={t("text.ServiceType")} />} />
                  )}
                />
              </Grid>
              <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{t("text.AddServiceType")}</DialogTitle>
                <DialogContent>
                  <TextField
                    label={t("text.AddServiceType")}
                    value={typedServiceType}
                    fullWidth
                    disabled
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={async () => {
                      try {
                        const collectData = {
                          "serviceTypeID": 0,
                          "serviceTypeName": typedServiceType
                        };
                        const response = await api.post(
                          `ServiceMaster/UpsertServiceType`,
                          collectData
                        );
                        if (response.data.status === 1) {
                          setDialogOpen(false);
                          toast.success(response.data.message);
                          getServiceTypeData();
                        }
                      } catch (error) {
                        toast.error("Failed to add service type");
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                </DialogActions>
              </Dialog> */}


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  options={[
                    ...serviceTypeOption,
                    ...(typedServiceType && !serviceTypeOption.some(opt => opt.label === typedServiceType)
                      ? [{ value: "add-new", label: `${typedServiceType}` }]
                      : []),
                  ]}
                  fullWidth
                  size="small"
                  popupIcon={null}
                  value={serviceTypeOption.find(option => option.label === formik.values.serviceTypeName) || null}
                  onInputChange={(event, newValue) => {
                    setTypedServiceType(newValue);
                  }}
                  onChange={(event, newValue) => {
                    if (newValue?.value === "add-new") {
                      setDialogOpen(true);
                    } else {
                      formik.setFieldValue("serviceTypeid", newValue?.value);
                      formik.setFieldValue("serviceTypeName", newValue?.label);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.ServiceType")} />}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <IconButton
                              onClick={() => setDialogOpen(true)}
                              edge="end"
                              sx={{
                                color: "#1976d2",  // Primary blue color
                                backgroundColor: "#f0f8ff", // Light blue background
                                padding: "0",
                                marginLeft: "2px",
                                borderRadius: "50%", // Circular button
                                "&:hover": {
                                  backgroundColor: "#e3f2fd", // Lighter blue on hover
                                },
                              }}
                              aria-label="add service type"
                            >
                              <AddCircleOutlineIcon sx={{ fontSize: 24 }} />
                            </IconButton>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{t("text.AddServiceType")}</DialogTitle>
                <DialogContent>
                  <TextField
                    label={t("text.AddServiceType")}
                    value={typedServiceType}
                    fullWidth
                    disabled
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={async () => {
                      try {
                        const collectData = {
                          serviceTypeID: 0,
                          serviceTypeName: typedServiceType,
                        };
                        const response = await api.post(
                          `ServiceMaster/UpsertServiceType`,
                          collectData
                        );
                        if (response.data.status === 1) {
                          setDialogOpen(false);
                          toast.success(response.data.message);
                          getServiceTypeData();
                        }
                      } catch (error) {
                        toast.error("Failed to add service type");
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                </DialogActions>
              </Dialog>



              {/* Service Name */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ServiceName")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="serviceName"
                  id="serviceName"
                  value={formik.values.serviceName}
                  placeholder={t("text.ServiceName")}
                  onChange={(e) => {
                    formik.setFieldValue("serviceName", e.target.value);
                  }}
                />
                {formik.touched.serviceName && formik.errors.serviceName && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.serviceName}</div>
                )}
              </Grid>

              {/* Service Code */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ServiceCode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="serviceCode"
                  id="serviceCode"
                  value={formik.values.serviceCode}
                  placeholder={t("text.ServiceCode")}
                  onChange={(e) => {
                    formik.setFieldValue("serviceCode", e.target.value);
                  }}
                />
              </Grid>


              {/* Submit Button */}
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

              {/* Reset Button */}
              <Grid item lg={6} sm={6} xs={12}>
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
      </Card>
      <ToastApp />
    </>
  );
}
