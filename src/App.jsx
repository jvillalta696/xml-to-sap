import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";
import LoginPage from "./pages/LoginPage";
import FileUploadView from "./views/FileUploadView";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FileUploadView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
