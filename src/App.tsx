import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ThemeProvider } from "@/context/ThemeContext";
import { SiteThemeProvider } from "@/context/SiteThemeContext";
import DynamicTheme from "@/components/feature/DynamicTheme";
import DynamicFavicon from "@/components/feature/DynamicFavicon";

function App() {
  return (
    <SiteThemeProvider>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter basename={__BASE_PATH__}>
            <DynamicTheme />
            <DynamicFavicon />
            <AppRoutes />
          </BrowserRouter>
        </I18nextProvider>
      </ThemeProvider>
    </SiteThemeProvider>
  );
}

export default App;