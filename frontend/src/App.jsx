import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import Router from "./routes/router";
 
export default function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}