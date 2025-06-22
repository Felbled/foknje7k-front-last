import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Logo } from "../../assets/images";
import CustomButton from "../custom-button/custom-button";
import { RootState } from "../../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/store/isLogged-slices";
import { clearUserData } from "../../redux/store/userData-slices";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./header.css";

const Header: React.FC = () => {
  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name
  );
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const dispatch = useDispatch();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (!isDashboardRoute) {
        if (currentScrollTop > lastScrollTop) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      } else {
        setShowHeader(true);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop, location.pathname]);

  const handleLogout = () => {
    navigation("/");
    localStorage.clear();
    dispatch(logOut());
    dispatch(clearUserData());
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`z-20 h-[80px] bg-text bg-opacity-5 backdrop-blur-sm p-4 flex justify-between items-center fixed top-0 left-0 right-0 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo */}
      <img
        onClick={() => {
          if (isLogged) {
            if (role === "ROLE_TEACHER") {
              navigation("subject");
            } else {
              navigation("home");
            }
          } else {
            navigation("/");
          }
        }}
        src={Logo}
        alt="Logo"
        className="h-12 lg:h-20 cursor-pointer"
      />

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden flex items-center">
        <button onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <CloseIcon className="text-title text-3xl" />
          ) : (
            <MenuIcon className="text-title text-3xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden fixed h-max top-0 left-0 w-full bg-white p-6 z-30 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button (positioned top-right) */}
        <div className="flex justify-end">
          <CloseIcon
            onClick={toggleMobileMenu}
            className="text-title text-3xl cursor-pointer"
          />
        </div>
        {/* Menu Links */}
        <div className="flex flex-col mt-6 space-y-4">
          <a
            href="#home"
            onClick={() => {
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("home");
              }
            }}
            className="text-title font-montserrat_regular text-2xl"
          >
            Acceuil
          </a>
          <a
            href="#about"
            onClick={() => {
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("about");
              }
            }}
            className="text-title font-montserrat_regular text-2xl"
          >
            À propos
          </a>
          <a
            href="#free-courses"
            onClick={() => {
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("free-courses");
              }
            }}
            className="text-title font-montserrat_regular text-2xl"
          >
            Cours gratuits
          </a>
          <a
            href="#contact"
            onClick={() => {
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("contact");
              }
            }}
            className="text-title font-montserrat_regular text-2xl"
          >
            Contact
          </a>
          {isLogged && (
            <Link
              to={role === "ROLE_TEACHER" ? "subject" : "home"}
              className="text-title font-montserrat_regular text-2xl"
              onClick={toggleMobileMenu}
            >
              Tableau de bord
            </Link>
          )}
        </div>
        <div className="lg:hidden mt-4 flex flex-col space-y-4">
          {isLogged ? (
            <CustomButton
              text={"Déconnexion"}
              onClick={() => handleLogout()}
              width={"w-full"}
              className="h-10 rounded-md"
            />
          ) : (
            <>
              <CustomButton
                text={"S'inscrire"}
                onClick={() => navigation("/role")}
                width={"w-full"}
                className="h-10 rounded-md"
              />
              <CustomButton
                text={"Se connecter"}
                onClick={() => navigation("/login")}
                width={"w-full"}
                className="bg-white border border-primary text-primary rounded-md h-10"
              />
            </>
          )}
        </div>
      </nav>

      {/* Desktop Menu */}
      <nav className="navbare">
        <ul>
          <li>
            <a
              href="#home"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("home");
                }
              }}
              className="text-title font-montserrat_regular text-2xl hover:text-text"
            >
              Acceuil
            </a>
          </li>
          <li>
            {" "}
            <a
              href="#about"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("about");
                }
              }}
              className="text-title font-montserrat_regular text-2xl hover:text-text"
            >
              À propos
            </a>
          </li>
          <li>
            <a
              href="#free-courses"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("free-courses");
                }
              }}
              className="text-title font-montserrat_regular text-2xl hover:text-text"
            >
              Cours gratuits
            </a>
          </li>
          <li>
            {" "}
            <a
              href="#contact"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("contact");
                }
              }}
              className="text-title font-montserrat_regular text-2xl hover:text-text"
            >
              Contact
            </a>
          </li>
        </ul>

        {isLogged && (
          <Link
            to={role === "ROLE_TEACHER" ? "subject" : "home"}
            className="text-title font-montserrat_regular text-2xl hover:text-text"
          >
            Tableau de bord
          </Link>
        )}
      </nav>

      {/* Desktop and Mobile Buttons */}
      {isLogged ? (
        <div className="hidden lg:flex">
          <CustomButton
            text={"Déconnexion"}
            onClick={() => handleLogout()}
            width={"w-44"}
            className="h-10 rounded-md"
          />
        </div>
      ) : (
        <div className="hidden lg:flex space-x-4">
          <CustomButton
            text={"S'inscrire"}
            onClick={() => navigation("/role")}
            width={"w-40"}
            className="h-[30px] rounded-md nav-btn"
          />
          <CustomButton
            text={"Se connecter"}
            onClick={() => navigation("/login")}
            width={"w-40"}
            className="bg-white border border-primary text-primary rounded-md h-[30px] nav-btn"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
