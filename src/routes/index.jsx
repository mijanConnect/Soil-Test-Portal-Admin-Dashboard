import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import NotFound from "../NotFound";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetSuccess from "../Pages/Auth/ResetSuccess";
import SetPassword from "../Pages/Auth/SetPassword";

// Dashboard pages & components
import CustomerManagement from "../components/customerManagement/customerManagement";
import TierSystem from "../components/TierSystem/TierSystem";
import SubscriptionTable from "../components/subscriber/SubscriberTable";
import PromotionManagement from "../components/promotionManagement/PromotionManagement";
import SalesRepPortal from "../components/salesRepPortal/SalesRepPortal";
import AuditLogs from "../components/auditLogs/AuditLogs";
import LoginCredentials from "../components/loginCredentials/LoginCredentials";
import ReportingAnalytics from "../components/reportingAnalytics/ReportingAnalytics";
import PushNotifications from "../components/pushNotifications/PushNotifications";
import OrderManagementContainer from "../components/orderMangement/OrderManagementContainer";
import SalesManagement from "../Pages/Dashboard/SalesManagement";
import Retailer from "../Pages/Dashboard/Retailer";
import ViewSalesReps from "../components/SalesRepsManagement/detailsSalesReps/ViewSalesReps";
import LoyaltyProgram from "../Pages/Dashboard/LoyaltyProgram";
import CategoryManagement from "../components/category/CategoryManagement";
import ColorManagement from "../components/colorManage/ColorManagement";
import SizeManagement from "../components/sizeManagement/SizeManagement";
import ProductManagement from "../components/productManagement/ProductsManagement";
import UserManagement from "../components/userMangement/UserManagement";
import PackagesPlans from "../Pages/Dashboard/Subscription";
import Banner from "../Pages/Dashboard/Banner";
import AboutUs from "../Pages/Dashboard/AboutUs";
import Contact from "../Pages/Dashboard/Contact";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndConditions from "../Pages/Dashboard/TermsAndCondition";
import FAQSection from "../components/faq/Faq";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import Notifications from "../Pages/Dashboard/Notifications";

// Sales reps
import SaleRepsManagement from "../Pages/Dashboard/SaleRepsManagement";

import PrivateRoute from "./ProtectedRoute";
import SubmissionManagement from "../components/submissionManagement/SubmissionManagement";
import UploadDocument from "../components/uploadDocuments/UploadDocument";
import SignUp from "../Pages/Auth/SignUp";

// 🔑 Simple auth check function (adjust based on your app logic)
const isLoggedIn = () => {
  return !!localStorage.getItem("token"); // change "token" to your auth key
};

const router = createBrowserRouter([
  // ✅ Root redirect
  {
    path: "/",
    element: isLoggedIn() ? (
      <Navigate to="/submission-management" replace />
    ) : (
      <Navigate to="/auth/login" replace />
    ),
  },

  // ====== DASHBOARD (Protected) ======
  {
    path: "/",
    element: (
      <PrivateRoute allowedRoles={["ADMIN"]}>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/submission-management",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <SubmissionManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "/user-management",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <LoginCredentials />
          </PrivateRoute>
        ),
      },
      {
        path: "/upload-documents",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <UploadDocument />
          </PrivateRoute>
        ),
      },
      {
        path: "/category-management",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <CategoryManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "/about-us",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <AboutUs />
          </PrivateRoute>
        ),
      },
      {
        path: "/contact",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <Contact />
          </PrivateRoute>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <PrivacyPolicy />
          </PrivateRoute>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <TermsAndConditions />
          </PrivateRoute>
        ),
      },
      {
        path: "/faq",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <FAQSection />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <AdminProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/notification",
        element: (
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <Notifications />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ====== AUTH ======
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "/auth", element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      { path: "reset-success", element: <ResetSuccess /> },
      { path: "set-password", element: <SetPassword /> },
      { path: "signup", element: <SignUp /> },
    ],
  },

  // ====== 404 ======
  { path: "*", element: <NotFound /> },
]);

export default router;
