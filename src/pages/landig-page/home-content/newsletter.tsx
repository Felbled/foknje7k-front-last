import React, { useContext, useState } from "react";
import { subscribe } from "../../../assets/images";
import { SnackbarContext } from "../../../config/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./newsletter.css";
import CustomButton from "../../../shared/custom-button/custom-button";
import { useNavigate } from "react-router-dom";
import { prof, newsletterOne, newsletterTwo } from "../../../assets/images";

const Newsletter = () => {
  const snackbarContext = useContext(SnackbarContext);
  const navigation = useNavigate();
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {
    if (email === "") {
      snackbarContext?.showMessage(
        "Abonnez-vous",
        "Veuillez entrer votre email.",
        "error"
      );
      return;
    }
    const regext = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regext.test(email)) {
      snackbarContext?.showMessage(
        "Abonnez-vous",
        "Veuillez entrer un email valide.",
        "error"
      );
      return;
    }
    snackbarContext?.showMessage(
      "Abonnez-vous",
      "Vous êtes abonné avec succès.",
      "success"
    );
    setEmail("");
  };
  return (
    <div className="Container" id="contact">
      <div className="left">
        <div className="top">
          <div className="desc leading-[1.1]">
            <h1> Vous souhaitez partager votre</h1>
            <h1> connaissance ? Rejoignez-nous</h1>
            <h1>comme un Professeur</h1>
          </div>
          <div className="descP">
            <p>
              Rejoignez notre équipe dynamique et enthousiaste de professeurs et
              contribuez à l'épanouissement de
            </p>
            <p> la prochaine génération.</p>
          </div>

          <CustomButton
            text={"Rejoignez-nous"}
            width="w-min"
            className="text-nowrap join-btn"
            onClick={() => navigation("/register")}
          />
        </div>
        <div className="bottom">
          <div className="boy-image">
            <img src={ newsletterOne} alt="étudiant" />
          </div>

          <div className="notif">
            <FontAwesomeIcon
              icon={faBell}
              shake
              style={{ color: "#ffffff" }}
              className="sound-icon"
            />
            <div className="description">
              <p>Abonnez-vous pour obtenir une</p>
              <p>mise à jour chaque nouveau cours</p>
            </div>
          </div>
          <div className="abonnement">
            <p>
              Profitez de votre temps libre pour apprendre de nouvelles
              compétences. Plus de 900 étudiants apprennent quotidiennement avec
              FOK NJE7IK. Abonnez-vous pour découvrir nos nouveaux cours
            </p>
            <img src={newsletterTwo} alt="étudiant" className="etudiant-image" />
          </div>
        </div>
      </div>
      <div className="right">
        <img src={prof} alt="étudiant" className="big" />
        <div className="abon flex items-center w-full justify-center">
          <input
            type="email"
            placeholder="Entrer votre email"
            className="border-0 bg-[#d0e4dc] h-12 md:h-10 w-[70%] md:w-[30%] rounded-l-full ps-4 text-black"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            className="px-4 py-2 h-12 md:h-10 font-montserrat_regular text-white rounded-r-full bg-[#1c7b67] hover:bg-[#16624f] transition-all duration-100"
            onClick={() => handleSubscribe()}
          >
            Abonnez-vous
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
