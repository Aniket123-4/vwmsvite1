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

export default function OfficePurchaseOrder() {
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

        let path = `/storemanagement/purchaseorder/EditOfficePurchaseOrder`;
        navigate(path, {
            state: row,
        });
    };

    const routeChangeAdd = () => {
        let path = `/storemanagement/purchaseorder/CreateOfficePurchaseOrder`;
        navigate(path);
    };

    let delete_id = "";
    let indent_id = "";

    const accept = () => {
        if (!delete_id || !indent_id) {
            toast.error("Missing required information to delete the record.");
            return;
        }

        const collectData = {
            orderId: delete_id,
            indentId: indent_id
        };

        api
            .post(`PurchaseOrder/DeletePurchaseOrder`, collectData)
            .then((response) => {
                if (response.data.status === 1) {
                    toast.success(response.data.message);
                    fetchZonesData(); // Refresh data after deletion
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.error("An error occurred while deleting the record.");
                console.error(error);
            });
    };

    const reject = () => {
        toast.warn("Rejected: You have rejected", { autoClose: 3000 });
    };

    const handledeleteClick = (row: any) => {
        console.log("row", row)
        delete_id = row.orderId;
        indent_id = row.indentId; // Define this logic based on your use case

        confirmDialog({
            message: "Do you want to delete this record?",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept,
            reject,
        });
    };

    const fetchZonesData = async () => {
        try {
            const collectData = {
                orderId: -1,
                indentId: -1,
            };
            const response = await api.post(
                `PurchaseOrder/GetPurchaseOrder`,
                collectData
            );
            const data = response.data.data;
    
            // Add serial numbers and filter for status "open"
            const IndentWithIds = data
                .map((Item: any, index: any) => ({
                    ...Item,
                    serialNo: index + 1,
                    id: Item.orderId,
                }))
                .filter((Item: any) => Item.orderType==="Office"); 
    
            setItem(IndentWithIds);
            setIsLoading(false);
    
            if (IndentWithIds.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width: 100,
                        renderCell: (params) => {
                            return (
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
                                        onClick={() => routeChangeEdit(params.row)}
                                    />
                                    <DeleteIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "red",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handledeleteClick(params.row)}
                                    />
                                </Stack>
                            );
                        },
                    },
                    // {
                    //     field: "serialNo",
                    //     headerName: t("text.SrNo"),
                    //     flex: 0.4,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                    {
                        field: "orderNo",
                        headerName: t("text.OrderNo"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "orderDate",
                        headerName: t("text.OrderDate"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                        renderCell: (params) => {
                            return dayjs(params.row.orderDate).format("DD-MMM-YYYY");
                        },
                    },
                    {
                        field: "name",
                        headerName: t("text.Vendor"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "status",
                        headerName: t("text.Status"),
                        flex: 1,
                    },
                    {
                        field: "netAmount",
                        headerName: t("text.netAmount"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                ];
                setColumns(columns);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    


    // const fetchZonesData = async () => {
    //     try {
    //         const collectData = {
    //             // "id": -1
    //             "orderId": -1,
    //             "indentId": -1
    //         };
    //         const response = await api.post(
    //             `PurchaseOrder/GetPurchaseOrder`,
    //             collectData
    //         );
    //         const data = response.data.data;
    //         const IndentWithIds = data.map((Item: any, index: any) => ({
    //             ...Item,
    //             serialNo: index + 1,
    //             id: Item.orderId,
    //             status: Item.status == "open",
    //             // id: Item.indentId,
    //         }));
    //         setItem(IndentWithIds);
    //         setIsLoading(false);

    //         if (data.length > 0) {
    //             const columns: GridColDef[] = [
    //                 {
    //                     field: "actions",
    //                     headerClassName: "MuiDataGrid-colCell",
    //                     headerName: t("text.Action"),
    //                     width: 100,

    //                     renderCell: (params) => {
    //                         return [
    //                             <Stack
    //                                 spacing={1}
    //                                 direction="row"
    //                                 sx={{ alignItems: "center", marginTop: "5px" }}
    //                             >

    //                                 <EditIcon
    //                                     style={{
    //                                         fontSize: "20px",
    //                                         color: "blue",
    //                                         cursor: "pointer",
    //                                     }}
    //                                     className="cursor-pointer"
    //                                     onClick={() => routeChangeEdit(params.row)}
    //                                 />

    //                                 <DeleteIcon
    //                                     style={{
    //                                         fontSize: "20px",
    //                                         color: "red",
    //                                         cursor: "pointer",
    //                                     }}
    //                                     onClick={() => {
    //                                         handledeleteClick(params.row);
    //                                     }}
    //                                 />
    //                             </Stack>,
    //                         ];
    //                     },
    //                 },

    //                 {
    //                     field: "serialNo",
    //                     headerName: t("text.SrNo"),
    //                     flex: 0.4,
    //                     headerClassName: "MuiDataGrid-colCell",
    //                 },

    //                 {
    //                     field: "orderNo",
    //                     headerName: t("text.OrderNo"),
    //                     flex: 1,
    //                     headerClassName: "MuiDataGrid-colCell",
    //                 },

    //                 {
    //                     field: "orderDate",
    //                     headerName: t("text.OrderDate"),
    //                     flex: 1,
    //                     headerClassName: "MuiDataGrid-colCell",
    //                     renderCell(params) {
    //                         return dayjs(params.row.orderDate).format("DD-MMM-YYYY")
    //                     },
    //                 },
    //                 {
    //                     field: "name",
    //                     headerName: t("text.Vendor"),
    //                     flex: 1,
    //                     headerClassName: "MuiDataGrid-colCell",
    //                 },
    //                 {
    //                     field: "status",
    //                     headerName: t("text.Status"),
    //                     flex: 1,
    //                 },
    //                 // {
    //                 //     field: "p_InvoiceNo",
    //                 //     headerName: t("text.p_InvoiceNos"),
    //                 //     flex: 1,
    //                 //     headerClassName: "MuiDataGrid-colCell",
    //                 // },

    //                 // {
    //                 //     field: "p_InvoiceDate",
    //                 //     headerName: t("text.p_InvoiceDates"),
    //                 //     flex: 1,
    //                 //     headerClassName: "MuiDataGrid-colCell",
    //                 //     renderCell(params) {
    //                 //         return dayjs(params.row.p_InvoiceDate).format("DD-MMM-YYYY")
    //                 //     },
    //                 // },
    //                 // {
    //                 //     field: "freight",
    //                 //     headerName: t("text.freights"),
    //                 //     flex: 1,
    //                 //     headerClassName: "MuiDataGrid-colCell",
    //                 // },
    //                 {
    //                     field: "netAmount",
    //                     headerName: t("text.netAmount"),
    //                     flex: 1,
    //                     headerClassName: "MuiDataGrid-colCell",
    //                 },

    //             ];
    //             setColumns(columns as any);
    //         }

    //     } catch (error) {
    //         console.error("Error fetching data:", error);

    //     }
    // };

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
                        {t("text.OfficePurchaseOrder")}
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

{/* 
                    <DataGrids
                        isLoading={isLoading}
                        rows={item}
                        columns={adjustedColumns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialPageSize={5}
                    /> */}
                    <DataGrids
    isLoading={isLoading}
    rows={item}
    columns={adjustedColumns}
    pageSizeOptions={[5, 10, 25, 50, 100]}
    initialPageSize={5}
/>

{item.length === 0 && !isLoading && (
    <Typography
        variant="h6"
        align="center"
        sx={{ marginTop: "20px", color: "gray" }}
    >
        {t("text.NoRecordsFound")}
    </Typography>
)}

                </Paper>
            </Card>
            <ToastApp />

        </>
    );
}
