import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import PredictChurn from "./pages/PredictChurn";
import CustomerExplanation from "./pages/CustomerExplanation";
import CustomerRiskTable from "./pages/CustomerRiskTable";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/predict"
          element={<PredictChurn />}
        />

        <Route
          path="/explanation"
          element={<CustomerExplanation />}
        />

        <Route
          path="/customers"
          element={<CustomerRiskTable />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;