import Layout from "@/components/Layout";
import { store } from "@/store";
import { useLocalStorage } from "@/utils/localStorage";
import { ThemeProvider } from "@emotion/react";
import {
  CssBaseline,
  ThemeOptions,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Provider } from "react-redux";
import SnackBar from "../components/SnackBar";
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [isDarkMode, setDarkMode] = useLocalStorage(
    "darkMode",
    prefersDarkMode
  );

  const lightModeColors = {
    primary: { main: "#DD5903" },
    secondary: { main: "#FFE194" },
    textSecondary: { main: "#6D6A7C" },
    success: { main: "#1F1F1F" },
    info: { main: "#E8F6EF" },
    container: { main: "#fff" },
  };

  const darkModeColors = {
    primary: { main: "#DD5903" },
    secondary: { main: "#FFE194" },
    textSecondary: { main: "#6D6A7C" },
    success: { main: "#1F1F1F" },
    info: { main: "#E8F6EF" },
    container: { main: "#1F1F1F" },
  };

  // Define your theme options
  const themeOptions: ThemeOptions = {
    palette: {
      mode: isDarkMode ? "dark" : "light",
      ...(!isDarkMode && { ...lightModeColors }),
      ...(isDarkMode && { ...darkModeColors }),
    },
    typography: {
      button: {
        textTransform: "none",
      },
    },
  };
  const theme = createTheme(themeOptions);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout isDarkMode={isDarkMode} setDarkMode={setDarkMode}>
            <Component {...pageProps} />
            <SnackBar />
          </Layout>
          <CssBaseline />
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
