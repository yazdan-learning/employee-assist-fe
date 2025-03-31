// import EcommerenceProducts from "src/pages/Ecommerence/EcommerenceProducts";
// import { Navigate } from "react-router-dom"
// import Dashboard from "../pages/Dashboard";

import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/index";

//Chat
import Chat from "../pages/Chat/Chat";

import React from "react";
import CustomerList from "../pages/Accountant/Customers/CustomerList";
import CustomerForm from "../pages/Accountant/Customers/CustomerForm";
import CustomerDetails from "../pages/Accountant/Customers/CustomerDetails";

//Authentication pages
// import Login1 from "../pages/AuthenticationInner/Login";
// import Login2 from "../pages/AuthenticationInner/Login2";
// import Register from "../pages/AuthenticationInner/Register";
// import Register2 from "../pages/AuthenticationInner/Register2";
// import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
// import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
// import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
// import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
// import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
// import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";
// import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
// import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";
// import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
// import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

//Pages
// import PagesStarter from "../pages/Utility/pages-starter";
// import PagesMaintenance from "../pages/Utility/pages-maintenance";
// import PagesTimeline from "../pages/Utility/pages-timeline";
// import PagesFaqs from "../pages/Utility/pages-faqs";
// import PagesPricing from "../pages/Utility/pages-pricing";
// import PagesComingsoon from "../pages/Utility/pages-comingsoon";
// import Pages404 from "../pages/Utility/pages-404";
// import Pages500 from "../pages/Utility/pages-500";

const authProtectedRoutes = [
  // { path: "/dashboard", component: <Dashboard /> }
  // { path: "/profile", component: <UserProfile /> },
  // { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // eslint-disable-next-line react/react-in-jsx-scope
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  // eslint-disable-next-line react/react-in-jsx-scope
  { path: "/dashboard", component: <Dashboard /> },
  //chat

  // eslint-disable-next-line react/react-in-jsx-scope
  { path: "/chat", component: <Chat /> },
  // eslint-disable-next-line react/react-in-jsx-scope
  { path: "/accountant/customers", component: <CustomerList /> },
  // eslint-disable-next-line react/react-in-jsx-scope
  { path: "/accountant/customers/add", component: <CustomerForm /> },
  // eslint-disable-next-line react/react-in-jsx-scope
  { path: "/accountant/customers/edit/:id", component: <CustomerForm /> },
  // eslint-disable-next-line react/react-in-jsx-scope
  { path: "/accountant/customers/:id", component: <CustomerDetails /> },
  // { path: "/login", component: <Login /> },
  // { path: "/logout", component: <Logout /> },
  // { path: "/forgot-password", component: <ForgotPassword /> },
  // { path: "/register", component: <SignUp /> },

  // { path: "/pages-maintenance", component: <PagesMaintenance /> },
  // { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  // { path: "/pages-404", component: <Pages404 /> },
  // { path: "/pages-500", component: <Pages500 /> },
  // { path: "/crypto-ico-landing", component: <CryptoIcoLanding /> },

  // // // Authentication Inner
  // { path: "/pages-login", component: <Login1 /> },
  // { path: "/pages-login-2", component: <Login2 /> },
  // { path: "/pages-register", component: <Register /> },
  // { path: "/pages-register-2", component: <Register2 /> },
  // { path: "/page-recoverpw", component: <Recoverpw /> },
  // { path: "/page-recoverpw-2", component: <Recoverpw2 /> },
  // { path: "/auth-lock-screen", component: <LockScreen /> },
  // { path: "/auth-lock-screen-2", component: <LockScreen2 /> },
  // { path: "/page-confirm-mail", component: <ConfirmMail /> },
  // { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },
  // { path: "/auth-email-verification", component: <EmailVerification /> },
  // { path: "/auth-email-verification-2", component: <EmailVerification2 /> },
  // { path: "/auth-two-step-verification", component: <TwostepVerification /> },
  // { path: "/auth-two-step-verification-2", component: <TwostepVerification2 /> },
];
export { authProtectedRoutes, publicRoutes };
