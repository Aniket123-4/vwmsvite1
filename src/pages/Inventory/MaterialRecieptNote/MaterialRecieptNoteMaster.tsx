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
import VisibilityIcon from "@mui/icons-material/Visibility";
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

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function MaterialRecieptNoteMaster() {
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);


  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {

    fetchZonesData();

  }, [isLoading]);


  const routeChangeEdit = (row: any) => {
    console.log("row " + row);

    let path = `/storemanagement/EditMRN`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/storemanagement/CreateMRN`;
    navigate(path);
  };

  let delete_id = "";

  const accept = () => {
    api
      .post(`QualityCheck/DeleteMrn?filter=${delete_id}`, null) // Pass `filter` as query param and no body
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchZonesData(); // Refresh the data
      })
      .catch((error) => {
        console.error("Error during deletion:", error);
        toast.error("Failed to delete the record. Please try again.");
      });
  };



  const reject = () => {
    // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    // console.log(del_id + " del_id ");
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
        mrnId: -1,
      };
      const response = await api.post(
        `QualityCheck/GetMrn`, collectData
      );
      const data = response.data.data;
      const IndentWithIds = data.map((Item: any, index: any) => ({
        ...Item,
        serialNo: index + 1,
        id: Item.mrnId,

      }));
      setItem(IndentWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            flex: 1,
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
                  <VisibilityIcon
                    style={{
                      fontSize: "20px",
                      color: "grey",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit({ ...params.row, isView: true })}
                  />
                </Stack>,
              ];
            },
          },
          // {
          //   field: "serialNo",
          //   headerName: t("text.SrNo"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text",
          // },

          // {
          //   field: "mrnNo",
          //   headerName: t("text.mrnNo"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          // },
          // {
          //   field: "mrnDate",
          //   headerName: t("text.mrnDate"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   renderCell(params) {
          //     return dayjs(params.row.mrnDate).format("DD-MMM-YYYY")
          //   },
          // },
          {
            field: "mrnType",
            headerName: t("text.mrnType"),
            flex: 1.2,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text",
            renderCell(params) {
              return params.row.mrnType === '1' ? 'Bill' : 'Challan';
            },
          },
          {
            field: "bill_ChalanNo",
            headerName: t("text.bill_ChalanNo"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text",
          },
          // {
          //   field: "bill_ChalanDate",
          //   headerName: t("text.bill_ChalanDate"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   renderCell(params) {
          //     return dayjs(params.row.bill_ChalanDate).format("DD-MMM-YYYY")
          //   },
          // },
          {
            field: "shipmentNo",
            headerName: t("text.shipmentNo"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text",
          },
          {
            field: "totalAmount",
            headerName: t("text.totalAmount"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text",
          },
          {
            field: "netAmount",
            headerName: t("text.NetAmount"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text",
            renderCell(params) {
              // console.log("values", params.row);
              return (parseFloat(params.row.totalAmount) + parseFloat(params.row.totalSGST) + parseFloat(params.row.totalCGST) + parseFloat(params.row.totalIGST)).toFixed(2);
            },
          },
          // {
          //   field: "totalGrossAmount",
          //   headerName: t("text.totalGrossAmounts"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          // },
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
              fontSize: 13,
              fontWeight: 700
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
            {t("text.mrn")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true && ( */}
            <Button
              onClick={routeChangeAdd}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{ backgroundColor: `var(--header-background)` }}
            >
              {t("text.add")}
            </Button>
            {/* ) } */}

          </Stack>


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
