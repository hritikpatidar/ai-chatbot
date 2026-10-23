import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";

export default function App() {
    const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {/* <Toaster
        position="top-center"
        gutter={10}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#171b23",
            color: "#fff",
            border: "1px solid rgba(255,255,255,.08)",
            padding: "12px 16px",
            borderRadius: "14px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      /> */}
      <Toaster
        position="top-center"
        gutter={10}
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? "#171b23" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#111827",
            border: isDarkMode
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid #e5e7eb",
            padding: "12px 16px",
            borderRadius: "14px",
            fontSize: "14px",
            boxShadow: isDarkMode
              ? "0 8px 24px rgba(0,0,0,0.3)"
              : "0 8px 24px rgba(0,0,0,0.08)",
          },
          success: {
            style: {
              background: isDarkMode ? "#171b23" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#111827",
              border: isDarkMode
                ? "1px solid rgba(34,197,94,0.3)"
                : "1px solid #bbf7d0",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: isDarkMode ? "#171b23" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#111827",
              border: isDarkMode
                ? "1px solid rgba(239,68,68,0.3)"
                : "1px solid #fecaca",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}
