import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import BlastFurnace from "./pages/BlastFurnace/BlastFurnace";
import CokeOven from "./pages/CokeOven/CokeOven";
import SinterPlant from "./pages/SinterPlant/SinterPlant";
import PowerPlant from "./pages/PowerPlant/PowerPlant";
import ESG from "./pages/ESG/ESG";
import Reports from "./pages/Reports/Reports";
import VoiceAssistant from "./pages/VoiceAssistant/VoiceAssistant";
import Layout from "./components/layout/Layout";
import SMS from "./pages/SMS/SMS";
import Alerts from "./pages/Alerts/Alerts";

function App() {

  return (

  <BrowserRouter>

    <Routes>
      
    
        <Route
            path="/"
            element={<Login />}
        />


            <Route
                path="/dashboard"
                element={<Dashboard />}
            />
<Route
            element={<Layout />}
        >

            <Route
                path="/blast-furnace"
                element={<BlastFurnace />}
            />

            <Route
                path="/coke-oven"
                element={<CokeOven />}
            />

            <Route
                path="/sinter-plant"
                element={<SinterPlant />}
            />

            <Route
                path="/power-plant"
                element={<PowerPlant />}
            />

            <Route
                path="/esg"
                element={<ESG />}
            />

            <Route
                path="/reports"
                element={<Reports />}
            />
            <Route
    path="/alerts"
    element={<Alerts />}
/>
            <Route
                path="/voice-assistant"
                element={<VoiceAssistant />}
            />

        </Route>
        <Route
    path="/sms"
    element={<SMS />}
/>

    </Routes>

</BrowserRouter>

  );
}

export default App;