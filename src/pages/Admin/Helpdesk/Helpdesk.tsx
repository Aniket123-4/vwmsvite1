import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Card, Grid, Typography, Divider, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../utils/Url";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import { useLocation } from "react-router-dom";

export default function HelpDesk() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [PageName, setPageName] = useState<string>("");
  const [PageDesk, setPageDesk] = useState<string>("");
  const location =  useLocation();

  useEffect(() => {
    console.log("@@@@@@",location.state.activeMenu)
    fetchHelpDeskData();
  }, []);

  const fetchHelpDeskData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`HelpCreation`, { menuId: location.state.activeMenu || 39 }); // need to replace
      if (response.data && response.data.data.length > 0) {
        setPageName(response.data.data[0]["menuName"]);
        setPageDesk(response.data.data[0]["helpedit"]); 
      } else {
        toast.warn("No content found.");
      }
    } catch (error) {
      toast.error("Failed to fetch Help Desk data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ marginTop: "3vh" }}>
      <ToastApp />
      <Grid item lg={8} sm={10} xs={12}>
        <Card
          sx={{
            backgroundColor: "#E9FDEE",
            border: "1px solid #2B4593",
            padding: "20px",
            borderRadius: 2,
          }}
        >
          <Paper sx={{ padding: "20px", borderRadius: 2 }}>
          
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
              {t("text.HelpDesk")}
            </Typography>
            <Divider sx={{ margin: "20px 0" }} />

       
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress />
              </Box>
            ) : PageName && PageDesk ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography fontWeight="600" fontSize={20}>
                    Page Name: <i>{PageName}</i>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Content:
                    <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography fontWeight="530" fontSize={24} textAlign="center">
                No content available.
              </Typography>
            )}
          </Paper>
        </Card>
      </Grid>
    </Grid>
  );
}

// import Paper from "@mui/material/Paper";
// import { useEffect, useState } from "react";
// import { Card, Grid, Typography, Divider, Box, Button, CircularProgress } from "@mui/material";
// import { ConfirmDialog } from "primereact/confirmdialog";
// import api from "../../../utils/Url";
// import { useTranslation } from "react-i18next";
// import ToastApp from "../../../ToastApp";
// import { toast } from "react-toastify";
// import { getMenuData }  from "../../../utils/Constant";



// type Props = {};

// export default function HelpDesk(props: Props) {
//   const { i18n, t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(true);
//   const [PageName, setPageName] = useState<string>("");
//   const [PageDesk, setPageDesk] = useState<string>("");

//   useEffect(() => {
//     const { menuId } = getMenuData();
    
//     if (menuId) {
//       fetchHelpDeskData(menuId);
//     } else {
//       toast.error("No Menu Id is  present. Please try again.");
//     }
//   }, []);

//   // const getHelpDesk = async (id: any) => {
//   //   setIsLoading(true);
//   //   try {
//   //     const res = await api.post(`api/HelpCreate/GetHelpCreate`, { pageTitleId: id });
//   //     if (res.data.data.length) {
//   //       setPageName(res.data.data[0]["page_Name"]);
//   //       setPageDesk(res.data.data[0]["frontDesign"]);
//   //     } else {
//   //       toast.warn("No content found.");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Failed to fetch data.");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const fetchHelpDeskData = async (id: any) => {
//     setIsLoading(true);
//     try {
//       const response = await api.post(`/Auth/GetHelpMenu`, { menuId: id }); // need to replace
//       if (response.data && response.data.data.length > 0) {
//         setPageName(response.data.data[0]["menuName"]);
//         setPageDesk(response.data.data[0]["helpedit"]); 
//       } else {
//         toast.warn("No content found.");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch Help Desk data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <>
//       <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
//         <ToastApp />
//         <Card
//           sx={{
//             backgroundColor: "#E9FDEE",
//             border: ".5px solid #2B4593",
//             marginTop: "5px",
//             padding: "20px",
//             borderRadius: 2,
//           }}
//         >
//           <Paper sx={{ padding: "20px", borderRadius: 2 }}>
//             <ConfirmDialog />
//             <Typography variant="h4" component="div" sx={{ fontWeight: "bold", textAlign: "center" }}>
//               {t("text.HelpDesk")}
//             </Typography>
//             <Divider sx={{ margin: "20px 0" }} />
//             {isLoading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
//                 <CircularProgress />
//               </Box>
//             ) : PageName && PageDesk ? (
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <Typography fontWeight="600" fontSize={20}>
//                     Page Name: <i>{PageName}</i>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="h6">
//                     Content: 
//                     <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
//                   </Typography>
//                 </Grid>
//               </Grid>
//             ) : (
//               <Typography fontWeight="530" fontSize={30} textAlign="center">
//                 No content available.
//               </Typography>
//             )}
           
//           </Paper>
//         </Card>
//       </Grid>
//       <ToastApp />
//     </>
//   );
// }

// ==================================
// import Paper from "@mui/material/Paper";
// import { useEffect, useState } from "react";
// import { Card, Grid, Typography, Divider, Box, CircularProgress } from "@mui/material";
// import { toast } from "react-toastify";
// import api from "../../../utils/Url";
// import { useTranslation } from "react-i18next";
// import { useLocation } from "react-router-dom"; // ✅ Import useLocation correctly
// import ToastApp from "../../../ToastApp";

// export default function HelpDesk() {
//   const { t } = useTranslation();
//   const location = useLocation(); // ✅ Get URL in HelpDesk

//   const [isLoading, setIsLoading] = useState(true);
//   const [PageName, setPageName] = useState<string>("");
//   const [PageDesk, setPageDesk] = useState<string>("");

//   useEffect(() => {
//     const menuId = getMenuId(); // ✅ Get menuId dynamically
//     if (menuId) {
//       fetchHelpDeskData(menuId);
//     } else {
//       toast.error("No Menu ID found. Please try again.");
//       setIsLoading(false);
//     }
//   }, []);

//   // ✅ Fix: getMenuId is now a normal function that doesn't use Hooks

//   const getMenuId = (): number | null => {
//     console.log("🔍 Checking Menu ID...");
  
//     const params = new URLSearchParams(location.search);
//     const menuIdFromURL = params.get("menuId");
  
//     console.log("📌 Full URL:", location.pathname + location.search); // ✅ Log full URL
  
//     if (menuIdFromURL) {
//       console.log("✅ Menu ID from URL:", menuIdFromURL);
//       return parseInt(menuIdFromURL, 10);
//     }
  
//     const storedMenuId = localStorage.getItem("selectedMenuId");
//     if (storedMenuId) {
//       console.log("✅ Menu ID from LocalStorage:", storedMenuId);
//       return parseInt(storedMenuId, 10);
//     }
  
//     console.log("❌ No Menu ID Found. (Neither URL nor LocalStorage)");
//     return null;
//   };

//   const fetchHelpDeskData = async (menuId: number) => {
//     setIsLoading(true);
//     console.log("🚀 Fetching Help Desk Data with menuId:", menuId);
  
//     try {
//       const response = await api.post(`/Auth/GetHelpMenu`, { menuId });
//       console.log("✅ API Request Sent:", { menuId });
//       console.log("✅ API Response:", response.data);
  
//       if (response.data && response.data.data.length > 0) {
//         setPageName(response.data.data[0]["menuName"]);
//         setPageDesk(response.data.data[0]["helpedit"]);
//       } else {
//         toast.warn("No content found.");
//       }
//     } catch (error) {
//       console.error("❌ API Call Failed:", error);
//       toast.error("Failed to fetch Help Desk data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
  



//   return (
//     <Grid container justifyContent="center" sx={{ marginTop: "3vh" }}>
//       <ToastApp />
//       <Grid item lg={8} sm={10} xs={12}>
//         <Card
//           sx={{
//             backgroundColor: "#E9FDEE",
//             border: "1px solid #2B4593",
//             padding: "20px",
//             borderRadius: 2,
//           }}
//         >
//           <Paper sx={{ padding: "20px", borderRadius: 2 }}>
//             <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
//               {t("text.HelpDesk")}
//             </Typography>
//             <Divider sx={{ margin: "20px 0" }} />

//             {isLoading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
//                 <CircularProgress />
//               </Box>
//             ) : PageName && PageDesk ? (
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <Typography fontWeight="600" fontSize={20}>
//                     Page Name: <i>{PageName}</i>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="h6">
//                     Content:
//                     <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
//                   </Typography>
//                 </Grid>
//               </Grid>
//             ) : (
//               <Typography fontWeight="530" fontSize={24} textAlign="center">
//                 No content available.
//               </Typography>
//             )}
//           </Paper>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// }


