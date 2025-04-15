import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
// // import CustomDataGrids from "../../../utils/CustomDataGrids";
// import CustomDataGrid from "../../../utils/CustomDatagrid";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ItemDetail() {
  const Userid = getId();
  let navigate = useNavigate();
  const [editId, setEditId] = useState(-1);
    const [item, setItem] = useState([]);
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

  const routeChangeEdit = (row: any) => {
    // console.log(row);
    let path = `/storemanagement/EditItemDetail`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/storemanagement/CreateItemDetail`;
    navigate(path);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      itemMasterId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`ItemMaster/DeleteItemMaster`,collectData )
      .then((response) => {
        if (response.data.status===1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchZonesData();
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
        itemMasterId: -1,
      };
      const response = await api.get(`ItemMaster/GetItemMaster`,{}, )
      const data = response.data.data;
      console.log(
        "🚀 ~ fetchZonesData ~ response.data.data:",
        response.data.data
      );
      const zonesWithIds = data.map((Item: any, index: any) => ({
        ...Item,
        srNo: index + 1,
        id: Item.itemMasterId,
      }));
      setItem(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerName: t("text.Action"),
            headerClassName: "MuiDataGrid-colCell",
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
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  {/* ) : (
                    ""
                  )}
                  {permissionData?.isDel ? ( */}
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
                    onClick={() => routeChangeEdit({...params.row, isView: true})}
                  />
                 
                </Stack>,
              ];
            },
          },

       
          {
            field: "itemName",
            headerName: t("text.itemName"),
            flex: 1,
           
          },
          {
            field: "itemCode",
            headerName: t("text.itemCode"),
            flex: 1,
            
          },
          // {
          //   field: "purchaseYear",
          //   headerName: t("text.purchaseYear"),
          //   flex: 1,
           
          // },
          // {
          //   field: "vehicleNo",
          //   headerName: t("text.vehicleNo"),
          //   flex: 1,
            
          // },
          {
            field: "serialNo",
            headerName: t("text.serialNo"),
            flex: .5,
          },
          {
            field: "hsnCode",
            headerName: t("text.hsnCode"),
            flex: 1,
           
          },
          // {
          //   field: "itemWeight",
          //   headerName: t("text.itemWeight"),
          //   flex: 1,
           
          // },

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
                {t("text.ItemDetail")}
              </Typography>
           

          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">

<Button
    onClick={routeChangeAdd}
    variant="contained"
    endIcon={<AddCircleIcon />}
    size="large"
    style={{ backgroundColor: `var(--header-background)` }}
>
    {t("text.add")}
</Button>

</Stack>


            <DataGrids
                    isLoading={isLoading}
                    rows={item}
                    columns={adjustedColumns}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    initialPageSize={5}
                />
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
            <CustomDataGrid
              isLoading={isLoading}
              rows={zones}
              columns={adjustedColumns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialPageSize={5}
            />
          )} */}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
