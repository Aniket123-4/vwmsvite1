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

export default function PurchaseInvoice() {
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

        let path = `/storemanagement/EditPurchaseInvoice`;
        navigate(path, {
            state: row,
        });
    };

    const routeChangeAdd = () => {
        let path = `/storemanagement/CreatePurchaseInvoice`;
        navigate(path);
    };

    let delete_id = "";

    const accept = () => {
        const collectData = {
            InvoiceId: delete_id,
        };
    
        api.get(`PurchaseInv/DeletePurchaseInvoice?InvoiceId=${delete_id}`)
            .then((response) => {
                if (response.data.status === 1) {
                    toast.success(response.data.message);
                    fetchZonesData(); // Refresh the data grid
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error during deletion:", error.response?.data || error.message);
                toast.error("Failed to delete the invoice. Please try again.");
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
                "invoiceId": -1
            };
            const response = await api.post(
                `PurchaseInv/GetPurchaseInvoice`,
                collectData
            );
            const data = response.data.data;
            const IndentWithIds = data.map((Item: any, index: any) => ({
                ...Item,
                serialNo: index + 1,
                id: Item.invoiceId,
               
               // name: Item.vendor.name,
                // code: Item.comb2.comb.vend.code,
                // contactPerson: Item.comb2.comb.vend.contactPerson,
                // gstinNo: Item.comb2.comb.vend.gstinNo,
                // mobileNo: Item.comb2.comb.vend.mobileNo,
                // permanentAddress: Item.comb2.comb.vend.permanentAddress,
            }));
            setItem(IndentWithIds);
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
                                </Stack>,
                            ];
                        },
                    },

                    {
                        field: "serialNo",
                        headerName: t("text.SrNo"),
                        flex: 1,
                    //     align: "right",
            // headerAlign: "right",
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    
                    {
                        field: "invoiceNo",
                        headerName: t("text.invoiceNo"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    {
                        field: "invoiceDate",
                        headerName: t("text.invoiceDate"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                        renderCell(params) {
                            return dayjs(params.row.invoiceDate).format("DD-MMM-YYYY")
                        },
                    },
                    {
                        field: "orderNo",
                        headerName: t("text.orderNo11"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    // {
                    //     field: "name",
                    //     headerName: t("text.name"),
                    //     flex: 1.5,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                    // {
                    //     field: "totalAmount",
                    //     headerName: t("text.Amount"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                    // {
                    //     field: "totalGrossAmount",
                    //     headerName: t("text.netAmount"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                   
                    // {
                    //     field: "netAmount",
                    //     headerName: t("text.netAmount"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                       
                    // },
                    // {
                    //     field: "freight",
                    //     headerName: t("text.freights"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                    // {
                    //     field: "amount",
                    //     headerName: t("text.amounts"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
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
                        {t("text.PurchaseInvoice")}
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
                </Paper>
            </Card>
            <ToastApp />

        </>
    );
}
