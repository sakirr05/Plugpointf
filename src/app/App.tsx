import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AppProvider>
      <div className="h-screen w-full max-w-lg mx-auto bg-background shadow-xl overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        <RouterProvider router={router} />
      </div>
      <Toaster position="top-center" />
    </AppProvider>
  );
}
