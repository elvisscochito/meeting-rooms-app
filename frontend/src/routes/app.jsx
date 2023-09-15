import { BrowserRouter, Route, Routes } from "react-router-dom";
import Meetings from "../Pages/Meetings.jsx";
import MeetingsHistory from "../Pages/MeetingsHistory.jsx";
import Rooms from "../Pages/Rooms.jsx";
import Layout from "../components/Layout.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/" element={<Rooms />} />
          <Route path="/:room/meetings" element={<Meetings />} />
          <Route path="history" element={<MeetingsHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
