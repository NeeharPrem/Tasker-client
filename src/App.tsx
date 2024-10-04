import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useSelector } from "react-redux";

interface RootState {
  auth: {
    userLoggedin: boolean;
  };
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { userLoggedin } = useSelector((state: RootState) => state.auth);
  if (!userLoggedin) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;