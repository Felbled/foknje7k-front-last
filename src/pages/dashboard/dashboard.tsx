import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Drawer, IconButton } from "@mui/material";

const sidebarLinks = [
  {
    path: "/offer-teacher",
    name: "Proffesseur Offre",
    roles: ["ROLE_SUPER_TEACHER", "ROLE_ADMIN"],
  },
  {
    path: "/offer-student",
    name: "Éleves Offre",
    roles: ["ROLE_STUDENT", "ROLE_ADMIN"],
  },
  {
    path: "/subscription",
    name: "Abonnement",
    roles: ["ROLE_SUPER_TEACHER", "ROLE_STUDENT"],
  },
  /*{
    path: "/advertisement",
    name: "Publicité",
    roles: ["ROLE_ADMIN", "ROLE_SUPER_TEACHER"],
  },*/
  {
    path: "/management-prof",
    name: "Gestion Prof",
    roles: ["ROLE_ADMIN", "ROLE_SUPER_TEACHER"],
  },
  {
    path: "/management-student",
    name: "Gestion Eléve",
    roles: ["ROLE_ADMIN", "ROLE_SUPER_TEACHER"],
  },
  {
    path: "/management-course",
    name: "Gestion des cours",
    roles: ["ROLE_ADMIN", "ROLE_SUPER_TEACHER", "ROLE_TEACHER"],
  },
  {
    path: "/management-files",
    name: "Gestion des fichiers",
    roles: ["ROLE_ADMIN", "ROLE_SUPER_TEACHER", "ROLE_TEACHER"],
  },
  {
    path: "/files",
    name: "Les fichiers",
    roles: ["ROLE_ADMIN", "ROLE_SUPER_TEACHER", "ROLE_TEACHER"],
  },
  {
    path: "/calender",
    name: "Calendrier Live",
    roles: ["ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_TEACHER", "ROLE_STUDENT"],
  },
  {
    path: "/chat",
    name: "Chat Room",
    roles: ["ROLE_ADMIN", "ROLE_TEACHER", "ROLE_SUPER_TEACHER", "ROLE_STUDENT"],
  },
  {
    path: "/requests-prof",
    name: "Les Demandes des Prof",
    roles: ["ROLE_ADMIN"],
  },
  {
    path: "/requests-student",
    name: "Les Demandes des élèves",
    roles: ["ROLE_ADMIN"],
  },
  {
    path: "/stats",
    name: "Statestique",
    roles: ["ROLE_ADMIN"],
  },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const name = useSelector(
    (state: RootState) => state?.user?.userData?.fullName,
  );
  const userRole = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-full pt-28">
      {/* Sidebar for larger screens */}
      <aside className="hidden sm:block w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>
        <nav>
          <ul>
            {sidebarLinks.map(
              (link) =>
                //@ts-ignore
                link.roles.includes(userRole) && (
                  <li key={link.path} className="mb-2">
                    <NavLink
                      to={"/dashboard" + link.path}
                      className={({ isActive }) =>
                        `block p-2 rounded text-balance ps-12 font-montserrat_medium ${
                          isActive
                            ? "bg-primary text-white"
                            : "hover:bg-gray-200"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ),
            )}
          </ul>
        </nav>
      </aside>

      <div className="md:hidden absolute  right-3 top-20">
        <IconButton onClick={toggleSidebar}>
          <MenuOpenIcon />
        </IconButton>
      </div>

      {/* Drawer for mobile screens only */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        className="sm:hidden" // Drawer only appears in mobile view
        transitionDuration={{ enter: 500, exit: 500 }}
      >
        <aside className="w-64 bg-white shadow-md p-4 h-full">
          <h2 className="text-lg font-bold mb-4">Dashboard</h2>
          <nav>
            <ul>
              {sidebarLinks.map(
                (link) =>
                  //@ts-ignore
                  link.roles.includes(userRole) && (
                    <li key={link.path} className="mb-2">
                      <NavLink
                        to={"/dashboard" + link.path}
                        className={({ isActive }) =>
                          `block p-2 rounded text-balance ps-12 font-montserrat_medium ${
                            isActive
                              ? "bg-primary text-white"
                              : "hover:bg-gray-200"
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ),
              )}
            </ul>
          </nav>
        </aside>
      </Drawer>
      <main className="flex-1 w-[70%]]">
        <div className="h-20 bg-white  justify-end items-center px-5 hidden lg:flex">
          <div className="w-1/3 flex justify-end">
            <div className="flex items-center">
              <p className="font-montserrat_regular text-xs text-title ms-5">
                {name}
              </p>
            </div>
          </div>
        </div>
        <div className=" px-7 lg:px-14 pt-10 h-full ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
