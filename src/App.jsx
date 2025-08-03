import { Routes, Route } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useEffect } from "react";
import AppLayout from "./layouts/AppLayout";
import DashboardHome from "./pages/DashboardHome";
import Dashboard from "./pages/Dashboard";
import DeveloperProfile from "./pages/DeveloperProfile";
import CreateReport from "./pages/CreateReport";
import ConsolidatedReport from "./pages/ConsolidatedReport";
import useAppStore from "./store/useAppStore";
import "./App.css";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
});

function App() {
  const { darkMode } = useAppStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <MantineProvider
      theme={theme}
      forceColorScheme={darkMode ? "dark" : "light"}
    >
      <Notifications />
      <ModalsProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/team-dashboard" element={<Dashboard />} />
            <Route path="/developer/:id" element={<DeveloperProfile />} />
            <Route
              path="/developer/:id/create-report"
              element={<CreateReport />}
            />
            <Route
              path="/consolidated-report"
              element={<ConsolidatedReport />}
            />
          </Routes>
        </AppLayout>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
