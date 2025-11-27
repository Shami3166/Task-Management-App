import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext"; // ADD THIS
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <TaskProvider>
            {" "}
            {/* WRAP WITH TASK PROVIDER */}
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Toaster position="top-right" richColors closeButton />
            </div>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
