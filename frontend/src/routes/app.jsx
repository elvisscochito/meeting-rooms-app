import { BrowserRouter, Route, Routes } from "react-router-dom";
import Meetings from "../Pages/Meetings.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/meetings" element={<Meetings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
