import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import Login from "../../pages/auth/login/login";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col ">
      <Header />
      <main className={"bg-blue-500  "}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
