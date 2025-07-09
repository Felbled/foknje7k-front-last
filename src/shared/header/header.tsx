import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Logo } from "../../assets/images";
import CustomButton from "../custom-button/custom-button";
import { RootState } from "../../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/store/isLogged-slices";
import { clearUserData } from "../../redux/store/userData-slices";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faSignOutAlt, 
  faChevronDown,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import "./header.css";

const Header: React.FC = () => {
  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role?.name
  );
  const userData = useSelector((state: RootState) => state.user.userData);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const dispatch = useDispatch();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calcul des initiales et nom complet
  const userFullName = userData?.fullName || '';
  const userInitials = userFullName
    ? userFullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '';

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

  // Gestion des clics en dehors du menu dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigation("/");
    localStorage.clear();
    dispatch(logOut());
    dispatch(clearUserData());
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
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

  // Fonction pour naviguer vers le tableau de bord selon le rôle
  const goToDashboard = () => {
    const path = role === "ROLE_TEACHER" ? "/subject" : "/home";
    navigation(path);
    setDropdownOpen(false);
    if (isMobileMenuOpen) toggleMobileMenu();
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
        className="logo-navv h-12 lg:h-20 cursor-pointer"
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
        </div>
        
        {/* Menu utilisateur mobile */}
        <div className="lg:hidden mt-4">
          {isLogged ? (
            <div className="mt-4">
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <div className="bg-[#3492d6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {userInitials}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 truncate max-w-[120px]">
                    {userFullName}
                  </span>
                </div>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className="h-3 w-3 text-gray-500 transition-transform duration-200"
                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
              </div>

              {dropdownOpen && (
                <div className="mt-3 bg-white rounded-md shadow-lg  z-50 border border-gray-200">
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      goToDashboard();
                    }}
                  >
                    <FontAwesomeIcon icon={faChartBar} className="h-4 w-4 mr-2 text-blue-500" />
                    Tableau de bord
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      navigation('/dashboard/updateprofil');
                      setDropdownOpen(false);
                      toggleMobileMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4 mr-2 text-blue-500" />
                    Mon espace
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                      setDropdownOpen(false);
                      toggleMobileMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-2 text-red-500" />
                    Déconnexion
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="lg:hidden mt-4 flex flex-col space-y-4">
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
            </div>
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
      </nav>

      {/* Menu utilisateur desktop */}
      {isLogged ? (
        <div className="hidden lg:flex relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 rounded-full pl-2 pr-4 py-1 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="bg-[#3492d6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium shadow-md">
              {userInitials}
            </div>
            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
              {userFullName}
            </span>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className="h-3 w-3 text-gray-500 transition-transform duration-200"
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {dropdownOpen && (
            <div 
              className="absolute top-full right-0 w-56 bg-white rounded-md shadow-lg border-[#3492d6]  z-50 border-2 border-gray-200" 
              style={{ top: 'calc(100% + 8px)' }}
            >
              <a 
                href="#" 
                className="flex items-center  px-4 py-2 text-sm text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  goToDashboard();
                }}
              >
                <FontAwesomeIcon icon={faChartBar} className="h-4 w-4 mr-2 text-blue-500" />
                Tableau de bord
              </a>
              <a 
                href="#" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigation('/dashboard/updateprofil');
                  setDropdownOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4 mr-2 text-blue-500" />
                Mon espace
              </a>
              <a 
                href="#" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                  setDropdownOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-2 text-red-500" />
                Déconnexion
              </a>
            </div>
          )}
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