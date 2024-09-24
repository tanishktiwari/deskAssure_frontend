import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserPanel from './Components/Loginpages/Userpanel'; // Adjust path as needed
import AdminPanel from './Components/Loginpages/Adminpanel'; // Adjust path as needed
import Dashboard from './Components/UserPanel/Dashboard/Dashboard'; // Adjust path as needed
import CreateTicket from './Components/UserPanel/CreateTicket/CreateTicket'; // Adjust path as needed
import Open from './Components/UserPanel/Open/Open';
import Close from './Components/UserPanel/Close/Close';
import Dashboardadmin from './Components/AdminPanel/Dashboardadmin';
import Operator from "../src/Components/AdminPanel/Operator/Operator"
import Home from './Components/UserPanel/Home/Home';
import ProfileForm from './Components/UserPanel/Profileform/Profileform';
import OpenticketAdmin from './Components/AdminPanel/OpenticketAdmin/OpenticketAdmin';
import CloseticketAdmin from './Components/AdminPanel/CloseticketAdmin/CloseticketAdmin'
import Reports from './Components/UserPanel/Reports/Reports';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            {/* Redirect root path to /user-login */}
            <Route path="/" element={<Navigate to="/user-login" />} />

            {/* Define routes */}
            <Route path="/user-login" element={<UserPanel />} />
            <Route path="/admin-login" element={<AdminPanel />} />
            
            {/* Dashboard for user */}
            <Route path="/dashboard" element={<Dashboard />}>
              {/* Nested routes within user Dashboard */}
              <Route path="create-ticket" element={<CreateTicket />} />
              <Route path="open" element={<Open />} />
              <Route path="close" element={<Close />} />
              <Route path="home" element={<Home />} />
              <Route path="Profileform" element={<ProfileForm />} />
              <Route path="report" element={<Reports />} />
            </Route>

            {/* Independent route for Admin Dashboard */}
            <Route path="/dashboardadmin" element={<Dashboardadmin />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/openticketadmin" element={<OpenticketAdmin />} />
            <Route path="/closeticketadmin" element={<CloseticketAdmin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
