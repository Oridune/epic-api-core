import { AppTheme } from "./App.Theme";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider,
} from "react-query";

export const QueryClient = new ReactQueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={QueryClient}>
      <AppTheme />
    </QueryClientProvider>
  );
};
