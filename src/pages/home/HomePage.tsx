import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";

import { Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"; // for insurance or related to fuel
import ListAltIcon from "@mui/icons-material/ListAlt"; // for registration or documents
import SettingsIcon from "@mui/icons-material/Settings"; // for services
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull"; // for scrap or vehicle condition
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts/PieChart";
import api from "../../utils/Url";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";
import PrintIcon from "@mui/icons-material/Print";
import ProgressBar from "@ramonak/react-progress-bar";
import BuildIcon from "@mui/icons-material/Build";
import { motion, useSpring } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
// import { table } from "console";
import * as XLSX from "xlsx";
import SearchIcon from "@mui/icons-material/Search";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
import dayjs from "dayjs";
import CustomLabel from "../../CustomLable";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "120%",
  bgcolor: "#f5f5f5",
  border: "0.1em solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10%",
};
const containerStyle = {
  width: "100%",
  height: "100%",
};
interface Department {
  dept_id: number;
  dept_name: string;
  session_year: string;
}
export default function HomePage() {

  const [selectedCardId, setSelectedCardId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [searchTerm3, setSearchTerm3] = useState("");
  const [searchTerm4, setSearchTerm4] = useState("");
  const [searchTerm5, setSearchTerm5] = useState("");
  const [totalComplaints, setTotalComplaints] = useState(0);

  let navigate = useNavigate();
 
  const handleClick1 = (key: any) => {
    if (key.toLowerCase() === "inhouse") {
      return; // Do nothing for inhouse status
    }
    navigate(`/Reports/ComplainStatus`, {
      state: { status: key.toUpperCase() },
    });
  };

 

  const handleClickVno = (key: any) => {
    navigate(`/Reports/VehicleItemService`, { state: {} });
  };
  const [ispending, setpending] = useState(0);
  const [isprogress, setprogress] = useState(0);
  const [isoutsource, setoutsource] = useState(0);
  const [isinhouse, setinhouse] = useState(0);
  const [isclosed, setclosed] = useState(0);
  const fetchComplaintStatus = async (
    status: string,
    setter: React.Dispatch<any>
  ) => {
    try {
      const response = await api.get(
        `Dashboard/GetComplaintsStatus?Status=${status}`
      );
      const data = response.data.data || [];
      const count = data.reduce(
        (acc: any, item: any) => acc + (item.Status || 0),
        0
      );
      setter(count);
    } catch (error) {
      console.error(`Error fetching ${status} data:`, error);
    }
  };
  const handlePending = () => fetchComplaintStatus("pending", setpending);
  const handleInProgress = () =>
    fetchComplaintStatus("inprogress", setprogress);
  const handleOutsource = () => fetchComplaintStatus("JobWork", setoutsource);
  const handleInHouse = () => fetchComplaintStatus("inprogress", setinhouse); // Adjust the status as needed
  const handleClosed = () => fetchComplaintStatus("Complete", setclosed);
  const [activeTab, setActiveTab] = useState(0);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShow, setIsShow] = useState(true);
  const [isShow2, setIsShow2] = useState<any>(false);
  const [isShow3, setIsShow3] = useState<any>(false);
  const [isShow4, setIsShow4] = useState<any>(false);
  const [isShow5, setIsShow5] = useState<any>(false);
  const [isShow6, setIsShow6] = useState<any>(false);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [RepairOption, setRepairOption] = useState<any[]>([]);
  const [ComplaintsOption, setComplaintsOption] = useState<any[]>([]);
  const [ReorderOption, setReorderOption] = useState<any[]>([]);
  const [OverDueOption, setOverDueOption] = useState<any[]>([]);
  const [IssuedStatusOption, setIssuedStatusOption] = useState<any[]>([]);
  const [DocumentTypeOption, setDocumentTypeOption] = useState<any[]>([]);
  useEffect(() => {
    GetTopVehicleActprice();
   
  }, []);
  useEffect(() => {
    setIsShow(true);
    setIsShow2(false);
    setIsShow3(false);
    setIsShow4(false);
    setIsShow5(false);
    setIsShow6(false);
  }, []); // Run only on initial render

  const GetTopVehicleActprice = async () => {
    try {
      const response = await api.get(`Dashboard/GetTopVehicleActprice`);
      const data = response.data.data;
      console.log("Fetched Data:", data);
      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
        grossPercent: (item.actprice > 0) ? Math.round(item.amount * 100 / item.actprice) : 0
      }));
      setRepairOption(processedData);
      setIsLoading(false);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(true);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
          { field: "vehicleNo", headerName: t("text.vehicleNo12"), flex: 1 },
          {
            field: "vehicleTypename",
            headerName: t("text.VehicleType"),
            flex: 1,
          },
          { field: "actprice", headerName: t("text.ActualPrice"), flex: 1 },
          { field: "amount", headerName: t("text.Expense"), flex: 1 },
          { field: "amount", headerName: t("text.GrossExpenditurePercent"), flex: 1 },
          { field: "age", headerName: t("text.Age"), flex: 1 },
        ];
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const GetTopVehicleMaxNoOfComplaints = async () => {
    try {
      const response = await api.get(
        `Dashboard/GetTopVehicleMaxNoOfComplaints`
      );
      const data = response.data.data;
      console.log("Fetched Data:", data);
      const processedData1 = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
      }));
      setComplaintsOption(processedData1);
      setIsLoading(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(true);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
          { field: "vehicleNo", headerName: t("text.vehicleNo12"), flex: 1 },
          {
            field: "noOfComplaints",
            headerName: t("text.Complaints"),
            flex: 1,
          },
          { field: "totaldays", headerName: t("text.totaldays"), flex: 1 },
          { field: "amount", headerName: t("text.Expense"), flex: 1 },
        ];
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const GetReOrderLevel = async () => {
    try {
      const response = await api.get(`Dashboard/GetLicensing`);
      const data = response.data.data;
      console.log("Fetched Data:", data);
      const processedData2 = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
      }));
      setReorderOption(processedData2);
      setIsLoading(false);
      setIsShow3(true);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
          { field: "vehicleNo", headerName: t("text.vehicleNo12"), flex: 1 },
          { field: "effectiveDate", headerName: "Effective Date", flex: 1 },
          { field: "todate", headerName: "Expiry Date", flex: 1 },
          { field: "attachment", headerName: "Document", flex: 1 },
          { field: "licenceType", headerName: "Document Type", flex: 1 },
        ];
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const reportRef = useRef<HTMLDivElement>(null);
  const GetTopVehiclewaiting = async () => {
    try {
      const response = await api.get(`Dashboard/GetRegistration`);
      const data = response.data.data;
      console.log("Fetched Data:", data);
      const processedData3 = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
      }));
      setOverDueOption(processedData3);
      setIsLoading(false);
      setIsShow3(false);
      setIsShow4(true);
      setIsShow5(false);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "vehicleNo", headerName: "Vehicle No", flex: 1 },
          {
            field: "vehicleRegistrationDate",
            headerName: "Registration Date",
            flex: 1,
          },
          { field: "filename", headerName: "RC Document", flex: 1 },
          { field: "vehiclePhotoFile", headerName: "Vehicle Photo", flex: 1 },
          { field: "vehicleTypename", headerName: "Vehicle Type", flex: 1 },
        ];
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const GetTopItemIssued = async () => {
    try {
      const response = await api.get(`Dashboard/GetServiceDetail`);
      const data = response.data.data;
      console.log("Fetched Data:", data);
      const processedData4 = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleno || index,
        serialNo: index + 1,
      }));
      setIssuedStatusOption(processedData4);
      setIsLoading(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(true);
      setIsShow6(false);
      setIsShow(false);
      setIsShow2(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "vehicleno", headerName: "Vehicle No", flex: 1 },
          { field: "noOfServices", headerName: "No. Of Services", flex: 1 },
          { field: "jobCardDate", headerName: "Last Service", flex: 1 },
        ];

        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetScrapDetail = async () => {
    try {
      const response = await api.get(`Dashboard/GetScrap
`);
      const data = response.data.data;

      console.log("Fetched Data:", data);

      const processedData5 = data.map((item: any, index: number) => ({
        ...item,
        id: item.vehicleNo || index,
        serialNo: index + 1,
      }));

      setDocumentTypeOption(processedData5);
      setIsLoading(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(true);
      setIsShow(false);
      setIsShow2(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");

      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: "Sr No.", flex: 1 },
          { field: "vehicleNo", headerName: "Vehicle No", flex: 1 },
          { field: "date", headerName: "Scrap Date", flex: 1 },
        ];
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleClickOpen = (image:any) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleCloseicon = () => {
    setOpen(false);
    setSelectedImage(""); // Clear the image when closed
  };
  
  // const handleClose = () => {
  //   setOpen(false);
  // };
  const handleClick = (id: any) => {
    setSelectedCardId(id);
    if (id === 0) {
      GetTopVehicleActprice(); // Load VEHICLE EXPENDITURE data
      setIsShow(true);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
    } else if (id === 1) {
      GetTopVehicleMaxNoOfComplaints(); // Load COMPLAINTS data
      setIsShow(false);
      setIsShow2(true);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
    } else if (id === 2) {
      GetReOrderLevel(); // Load INSURANCE data
      setIsShow(false);
      setIsShow2(false);
      setIsShow3(true);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
    } else if (id === 3) {
      GetTopVehiclewaiting(); // Load REGISTRATION data
      setIsShow(false);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(true);
      setIsShow5(false);
      setIsShow6(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
    } else if (id === 4) {
      GetTopItemIssued(); // Load SERVICES data
      setIsShow(false);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(true);
      setIsShow6(false);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
    } else if (id === 5) {
      GetScrapDetail(); // Load SCRAP DETAIL data
      setIsShow(false);
      setIsShow2(false);
      setIsShow3(false);
      setIsShow4(false);
      setIsShow5(false);
      setIsShow6(true);
      setSearchTerm("");
      setSearchTerm1("");
      setSearchTerm2("");
      setSearchTerm3("");
      setSearchTerm4("");
      setSearchTerm5("");
    }
  };

 
  const [recentlyIssueTransactionOption] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [zones1, setZones1] = useState([]);
  const [columns1, setColumns1] = useState<any>([]);
  const [isLoading1, setIsLoading1] = useState(true);

  const [zones2, setZones2] = useState([]);
  const [columns2, setColumns2] = useState<any>([]);
  const [isLoading2, setIsLoading2] = useState(true);
  const [zones3, setZones3] = useState([]);
  const [columns3, setColumns3] = useState<any>([]);
  const [isLoading3, setIsLoading3] = useState(true);
  const [zones4, setZones4] = useState([]);
  const [columns4, setColumns4] = useState<any>([]);
  const [isLoading4, setIsLoading4] = useState(true);
  const [isLoading6, setIsLoading6] = useState(true);
  const [zones5, setZones5] = useState([]);
  const [columns5, setColumns5] = useState<any>([]);
  const [isLoading5, setIsLoading5] = useState(true);
  const [getTop, setGetTop] = useState(false);
  const [getTop1, setGetTop1] = useState(false);
  const [isRunn, setRunn] = useState<any>(0);
  const [isIdle, setIdle] = useState<any>(0);
  const [isStop, setStop] = useState<any>(0);
  const [is30days, set30days] = useState<any>(0);
  const [totalVeh, setTotalVeh] = useState<any>(0);
  const [totalDistance, setTotalDistance] = useState<any>(0);
  const [isModal, setModal] = useState<any>(false);
  const [isModal1, setModal1] = useState<any>(false);
  const [isModal2, setModal2] = useState<any>(false);
  const [isModal3, setModal3] = useState<any>(false);
  const [isModal4, setModal4] = useState<any>(false);
  const [isModal5, setModal5] = useState<any>(false);
  const [isModal6, setModal6] = useState<any>(false);
  const [isModal7, setModal7] = useState<any>(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isMap, setMap] = useState<any>([]);
  const [accordionExpanded, setAccordionExpanded] = useState<any>({});

  const filteredRows = React.useMemo(() => {
    return RepairOption.filter((row) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [RepairOption, columns, searchTerm, isShow]);

  const filteredRows1 = React.useMemo(() => {
    return ComplaintsOption.filter((row) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm1.toLowerCase())
      )
    );
  }, [ComplaintsOption, columns, searchTerm1]);
  const filteredRows2 = React.useMemo(() => {
    return ReorderOption.filter((row) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm2.toLowerCase())
      )
    );
  }, [ReorderOption, columns, searchTerm2]);
  const filteredRows3 = React.useMemo(() => {
    return OverDueOption.filter((row) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm3.toLowerCase())
      )
    );
  }, [OverDueOption, columns, searchTerm3]);
  const filteredRows4 = React.useMemo(() => {
    return IssuedStatusOption.filter((row) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm4.toLowerCase())
      )
    );
  }, [IssuedStatusOption, columns, searchTerm4]);
  const filteredRows5 = React.useMemo(() => {
    return DocumentTypeOption.filter((row) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm5.toLowerCase())
      )
    );
  }, [DocumentTypeOption, columns, searchTerm5]);

  const handleAccordionToggle = (index: any, isExpanded: any) => {
    setAccordionExpanded((prev: any) => ({
      ...prev,
      [index]: !prev[index],
    }));

    if (isExpanded) {
      if (index === 0) {
        //  FuelconsData();
      } else if (index === 1) {
        //  IdleData();
      } else if (index === 2) {
        //TodayVData();
      } else if (index === 3) {
        //fetchZonesData();
      }
    } else {
      console.log("function is not working");
    }
  };
  const [value, setValue] = useState<any>(
    parseInt(localStorage.getItem("dash") || "0", 10)
  );
  useEffect(() => {
    setTimeout(() => {
      setZones1([]);
      setIsLoading1(false);
    }, 2000);
  }, []);

  const [isPrint, setPrint] = useState([]);
  const [isPrint1, setPrint1] = useState([]);
  const [isLabel, setlabel] = useState("");
  const [isStatus, setStatus] = useState("");
  const [isStatus1, setStatus1] = useState("");
  const [isStatus2, setStatus2] = useState("");
  const [isStatus3, setStatus3] = useState("");
  const [isStatus4, setStatus4] = useState("");
  const [isStatus5, setStatus5] = useState("");
  const [isStatus6, setStatus6] = useState("");
  const [isStatus7, setStatus7] = useState("");
  const downloadExcel = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to Excel.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(isPrint);
    const headers = Object.keys(isPrint[0]);
    headers.forEach((header, index) => {
      const cellAddress = `${String.fromCharCode(65 + index)}1`;
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vehicles");
    XLSX.writeFile(wb, "FuelConsumed.xlsx");
  };
  const downloadExcel1 = () => {
    if (!isPrint1 || isPrint1.length === 0) {
      console.error("No data to export to Excel.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(isPrint1);
    const headers = Object.keys(isPrint1[0]);
    headers.forEach((header, index) => {
      const cellAddress = `${String.fromCharCode(65 + index)}1`;
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vehicles");
    XLSX.writeFile(wb, "Long_Idle.xlsx");
  };
  const handleTab = (event: any, newValue: any) => {
    console.log(newValue);
    setValue(newValue);
  };
  const items = [
    {
      id: 0,
      text: t("text.VEHICLEEXPENDITURE"),
      icon: <BuildIcon sx={{ color: "blue" }} />,
      onClick: () => handleClick(0),
    },
    {
      id: 1,
      text: t("text.Complaints"),
      icon: <ReportProblemIcon sx={{ color: "red" }} />,
      onClick: () => handleClick(1),
    },
    {
      id: 2,
      text: t("text.INSURANCE"),
      icon: <TimeToLeaveIcon sx={{ color: "orange" }} />,
      onClick: () => handleClick(2),
    },
    {
      id: 3,
      text: t("text.REGISTRATION"),
      icon: <ListAltIcon sx={{ color: "green" }} />,
      onClick: () => handleClick(3),
    },
    {
      id: 4,
      text: t("text.SERVICES"),
      icon: <SettingsIcon sx={{ color: "purple" }} />,
      onClick: () => handleClick(4),
    },
    {
      id: 5,
      text: t("text.SCRAPDETAIL"),
      icon: <BatteryChargingFullIcon sx={{ color: "teal" }} />,
      onClick: () => handleClick(5),
    },
  ];
  const handleClose = () => {
    setModal(false);
  };
  const handleClose1 = () => {
    setModal1(false);
  };
  const handleClose2 = () => {
    setVisible(false);
  };
  const adjustedColumns5 = columns5.map((column: any) => ({
    ...column,
  }));
  const runningData = async (value: any) => {
    setStatus1(value);
    setModal(true);
    try {
      const response = await api.get(`Dashboard/GetComplaintsVehicleStatus`);
      const data = response.data.data;
      const vehicleInWorkshop = data.reduce(
        (acc: any, item: any) => acc + (item.complaintOnVehicle || 0),
        0
      );
      const inhouse = data.reduce(
        (acc: any, item: any) => acc + (item.inSideVehicle || 0),
        0
      );
      const outsource = data.reduce(
        (acc: any, item: any) => acc + (item.outSideVehicle || 0),
        0
      );
      const completed = data.reduce(
        (acc: any, item: any) => acc + (item.completeVehicle || 0),
        0
      );
      const totalVehicles = data.reduce(
        (acc: any, item: any) => acc + (item.totWVehicle || 0),
        0
      );
      setRunn(vehicleInWorkshop);
      setIdle(inhouse);
      setStop(outsource);
      set30days(completed);
      setTotalVeh(totalVehicles);
      if (data.length > 0) {
        const columns2 = [
          { field: "serialNo", headerName: "Sr. No", flex: 0.5 },
          {
            field: "complaintOnVehicle",
            headerName: "Vehicle In Workshop",
            flex: 1,
          },
          { field: "inSideVehicle", headerName: "Inhouse", flex: 1 },
          { field: "outSideVehicle", headerName: "Outsource", flex: 1 },
          { field: "completeVehicle", headerName: "Completed", flex: 1 },
          { field: "totWVehicle", headerName: "Total Vehicles", flex: 1 },
        ];
        setColumns4(columns2);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [complaints, setComplaints] = useState({
    pending: 0,
    inprogress: 0,
    outsource: 0,
    inhouse: 0,
    Complete: 0,
  });

  const [total, setTotal] = useState(0);
  useEffect(() => {
    const fetchAllStatuses = async () => {
      try {
        const responses = await Promise.all([
          api.get("Dashboard/GetComplaintsStatus?Status=pending"),
          api.get("Dashboard/GetComplaintsStatus?Status=inprogress"),
          api.get("Dashboard/GetComplaintsStatus?Status=JobWork"),
          api.get("Dashboard/GetComplaintsStatus?Status=inprogress"),
          api.get("Dashboard/GetComplaintsStatus?Status=Complete"),
        ]);
        const data = {
          pending: responses[0].data.data.length,
          inprogress: responses[1].data.data.length,
          outsource: responses[2].data.data.length,
          inhouse: responses[3].data.data.length,
          Complete: responses[4].data.data.length,
        };
        setComplaints(data);
        setTotal(Object.values(data).reduce((sum, count) => sum + count, 0));
      } catch (error) {
        console.error("Error fetching complaint statuses:", error);
      }
    };
    fetchAllStatuses();
  }, []);
  // const calculatePercentage = (count: number) =>
  //   total ? Math.round((count / total) * 100) : 0;
  const calculatePercentage = (count: number, total: number) =>
    total ? ((count / total) * 100).toFixed(1) : "0.00";

  const adjustedColumns4 = columns4.map((column: any) => ({
    ...column,
  }));
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };
  const formatDate = (date: any) => {
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };
  const formattedDate = formatDate(new Date());
  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));
  useEffect(() => { }, [getTop]);
  useEffect(() => { }, [getTop1]);
  const adjustedColumns1 = columns1.map((column: any) => ({
    ...column,
  }));
  const adjustedColumns2 = columns2.map((column: any) => ({
    ...column,
  }));
  const styles = `
  .wrap-text {
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
`;
  document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
  const handlePrint = () => {
    const rowsToPrint = getTop ? filteredRows.slice(0, 10) : filteredRows;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }

    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>Vehicle Type</th>
            <th>Actual Price</th>
            <th>Expense</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.vehicleTypename}</td>
              <td>${row.actprice}</td>
              <td>${row.amount}</td>
              <td>${row.age}</td>
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Vehicle Expenditure Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              table, th, td { border: 1px solid black; }
              th, td { padding: 8px; text-align: left; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };


  const handlePrint1 = () => {
    const rowsToPrint = getTop ? filteredRows1.slice(0, 10) : filteredRows1;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }

  

    const printContent = `
      <table>
        <thead>
          <tr>
            <th>vehicle No.</th>
            <th>No. Of Complaints Type</th>
            <th>total days </th>
            <th>Expense</th>
           
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.noOfComplaints}</td>
              <td>${row.totaldays}</td>
              <td>${row.amount}</td>
             
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>COMPLAINTS REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
             table, th, td {
  border: 0.1em solid black; 
}

th, td {
  padding: 0.5%; 
  text-align: left;
}
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };
  const handlePrint2 = () => {
    const rowsToPrint = getTop ? filteredRows2.slice(0, 10) : filteredRows2;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }

    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>Effective Date</th>
            <th>Expiry Date</th>
            <th>Document</th>
            <th>Document Type</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row: any) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.effectiveDate}</td>
              <td>${row.todate}</td>
              <td>${row.attachment}</td>
              <td>${row.licenceType}</td>
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>INSURANCE REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
             table, th, td {
  border: 0.1em solid black; 
}

th, td {
  padding: 0.5%; 
  text-align: left;
}
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };
  const handlePrint3 = () => {
    const rowsToPrint = getTop ? filteredRows3.slice(0, 10) : filteredRows3;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }

    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>Registration Date</th>
            <th>RC Document</th>
            <th>Vehicle Photo</th>
             <th>Vehicle Type</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row: any) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.vehicleRegistrationDate}</td>
              <td>${row.filename}</td>
              <td>${row.vehiclePhotoFile}</td>
              <td>${row.vehicleTypename}</td>
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>REGISTRATION REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
            table, th, td {
  border: 0.1em solid black; 
}

th, td {
  padding: 0.5%;
  text-align: left;
}
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };
  const handlePrint4 = () => {
    const rowsToPrint = getTop ? filteredRows4.slice(0, 10) : filteredRows4;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }

    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>No. Of Services</th>
            <th>Last Service</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row: any) => `
            <tr>
              <td>${row.vehicleno}</td>
              <td>${row.noOfServices}</td>
            <td>${row.jobCardDate}</td>
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SERVICES REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
  border: 0.1em solid black; 
}

th, td {
  padding: 0.5%;
  text-align: left;
}
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };
  const handlePrint5 = () => {
    const rowsToPrint = getTop ? filteredRows5.slice(0, 10) : filteredRows5;

    if (rowsToPrint.length === 0) {
      console.error("No data to print.");
      return;
    }

    const printContent = `
      <table>
        <thead>
          <tr>
            <th>Vehicle No.</th>
            <th>Scrap Date</th>
          
          </tr>
        </thead>
        <tbody>
          ${rowsToPrint
        .map(
          (row: any) => `
            <tr>
              <td>${row.vehicleNo}</td>
              <td>${row.date}</td>
            
            </tr>`
        )
        .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SCRAP DETAIL REPORT</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
  border: 0.1em solid black;
}

th, td {
  padding: 0.5%;
  text-align: left;
}
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };
  const adjustedColumns3 = columns3.map((column: any) => ({
    ...column,
  }));
  return (
    <div>
      <Box sx={{ marginTop: "1%" }}>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={6} sm={4} md={2} key={item.id}>
              <Card
                onClick={() => handleClick(item.id)}
                sx={{
                  width: "105%",
                  height: "90%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1%,",
                  backgroundColor: "#fff",
                  border: `2px solid ${selectedCardId === item.id ? "#3498db" : "#e0e0e0"
                    }`,
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  borderLeft: `4px solid ${item.id === 0
                    ? "blue"
                    : item.id === 1
                      ? "red"
                      : item.id === 2
                        ? "green"
                        : item.id === 3
                          ? "orange"
                          : item.id === 4
                            ? "purple"
                            : "teal"
                    }`,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    borderColor: "#3498db",
                  },
                }}
              >
                <Box sx={{ fontSize: "2rem" }}>{item.icon}</Box>
                <CardContent sx={{ padding: 0, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      color: "black",
                    }}
                  >
                    {item.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div>
        <div>
          <CardContent></CardContent>
        </div>
      </div>
      <div>
        <CardContent></CardContent>
      </div>
      {value === 0 && (
        <div>
          <Grid container spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8} lg={8} sm={6}>
                <motion.div initial="hidden" whileHover={{ scale: 1.01 }}>
                  <Accordion expanded={true}>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                      sx={{
                        backgroundColor: `var(--grid-headerBackground)`,
                        color: `var(--grid-headerColor)`,
                        width: "100%",
                        marginTop: "-5%",
                        "&:hover": {
                          backgroundColor: `var(--grid-headerBackground)`, // Retain the same background on hover
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: `var(--grid-headerBackground)`, // Prevent focus styles from changing background
                        },
                        "&:focus-within": {
                          backgroundColor: `var(--grid-headerBackground)`, // Prevent focus from child elements (e.g., TextField) from changing background
                        },
                      }}
                    >
                      {isShow && (
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center", // Ensures vertical alignment
                          }}
                        >
                          {t("text.VEHICLEEXPENDITURE")}
                          <Grid
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <TextField
                              placeholder={t("text.Search")}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon
                                      sx={{
                                        color: `var(--grid-headerBackground)`,
                                      }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#f1f1f1",
                                borderRadius: "20px",
                                width: "150px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "0.8rem",
                                  padding: "4px 8px",
                                  "& fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&:hover fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                },
                              }}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                console.log("Search Term:", e.target.value); // Debugging search term updates
                              }}
                            />
                            <PrintIcon
                              fontSize="large"
                              sx={{ color: "white", cursor: "pointer" }}
                              onClick={handlePrint}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getTop}
                                  onChange={(e) => setGetTop(e.target.checked)}
                                  sx={{
                                    color: "white",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "white" }}>
                                  {t("text.top10")}
                                </span>
                              }
                            />
                          </Grid>{" "}
                        </Typography>
                      )}
                      {isShow2 && (
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center", // Ensures vertical alignment
                          }}
                        >
                          {t("text.Complaints")}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <TextField
                              placeholder={t("text.Search")}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon
                                      sx={{
                                        color: `var(--grid-headerBackground)`,
                                      }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#f1f1f1",
                                borderRadius: "20px",
                                width: "150px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "0.8rem",
                                  padding: "4px 8px",
                                  "& fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&:hover fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                },
                              }}
                              onChange={(e) => setSearchTerm1(e.target.value)}
                            />
                            <PrintIcon
                              fontSize="large"
                              sx={{ color: "white", cursor: "pointer" }}
                              onClick={handlePrint1}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getTop}
                                  onChange={(e) => setGetTop(e.target.checked)}
                                  sx={{
                                    color: "white",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "white" }}>
                                  {t("text.top10")}
                                </span>
                              }
                            />
                          </div>
                        </Typography>
                      )}

                      {isShow3 && (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center", // Ensures vertical alignment
                          }}
                        >
                          {t("text.INSURANCE")}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <TextField
                              placeholder={t("text.Search")}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon
                                      sx={{
                                        color: `var(--grid-headerBackground)`,
                                      }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#f1f1f1",
                                borderRadius: "20px",
                                width: "150px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "0.8rem",
                                  padding: "4px 8px",
                                  "& fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&:hover fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                },
                              }}
                              onChange={(e) => setSearchTerm2(e.target.value)} // Update search term state
                            />
                            <PrintIcon
                              fontSize="large"
                              sx={{ color: "white", cursor: "pointer" }}
                              onClick={handlePrint2}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getTop}
                                  onChange={(e) => setGetTop(e.target.checked)}
                                  sx={{
                                    color: "white",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "white" }}>
                                  {t("text.top10")}
                                </span>
                              }
                            />
                          </div>
                        </Typography>
                      )}
                      {isShow4 && (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center", // Ensures vertical alignment
                          }}
                        >
                          {t("text.REGISTRATION")}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <TextField
                              placeholder={t("text.Search")}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon
                                      sx={{
                                        color: `var(--grid-headerBackground)`,
                                      }}
                                    />{" "}
                                    {/* Add the search icon */}
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#f1f1f1",
                                borderRadius: "20px",
                                width: "150px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "0.8rem",
                                  padding: "4px 8px",
                                  "& fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&:hover fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                },
                              }}
                              onChange={(e) => setSearchTerm3(e.target.value)} // Update search term state
                            />
                            <PrintIcon
                              fontSize="large"
                              sx={{ color: "white", cursor: "pointer" }}
                              onClick={handlePrint3}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getTop}
                                  onChange={(e) => setGetTop(e.target.checked)}
                                  sx={{
                                    color: "white",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "white" }}>
                                  {t("text.top10")}
                                </span>
                              }
                            />
                          </div>
                        </Typography>
                      )}
                      {isShow5 && (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center", // Ensures vertical alignment
                          }}
                        >
                          {t("text.SERVICES")}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <TextField
                              placeholder={t("text.Search")}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon
                                      sx={{
                                        color: `var(--grid-headerBackground)`,
                                      }}
                                    />{" "}
                                    {/* Add the search icon */}
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#f1f1f1",
                                borderRadius: "20px",
                                width: "150px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "0.8rem",
                                  padding: "4px 8px",
                                  "& fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&:hover fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                },
                              }}
                              onChange={(e) => setSearchTerm4(e.target.value)} // Update search term state
                            />
                            <PrintIcon
                              fontSize="large"
                              sx={{ color: "white", cursor: "pointer" }}
                              onClick={handlePrint4}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getTop}
                                  onChange={(e) => setGetTop(e.target.checked)}
                                  sx={{
                                    color: "white",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "white" }}>
                                  {t("text.top10")}
                                </span>
                              }
                            />
                          </div>
                        </Typography>
                      )}
                      {isShow6 && (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center", // Ensures vertical alignment
                          }}
                        >
                          {t("text.SCRAPDETAIL")}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <TextField
                              placeholder={t("text.Search")}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon
                                      sx={{
                                        color: `var(--grid-headerBackground)`,
                                      }}
                                    />{" "}
                                    {/* Add the search icon */}
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#f1f1f1",
                                borderRadius: "20px",
                                width: "150px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "0.8rem",
                                  padding: "4px 8px",
                                  "& fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&:hover fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: `var(--grid-headerBackground)`,
                                  },
                                },
                              }}
                              onChange={(e) => setSearchTerm5(e.target.value)} // Update search term state
                            />
                            <PrintIcon
                              fontSize="large"
                              sx={{ color: "white", cursor: "pointer" }}
                              onClick={handlePrint5}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getTop}
                                  onChange={(e) => setGetTop(e.target.checked)}
                                  sx={{
                                    color: "white",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "white" }}>
                                  {t("text.top10")}
                                </span>
                              }
                            />
                          </div>
                        </Typography>
                      )}
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        background: "white",
                        height: "50vh",
                        overflow: "auto",
                      }}
                    >
                      {isShow && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} lg={12}>
                           
                            {isLoading1 ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "100%",
                                }}
                              >
                                <CircularProgress />
                              </div>
                            ) : (
                              <div ref={reportRef}>
                                <DataGrid
                                  rows={
                                    getTop
                                      ? filteredRows.slice(0, 10) // Apply filtering and Top 10 logic
                                      : filteredRows
                                  }
                                
                                  columns={[
                                   
                                    {
                                      field: "vehicleNo",
                                      headerName: t("text.vehicleNo12"),
                                      flex: 1,
                                      minWidth: 110,
                                      renderCell: (params) => (
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            color: "#007bff",
                                          }}
                                          onClick={() => {
                                            navigate(
                                              `/Reports/VehicleItemService`,
                                              {
                                                state: {
                                                  vehicleNo:
                                                    params.row.vehicleNo,
                                                },
                                               
                                              }
                                            );
                                          }}
                                        >
                                          {params.row.vehicleNo}
                                        </span>
                                      ),
                                    },
                                    {
                                      field: "vehicleTypename",
                                      headerName: t("text.VehicleType"),
                                      flex: 1.2,
                                      minWidth: 140
                                    },
                                    {
                                      field: "actprice",
                                      headerName: t("text.ActualPrice"),
                                      flex: 0.7,
                                      minWidth: 100
                                    },
                                    {
                                      field: "amount",
                                      headerName: t("text.Expense"),
                                      flex: 0.7,
                                      minWidth: 100
                                    },
                                    {
                                      field: "grossPercent",
                                      headerName: t("text.GrossExpenditurePercent"),
                                      headerClassName: "MuiDataGrid-colCell",
                                      cellClassName: "wrap-text",
                                      flex: 1,
                                      minWidth: 140,
                                      renderCell: (params) => (
                                        (params.row.grossPercent > 75) ? (<span
                                          style={{
                                            cursor: "pointer",
                                            color: "red",
                                          }}
                                        >
                                          {params.row.grossPercent + "%"}
                                        </span>) : (<span
                                          style={{
                                            cursor: "pointer",
                                            color: "#007bff",
                                          }}
                                        >
                                          {params.row.grossPercent + "%"}
                                        </span>)
                                      ),
                                    },
                                    {
                                      field: "age",
                                      headerName: t("text.Age"),
                                      flex: 0.7,
                                    },
                                  ]}
                                
                                  slots={{
                                    toolbar: GridToolbar,
                                  }}


                                  slotProps={{
                                    toolbar: {
                                      showQuickFilter: true,
                                    },
                                  }}

                                  autoHeight={false}
                                  sx={{
                                    border: 0,
                                    "& .MuiDataGrid-columnHeaders": {
                                      backgroundColor: `var(--grid-headerBackground)`,
                                      color: `var(--grid-headerColor)`,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    },
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                      color: "white",
                                    },
                                    "& .MuiDataGrid-cell": {
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    },
                                    height: 400,
                                    overflowY: "auto",
                                  }}

                                />
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      )}
                      {isShow2 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} lg={12}>
                           
                            {isLoading1 ? (
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
                              <div ref={reportRef}>
                                <DataGrid
                                  rows={
                                    getTop
                                      ? filteredRows1.slice(0, 10) // Apply filtering and Top 10 logic
                                      : filteredRows1
                                  }
                                  //   rows={ComplaintsOption.length > 0 ? ComplaintsOption : []}
                                  columns={[
                                    {
                                      field: "vehicleNo",
                                      headerName: t("text.vehicleNo12"),
                                      flex: 1,
                                      renderCell: (params) => (
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            color: "#007bff",
                                          }}
                                          onClick={() => {
                                            navigate(
                                              `/Reports/ComplainStatus`,
                                              {
                                                state: {
                                                  vehicleNo:
                                                    params.row.vehicleNo,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {params.row.vehicleNo}
                                        </span>
                                      ),
                                    },
                                    {
                                      field: "noOfComplaints",
                                      headerName: t("text.noOfComplaints"),
                                      flex: 1,
                                    },
                                    {
                                      field: "totaldays",
                                      headerName: t("text.totaldays"),
                                      flex: 1,
                                    },
                                    {
                                      field: "amount",
                                      headerName: t("text.Expense"),
                                      flex: 1,
                                    },
                                    {
                                      field:"status",
                                      headerName: t("text.Status"),
                                      flex: 1,
                                    }
                                  ]}
                                 
                                  slots={{
                                    toolbar: GridToolbar,
                                  }}


                                  slotProps={{
                                    toolbar: {
                                      showQuickFilter: true,
                                    },
                                  }}

                                  autoHeight={false}
                                  sx={{
                                    border: 0,
                                    "& .MuiDataGrid-columnHeaders": {
                                      backgroundColor: `var(--grid-headerBackground)`,
                                      color: `var(--grid-headerColor)`,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    },
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                      color: "white",
                                    },
                                    "& .MuiDataGrid-cell": {
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    },
                                    height: 400,
                                    overflowY: "auto",
                                  }}

                                />
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      )}
                      {isShow3 && (
                        <Grid container spacing={2}>
                         
                          <Grid item xs={12} sm={12} lg={12}>
                            {isLoading1 ? (
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
                              <div ref={reportRef}>
                                <DataGrid
                                  rows={
                                    getTop
                                      ? filteredRows2.slice(0, 10) // Apply filtering and Top 10 logic
                                      : filteredRows2
                                  }
                                  //  rows={ReorderOption.length > 0 ? ReorderOption : []}
                                  columns={[
                                    {
                                      field: "vehicleNo",
                                      headerName: t("text.vehicleNo12"),
                                      flex: 1,
                                    },
                                    {
                                      field: "effectiveDate",
                                      headerName: t("text.effectiveDate"),
                                      flex: 1,
                                      renderCell(params) {
                                        return dayjs(
                                          params.row.effectiveDate
                                        ).format("DD-MMM-YYYY");
                                      },
                                    },
                                    {
                                      field: "todate",
                                      headerName: t("text.ExpiryDate"),
                                      flex: 1,
                                      renderCell(params) {
                                        return dayjs(params.row.todate).format(
                                          "DD-MMM-YYYY"
                                        );
                                      },
                                    },
                                    // {
                                    //   field: "attachment",
                                    //   headerName: t("text.Document"),
                                    //   flex: 1.5,
                                    // },
                                    {
                                      field: "attachment",
                                      headerName: t("text.Document"),
                                      flex: 1.5,
                                      renderCell: (params) =>
                                        params.row.attachment ? (
                                          <span
                                            onClick={() => handleClickOpen(params.row.attachment)}
                                            style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                                          >
                                            View Image
                                          </span>
                                        ) : (
                                          "No Image"
                                        ),
                                    },
                                    
                                    // {
                                    //   field: "licenceType",
                                    //   headerName: t("text.DocumentType"),
                                    //   flex: 1,
                                    // },
                                  ]}
                                 
                                  slots={{
                                    toolbar: GridToolbar,
                                  }}


                                  slotProps={{
                                    toolbar: {
                                      showQuickFilter: true,
                                    },
                                  }}

                                  autoHeight={false}
                                  sx={{
                                    border: 0,
                                    "& .MuiDataGrid-columnHeaders": {
                                      backgroundColor: `var(--grid-headerBackground)`,
                                      color: `var(--grid-headerColor)`,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    },
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                      color: "white",
                                    },
                                    "& .MuiDataGrid-cell": {
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    },
                                    height: 400,
                                    overflowY: "auto",
                                  }}

                                />
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      )}
   <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>
    Document Preview
    <IconButton
      aria-label="close"
      onClick={handleCloseicon}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <img src={selectedImage} alt="Document Preview" style={{ width: "100%" }} />
  </DialogContent>
</Dialog>;
                      {isShow4 && (
                        <Grid container spacing={2}>
                         
                          <Grid item xs={12} sm={12} lg={12}>
                            {isLoading1 ? (
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
                              <div ref={reportRef}>
                                <DataGrid
                                  rows={
                                    getTop
                                      ? filteredRows3.slice(0, 10) // Apply filtering and Top 10 logic
                                      : filteredRows3
                                  }
                                  // rows={OverDueOption.length > 0 ? OverDueOption : []}
                                  columns={[
                                    {
                                      field: "vehicleNo",
                                      headerName: t("text.vehicleNo12"),
                                      flex: 0.9,
                                    },
                                    {
                                      field: "vehicleRegistrationDate",
                                      headerName: t("text.RegistrationOn"),
                                      flex: 1,
                                      renderCell(params) {
                                        return dayjs(
                                          params.row.vehicleRegistrationDate
                                        ).format("DD-MMM-YYYY");
                                      },
                                    },
                                    // {
                                    //   field: "filename",
                                    //   headerName: t("text.RCDocument1"),
                                    //   flex: 1,
                                    // },
                                    {
                                      field: "filename",
                                      headerName: t("text.RCDocument1"),
                                      flex: 1,
                                      renderCell: (params) =>
                                        params.row.filename ? (
                                          <span
                                            onClick={() => handleClickOpen(params.row.filename)}
                                            style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                                          >
                                            View Image
                                          </span>
                                        ) : (
                                          "No Image"
                                        ),
                                    },
                                    // {
                                    //   field: "vehiclePhotoFile",
                                    //   headerName: t("text.vehiclePhoto"),
                                    //   flex: 1.2,
                                    // },
                                    {
                                      field: "vehiclePhotoFile",
                                      headerName: t("text.vehiclePhoto"),
                                      flex: 1,
                                      renderCell: (params) =>
                                        params.row.vehiclePhotoFile ? (
                                          <span
                                            onClick={() => handleClickOpen(params.row.vehiclePhotoFile)}
                                            style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                                          >
                                            View Image
                                          </span>
                                        ) : (
                                          "No Image"
                                        ),
                                    },
                                    {
                                      field: "vehicleTypename",
                                      headerName: t("text.VehicleType"),
                                      flex: 1,
                                    },
                                  ]}
                                
                                  slots={{
                                    toolbar: GridToolbar,
                                  }}


                                  slotProps={{
                                    toolbar: {
                                      showQuickFilter: true,
                                    },
                                  }}

                                  autoHeight={false}
                                  sx={{
                                    border: 0,
                                    "& .MuiDataGrid-columnHeaders": {
                                      backgroundColor: `var(--grid-headerBackground)`,
                                      color: `var(--grid-headerColor)`,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    },
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                      color: "white",
                                    },
                                    "& .MuiDataGrid-cell": {
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    },
                                    height: 400,
                                    overflowY: "auto",
                                  }}

                                />
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      )}

                      {isShow5 && (
                        <Grid container spacing={2}>
                       
                          <Grid item xs={12} sm={12} lg={12}>
                            {isLoading1 ? (
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
                              <div ref={reportRef}>
                                <DataGrid
                                  rows={
                                    getTop
                                      ? filteredRows4.slice(0, 10) // Apply filtering and Top 10 logic
                                      : filteredRows4
                                  }
                                  //rows={IssuedStatusOption.length > 0 ? IssuedStatusOption : []}
                                  columns={[
                                    // {
                                    //   field: "vehicleno",
                                    //   headerName: t("text.vehicleNo12"),
                                    //   flex: 1,
                                    // },
                                    {
                                      field: "vehicleno",
                                      headerName: t("text.vehicleNo12"),
                                      flex: 1,
                                      renderCell: (params) => (
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            color: "#007bff",
                                          }}
                                          onClick={() => {
                                            navigate(
                                              `/vehiclemanagement/vehiclecomplaints/jobworkchallanrecieve`,
                                              {
                                                state: {
                                                  vehicleno:
                                                    params.row.vehicleno,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {params.row.vehicleno}
                                        </span>
                                      ),
                                    },
                                    {
                                      field: "noOfServices",
                                      headerName: t("text.noOfServices"),
                                      flex: 1,
                                    },
                                    {
                                      field: "jobCardDate",
                                      headerName: t("text.LastService"),
                                      flex: 1,
                                      renderCell(params) {
                                        return dayjs(
                                          params.row.jobCardDate
                                        ).format("DD-MMM-YYYY");
                                      },
                                    },
                                  ]}
                                  
                                  slots={{
                                    toolbar: GridToolbar,
                                  }}


                                  slotProps={{
                                    toolbar: {
                                      showQuickFilter: true,
                                    },
                                  }}

                                  autoHeight={false}
                                  sx={{
                                    border: 0,
                                    "& .MuiDataGrid-columnHeaders": {
                                      backgroundColor: `var(--grid-headerBackground)`,
                                      color: `var(--grid-headerColor)`,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    },
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                      color: "white",
                                    },
                                    "& .MuiDataGrid-cell": {
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    },
                                    height: 400,
                                    overflowY: "auto",
                                  }}

                                />
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      )}
                      {isShow6 && (
                        <Grid container spacing={2}>
                        
                          <Grid item xs={12} sm={12} lg={12}>
                            {isLoading1 ? (
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
                              <div ref={reportRef}>
                                <DataGrid
                                  rows={
                                    getTop
                                      ? filteredRows5.slice(0, 10) // Apply filtering and Top 10 logic
                                      : filteredRows5
                                  }
                                  // rows={DocumentTypeOption.length > 0 ? DocumentTypeOption : []}
                                  columns={[
                                    {
                                      field: "vehicleNo",
                                      headerName: t("text.vehicleNo12"),
                                      flex: 1,
                                    },
                                    {
                                      field: "date",
                                      headerName: t("text.ScrapDate"),
                                      flex: 1,
                                      renderCell(params) {
                                        return dayjs(params.row.date).format(
                                          "DD-MM-YYYY"
                                        );
                                      },
                                    },
                                  ]}
                                
                                  slots={{
                                    toolbar: GridToolbar,
                                  }}


                                  slotProps={{
                                    toolbar: {
                                      showQuickFilter: true,
                                    },
                                  }}

                                  autoHeight={false}
                                  sx={{
                                    border: 0,
                                    "& .MuiDataGrid-columnHeaders": {
                                      backgroundColor: `var(--grid-headerBackground)`,
                                      color: `var(--grid-headerColor)`,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    },
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                      color: "white",
                                    },
                                    "& .MuiDataGrid-cell": {
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    },
                                    height: 400,
                                    overflowY: "auto",
                                  }}

                                />
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4} lg={4} sm={6}>
                <motion.div initial="hidden" whileHover={{ scale: 1.01 }}>
                  <Card
                    elevation={2}
                    style={{
                      marginLeft: "1%",
                      marginTop: "-10%",
                      //   border: "0.03% solid transparent",
                      border: "2px solid #e0e0e0",
                      //  borderRadius: "4%",
                      height: "62.5vh",
                      overflow: "auto",
                    }}
                  >
                    <Grid
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                        overflow: "auto",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          padding: "4%",
                          backgroundColor: `var(--grid-headerBackground)`,
                          color: `var(--grid-headerColor)`,
                          fontWeight: "bold",
                          width: "100%",
                        }}
                      >
                        {t("text.ComplaintStatus")}
                        <br />
                      </Typography>
                    
                      <div style={{ padding: "2%" }}>
                        {Object.keys(complaints).map((key) => (
                          <div key={key}>
                            <Typography
                              variant="h6"
                              style={{
                                color:
                                  key.toLowerCase() === "inhouse"
                                    ? "grey"
                                    : getColor(key),
                                cursor:
                                  key.toLowerCase() === "inhouse"
                                    ? "default"
                                    : "pointer",
                                fontSize: "100%",
                                margin: "2.5%",
                              }}
                              onClick={() =>
                                key.toLowerCase() !== "inhouse" &&
                                handleClick1(key)
                              }
                            >
                              {t(`text.${key.toUpperCase()}`)}:{" "}
                              {complaints[key as keyof typeof complaints]}
                            </Typography>
                            <ProgressBar
                              completed={calculatePercentage(
                                complaints[key as keyof typeof complaints],
                                total
                              )}
                              bgColor={getColor(key)}
                            />
                          </div>
                        ))}
                      </div>
                    </Grid>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
            <Grid
              xs={12}
              lg={12}
              sm={12}
              item
              sx={{ justifyContent: "center" }}
            >
              <Dialog
                open={isVisible}
                onClose={handleClose2}
                fullWidth
                maxWidth="lg"
                sx={{
                  "& .MuiDialogContent-root": {
                    padding: "5%",
                    height: "50vh",
                  },
                }}
              />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
const getColor = (status: string) => {
  switch (status) {
    case "pending":
      return "red";
    case "inprogress":
      return "#e3be29";
    case "outsource":
      return "blue";
    case "inhouse":
      return "purple";
    case "Complete":
      return "green";
    default:
      return "white";
  }
};
