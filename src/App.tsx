import React from "react";
import "./App.css";
import { publicRoutes } from "./Routes/allRoutes";
import { Route, Routes } from "react-router-dom";
import VerticalLayout from "./Layouts/VerticalLayout";
import "./assets/scss/theme.scss";
// import NonAuthLayout from "./Layouts/NonLayout";
// import AuthProtected from "./Routes/AuthProtected";

// Default Layout (Removed Redux-based layout selection)
const DefaultLayout = VerticalLayout;

function App() {
  return (
    <React.Fragment>
      <Routes>
        {/* Public Routes (No authentication required) */}
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={<DefaultLayout>{route.component}</DefaultLayout>}
          />
        ))}

        {/* Authenticated Routes (Require login) */}
        {/* {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <AuthProtected>
                <DefaultLayout>{route.component}</DefaultLayout>
              </AuthProtected>
            }
          />
        ))} */}
      </Routes>
    </React.Fragment>
  );
}

export default App;
