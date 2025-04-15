import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import DataGrids from "../../../utils/Datagrids";
import dayjs from "dayjs";
import React from "react";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function JobCardItemReturn() {
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

    let path = `/storemanagement/itemreturn/EditJobCardItemReturn`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/storemanagement/itemreturn/CreateJobCardItemReturn`;
    navigate(path);
  };

  let delete_id = "";
  const accept = () => {
    const collectData = {
      returnId: delete_id,
      "returnType": ""
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`Master/DeleteItemReturn`, collectData


      )
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchZonesData();
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
        "returnId": -1,
        "returnType": ""
      };
      const response = await api.post(`Master/GetItemReturn`, collectData);

      const data = response.data.data;
      const IndentWithIds = data.map((Item: any, index: any) => ({
        ...Item,
        serialNo: index + 1,
        id: Item.returnId,
      }))
        .filter((Item: any) => Item.returnType === "JobCard");
      setItem(IndentWithIds);
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
                  {/* ) : ( */}
                  {/* "" */}
                  {/* )} */}
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
          // },
          {
            field: "returnType",
            headerName: t("text.returnType"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },


          {
            field: "returnDate",
            headerName: t("text.ReturnDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell(params) {
              return dayjs(params.row.returnDate).format("DD-MMM-YYYY")
            },
          },
          {
            field: "returnIndentNo",
            headerName: t("text.returnIndentNo"),
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
            {t("text.JobCardItemReturn")}
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
