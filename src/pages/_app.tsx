import Layout from "@/components/Layout";
import SnackBar from "@/components/SnackBar";
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
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [isDarkMode, setDarkMode] = useLocalStorage(
    "darkMode",
    prefersDarkMode
  );

  const themeOptions: ThemeOptions = {
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#4C4C6D",
      },
      secondary: {
        main: "#FFE194",
      },
      info: {
        main: "#E8F6EF",
      },
      success: {
        main: "#189C85",
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
