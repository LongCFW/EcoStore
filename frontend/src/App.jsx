import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider> {/* AuthProvider bây giờ đã nằm TRONG Router của main.jsx */}
        <AppRoutes />
    </AuthProvider>
  );
}

export default App;