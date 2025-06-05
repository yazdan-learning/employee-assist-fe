import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { publicRoutes } from "./Routes/allRoutes";
import { Route, Routes } from "react-router-dom";
import VerticalLayout from "./Layouts/VerticalLayout";
import "./assets/scss/theme.scss";
// import NonAuthLayout from "./Layouts/NonLayout";
// import AuthProtected from "./Routes/AuthProtected";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Default Layout (Removed Redux-based layout selection)
const DefaultLayout = VerticalLayout;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
