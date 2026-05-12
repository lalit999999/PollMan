import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" theme="system" />
      </ThemeProvider>
    </AuthProvider>
  );
}
