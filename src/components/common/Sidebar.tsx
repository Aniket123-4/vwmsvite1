import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import help from "../../assets/images/help.png";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Stack,
  Tooltip,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import call from "../../assets/images/phone-call.png";
import roles from "../../assets/images/role-model.png";
import tick from "../../assets/images/check-mark.png";
import crs from "../../assets/images/cross.png";
import log from "../../assets/images/profile.png";
import emails from "../../assets/images/gmail.png";
import genders from "../../assets/images/symbol.png";
import dobs from "../../assets/images/timetable.png";
import id from "../../assets/images/profile1.png";
import settings from "../../assets/images/settings.png";
import trans from "../../assets/images/translation.png";
import logout from "../../assets/images/logout.png";
import logged from "../../assets/images/permission.png";
import logo from "../../assets/images/recyclebinLogo.png";
import loged from "../../assets/images/DrawerLogo.png";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { Home } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import Typewriter from "./TypeWriter";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FolderIcon from "@mui/icons-material/Folder";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import "./Shine.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import names from "../../assets/images/id-card (2).png";
import backgrd from "../../assets/images/backgroundimage.jpg";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  // Typography,
} from "@mui/material";
import "./ThemeStyle.css";
import ThemeIcon from "../../assets/images/themes.png";
import ThemeIcon1 from "../../assets/images/themes1.png";

import {
  Brightness5,
  Brightness4,
  Waves,
  WbSunny,
  Forest,
  Flag,
} from "@mui/icons-material";
import api from "../../utils/Url";
import { toast } from "react-toastify";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import TreeView from "@mui/x-tree-view/TreeView";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

import { FaRegFolderOpen } from "react-icons/fa6";
import DescriptionIcon from "@mui/icons-material/Description";

import { FaFileLines } from "react-icons/fa6";

// Constants
const DRAWER_WIDTH = 225;
const GREETING_CONFIGS = [
  {
    maxHour: 12,
    text: "Good Morning",
    color: "#FFFFE0",
    icon: "🌅"
  },
  {
    maxHour: 17,
    text: "Good Afternoon",
    color: "#FFE4B5",
    icon: "🌞"
  },
  {
    maxHour: 24,
    text: "Good Evening",
    color: "#FFDAB9",
    icon: "🌜"
  }
];

// Reusable transition creator
const createTransition = (
  theme: Theme,
  props: string | string[],
  duration: 'leavingScreen' | 'enteringScreen'
) => theme.transitions.create(props, {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration[duration]
});

// Common styles
const baseMixin = (theme: Theme): CSSObject => ({
  overflowX: "hidden",
  width: DRAWER_WIDTH
});

const openedMixin = (theme: Theme): CSSObject => ({
  ...baseMixin(theme),
  transition: createTransition(theme, "width", "enteringScreen")
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: createTransition(theme, "width", "leavingScreen"),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(12)} + 1px)`
  }
});

// Styled components
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

interface AppBarProps extends MuiAppBarProps { open?: boolean }

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: createTransition(theme, ["width", "margin"], "leavingScreen"),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: createTransition(theme, ["width", "margin"], "enteringScreen")
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open ? {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  } : {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

// Helper functions
const getGreeting = () => {
  const hour = new Date().getHours();
  return GREETING_CONFIGS.find(config => hour < config.maxHour) || GREETING_CONFIGS[2];
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "85%",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10
};

export default function MiniDrawer({ items }: any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [collapseIndex, setCollapseIndex] = React.useState<any>(null);
  const [activeMenu, setActiveMenu] = React.useState<number | null>(null);
  const [openlogo, setOpenlogo] = React.useState(true);
  const [homeColor, setHomeColor] = React.useState("inherit");
  const { t } = useTranslation();
  const [menuData, setMenuData] = React.useState([]);
  const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);
  const [openMenus, setOpenMenus] = React.useState<Set<number>>(new Set());
  const [expandedItems, setExpandedItems] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [treedata, setTreedata] = React.useState<any>([]);
  const [check, setCheck] = React.useState<any>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);

  const themes = [
    { name: "light-theme", icon: <Brightness5 /> },
    { name: "dark-theme", icon: <Brightness4 /> },
    { name: "ocean-theme", icon: <Waves /> },
    { name: "sunset-theme", icon: <WbSunny /> },
    { name: "forest-theme", icon: <Forest /> },
    { name: "bhagwa-theme", icon: <Flag /> },
  ];

  const greeting = getGreeting();
  const navigate = useNavigate();
  React.useEffect(() => { setMenuData(items); }, []);
  const handleMenuClick = (menu: any) => { setActiveMenu(menu.menuId); menu.children?.length ? toggleMenu(menu.menuId, menu.parentId) : menu.path && navigate(menu.path); };

  const toggleMenu = (menuId: number, parentId: number | null) => setOpenMenus((prev: Set<number>) => { const next = new Set(prev); next.has(menuId) ? next.delete(menuId) : (parentId === null && next.clear(), next.add(menuId)); return next; });

  const parentMenuOrder = ["Vehicle Management", "Store Management", "Communication", "Vendor Info", "Employee Info", "Reports", "Admin"];

  const storeManagementChildOrder = ["Item Detail", "Indent For Staff", "WorkShop Indent", "Item Issue", "Item Return", "PurchaseOrder", "Material Receipt Note", "Quality Check", "Store Master", "Stock Opening", "Off.Purchase Indent", "PurchaseInvoice"];

  const sortParentMenus = (menus: any[]) => {
    const orderMap = new Map(
      parentMenuOrder.map((name, index) => [name, index])
    );
    return menus.slice().sort((a, b) => {
      const indexA: any = orderMap.has(a.menuName)
        ? orderMap.get(a.menuName)
        : Infinity;
      const indexB: any = orderMap.has(b.menuName)
        ? orderMap.get(b.menuName)
        : Infinity;
      return indexA - indexB;
    });
  };
  // Function to sort child menus
  const sortChildMenus = (parentMenuName: string, menus: any[]) =>
    parentMenuName === "Store Management"
      ? menus.slice().sort((a, b) => {
        const orderMap = new Map(storeManagementChildOrder?.map((name, index) => [name, index]));
        const indexA = orderMap?.get(a.menuName) ?? Infinity;
        const indexB = orderMap?.get(b.menuName) ?? Infinity;
        return indexA - indexB;
      })
      : menus.slice().sort((a, b) => a.menuId - b.menuId);

      // const renderMenu = (menus: any[], level = 0, parentMenuName = "") => {
      //   const sortedMenus = level === 0 ? sortParentMenus(menus) : sortChildMenus(parentMenuName, menus);
      //   return sortedMenus.map((menu: any) => (
      //     <React.Fragment key={menu.menuId}>
      //       <ListItem
      //         component="button"
      //         sx={{
      //           display: "flex", justifyContent: "space-between", alignItems: "center",
      //           backgroundColor: activeMenu === menu.menuId ? "#dfe6f5" : "inherit",
      //           paddingLeft: `${level * 14}px`, paddingY: 0.5, cursor: "pointer",
      //           "&:hover": { backgroundColor: "#e0ecff" },
      //           borderRadius: "4px", boxShadow: "none", border: "none", marginY: 0.3
      //         }}
      //         onClick={() => handleMenuClick(menu)}
      //       >
      //         <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      //           <ListItemIcon
      //             sx={{ minWidth: "32px", justifyContent: "center", color: activeMenu === menu.menuId ? "#FF0000" : "#333", fontWeight: 600 }}
      //             onClick={(e) => { e.stopPropagation(); toggleMenu(menu.menuId, menu.parentId); }}
      //           >
      //             {menu.children?.length > 0
      //               ? (openMenus.has(menu.menuId)
      //                   ? <FaRegFolderOpen style={{ color: "#42AEEE", fontSize: "18px" }} />
      //                   : <FolderIcon style={{ color: "#42AEEE", fontSize: "18px" }} />)
      //               : <DescriptionIcon style={{ color: "#42AEEE", fontSize: "18px" }} />}
      //           </ListItemIcon>
      //           <Tooltip title={menu.menuName} arrow>
      //             <ListItemText
      //               primary={open ? menu.menuName : menu.menuName.charAt(0).toUpperCase()}
      //               sx={{
      //                 fontWeight: "bold", fontSize: "13px",
      //                 color: activeMenu === menu.menuId ? "#0056b3" : "var(--grid-menuColor)",
      //                 overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
      //               }}
      //             />
      //           </Tooltip>
      //         </Box>
      //         {menu.children?.length > 0 && (
      //           <ListItemIcon
      //             sx={{ paddingRight: "12px", minWidth: "32px", justifyContent: "flex-end", cursor: "pointer", color: "#42AEEE" }}
      //             onClick={(e) => { e.stopPropagation(); toggleMenu(menu.menuId, menu.parentId); }}
      //           >
      //             {openMenus.has(menu.menuId) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      //           </ListItemIcon>
      //         )}
      //       </ListItem>
      //       {openMenus.has(menu.menuId) && menu.children?.length > 0 && (
      //         <Box sx={{ paddingLeft: 2 }}>{renderMenu(menu.children, level + 1, menu.menuName)}</Box>
      //       )}
      //     </React.Fragment>
      //   ));
      // };
      
  const renderMenu = (menus: any[], level = 0, parentMenuName = "") => {
    const sortedMenus = level === 0 ? sortParentMenus(menus) : sortChildMenus(parentMenuName, menus);
    return sortedMenus.map((menu: any) => (
      <List key={menu.menuId} sx={{ paddingY: 0.5, paddingX: 0 }}>
        <Divider />
        <ListItem component="button" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: activeMenu === menu.menuId ? "#dfe6f5" : "inherit", paddingLeft: `${level * 14}px`, paddingY: 0.3, cursor: "pointer", "&:hover": { backgroundColor: "#ccccff" }, borderRadius: "6px", borderColor:"white", transition: "background 0.2s ease-in-out" }} onClick={() => handleMenuClick(menu)}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <ListItemIcon sx={{ minWidth: "32px", justifyContent: "center", color: activeMenu === menu.menuId ? "#FF0000" : "#333", fontWeight: 600 }} onClick={(e) => { e.stopPropagation(); toggleMenu(menu.menuId, menu.parentId); }}>
              {menu.children && menu.children.length > 0 ? (
                openMenus.has(menu.menuId) ? <FaRegFolderOpen style={{ color: "#42AEEE", fontSize: "18px" }} /> : <FolderIcon style={{ color: "#42AEEE", fontSize: "18px" }} />
              ) : (
                <DescriptionIcon style={{ color: "#42AEEE", fontSize: "18px" }} />
              )}
            </ListItemIcon>
            <Tooltip title={menu.menuName} arrow>
              <ListItemText primary={open ? menu.menuName : menu.menuName.charAt(0).toUpperCase()} sx={{ fontWeight: "bold", fontSize: "13px", color: activeMenu === menu.menuId ? "#0056b3" : "var(--grid-menuColor)", transition: "color 0.2s ease-in-out", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} />
            </Tooltip>
          </Box>
          {menu.children && menu.children.length > 0 && (
            <ListItemIcon sx={{ paddingRight: "16px", minWidth: "32px", justifyContent: "flex-end", cursor: "pointer", color: "#42AEEE" }} onClick={(e) => { e.stopPropagation(); toggleMenu(menu.menuId, menu.parentId); }}>
              {openMenus.has(menu.menuId) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </ListItemIcon>
          )}
        </ListItem>
        {openMenus.has(menu.menuId) && menu.children && menu.children.length > 0 && (
          <List sx={{ paddingLeft: 2, backgroundColor: "inherit" }}>
            {renderMenu(menu.children, level + 1, menu.menuName)}
          </List>
        )}
      </List>
    ));
  };

  

  interface MenuItem { Icon: any; displayNo: number; menuId: number; items: MenuItem[]; label: string; menuName: string; path: string; }

  const handleNavigation = (path: any) => { navigate(path); };

  const handleAutocompleteChange = (event: any, value: any) => {
    const selectedItem = items.find((item: any) =>
      item.items.some((subItem: any) => subItem.name === value)
    );
    if (selectedItem) {
      const selectedSubItem = selectedItem.items.find(
        (subItem: any) => subItem.name === value
      );
      if (selectedSubItem) {
        handleNavigation(selectedSubItem.path);
      }
    }
  };
  const allMenuNames = items.reduce((acc: any, item: { items: any[] }) => {
    if (item.items) {
      return [
        ...acc,
        ...item.items.map((subItem: { menuName: any }) => subItem.menuName),
      ];
    }
    return acc;
  }, []);
  const filteredItemed = allMenuNames.filter((item: string) => item.toLowerCase().includes(searchValue.toLowerCase()));

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    const expandedMenuIds: any = new Set();
    if (value === "") {
      setFilteredItems(items);
      setOpenMenus(new Set());
      return;
    }
    const filtered = items.reduce((acc: any, menu: any) => {
      if (menu.menuName.toLowerCase().includes(value)) {
        acc.push(menu);
        expandedMenuIds.add(menu.menuId);
      } else if (menu.children) {
        const filteredChildren = menu.children.filter((child: any) => child.menuName.toLowerCase().includes(value));
        if (filteredChildren.length > 0) {
          acc.push({ ...menu, children: filteredChildren });
          expandedMenuIds.add(menu.menuId);
        }
      }
      return acc;
    }, []);
    setFilteredItems(filtered);
    setOpenMenus(expandedMenuIds);
  };
  var [date, setDate] = React.useState(new Date());
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit", month: "short", year: "numeric",
  };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .split(" ")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });
  const handleSubMenuClick = (index: any) => {
    console.log(index);
    setSelectedSubMenu(index);
  };
  const resetHomeColor = () => {
    setHomeColor("#FF0000");
  };
  const backgroundStyle = {
    background: "linear-gradient(45deg, #fff, #f0f)",
    backgroundSize: "400% 400%",
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    setHomeColor("inherit");
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };
  const routeChangeHome = () => {
    let path = `/home`;
    navigate(path);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
    setOpenlogo(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
    setOpenlogo(false);
  };
  const Logout = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("username");
    localStorage.removeItem("ApplicationFlow");
    localStorage.removeItem("permissions");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.clear();  //  Clear all stored data safely
    sessionStorage.clear();
    window.location.href = window.location.origin; //  Redirect to login
    navigate("/");
  };
  function onClick(e: any, item: any) {
    let path = item.path;
    if (path == "" || path == null || path == "undefind") {
      window.alert("Path Not Found ????");
    } else {
      navigate(path);
    }
  }
  const { i18n } = useTranslation();
  const changeLanguage = (language: any) => {
    i18n.changeLanguage(language);
    localStorage.setItem("preferredLanguage", language);
  };
  var currentLanguage = localStorage.getItem("preferredLanguage");
  var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";
  const collapsehamndle = (index: any) => {
    if (index == collapseIndex) {
      setCollapseIndex(-1);
    } else {
      setCollapseIndex(index);
    }
  };
  const getImageForFirstName = (
    firsT_NAME: any,
    middlE_NAME: any,
    suR_NAME: any
  ) => {
    const firstLetter = firsT_NAME ? firsT_NAME.charAt(0).toUpperCase() : "";
    const secondLetter = middlE_NAME ? middlE_NAME.charAt(0).toUpperCase() : "";
    const thirdLetter = suR_NAME ? suR_NAME.charAt(0).toUpperCase() : "";
    return `${firstLetter}${secondLetter}${thirdLetter}`;
  };
 
  const handleMyProfileClick = () => {
    setProfileDrawerOpen(!profileDrawerOpen);
  };
  const currentPathname = window.location.pathname;
  const segments = currentPathname.split("/").filter(Boolean);
  const isHomePage = segments.length === 0;
  function handleClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
  }
  const handleClickhome = () => {
    let path = `/home`;
    navigate(path);
  };
  function FirstLetters(props: any) {
    const { text } = props;
    const words = text.split(" ");
    const firstLetters = words.map((word: any) => word.charAt(0));
    const result = firstLetters.join("");
    return <div>{result}</div>;
  }
  const handleRightClick = (path: any) => (e: any) => {
    e.preventDefault();
    window.open(path, "_blank");
  };
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [userData, setUserData] = React.useState<any>(null);
  const [selectedTheme, setSelectedTheme] = React.useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : themes[0]["name"];
  });
  React.useEffect(() => {
    console.log(selectedTheme);
    document.body.className = selectedTheme;
    localStorage.setItem("theme", selectedTheme);
  }, [selectedTheme]);
  const handleThemeChange = (theme: any) => {
    setSelectedTheme(theme);
    setShowThemeMenu(false);
  };
  const handleCloseSelect = () => {
    setShowThemeMenu(false);
  };
  const headerColor1 = `var(--header-background)`;
  const drawerStyles = `var(--drawer-background)`;
  let ID: any = localStorage.getItem("username");
  if (!ID) {
    console.log("No username found, redirecting to login...");
    window.location.href = window.location.origin; //  Redirect to login if username is missing
  } else {
    ID = ID.replace(/^"(.*)"$/, "$1"); //  Only replace if ID exists
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 

  const defaultSelectedNodeId = parseInt(localStorage.getItem("id") + "");
  React.useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    const storedUsername = localStorage.getItem("username");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        const userDetails = parsedData.userDetails || parsedData;
        setUserData({
          ...userDetails,
          userName: userDetails.userName || storedUsername?.replace(/"/g, '') || "User"
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserData({
          userName: storedUsername?.replace(/"/g, '') || "User",
          email: "N/A",
          phoneNumber: "N/A"
        });
      }
    } else {
      setUserData({
        userName: storedUsername?.replace(/"/g, '') || "User",
        email: "N/A",
        phoneNumber: "N/A"
      });
    }
  }, []);

  const [nodeId, setnodeId] = React.useState<any>(0);
  const [nodeNames, setNodeNames] = React.useState<string>("");
  const handleToggle = (id: number, menuName: string) => () => {
    const currentIndex = check.indexOf(id);
    const newChecked = currentIndex === -1 ? [id] : [];
    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheck(newChecked);
    console.log("Checked data:", menuName);
    console.log("Checked data:", id);
    setNodeNames(menuName);
    setnodeId(id);
  };
  const handleSave = () => {
    console.log("handleSave function called");
    if (nodeId != 0 || nodeNames != "") {
      localStorage.setItem("id", nodeId);
      localStorage.setItem("nodeName", nodeNames);
      console.log("Checked Save:", { nodeId, nodeNames });
      handleCloseModal();
    } else {
      toast.error("Please Retry... Network Issues");
    }
  };
  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      itemId={String(nodes.id)}
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={check.indexOf(nodes.id) !== -1}
            onChange={handleToggle(nodes.id, nodes.menuName)}
            onClick={(event: any) => event.stopPropagation()}
          />
          <div style={{ marginLeft: 8 }}>{nodes.menuName}</div>
        </div>
      }
      onClick={() => toggleExpansion(nodes.id.toString())}
    >
      {Array.isArray(nodes.childnode)
        ? nodes.childnode.map((node: any) => renderTree(node))
        : null}
    </TreeItem>
  );
  const toggleExpansion = (nodeId: string) => {
    if (expandedItems.includes(nodeId)) {
      setExpandedItems(expandedItems.filter((item) => item !== nodeId));
    } else {
      setExpandedItems([...expandedItems, nodeId]);
    }
  };
  return (
    <Box sx={{ display: "flex" }}>
    <AppBar position="fixed" open={open} style={{}}>
  <Toolbar style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: `var(--header-background1)`, color: `var(--header-color1)` }}>
    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
      <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ ...(open && { display: "none" }) }}>
        <MenuIcon fontSize="large" />
      </IconButton>
      {!openlogo && <img src={logo} width={60} height={60} />}
    </div>
    <div style={{ fontSize: "2.5vw" }}>
      <div style={{ fontFamily: "Georgia, serif" }}>
        <span style={{ fontSize: "3vw", color: "#FFAE35" }}>V</span>
        <span style={{ fontSize: "2.2vw" }}>ehicle </span>
        <span style={{ fontSize: "3vw", color: "#D50E00" }}>W</span>
        <span style={{ fontSize: "2.2vw" }}>orkshop </span>
        <span style={{ fontSize: "3vw", color: "#FFE100" }}>M</span>
        <span style={{ fontSize: "2.2vw" }}>anagement </span>
        <span style={{ fontSize: "3vw", color: "#e69f9f" }}>S</span>
        <span style={{ fontSize: "2.2vw" }}>ystem</span>
      </div>
    </div>
    <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
      <Avatar sx={{ width: 40, height: 40, bgcolor: "#2196F3", color: "white" }}>
        {localStorage.getItem("username")?.replaceAll('"', "").charAt(0).toUpperCase()}
      </Avatar>
    </IconButton>
    <Menu anchorEl={anchorEl} id="account-menu" open={menuOpen} onClick={handleClose} PaperProps={{ elevation: 0, sx: { backgroundColor: `var(--menu-background)`, color: `var(--menu-color)`, overflow: "auto", filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))", paddingRight: "5px", paddingLeft: "5px", mt: 1.5, "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 }, "&::before": { content: '""', display: "block", position: "absolute", top: 0, right: 14, width: 10, height: 10, bgcolor: "background.paper", transform: "translateY(-50%) rotate(45deg)", zIndex: 0 } } }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
      <MenuItem onClick={handleClose}>
        <ListItemIcon><img src={logged} width={40} height={40} /></ListItemIcon> {localStorage.getItem("username")?.replaceAll('"', "")}
      </MenuItem>
      <MenuItem onClick={handleMyProfileClick}>
        <ListItemIcon><img src={id} width={30} height={30} /></ListItemIcon> My Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => { localStorage.getItem("preferredLanguage") == "hi" ? changeLanguage("en") : changeLanguage("hi"); }}>
        <ListItemIcon><img src={trans} width={30} height={30} /></ListItemIcon> Translate -- {newLanguage}
      </MenuItem>
      <MenuItem onClick={() => setShowThemeMenu(!showThemeMenu)}>
        <ListItemIcon><img src={ThemeIcon} width={30} height={30} /></ListItemIcon> Select Theme
      </MenuItem>
      <MenuItem onClick={() => { let path = "/Admin/HelpDesk"; navigate(path, { state: { activeMenu } }); }}>
        <ListItemIcon><img src={help} width={30} height={30} alt="Help Desk" /></ListItemIcon> Help Desk
      </MenuItem>
      <MenuItem onClick={() => navigate("/admin/flowmaster")}>
        <ListItemIcon><img src={ThemeIcon1} width={30} height={30} /></ListItemIcon> Flow Master
      </MenuItem>
      <Divider />
      <MenuItem onClick={Logout}>
        <ListItemIcon><img src={logout} width={30} height={30} /></ListItemIcon> Logout
      </MenuItem>
    </Menu>
  </Toolbar>
  <Dialog open={showThemeMenu} onClose={handleCloseSelect}>
    <DialogTitle>Select a Theme</DialogTitle>
    <DialogContent>
  <List>
    {themes.map((theme) => (
      <ListItem
        key={theme.name}
        component="div" // Or remove this line entirely
        sx={{
          cursor: 'pointer',
          backgroundColor: selectedTheme === theme.name ? 'action.selected' : 'inherit',
          '&:hover': { backgroundColor: 'action.hover' }
        }}
        onClick={() => handleThemeChange(theme.name)}
      >
        {theme.icon}
        <span style={{ marginLeft: "10px" }}>{theme.name}</span>
      </ListItem>
    ))}
  </List>
</DialogContent>
    <DialogActions>
      <Button onClick={handleCloseSelect}>Cancel</Button>
    </DialogActions>
  </Dialog>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: headerColor1, borderBottomRightRadius: "15px" }}>
    <div role="presentation" onClick={handleClicked}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#fff" }}>
        <Typography sx={{ display: "flex", color: "#fff", alignItems: "center" }}>
          <Link underline="hover" sx={{ display: "flex", color: "#fff", alignItems: "center", cursor: "pointer" }} color="inherit" onClick={handleClickhome}>
            <HomeIcon sx={{ ml: 1, mr: 1 }} fontSize="inherit" />
            Home
          </Link>
        </Typography>
        {segments.slice(1).map((segment, index) => (
          <Typography key={index} sx={{ display: "flex", color: "#fff", alignItems: "center" }}>
            {index > 0 && " / "}
            {index === segments.length - 2 ? (
              <span> {segment} </span>
            ) : (
              <Link underline="hover" sx={{ display: "flex", color: "#fff", alignItems: "center" }} color="inherit" href={`/${segments.slice(0, index + 1).join("/")}`}>
                {segment}
              </Link>
            )}
          </Typography>
        ))}
      </Breadcrumbs>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 15, paddingRight: "15px" }}>
      <p style={{ fontSize: "1.2vw", color: greeting.color }}>
        {greeting.icon} {greeting.text}
      </p>
      <p> Time : {date.toLocaleTimeString()}</p>
      <p> Date : {formattedDate}</p>
    </div>
  </div>
</AppBar>

      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: drawerStyles,
            color: `var(--drawer-color)`,
            width: DRAWER_WIDTH,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          },
        }}
      >
        <DrawerHeader>
          <>
            <Stack sx={{ width: "100%", height: "16vh" }} direction="row" justifyContent="center">
              {openlogo ? (
                <div style={{ paddingTop: "25px", paddingBottom: "25px" }}>
                  <img src={loged} width={100} height={100} />
                </div>
              ) : (
                <div style={{ padding: 0 }}></div>
              )}
            </Stack>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            <br />
            <br />
          </>
        </DrawerHeader>
        <br />
        <br />
        <Divider />
        {openlogo && (
          <Paper component="form" sx={{ m: "5px 5px", p: "0px 2px", display: "flex", alignItems: "center" }}>
            <Autocomplete
              freeSolo
              fullWidth
              size="small"
              options={items.reduce((acc: any, item: any) => {
                if (item.items) acc.push(...item.items.map((subItem: any) => subItem.menuName));
                return acc;
              }, [])}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Menu"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchInputChange}
                />
              )}
            />
          </Paper>
        )}

        <Divider />
        <React.Fragment>
          <List sx={{ padding: 0 }}>
            {["Home"].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0,
                  "&:hover": { cursor: "pointer", backgroundColor: "inherit" }
                }}
              >
                <ListItemButton
                  sx={{ justifyContent: open ? "initial" : "center", px: 4.5, backgroundColor: "inherit" }}
                  onClick={() => { routeChangeHome(); resetHomeColor(); }}
                >
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: open ? 1 : "auto", justifyContent: "center", color: homeColor }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {renderMenu(filteredItems.length > 0 ? filteredItems : items)}
        </React.Fragment>
      </Drawer>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography fontWeight={500} fontSize={20} noWrap align="center">Node Permission</Typography>
          <div>
            <Grid xs={12} item>
              <Box>
                <div style={{ height: "400px", overflow: "auto" }}>
                  <SimpleTreeView expandedItems={expandedItems}>
                    {Array.isArray(treedata) ? treedata.map((node: any) => renderTree(node)) : null}
                  </SimpleTreeView>
                </div>
              </Box>
            </Grid>
            <Grid xs={3} item alignItems="center" justifyContent="center">
              <Button
                type="submit"
                fullWidth
                style={{ backgroundColor: "#059669", color: "white", marginTop: "10px" }}
                onClick={(e: any) => handleSave()}
              >
                {t("text.save")}
              </Button>
            </Grid>
          </div>
        </Box>
      </Modal>
      <Avatar
        src={userData?.profileImage || "/default-avatar.png"}
        sx={{ width: 10, height: 30, cursor: "pointer" }}
        onClick={() => setProfileDrawerOpen(true)}
      />
      <SwipeableDrawer
        anchor="left"
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onOpen={() => { }}
        style={{ zIndex: 1300 }}
      >
        <Box sx={{ width: DRAWER_WIDTH }}>
          <IconButton edge="end" onClick={() => setProfileDrawerOpen(false)} sx={{ position: "absolute", right: 15, top: 2, color: "white" }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1, pb: 2, backgroundImage: 'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)', color: 'whitesmoke', borderBottomLeftRadius: '1px', borderBottomRightRadius: '1px' }}>
  <Avatar sx={{ width: 60, height: 60, mb: 0, bgcolor: 'white', color: '#2196F3', fontSize: '1.8rem', border: '3px solid white' }}>{(userData?.userName || 'U').charAt(0).toUpperCase()}</Avatar>
  <Typography variant="subtitle1" align="center">{userData?.userName || 'User'}</Typography>
  <Typography variant="caption" align="center" sx={{ mt: 0.5 }}>{userData?.email || 'user@example.com'}</Typography>
</Box>

          <Box sx={{ p: 3 }}>
            <List>
              <ListItem>
                <ListItemIcon><img src={id} width={30} height={30} alt="ID" /></ListItemIcon>
                <ListItemText primary="User ID" secondary={userData?.userName || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemIcon><img src={emails} width={30} height={30} alt="Email" /></ListItemIcon>
                <ListItemText primary="Email" secondary={userData?.email || 'Not provided'} />
              </ListItem>
              <ListItem>
                <ListItemIcon><img src={call} width={30} height={30} alt="Phone" /></ListItemIcon>
                <ListItemText primary="Phone Number" secondary={userData?.phoneNumber || 'Not provided'} />
              </ListItem>
              <ListItem>
                <ListItemIcon><img src={logged} width={30} height={30} alt="Status" /></ListItemIcon>
                <ListItemText primary="Account Status" secondary={userData?.iS_ACTIVE ? 'Inactive❌' : 'Active ✅'} />
              </ListItem>
            </List>
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

