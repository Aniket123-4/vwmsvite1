import { RouteType } from "./config";
import RoleMaster from "../pages/UserManagementMaster/RoleMaster/RoleMaster";
import UserPermissionMaster from "../pages/UserManagementMaster/UserPermissionMaster/UserPermissionMaster";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../loginPage/LoginPage";
import HomeIcon from "@mui/icons-material/Home";
import DashboardPageLayout from "../pages/master/MasterPageLayout";
import DashboardIndex from "../pages/master/MasterPageIndex";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ZoneMaster from "../pages/master/ZoneMaster/ZoneMaster";
import StateMaster from "../pages/master/StateMaster/StateMaster";
import CountryMaster from "../pages/master/CountryMaster/CountryMaster";
import CityMaster from "../pages/master/CityMaster/CityMaster";
import Taxmaster from '../pages/master/Taxmaster/Taxmaster';
import Unitmaster from "../pages/master/Unitmaster/Unitmaster";
import MaterialRecieptNoteMaster from "../pages/Inventory/MaterialRecieptNote/MaterialRecieptNoteMaster";
import CreateMaterialRecieptNote from "../pages/Inventory/MaterialRecieptNote/CreateMaterialRecieptNote";
import EditMaterialRecieptNote from "../pages/Inventory/MaterialRecieptNote/EditMaterialRecieptNote";
import QualityCheckMaster from "../pages/Inventory/QualityCheck/QualityCheckMaster";
import CreateQualityCheck from "../pages/Inventory/QualityCheck/CreateQualityCheck";
import EditQualityCheck from "../pages/Inventory/QualityCheck/EditQualityCheck";
import ItemCategory from "../pages/master/ItemCategory/ItemCategory";
import EmployeeMaster from "../pages/Employee/EmployeeMaster";
import EmployeeAdd from "../pages/Employee/EmployeeAdd";
import EmployeeEdit from "../pages/Employee/EmployeeEdit";
import ItemType from "../pages/master/ItemType/ItemType";
import StaffIndent from "../pages/Inventory/StaffIndent/StaffIndent";
import CreateStaffIndent from "../pages/Inventory/StaffIndent/CreateStaffIndent";
import EditStaffIndent from "../pages/Inventory/StaffIndent/EditStaffIndent";
import StaffItemIssue from "../pages/Inventory/staffItemIssue/StaffItemIssue";
import CreateStaffItemIssue from "../pages/Inventory/staffItemIssue/CreateStaffItemIssue";
import EditStaffItemIssue from "../pages/Inventory/staffItemIssue/EditStaffItemIssue";
import StaffItemReturn from "../pages/Inventory/StaffItemReturn/StaffItemReturn";
import CreateStaffItemReturn from "../pages/Inventory/StaffItemReturn/CreateStaffItemReturn";
import EditStaffItemReturn from "../pages/Inventory/StaffItemReturn/EditStaffItemReturn";
import StoreMaster from "../pages/Inventory/StoreMaster/StoreMaster";
import Emailsettingmaster from "../pages/Emailsystem/Emailsetting/Emailsettingmaster";
import EmailcampgianMaster from "../pages/Emailsystem/Emailcampagian/Emailcampagianmaster";
import CreatemailcampgiontForm from "../pages/Emailsystem/Emailcampagian/Createcampgainform";
import Editcampgianmailmaster from "../pages/Emailsystem/Emailcampagian/Editcampagianmaster";
import EmaileventMaster from "../pages/Emailsystem/EmailEventSettings/EmaileventMaster";
import CreatemaileventForm from "../pages/Emailsystem/EmailEventSettings/CreatemaileventForm";
import Editeventemail from "../pages/Emailsystem/EmailEventSettings/Editeventemail";
import CampaignTemplate from "../pages/Emailsystem/CampaignTemplate/CampaignTemplate";
import AddCampaignTemplate from "../pages/Emailsystem/CampaignTemplate/AddCampaignTemplate";
import EditCampaignTemplate from "../pages/Emailsystem/CampaignTemplate/EditCampaignTemplate";
import Editgroupmaster from "../pages/Emailsystem/Group/Editgroupmaster";
import Creategroupmaster from "../pages/Emailsystem/Group/Creategroupmaster";
import Groupmaster from "../pages/Emailsystem/Group/Groupmaster";
import Login_Page from "../loginPage/Login_Page";
import LicensingInsuranceMaster from "../pages/VehicleMaster/LicensingInsuranceMaster/LicensingInsuranceMaster";
import EditLicensingInsuranceMaster from "../pages/VehicleMaster/LicensingInsuranceMaster/EditLicensingInsuranceMaster";
import AddLicensingInsuranceMaster from "../pages/VehicleMaster/LicensingInsuranceMaster/AddLicensingInsuranceMaster";
import MaintainanceWarrantyMaster from "../pages/VehicleMaster/MaintainanceWarrantyMaster/MaintainanceWarrantyMaster";
import AddMaintainanceWarrantyMaster from "../pages/VehicleMaster/MaintainanceWarrantyMaster/AddMaintainanceWarrantyMaster";
import EditMaintainanceWarrantyMaster from "../pages/VehicleMaster/MaintainanceWarrantyMaster/EditMaintainanceWarrantyMaster";
import UtilizationLog from "../pages/VehicleMaster/UtilizationLog/UtilizationLog";
import AddUtilizationLog from "../pages/VehicleMaster/UtilizationLog/AddUtilizationLog";
import EditUtilizationLog from "../pages/VehicleMaster/UtilizationLog/EditUtilizationLog";
import VehicleTypeMaster from "../pages/VehicleMaster/VehicleTypeMater/VehicleTypeMaster";
import Complaint from "../pages/VehicleComplaints/Complaint/Complaint";
import AddComplaint from "../pages/VehicleComplaints/Complaint/AddComplaint";
import EditComplaint from "../pages/VehicleComplaints/Complaint/EditComplaint";
import JobCard from "../pages/VehicleComplaints/JobCard/JobCard";
import AddJobCard from "../pages/VehicleComplaints/JobCard/AddJobCard";
import EditJobCard from "../pages/VehicleComplaints/JobCard/EditJobCard"
import JobWorkChallan from "../pages/VehicleComplaints/JobWorkChallan/JobWorkChallan";
import AddJobWorkChallan from "../pages/VehicleComplaints/JobWorkChallan/AddJobWorkChallan";
import EditJobWorkChallan from "../pages/VehicleComplaints/JobWorkChallan/EditJobWorkChallan";
import JobWorkChallanRecieve from "../pages/VehicleComplaints/JobWorkChallanRecieve/JobWorkChallanRecieve";
import AddJobWorkChallanRecieve from "../pages/VehicleComplaints/JobWorkChallanRecieve/AddJobWorkChallanRecieve";
import EditJobWorkChallanRecieve from "../pages/VehicleComplaints/JobWorkChallanRecieve/EditJobWorkChallanRecieve";
import ComplainStatus from "../pages/Reports/ComplainStatus/ComplainStatus";
import WorkshopService from "../pages/Reports/WorkshopService/WorkshopService";
import VendorItemDetail from "../pages/Reports/VendorItemDetail/VendorItemDetail";
import VendorEvaluationReport from "../pages/Reports/VendorEvaluationReport/VendorEvaluationReport";
import VehicleStatusReport from "../pages/Reports/VehicleStatusReport/VehicleStatusReport";
import VehicleItemService from "../pages/Reports/VehicleItemService/VehicleItemService";
import VehicleEfileReport from "../pages/Reports/VehicleEfileReport/VehicleEfileReport";
import VehicleAgeReport from "../pages/Reports/VehicleAgeReport/VehicleAgeReport";
import StockSummaryReport from "../pages/Reports/StockSummaryReport/StockSummaryReport";
import StockLedgerReport from "../pages/Reports/StockLedgerReport/StockLedgerReport";
import OutSourceService from "../pages/Reports/OutSourceService/OutSourceService";
import JobCardStatus from "../pages/Reports/JobCardStatus/JobCardStatus";
import FolderLocation from "../pages/master/FolderLocation/FolderLocation";
import FinancialYear from "../pages/master/FinancialYear/FinancialYear";
import StockBin from "../pages/master/StockBin/StockBin";
import EditItemContract from "../pages/VendorInfo/ItemContract/EditItemContract";
import AddItemContract from "../pages/VendorInfo/ItemContract/AddItemContract";
import ItemContract from "../pages/VendorInfo/ItemContract/ItemContract";
import EditServiceContract from "../pages/VendorInfo/ServiceContract/EditServiceContract";
import AddServiceContract from "../pages/VendorInfo/ServiceContract/AddServiceContract";
import ServiceContract from "../pages/VendorInfo/ServiceContract/ServiceContract";
import Services from "../pages/VendorInfo/Services/Services";
import AddVendor from "../pages/VendorInfo/Vendor/AddVendor";
import EditVendor from "../pages/VendorInfo/Vendor/EditVendor";
import Vendor from "../pages/VendorInfo/Vendor/Vendor";
import VehicleTypeInfo from "../pages/VehicleMaster/VehicleTypeInfo/VehicleTypeInfo";
import Location from "../pages/VehicleMaster/Location/Location";
import FuelTypeMaster from "../pages/VehicleMaster/FuelTypeMaster/FuelTypeMaster";
import BrandMaster from "../pages/VehicleMaster/BrandMaster/BrandMaster";
import EditVehicleDetail from "../pages/VehicleMaster/VehicleDetail/EditVehicleDetail";
import AddVehicleDetail from "../pages/VehicleMaster/VehicleDetail/AddVehicleDetail";
import VehicleDetail from "../pages/VehicleMaster/VehicleDetail/VehicleDetail";
import EditUploadDocuments from "../pages/EmployeeInfo/UploadDocuments/EditUploadDocuments";
import AddUploadDocuments from "../pages/EmployeeInfo/UploadDocuments/AddUploadDocuments";
import UploadDocuments from "../pages/EmployeeInfo/UploadDocuments/UploadDocuments";
import EditOrganization from "../pages/EmployeeInfo/Organization/EditOrganization";
import AddOrganization from "../pages/EmployeeInfo/Organization/AddOrganization";
import Organization from "../pages/EmployeeInfo/Organization/Organization";
import Designation from "../pages/EmployeeInfo/Designation/Designation";
import Department from "../pages/EmployeeInfo/Department/Department";
import EditEmployee from "../pages/EmployeeInfo/Employee/EditEmployee";
import AddEmployee from "../pages/EmployeeInfo/Employee/AddEmployee";
import Employee from "../pages/EmployeeInfo/Employee/Employee";
import EditOfficePurchaseOrder from "../pages/Inventory/OfficePurchaseOrder/EditOfficePurchaseOrder";
import CreateOfficePurchaseOrder from "../pages/Inventory/OfficePurchaseOrder/CreateOfficePurchaseOrder";
import EditJobCardItemReturn from "../pages/Inventory/JobCardItemReturn/EditJobCardItemReturn";
import CreateJobCardItemReturn from "../pages/Inventory/JobCardItemReturn/CreateJobCardItemReturn";
import JobCardItemReturn from "../pages/Inventory/JobCardItemReturn/JobCardItemReturn";
// import EditStockGeneral from "../pages/Inventory/StockGeneral/EditStockGeneral";
// import CreateStockGeneral from "../pages/Inventory/StockGeneral/CreateStockGeneral";
import StockGeneral from "../pages/Inventory/StockGeneral/StockGeneral";
import EditJobcardItemIssue from "../pages/Inventory/JobcardItemIssue/EditJobcardItemIssue";
import CreateJobcardItemIssue from "../pages/Inventory/JobcardItemIssue/CreateJobcardItemIssue";
import JobcardItemIssue from "../pages/Inventory/JobcardItemIssue/JobcardItemIssue";
import EditPurchaseInvoice from "../pages/Inventory/PurchaseInvoice/EditPurchaseInvoice";
import CreatePurchaseInvoice from "../pages/Inventory/PurchaseInvoice/CreatePurchaseInvoice";
import PurchaseInvoice from "../pages/Inventory/PurchaseInvoice/PurchaseInvoice";
import EditWorkShopPurchaseOrder from "../pages/Inventory/WorkShopPurchaseOrder/EditWorkShopPurchaseOrder";
import CreateWorkShopPurchaseOrder from "../pages/Inventory/WorkShopPurchaseOrder/CreateWorkShopPurchaseOrder";
import WorkShopPurchaseOrder from "../pages/Inventory/WorkShopPurchaseOrder/WorkShopPurchaseOrder";
import OfficePurchaseOrder from "../pages/Inventory/OfficePurchaseOrder/OfficePurchaseOrder";
import EditOfficePurchaseIndent from "../pages/Inventory/OfficePurchaseIndent/EditOfficePurchaseIndent";
import CreateOfficePurchaseIndent from "../pages/Inventory/OfficePurchaseIndent/CreateOfficePurchaseIndent";
import EditItemDetail from "../pages/Inventory/ItemDetail/EditItemDetail";
import CreateItemDetail from "../pages/Inventory/ItemDetail/CreateItemDetail";
import ItemDetail from "../pages/Inventory/ItemDetail/ItemDetail";
import EditWorkShopPurchaseIndent from "../pages/Inventory/WorkShopPurchaseIndent/EditWorkShopPurchaseIndent";
import CreateWorkShopPurchaseIndent from "../pages/Inventory/WorkShopPurchaseIndent/CreateWorkShopPurchaseIndent";
import EditJobCardIndent from "../pages/Inventory/JobCardIndent/EditJobCardIndent";
import CreateJobCardIndent from "../pages/Inventory/JobCardIndent/CreateJobCardIndent";
import JobCardIndent from "../pages/Inventory/JobCardIndent/JobCardIndent";
import WorkShopPurchaseIndent from "../pages/Inventory/WorkShopPurchaseIndent/WorkShopPurchaseIndent";
import SmsEventSettings from "../pages/Emailsystem/SmsEventSettings/SmsEventSettings";
import CreateSmsEventSettings from "../pages/Emailsystem/SmsEventSettings/CreateSmsEventSettings";
import EditSmsEventSettings from "../pages/Emailsystem/SmsEventSettings/EditSmsEventSettings";
import Smscampagian from "../pages/Emailsystem/Smscampagian/Smscampagian";
import CreateSmscampagian from "../pages/Emailsystem/Smscampagian/CreateSmscampagian";
import EditSmscampagian from "../pages/Emailsystem/Smscampagian/EditSmscampagian";
import Smssetting from "../pages/Emailsystem/Smssetting/Smssetting";
import OfficePurchaseIndent from "../pages/Inventory/OfficePurchaseIndent/OfficePurchaseIndent";
import LoginPage1 from "../loginPage/LoginPage1";
import AddComplaintApproval from "../pages/Admin/ComplaintApproval/AddComplaintApproval";
import AddJobCard1 from "../pages/VehicleComplaints/JobCard1/AddJobCard1";
import EditJobCard1 from "../pages/VehicleComplaints/JobCard1/EditJobCard1";
import JobCard1 from "../pages/VehicleComplaints/JobCard1/JobCard1";
import Flowmaster from "../pages/Admin/Flowmaster/flowmaster";
import ComplaintApproval from "../pages/Admin/ComplaintApproval/ComplaintApproval";
import EditComplaintApproval from "../pages/Admin/ComplaintApproval/EditComplaintApproval";
import Juridiction from "../pages/UserManagementMaster/Juridiction/Juridiction";
import MenuMaster from "../pages/Admin/MenuMaster/MenuMaster";
// import HelpCreation from "../pages/Admin/HelpCreation/HelpCreation";
import ItemConsumedReport from "../pages/Reports/ItemConsumedReport/ItemConsumedReport";
import PageSetup from "../pages/Admin/PageSetup/PageSetup";
import Institute from "../pages/Admin/InstitueForm/Institute";
import InstituteAdd from "../pages/Admin/InstitueForm/InstituteAdd";
import InstituteEdit from "../pages/Admin/InstitueForm/InstituteEdit";
import Helpdesk from "../pages/Admin/Helpdesk/Helpdesk";
import ChangePassword from "../pages/Admin/ChangePassword/ChangePassword";
//import Oragnisation from "../pages/Admin/Setting/Oragnisation";

import React from "react";
import HelpCreation from "../pages/Admin/HelpCreation/HelpCreationvwms";


const appRoutes: RouteType[] = [
  {
    index: true,
    element: <LoginPage1 />,
    state: "home",
  },
  {
    element: <HomePage />,
    state: "home",
    path: "/home",
    sidebarProps: {
      displayText: "Home",
      icon: <HomeIcon />,
    },
  },


  //======================Master Form End========================



  /////-------------------start ------Inventory-----------------------

  {
    path: "/storemanagement",
    element: <DashboardPageLayout />,
    state: "Inventory",

    sidebarProps: {
      displayText: "Inventory",
      icon: <DashboardOutlinedIcon />
    },

    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Inventory.index",
      },


      // {
      //   path: "/Inventory/IndentForm",
      //   element: <IndentFormMaster/>,
      //   state: "Inventory.IndentForm",
      //   sidebarProps: {
      //     displayText: "Indent Form",
      //   }
      // },
      // {
      //   path: "/Inventory/CreateIndentForm",
      //   element: <CreateIndentForm />,
      //   state: "Inventory.CreateIndentForm",
      // },
      // {
      //   path: "/Inventory/EditIndentForm",
      //   element: <EditIndentForm />,
      //   state: "Inventory.EditIndentForm",
      // },
      {
        path: "/storemanagement/materialreceiptnote",
        element: <MaterialRecieptNoteMaster />,
        state: "Inventory.MRNForm",
        sidebarProps: {
          displayText: "Material Recpt Notes",
        }
      },
      {
        path: "/storemanagement/CreateMRN",
        element: <CreateMaterialRecieptNote />,
        state: "Inventory.CreateMRN",
      },
      {
        path: "/storemanagement/EditMRN",
        element: <EditMaterialRecieptNote />,
        state: "Inventory.EditMRN",
      },
      {
        path: "/storemanagement/qualitycheck",
        element: <QualityCheckMaster />,
        state: "Inventory.QualityCheck",
        sidebarProps: {
          displayText: "Quality Check",
        }
      },
      {
        path: "/storemanagement/CreateQualityCheck",
        element: <CreateQualityCheck />,
        state: "Inventory.CreateQualityCheck",
      },
      {
        path: "/storemanagement/EditQualityCheck",
        element: <EditQualityCheck />,
        state: "Inventory.EditQualityCheck",
      },




      {
        path: "/storemanagement/indentforstaff",
        element: <StaffIndent />,
        state: "Inventory.StaffIndent",
        sidebarProps: {
          displayText: "Staff Indent",
        }
      },
      {
        path: "/storemanagement/CreateStaffIndent",
        element: <CreateStaffIndent />,
        state: "Inventory.CreateStaffIndent",
      },
      {
        path: "/storemanagement/EditStaffIndent",
        element: <EditStaffIndent />,
        state: "Inventory.EditStaffIndent",
      },

      {
        path: "/storemanagement/itemissue/staffitemissue",
        element: <StaffItemIssue />,
        state: "Inventory.StaffItemIssue",
        sidebarProps: {
          displayText: "Staff Item Issue",
        }
      },
      {
        path: "/storemanagement/itemissue/CreateStaffItemIssue",
        element: <CreateStaffItemIssue />,
        state: "Inventory.CreateStaffItemIssue",
      },
      {
        path: "/storemanagement/itemissue/EditStaffItemIssue",
        element: <EditStaffItemIssue />,
        state: "Inventory.EditStaffItemIssue",
      },

      {
        path: "/storemanagement/itemreturn/staffitemreturn",
        element: <StaffItemReturn />,
        state: "Inventory.StaffItemReturn",
        sidebarProps: {
          displayText: "Staff Item Return",
        }
      },
      {
        path: "/storemanagement/itemreturn/CreateStaffItemReturn",
        element: <CreateStaffItemReturn />,
        state: "Inventory.CreateStaffItemReturn",
      },
      {
        path: "/storemanagement/itemreturn/EditStaffItemReturn",
        element: <EditStaffItemReturn />,
        state: "Inventory.EditStaffItemReturn",
      },


      {
        path: "/storemanagement/workshopindent/jobcardindent",
        element: <JobCardIndent />,
        state: "Inventory.JobCardIndent",
        sidebarProps: {
          displayText: "JobCardIndent",
        }
      },
      {
        path: "/storemanagement/workshopindent/CreateJobCardIndent",
        element: <CreateJobCardIndent />,
        state: "Inventory.CreateJobCardIndent",
      },
      {
        path: "/storemanagement/workshopindent/EditJobCardIndent",
        element: <EditJobCardIndent />,
        state: "Inventory.EditJobCardIndent",
      },


      {
        path: "/storemanagement/workshopindent/wrk.pur.indent",
        element: <WorkShopPurchaseIndent />,
        state: "Inventory.WorkShopPurchaseIndent",
        sidebarProps: {
          displayText: "WorkShopPurchaseIndent",
        }
      },
      {
        path: "/storemanagement/workshopindent/CreateWorkShopPurchaseIndent",
        element: <CreateWorkShopPurchaseIndent />,
        state: "Inventory.CreateWorkShopPurchaseIndent",
      },
      {
        path: "/storemanagement/workshopindent/EditWorkShopPurchaseIndent",
        element: <EditWorkShopPurchaseIndent />,
        state: "Inventory.EditWorkShopPurchaseIndent",
      },

      {
        path: "/storemanagement/StoreMaster",
        element: <StoreMaster />,
        state: "Inventory.StoreMaster",
      },

      {
        path: "/storemanagement/ItemDetail",
        element: <ItemDetail />,
        state: "Inventory.ItemDetail",
        sidebarProps: {
          displayText: "Item Detail",
        },
      },
      {

        path: "/storemanagement/CreateItemDetail",
        element: <CreateItemDetail />,
        state: "Inventory.CreateItemDetail",
      },
      {
        path: "/storemanagement/EditItemDetail",
        element: <EditItemDetail />,
        state: "Inventory.EditItemDetail",

      },

      {
        path: "/storemanagement/off.purchaseindent",
        element: <OfficePurchaseIndent />,
        state: "Inventory.OfficePurchaseIndent",
        sidebarProps: {
          displayText: "Office Purchase Indent",
        },
      },
      {

        path: "/storemanagement/CreateOfficePurchaseIndent",
        element: <CreateOfficePurchaseIndent />,
        state: "Inventory.CreateOfficePurchaseIndent",
      },
      {
        path: "/storemanagement/EditOfficePurchaseIndent",
        element: <EditOfficePurchaseIndent />,
        state: "Inventory.EditOfficePurchaseIndent",

      },

      {
        path: "/storemanagement/purchaseorder/office",
        element: <OfficePurchaseOrder />,
        state: "Inventory.OfficePurchaseOrder",
        sidebarProps: {
          displayText: "Office Purchase Order",
        },
      },
      {

        path: "/storemanagement/purchaseorder/CreateOfficePurchaseOrder",
        element: <CreateOfficePurchaseOrder />,
        state: "Inventory.CreateOfficePurchaseOrder",
      },
      {
        path: "/storemanagement/purchaseorder/EditOfficePurchaseOrder",
        element: <EditOfficePurchaseOrder />,
        state: "Inventory.EditOfficePurchaseOrder",

      },

      {
        path: "/storemanagement/purchaseorder/workshop",
        element: <WorkShopPurchaseOrder />,
        state: "Inventory.WorkShopPurchaseOrder",
        sidebarProps: {
          displayText: "WorkShop Purchase Order",
        },
      },
      {

        path: "/storemanagement/purchaseorder/CreateWorkShopPurchaseOrder",
        element: <CreateWorkShopPurchaseOrder />,
        state: "Inventory.CreateWorkShopPurchaseOrder",
      },
      {
        path: "/storemanagement/purchaseorder/EditWorkShopPurchaseOrder",
        element: <EditWorkShopPurchaseOrder />,
        state: "Inventory.EditWorkShopPurchaseOrder",

      },

      {
        path: "/storemanagement/PurchaseInvoice",
        element: <PurchaseInvoice />,
        state: "Inventory.PurchaseInvoice",
        sidebarProps: {
          displayText: "Purchase Invoice",
        },
      },
      {

        path: "/storemanagement/CreatePurchaseInvoice",
        element: <CreatePurchaseInvoice />,
        state: "Inventory.CreatePurchaseInvoice",
      },
      {
        path: "/storemanagement/EditPurchaseInvoice",
        element: <EditPurchaseInvoice />,
        state: "Inventory.EditPurchaseInvoice",

      },

      {
        path: "/storemanagement/itemissue/jobcarditemissue",
        element: <JobcardItemIssue />,
        state: "Inventory.JobcardItemIssue",
        sidebarProps: {
          displayText: "Jobcard Item Issue",
        },
      },
      {

        path: "/storemanagement/itemissue/CreateJobcardItemIssue",
        element: <CreateJobcardItemIssue />,
        state: "Inventory.CreateJobcardItemIssue",
      },
      {
        path: "/storemanagement/itemissue/EditJobcardItemIssue",
        element: <EditJobcardItemIssue />,
        state: "Inventory.EditJobcardItemIssue",

      },

      {
        path: "/storemanagement/stockopening",
        element: <StockGeneral />,
        state: "Inventory.StockGeneral",
        sidebarProps: {
          displayText: "Stock General",
        },
      },
      // {

      //   path: "/storemanagement/CreateStockGeneral",
      //   element: <CreateStockGeneral />,
      //   state: "Inventory.CreateStockGeneral",
      // },
      // {
      //   path: "/storemanagement/EditStockGeneral",
      //   element: <EditStockGeneral />,
      //   state: "Inventory.EditStockGeneral",

      // },

      {
        path: "/storemanagement/itemreturn/jobcarditemreturn",
        element: <JobCardItemReturn />,
        state: "Inventory.JobCardItemReturn",
        sidebarProps: {
          displayText: "JobCard Item Return",
        }
      },
      {
        path: "/storemanagement/itemreturn/CreateJobCardItemReturn",
        element: <CreateJobCardItemReturn />,
        state: "Inventory.CreateJobCardItemReturn",
      },
      {
        path: "/storemanagement/itemreturn/EditJobCardItemReturn",
        element: <EditJobCardItemReturn />,
        state: "Inventory.EditJobCardItemReturn",
      },



    ]

  },

  //=================Aniket sahu Emailroute start ===================
  {
    path: "/communication",
    element: <DashboardPageLayout />,
    state: "communication",
    sidebarProps: {
      displayText: "emailsystem",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        path: "/communication/Group",
        element: <Groupmaster />,
        state: "emailsystem.Groupmaster",
        sidebarProps: {
          displayText: "Groupmaster",
        },
      },
      {

        path: "/communication/Creategroupmaster",
        element: <Creategroupmaster />,
        state: "communication.Creategroupmaster",
      },
      {
        path: "/communication/Editgroupmaster",
        element: <Editgroupmaster />,
        state: "communication.Editgroupmaster",

      },

      {
        path: "/communication/email/emailsettings",
        element: <Emailsettingmaster />,
        state: "email.emailMaster",
      },
      {
        path: "/communication/email/emailcampaign",
        element: <EmailcampgianMaster />,
        state: "email.emailMaster",
      },
      {
        path: "/communication/email/addcampagianmaster",
        element: <CreatemailcampgiontForm />,
        state: "email.emailMaster",
      },
      {
        path: "/communication/email/editcampagianmaster",
        element: <Editcampgianmailmaster />,
        state: "email.emailMaster",
      },
      {
        path: "/communication/email/emailevent",
        element: <EmaileventMaster />,
        state: "email.emailMaster",
      },
      {
        path: "/communication/email/addeventmaster",
        element: <CreatemaileventForm />,
        state: "email.emailMaster",
      },
      {
        path: "/communication/email/editeventnmaster",
        element: <Editeventemail />,
        state: "email.emailMaster",
      },

      {
        path: "/communication/template(sms/email)",
        element: <CampaignTemplate />,
        state: "emailsystem.CampaignTemplate",
        sidebarProps: {
          displayText: "CampaignTemplate",
        },
      },
      {

        path: "/communication/AddCampaignTemplate",
        element: <AddCampaignTemplate />,
        state: "emailsystem.AddCampaignTemplate",
      },
      {
        path: "/communication/EditCampaignTemplate",
        element: <EditCampaignTemplate />,
        state: "emailsystem.EditCampaignTemplate",

      },

      {
        path: "/communication/sms/smsevent",
        element: <SmsEventSettings />,
        state: "emailsystem.SmsEventSettings",
        sidebarProps: {
          displayText: "SmsEventSettings",
        },
      },
      {

        path: "/communication/sms/CreateSmsEventSettings",
        element: <CreateSmsEventSettings />,
        state: "emailsystem.CreateSmsEventSettings",
      },
      {
        path: "/communication/sms/EditSmsEventSettings",
        element: <EditSmsEventSettings />,
        state: "emailsystem.EditSmsEventSettings",

      },

      {
        path: "/communication/sms/smscampaign",
        element: <Smscampagian />,
        state: "emailsystem.Smscampagian",
        sidebarProps: {
          displayText: "Smscampagian",
        },
      },
      {

        path: "/communication/sms/CreateSmscampagian",
        element: <CreateSmscampagian />,
        state: "emailsystem.CreateSmscampagian",
      },
      {
        path: "/communication/sms/EditSmscampagian",
        element: <EditSmscampagian />,
        state: "emailsystem.EditSmscampagian",

      },

      {
        path: "/communication/sms/smssettings",
        element: <Smssetting />,
        state: "email.Smssetting",
      },
    ],
  },
  {
    path: "/Employee",
    element: <DashboardPageLayout />,
    state: "Employee",
    sidebarProps: {
      displayText: "Employee",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "employeeinfo.index",
      },
      {
        path: "/Employee/EmployeeMaster",
        element: <EmployeeMaster />,
        state: "Employee.EmployeeMaster",
        sidebarProps: {
          displayText: "Employee Master",
        }
      },
      {
        path: "/Employee/EmployeeAdd",
        element: <EmployeeAdd />,
        state: "Employee.EmployeeAdd",
      },
      {
        path: "/Employee/EmployeeEdit",
        element: <EmployeeEdit />,
        state: "Employee.EmployeeEdit",
      },


    ],
  },




  //====================================vehicleMaster-start================================//

  // {
  //   path: "/vehiclemaster",
  //   element: <DashboardPageLayout />,
  //   state: "vehiclemaster",
  //   sidebarProps: {
  //     displayText: "Vehicle Master",
  //     icon: <DashboardOutlinedIcon />,
  //   },
  //   child: [
  //     {
  //       index: true,
  //       element: <DashboardIndex />,
  //       state: "vehiclemaster.index",
  //     },
  //     {
  //       path: "/vehiclemaster/LicensingInsuranceMaster",
  //       element: <LicensingInsuranceMaster />,
  //       state: "vehiclemaster.LicensingInsuranceMaster",
  //       sidebarProps: {
  //         displayText: "Licensing/Insurance",
  //       },
  //     },
  //     {
  //       path: "/vehiclemaster/AddLicensingInsuranceMaster",
  //       element: <AddLicensingInsuranceMaster />,
  //       state: "vehiclemaster.AddLicensingInsuranceMaster",
  //     },
  //     {
  //       path: "/vehiclemaster/EditLicensingInsuranceMaster",
  //       element: <EditLicensingInsuranceMaster />,
  //       state: "vehiclemaster.EditLicensingInsuranceMaster",
  //     },
  //     {
  //       path: "/vehiclemaster/MaintainanceWarrantyMaster",
  //       element: <MaintainanceWarrantyMaster />,
  //       state: "vehiclemaster.MaintainanceWarrantyMaster",
  //       sidebarProps: {
  //         displayText: "Licensing/Insurance",
  //       },
  //     },
  //     {
  //       path: "/vehiclemaster/AddMaintainanceWarrantyMaster",
  //       element: <AddMaintainanceWarrantyMaster />,
  //       state: "vehiclemaster.AddMaintainanceWarrantyMaster",
  //     },
  //     {
  //       path: "/vehiclemaster/EditMaintainanceWarrantyMaster",
  //       element: <EditMaintainanceWarrantyMaster />,
  //       state: "vehiclemaster.EditMaintainanceWarrantyMaster",
  //     },
  //     {
  //       path: "/vehiclemaster/UtilizationLog",
  //       element: <UtilizationLog />,
  //       state: "vehiclemaster.UtilizationLog",
  //       sidebarProps: {
  //         displayText: "Licensing/Insurance",
  //       },
  //     },
  //     {
  //       path: "/vehiclemaster/AddUtilizationLog",
  //       element: <AddUtilizationLog />,
  //       state: "vehiclemaster.AddUtilizationLog",
  //     },
  //     {
  //       path: "/vehiclemaster/EditUtilizationLog",
  //       element: <EditUtilizationLog />,
  //       state: "vehiclemaster.EditUtilizationLog",
  //     },
  //     {
  //       path: "/vehiclemaster/VehicleTypeMaster",
  //       element: <VehicleTypeMaster />,
  //       state: "vehiclemaster.VehicleTypeMaster",
  //       sidebarProps: {
  //         displayText: "Gender",
  //       },
  //     },
  //   ],
  // },

  //=====================================Vehicle Complaint=====================================//

  // {
  //   path: "/vehiclecomplaint",
  //   element: <DashboardPageLayout />,
  //   state: "vehiclecomplaint",
  //   sidebarProps: {
  //     displayText: "Vehicle Complaint",
  //     icon: <DashboardOutlinedIcon />,
  //   },
  //   child: [
  //     {
  //       index: true,
  //       element: <DashboardIndex />,
  //       state: "vehiclemaster.index",
  //     },
  //     {
  //       path: "/vehiclecomplaint/Complaint",
  //       element: <Complaint />,
  //       state: "vehiclecomplaint.Complaint",
  //       sidebarProps: {
  //         displayText: "Complaint",
  //       },
  //     },
  //     {
  //       path: "/vehiclecomplaint/AddComplaint",
  //       element: <AddComplaint />,
  //       state: "vehiclecomplaint.AddComplaint",
  //     },
  //     {
  //       path: "/vehiclecomplaint/EditComplaint",
  //       element: <EditComplaint />,
  //       state: "vehiclecomplaint.EditComplaint",
  //     },
  //     {
  //       path: "/vehiclecomplaint/JobCard",
  //       element: <JobCard />,
  //       state: "vehiclecomplaint.JobCard",
  //       sidebarProps: {
  //         displayText: "JobCard",
  //       },
  //     },
  //     {
  //       path: "/vehiclecomplaint/AddJobCard",
  //       element: <AddJobCard />,
  //       state: "vehiclecomplaint.AddJobCard",
  //     },
  //     {
  //       path: "/vehiclecomplaint/EditJobCard",
  //       element: <EditJobCard />,
  //       state: "vehiclecomplaint.EditJobCard",
  //     },
  //     {
  //       path: "/vehiclecomplaint/JobCard1",
  //       element: <JobCard1 />,
  //       state: "vehiclecomplaint.JobCard1",
  //       sidebarProps: {
  //         displayText: "JobCard",
  //       },
  //     },
  //     {
  //       path: "/vehiclecomplaint/AddJobCard1",
  //       element: <AddJobCard1 />,
  //       state: "vehiclecomplaint.AddJobCard1",
  //     },
  //     {
  //       path: "/vehiclecomplaint/EditJobCard1",
  //       element: <EditJobCard1 />,
  //       state: "vehiclecomplaint.EditJobCard1",
  //     },
  //     {
  //       path: "/vehiclecomplaint/JobWorkChallan",
  //       element: <JobWorkChallan />,
  //       state: "vehiclecomplaint.JobWorkChallan",
  //       sidebarProps: {
  //         displayText: "JobCard",
  //       },
  //     },
  //     {
  //       path: "/vehiclecomplaint/AddJobWorkChallan",
  //       element: <AddJobWorkChallan />,
  //       state: "vehiclecomplaint.AddJobWorkChallan",
  //     },
  //     {
  //       path: "/vehiclecomplaint/EditJobWorkChallan",
  //       element: <EditJobWorkChallan />,
  //       state: "vehiclecomplaint.EditJobWorkChallan",
  //     },
  //     {
  //       path: "/vehiclecomplaint/JobWorkChallanRecieve",
  //       element: <JobWorkChallanRecieve />,
  //       state: "vehiclecomplaint.JobWorkChallanRecieve",
  //       sidebarProps: {
  //         displayText: "JobCard",
  //       },
  //     },
  //     {
  //       path: "/vehiclecomplaint/AddJobWorkChallanRecieve",
  //       element: <AddJobWorkChallanRecieve />,
  //       state: "vehiclecomplaint.AddJobWorkChallanRecieve",
  //     },
  //     {
  //       path: "/vehiclecomplaint/EditJobWorkChallanRecieve",
  //       element: <EditJobWorkChallanRecieve />,
  //       state: "vehiclecomplaint.EditJobWorkChallanRecieve",
  //     },

  //   ],
  // },


  {
    path: "/Reports",
    element: <DashboardPageLayout />,
    state: "Reports",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Reports.index",
      },

      {
        path: "/Reports/ComplainStatus",
        element: <ComplainStatus />,
        state: "Reports.ComplainStatus",
        sidebarProps: {
          displayText: "Complain Status",
        }
      },


      {
        path: "/Reports/WorkshopService",
        element: <WorkshopService />,
        state: "Reports.WorkshopService",
        sidebarProps: {
          displayText: "Workshop Service",
        }
      },

      {
        path: "/Reports/VendorItemDetail",
        element: <VendorItemDetail />,
        state: "Reports.VendorItemDetail",
        sidebarProps: {
          displayText: "Vendor Item Detail",
        }
      },


      {
        path: "/Reports/VendorEvaluationReport",
        element: <VendorEvaluationReport />,
        state: "Reports.VendorEvaluationReport",
        sidebarProps: {
          displayText: "Vendor Evaluation Report",
        }
      },


      {
        path: "/Reports/VehicleStatusReport",
        element: <VehicleStatusReport />,
        state: "Reports.VehicleStatusReport",
        sidebarProps: {
          displayText: "Vehicle Status Report",
        }
      },


      {
        path: "/Reports/VehicleItemService",
        element: <VehicleItemService />,
        state: "Reports.VehicleItemService",
        sidebarProps: {
          displayText: "Vehicle Item Service",
        }
      },


      {
        path: "/Reports/VehicleEfileReport",
        element: <VehicleEfileReport />,
        state: "Reports.VehicleEfileReport",
        sidebarProps: {
          displayText: "Vehicle E-file Report",
        }
      },


      {
        path: "/Reports/vehicleagerep",
        element: <VehicleAgeReport />,
        state: "Reports.VehicleAgeReport",
        sidebarProps: {
          displayText: "Vehicle Age Report",
        }
      },


      {
        path: "/Reports/StockSummaryReport",
        element: <StockSummaryReport />,
        state: "Reports.StockSummaryReport",
        sidebarProps: {
          displayText: "Stock Summary Report",
        }
      },

      {
        path: "/Reports/StockLedgerReport",
        element: <StockLedgerReport />,
        state: "Reports.StockLedgerReport",
        sidebarProps: {
          displayText: "Stock Ledger Report",
        }
      },


      {
        path: "/Reports/OutSourceService",
        element: <OutSourceService />,
        state: "Reports.OutSourceService",
        sidebarProps: {
          displayText: "Out Source Service",
        }
      },

      {
        path: "/Reports/JobCardStatus",
        element: <JobCardStatus />,
        state: "Reports.JobCardStatus",
        sidebarProps: {
          displayText: "Job Card Status",
        }
      },
      {
        path: "/Reports/ItemConsumedReport",
        element: <ItemConsumedReport />,
        state: "Reports.ItemConsumedReport",
        sidebarProps: {
          displayText: "ItemConsumedReport",
        }
      },

    ],
  },



  {
    path: "/employeeInfo",
    element: <DashboardPageLayout />,
    state: "employeeInfo",
    sidebarProps: {
      displayText: "Employee Info",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "employeeInfo.index",
      },
      {
        path: "/employeeInfo/Employee",
        element: <Employee />,
        state: "employeeInfo.Employee",
        sidebarProps: {
          displayText: "Employee",
        }
      },
      {
        path: "/employeeInfo/AddEmployee",
        element: <AddEmployee />,
        state: "employeeInfo.AddEmployee",
      },
      {
        path: "/employeeInfo/EditEmployee",
        element: <EditEmployee />,
        state: "employeeInfo.EditEmployee",
      },
      {
        path: "/employeeInfo/Department",
        element: <Department />,
        state: "employeeInfo.Department",
        sidebarProps: {
          displayText: "Department",
        }
      },
      {
        path: "/employeeInfo/Designation",
        element: <Designation />,
        state: "employeeInfo.Designation",
        sidebarProps: {
          displayText: "Designation",
        }
      },
      {
        path: "/employeeInfo/Organization",
        element: <Organization />,
        state: "employeeInfo.Organization",
        sidebarProps: {
          displayText: "Organization",
        }
      },
      {
        path: "/employeeInfo/AddOrganization",
        element: <AddOrganization />,
        state: "employeeInfo.AddOrganization",
      },
      {
        path: "/employeeInfo/EditOrganization",
        element: <EditOrganization />,
        state: "employeeInfo.EditOrganization",
      },
      {
        path: "/employeeInfo/UploadDocuments",
        element: <UploadDocuments />,
        state: "employeeInfo.UploadDocuments",
        sidebarProps: {
          displayText: "Upload Documents",
        }
      },
      {
        path: "/employeeInfo/AddUploadDocuments",
        element: <AddUploadDocuments />,
        state: "employeeInfo.AddUploadDocuments",
      },
      {
        path: "/employeeInfo/EditUploadDocuments",
        element: <EditUploadDocuments />,
        state: "employeeInfo.EditUploadDocuments",
      },

    ],
  },


  //====================================vehicleMaster-start================================//


  {
    path: "/vehiclemanagement",
    element: <DashboardPageLayout />,
    state: "vehiclemanagement",
    sidebarProps: {
      displayText: "Vehicle Master",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        path: "/vehiclemanagement/vehiclemaster",
        element: <DashboardPageLayout />,
        state: "vehiclemaster",
        sidebarProps: {
          displayText: "Vehicle Master",
          icon: <DashboardOutlinedIcon />,
        },
        child: [
          {
            index: true,
            element: <DashboardIndex />,
            state: "vehiclemaster.index",
          },
          {
            path: "/vehiclemanagement/vehiclemaster/licensing/insurance",
            element: <LicensingInsuranceMaster />,
            state: "vehiclemaster.LicensingInsuranceMaster",
            sidebarProps: {
              displayText: "Licensing/Insurance",
            },
          },
          {
            path: "/vehiclemanagement/vehiclemaster/AddLicensingInsuranceMaster",
            element: <AddLicensingInsuranceMaster />,
            state: "vehiclemaster.AddLicensingInsuranceMaster",
          },
          {
            path: "/vehiclemanagement/vehiclemaster/EditLicensingInsuranceMaster",
            element: <EditLicensingInsuranceMaster />,
            state: "vehiclemaster.EditLicensingInsuranceMaster",
          },
          {
            path: "/vehiclemanagement/vehiclemaster/maintenance/warranty",
            element: <MaintainanceWarrantyMaster />,
            state: "vehiclemaster.MaintainanceWarrantyMaster",
            sidebarProps: {
              displayText: "Maintainance/Warranty",
            },
          },
          {
            path: "/vehiclemanagement/vehiclemaster/AddMaintainanceWarrantyMaster",
            element: <AddMaintainanceWarrantyMaster />,
            state: "vehiclemaster.AddMaintainanceWarrantyMaster",
          },
          {
            path: "/vehiclemanagement/vehiclemaster/EditMaintainanceWarrantyMaster",
            element: <EditMaintainanceWarrantyMaster />,
            state: "vehiclemaster.EditMaintainanceWarrantyMaster",
          },
          {
            path: "/vehiclemanagement/vehiclemaster/UtilizationLog",
            element: <UtilizationLog />,
            state: "vehiclemaster.UtilizationLog",
            sidebarProps: {
              displayText: "UtilizationLog",
            },
          },
          {
            path: "/vehiclemanagement/vehiclemaster/AddUtilizationLog",
            element: <AddUtilizationLog />,
            state: "vehiclemaster.AddUtilizationLog",
          },
          {
            path: "/vehiclemanagement/vehiclemaster/EditUtilizationLog",
            element: <EditUtilizationLog />,
            state: "vehiclemaster.EditUtilizationLog",
          },
          {
            path: "/vehiclemanagement/vehiclemaster/vehicletypemaster",
            element: <VehicleTypeMaster />,
            state: "vehiclemaster.VehicleTypeMaster",
            sidebarProps: {
              displayText: "Vehicle Type",
            },
          },
        ],
      },
      {
        path: "/vehiclemanagement/vehicletype",
        element: <VehicleTypeMaster />,
        state: "vehiclemaster.VehicleTypeMaster",
        sidebarProps: {
          displayText: "Vehicle Type",
        },
      },
      {
        path: "/vehiclemanagement/VehicleDetail",
        element: <VehicleDetail />,
        state: "vehiclemanagement.VehicleDetail",
        sidebarProps: {
          displayText: "Vehicle Detail",
        },
      },
      {
        path: "/vehiclemanagement/AddVehicleDetail",
        element: <AddVehicleDetail />,
        state: "vehiclemanagement.AddVehicleDetail",
      },
      {
        path: "/vehiclemanagement/EditVehicleDetail",
        element: <EditVehicleDetail />,
        state: "vehiclemanagement.EditVehicleDetail",
      },
      {
        path: "/vehiclemanagement/BrandMaster",
        element: <BrandMaster />,
        state: "vehiclemanagement.BrandMaster",
        sidebarProps: {
          displayText: "Brand Master",
        },
      },
      {
        path: "/vehiclemanagement/fueltype",
        element: <FuelTypeMaster />,
        state: "vehiclemanagement.FuelTypeMaster",
        sidebarProps: {
          displayText: "Fuel Type Master",
        },
      },
      {
        path: "/vehiclemanagement/Location",
        element: <Location />,
        state: "vehiclemanagement.Location",
        sidebarProps: {
          displayText: "Location",
        },
      },
      {
        path: "/vehiclemanagement/VehicleTypeInfo",
        element: <VehicleTypeInfo />,
        state: "vehiclemanagement.VehicleTypeInfo",
        sidebarProps: {
          displayText: "VehicleTypeInfo",
        },
      },
      {
        path: "/vehiclemanagement/vehiclecomplaints",
        element: <DashboardPageLayout />,
        state: "vehiclecomplaint",
        sidebarProps: {
          displayText: "Vehicle Complaint",
          icon: <DashboardOutlinedIcon />,
        },
        child: [
          {
            index: true,
            element: <DashboardIndex />,
            state: "vehiclecomplaint.index",
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/Complaint",
            element: <Complaint />,
            state: "vehiclecomplaint.Complaint",
            sidebarProps: {
              displayText: "Complaint",
            },
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/AddComplaint",
            element: <AddComplaint />,
            state: "vehiclecomplaint.AddComplaint",
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/EditComplaint",
            element: <EditComplaint />,
            state: "vehiclecomplaint.EditComplaint",
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/complaintapproval",
            element: <ComplaintApproval />,
            state: "vehiclecomplaint.Complaint",
            sidebarProps: {
              displayText: "Complaint",
            },
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/AddComplaintApproval",
            element: <AddComplaintApproval />,
            state: "Admin.AddComplaintApproval",
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/EditComplaintApproval",
            element: <EditComplaintApproval />,
            state: "Admin.EditComplaintApproval",
          },

          ((localStorage.getItem("ApplicationFlow") === "outsource") ?
            {
              path: "/vehiclemanagement/vehiclecomplaints/JobCard",
              element: <JobCard />,
              state: "vehiclecomplaint.JobCard",
              sidebarProps: {
                displayText: "JobCard",
              },
            } : {
              path: "/vehiclemanagement/vehiclecomplaints/JobCard",
              element: <JobCard1 />,
              state: "vehiclecomplaint.JobCard",
              sidebarProps: {
                displayText: "JobCard",
              },
            }
          ),
          ((localStorage.getItem("ApplicationFlow") === "outsource") ?
            {
              path: "/vehiclemanagement/vehiclecomplaints/AddJobCard",
              element: <AddJobCard />,
              state: "vehiclecomplaint.AddJobCard",
            } : {
              path: "/vehiclemanagement/vehiclecomplaints/AddJobCard",
              element: <AddJobCard1 />,
              state: "vehiclecomplaint.AddJobCard",
            }
          ),
          ((localStorage.getItem("ApplicationFlow") === "outsource") ?
            {
              path: "/vehiclemanagement/vehiclecomplaints/EditJobCard",
              element: <EditJobCard />,
              state: "vehiclecomplaint.EditJobCard",
            } : {
              path: "/vehiclemanagement/vehiclecomplaints/EditJobCard",
              element: <EditJobCard1 />,
              state: "vehiclecomplaint.EditJobCard",
            }
          ),


          // {
          //   path: "/vehiclemanagement/vehiclecomplaints/JobCard",
          //   element: <JobCard />,
          //   state: "vehiclecomplaint.JobCard",
          //   sidebarProps: {
          //     displayText: "JobCard",
          //   },
          // },
          // {
          //   path: "/vehiclemanagement/vehiclecomplaints/AddJobCard",
          //   element: <AddJobCard />,
          //   state: "vehiclecomplaint.AddJobCard",
          // },
          // {
          //   path: "/vehiclemanagement/vehiclecomplaints/EditJobCard",
          //   element: <EditJobCard />,
          //   state: "vehiclecomplaint.EditJobCard",
          // },
          {
            path: "/vehiclemanagement/vehiclecomplaints/JobWorkChallan",
            element: <JobWorkChallan />,
            state: "vehiclecomplaint.JobWorkChallan",
            sidebarProps: {
              displayText: "JobCard",
            },
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/AddJobWorkChallan",
            element: <AddJobWorkChallan />,
            state: "vehiclecomplaint.AddJobWorkChallan",
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/EditJobWorkChallan",
            element: <EditJobWorkChallan />,
            state: "vehiclecomplaint.EditJobWorkChallan",
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/JobWorkChallanRecieve",
            element: <JobWorkChallanRecieve />,
            state: "vehiclecomplaint.JobWorkChallanRecieve",
            sidebarProps: {
              displayText: "JobCard",
            },
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/AddJobWorkChallanRecieve",
            element: <AddJobWorkChallanRecieve />,
            state: "vehiclecomplaint.AddJobWorkChallanRecieve",
          },
          {
            path: "/vehiclemanagement/vehiclecomplaints/EditJobWorkChallanRecieve",
            element: <EditJobWorkChallanRecieve />,
            state: "vehiclecomplaint.EditJobWorkChallanRecieve",
          },

        ],
      },
    ]
  },


  //=====================================Vehicle Complaint=====================================//



  {
    path: "/vendorinfo",
    element: <DashboardPageLayout />,
    state: "vendorinfo",
    sidebarProps: {
      displayText: "Vendor Info",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "vendorinfo.index",
      },
      {
        path: "/vendorinfo/Vendor",
        element: <Vendor />,
        state: "vendorinfo.Vendor",
        sidebarProps: {
          displayText: "Vendor",
        },
      },
      {
        path: "/vendorinfo/AddVendor",
        element: <AddVendor />,
        state: "vendorinfo.AddVendor",
      },
      {
        path: "/vendorinfo/EditVendor",
        element: <EditVendor />,
        state: "vendorinfo.EditVendor",
      },
      {
        path: "/vendorinfo/Services",
        element: <Services />,
        state: "vendorinfo.Services",
        sidebarProps: {
          displayText: "Services",
        },
      },
      {
        path: "/vendorinfo/ServiceContract",
        element: <ServiceContract />,
        state: "vendorinfo.ServiceContract",
        sidebarProps: {
          displayText: "Service Contract",
        },
      },
      {
        path: "/vendorinfo/AddServiceContract",
        element: <AddServiceContract />,
        state: "vendorinfo.AddServiceContract",
      },
      {
        path: "/vendorinfo/EditServiceContract",
        element: <EditServiceContract />,
        state: "vendorinfo.EditServiceContract",
      },
      {
        path: "/vendorinfo/ItemContract",
        element: <ItemContract />,
        state: "vendorinfo.ItemContract",
        sidebarProps: {
          displayText: "Item Contract",
        },
      },
      {
        path: "/vendorinfo/AddItemContract",
        element: <AddItemContract />,
        state: "vendorinfo.AddItemContract",
      },
      {
        path: "/vendorinfo/EditItemContract",
        element: <EditItemContract />,
        state: "vendorinfo.EditItemContract",
      },

    ],
  },
  {
    path: "/Admin",
    element: <DashboardPageLayout />,
    state: "Admin",
    sidebarProps: {
      displayText: "Admin",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Admin.index",
      },
      {
        path: "/Admin/ComplaintApproval",
        element: <ComplaintApproval />,
        state: "Admin.ComplaintApproval",
        sidebarProps: {
          displayText: "Complaint Approval",
        },
      },
      {
        path: "/Admin/AddComplaintApproval",
        element: <AddComplaintApproval />,
        state: "Admin.AddComplaintApproval",
      },
      {
        path: "/Admin/EditComplaintApproval",
        element: <EditComplaintApproval />,
        state: "Admin.EditComplaintApproval",
      },

      {
        path: "/Admin/Flowmaster",
        element: <Flowmaster />,
        state: "Admin.Flowmaster",
        sidebarProps: {
          displayText: "Flow Master",
        },
      },
      {
        path: "/Admin/MenuCreate",
        element: <MenuMaster />,
        state: "Admin.MenuCreate",
        sidebarProps: {
          displayText: "Menu Create",
        },
      },
      {
        path: "/Admin/helpCreation",
        element: <HelpCreation />,
        state: "Admin.HelpCreation",
        sidebarProps: {
          displayText: "Help Creation",
        },
      },
      {
        path: "/Admin/Helpdesk",
        element: <Helpdesk />,
        state: "Admin.Helpdesk",
        sidebarProps: {
          displayText: "Help desk",
        },
      },
      {
        path: "/Admin/ChangePassword",
        element: <ChangePassword />,
        state: "Admin.ChangePassword",
        sidebarProps: {
          displayText: "Change Password",
        },
      },
      {
        path: "/Admin/masters",
        element: <DashboardPageLayout />,
        state: "masters",
        sidebarProps: {
          displayText: "Master",
          icon: <DashboardOutlinedIcon />,
        },
        child: [
          {
            index: true,
            element: <DashboardIndex />,
            state: "master.index",
          },

          {
            path: "/Admin/masters/ZoneM",
            element: <ZoneMaster />,
            state: "masters.ZoneMaster",
            sidebarProps: {
              displayText: "Zone Master",
            },
          },

          {
            path: "/Admin/masters/city",
            element: <CityMaster />,
            state: "masters.CityMaster",
            sidebarProps: {
              displayText: "District",
            },
          },
          {
            path: "/Admin/masters/State",
            element: <StateMaster />,
            state: "masters.StateMaster",
            sidebarProps: {
              displayText: "State",
            },
          },

          {
            path: "/Admin/masters/Country",
            element: <CountryMaster />,
            state: "masters.CountryMaster",
            sidebarProps: {
              displayText: "Country",
            },
          },


          {
            path: "/Admin/masters/Type",
            element: <ItemType />,
            state: "masters.ItemType",
          },

          {
            path: "/Admin/masters/category",
            element: <ItemCategory />,
            state: "masters.ItemCategory",
            sidebarProps: {
              displayText: "ItemCategory",
            },
          },


          {
            path: "/Admin/masters/Tax",
            element: <Taxmaster />,
            state: "masters.Taxmaster",
            sidebarProps: {
              displayText: "Tax master",
            },
          },
          {
            path: "/Admin/masters/Unit",
            element: <Unitmaster />,
            state: "masters.Unitmaster",
            sidebarProps: {
              displayText: "Unit master",
            },
          },

          {
            path: "/Admin/masters/FolderLocation",
            element: <FolderLocation />,
            state: "masters.FolderLocation",
            sidebarProps: {
              displayText: "Folder Location",
            },
          },


          {
            path: "/Admin/masters/FinancialYear",
            element: <FinancialYear />,
            state: "masters.FinancialYear",
            sidebarProps: {
              displayText: "Financial Year",
            },
          },


          {
            path: "/Admin/masters/StockBin",
            element: <StockBin />,
            state: "masters.StockBin",
            sidebarProps: {
              displayText: "Stock Bin",
            },
          },

        ],

      },
      {
        path: "/Admin/security",
        element: <DashboardPageLayout />,
        state: "security",
        sidebarProps: {
          displayText: "Security",
          icon: <DashboardOutlinedIcon />,
        },
        child: [
          {
            index: true,
            element: <DashboardIndex />,
            state: "security.index",
          },

          {
            path: "/Admin/security/Roles",
            element: <RoleMaster />,
            state: "security.RoleMaster",
            sidebarProps: {
              displayText: "Role Master",
            }
          },
          {
            path: "/Admin/security/juridictionwisefolder",
            element: <Juridiction />,
            state: "security.Jurisdiction",
            sidebarProps: {
              displayText: "Jurisdiction",
            }
          },
        ],
      },
      {
        path: "/Admin/Setting",
        element: <DashboardPageLayout />,
        state: "Setting",
        sidebarProps: {
          displayText: "Setting",
          icon: <DashboardOutlinedIcon />,
        },
        child: [
          {
            index: true,
            element: <DashboardIndex />,
            state: "Setting.index",
          },

          {
            path: "/Admin/Setting/oragnisation",
            element: <Institute />,
            state: "Setting.Oragnisation",
            sidebarProps: {
              displayText: "Oragnisation",
            }
          },
          {
            path: "/Admin/Setting/addoragnisation",
            element: <InstituteAdd />,
            state: "Setting.addoragnisation",
          },
          {
            path: "/Admin/Setting/editoragnisation",
            element: <InstituteEdit />,
            state: "Settting.editoragnisation",
          },
          {
            path: "/Admin/Setting/pagesetup",
            element: <PageSetup />,
            state: "Setting.PageSetup",
            sidebarProps: {
              displayText: "PageSetup",
            }
          },
         
        ],
      },
      {
        path: "/Admin/userpremission",
        element: <UserPermissionMaster />,
        state: "UserManagement.UserPermissionMaster",
        sidebarProps: {
          displayText: "User Permission",
        }
      },


    ]
  }

];



export default appRoutes;

