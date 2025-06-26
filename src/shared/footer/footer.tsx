import React from "react";
import { Logo } from "../../assets/images";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import {
  faPhone,
  faEnvelope,
  faGraduationCap,
  faPeopleGroup,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <div className="footerContainer w-full bg-backgroundHome py-8 px-6 lg:px-32 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-16 place-items-center text-center lg:text-left">
        {/* Logo and Social Media */}
        <div className="flex flex-col items-center">
          <img
            alt="logo"
            src={Logo}
            className="w-20 h-20 lg:w-40 lg:h-40 object-cover mb-2"
          />
          <div className="linkss flex space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=100069589923551"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookOutlinedIcon
                className="text-title fb"
                style={{ fontSize: 35 }}
              />
            </a>
            <a
              href="https://www.instagram.com/fok_nje7ik?igsh=eGU5ZWI0cjFmdDBi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon
                className="text-title ins"
                style={{ fontSize: 35 }}
              />
            </a>
            <a
              href="https://youtube.com/@foknje7ik?si=Gx6DuBqwdkokJLUl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTubeIcon className="text-title yt" style={{ fontSize: 35 }} />
            </a>
          </div>
          <p className="text-title font-montserrat_regular text-xs mt-4">
            <span className="fa">©</span>2025 FOK NJE7IK
          </p>
          <div className="father-footerContainer">
            <div className="footerContact">
              <FontAwesomeIcon icon={faPhone} className="fa" />
              <p>51 347 528</p>
            </div>
            <div className="footerContact">
              <FontAwesomeIcon icon={faEnvelope} className="fa" />
              <p>foknjeikacademy@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <div className="courses-title">
            <FontAwesomeIcon
              icon={faGraduationCap}
              style={{ fontSize: "25px" }}
              className="fa"
            />
            <p className="font-montserrat_medium  ">Cours</p>
          </div>
          <div className="footer-informations">
            <p className="font-montserrat_regular ">Cours en classroom</p>
            <p className="font-montserrat_regular ">Cours E-learning</p>
            <p className="font-montserrat_regular ">Cours vidéo</p>
            <p className="font-montserrat_regular ">Cours gratuits</p>
          </div>
        </div>

        {/* Community Section */}
        <div>
          <div className="courses-title">
            <FontAwesomeIcon icon={faPeopleGroup} className="fa" />
            <p className="font-montserrat_medium ">Communauté</p>
          </div>
          <div className="footer-informations">
            <p className="font-montserrat_regular ">Apprenants</p>
            <p className="font-montserrat_regular ">Partenaires</p>
            <p className="font-montserrat_regular ">Blog</p>
            <p className="font-montserrat_regular ">Centre d'enseignement</p>
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <div className="courses-title">
            <FontAwesomeIcon icon={faLink} className="fa" />
            <p className="font-montserrat_medium">Liens</p>
          </div>
          <div className="footer-informations">
            <p className="font-montserrat_regular ">Acceuil</p>
            <p className="font-montserrat_regular ">Education</p>
            <p className="font-montserrat_regular ">Admissions</p>
            <p className="font-montserrat_regular ">Témoignages</p>
          </div>
        </div>

        <div>
          <div className="courses-title">
            <FontAwesomeIcon icon={faCircleInfo} className="fa" />
            <p className="font-montserrat_medium">Plus</p>
          </div>
          <div className="footer-informations">
            <p className="font-montserrat_regular ">Termes</p>
            <p className="font-montserrat_regular ">Privacy</p>
            <p className="font-montserrat_regular ">Aide</p>
            <p className="font-montserrat_regular ">Contact</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
