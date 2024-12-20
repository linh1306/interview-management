import { BrowserRouter } from "react-router-dom";
import CustomProvider from "./redux/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./ErrorBoundary";
import MainRoutes from "./routes";
import { AuthProvider } from "@/redux/provider/AuthProvider.tsx";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <CustomProvider>
            <AuthProvider>
              <MainRoutes />
            </AuthProvider>
          </CustomProvider>
          <ToastContainer />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>

  );
}

export default App;
