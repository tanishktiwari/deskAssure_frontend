import React from 'react';
import Sidebar from './Sidebar/SidebarAdmin'; // Ensure the correct path
import Navbar from './Navbar/NavbarAdmin';   // Ensure the correct path
import Footer from './Footer/FooterAdmin';   // Ensure the correct path
import SidebarAdmin from './Sidebar/SidebarAdmin';
import NavbarAdmin from './Navbar/NavbarAdmin';
import FooterAdmin from './Footer/FooterAdmin';

const Dashboardadmin = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavbarAdmin />
      <div className="flex flex-1">
        <SidebarAdmin />
        <main className="flex-1 p-6 bg-gray-100">
          {/* Main content goes here */}
          <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
        </main>
      </div>
      <FooterAdmin />
    </div>
  );
};

export default Dashboardadmin;
