import { OauthAppProvider } from "./context/OauthApp";
import { AppTheme } from "./App.Theme";

export const App = () => {
  return (
    <OauthAppProvider>
      <AppTheme />
    </OauthAppProvider>
  );
};
