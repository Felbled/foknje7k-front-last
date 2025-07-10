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
  
  // États séparés pour les dropdowns desktop et mobile
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMobileOpen, setDropdownMobileOpen] = useState(false);
  
  const navigation = useNavigate();
  const location = useLocation();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const dispatch = useDispatch();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  
  // Réfs distinctes pour les dropdowns
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMobileRef = useRef<HTMLDivElement>(null);

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

  // Gestion des clics en dehors des menus dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Vérifier pour le dropdown desktop
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      
      // Vérifier pour le dropdown mobile
      if (dropdownMobileRef.current && !dropdownMobileRef.current.contains(target)) {
        setDropdownMobileOpen(false);
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
    setDropdownMobileOpen(false);
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
    // Fermer le dropdown mobile quand on ferme le menu complet
    if (isMobileMenuOpen) setDropdownMobileOpen(false);
  };

  // Fonction pour naviguer vers le tableau de bord selon le rôle
  const goToDashboard = () => {
    const path = role === "ROLE_TEACHER" ? "/subject" : "/home";
    navigation(path);
    setDropdownOpen(false);
    setDropdownMobileOpen(false);
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  return (
    <header
     className={`z-20 h-[80px] bg-text bg-opacity-5 backdrop-blur-sm p-4 flex justify-between items-center fixed top-0 left-0 right-0 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } shadow-md`}
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
        className="logo-navv h-12 lg:h-16 cursor-pointer pl-5 lg:pl-20"
      />

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="z-30">
          {isMobileMenuOpen ? (
            <CloseIcon className="text-title text-3xl mr-5" />
          ) : (
            <MenuIcon className="text-title text-3xl mr-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-[#f9f6f1] p-6 z-20 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
       
        
        
        {/* Menu Links */}
        <div className="bg-[#f9f6f1] rounded-t-[40px] pl-5  flex flex-col mt-8 space-y-6">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("home");
              }
            }}
            className="text-title font-montserrat_regular text-2xl hover:text-primary"
          >
            Acceuil
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("about");
              }
            }}
            className="text-title font-montserrat_regular text-2xl hover:text-primary"
          >
            À propos
          </a>
          <a
            href="#free-courses"
            onClick={(e) => {
              e.preventDefault();
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("free-courses");
              }
            }}
            className="text-title font-montserrat_regular text-2xl hover:text-primary"
          >
            Cours gratuits
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              toggleMobileMenu();
              if (location.pathname !== "/") {
                navigation("/");
              } else {
                scrollToSection("contact");
              }
            }}
            className="text-title pb-2 font-montserrat_regular text-2xl hover:text-primary"
          >
            Contact
          </a>
        </div>
        
        {/* Menu utilisateur mobile */}
        <div className="lg:hidden rounded-b-[40px] pb-3 pr-3 bg-[#f9f6f1]" ref={dropdownMobileRef}>
          {isLogged ? (
            <div className="">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-[#3492d6] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
                    {userInitials}
                  </div>
                  <span className="ml-3 text-base font-medium text-gray-700 truncate max-w-[140px]">
                    {userFullName}
                  </span>
                </div>
                <button onClick={() => setDropdownMobileOpen(!dropdownMobileOpen)}>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className="h-4 w-4 text-gray-500 transition-transform duration-200"
                    style={{ transform: dropdownMobileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
              </div>

              {dropdownMobileOpen && (
                <div className="mt-3 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      goToDashboard();
                    }}
                  >
                    <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 mr-3 text-blue-500" />
                    Tableau de bord
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      navigation('/dashboard/updateprofil');
                      setDropdownMobileOpen(false);
                      toggleMobileMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5 mr-3 text-blue-500" />
                    Mon espace
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-3 text-red-500" />
                    Déconnexion
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="lg:hidden pr-3 pl-3 ml-0 rounded-b-[40px] bg-[#f9f6f1] flex flex-col space-y-5">
              <CustomButton
                text={"S'inscrire"}
                onClick={() => {
                  navigation("/role");
                  toggleMobileMenu();
                }}
                width={"w-full"}
                className="h-12 rounded-lg text-base"
              />
              <CustomButton
                text={"Se connecter"}
                onClick={() => {
                  navigation("/login");
                  toggleMobileMenu();
                }}
                width={"w-full"}
                className="bg-white border-2  border-primary text-primary rounded-lg h-12 text-base"
              />
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Menu */}
      <nav className="hidden lg:block">
        <ul className="flex space-x-8 xl:space-x-12">
          <li>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("home");
                }
              }}
              className="text-title font-montserrat_regular text-lg hover:text-primary transition-colors"
            >
              Acceuil
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("about");
                }
              }}
              className="text-title font-montserrat_regular text-lg hover:text-primary transition-colors"
            >
              À propos
            </a>
          </li>
          <li>
            <a
              href="#free-courses"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("free-courses");
                }
              }}
              className="text-title font-montserrat_regular text-lg hover:text-primary transition-colors"
            >
              Cours gratuits
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== "/") {
                  navigation("/");
                } else {
                  scrollToSection("contact");
                }
              }}
              className="text-title font-montserrat_regular text-lg hover:text-primary transition-colors"
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
            <div className="bg-[#3492d6] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium shadow-md">
              {userInitials}
            </div>
            <span className="text-base font-medium text-gray-700 truncate max-w-[140px]">
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
              className="absolute top-full right-0 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 mt-2"
            >
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  goToDashboard();
                }}
              >
                <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 mr-3 text-blue-500" />
                Tableau de bord
              </a>
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigation('/dashboard/updateprofil');
                  setDropdownOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5 mr-3 text-blue-500" />
                Mon espace
              </a>
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-[#3492d6] hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                  setDropdownOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-3 text-red-500" />
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
            className="h-[40px] rounded-md text-base"
          />
          <CustomButton
            text={"Se connecter"}
            onClick={() => navigation("/login")}
            width={"w-40"}
            className="bg-white border-2 border-primary text-primary rounded-md h-[40px] text-base"
          />
        </div>
      )}
    </header>
  );
};

export default Header;