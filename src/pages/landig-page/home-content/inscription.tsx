import React from "react";
import { BlackUser } from "../../../assets/images";
import CustomButton from "../../../shared/custom-button/custom-button";
import { useNavigate } from "react-router-dom";
import "./inscription.css";
import { backinscription, girl } from "../../../assets/images";

const Inscription = () => {
  const navigation = useNavigate();

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="image-wrapper">
          <img src={girl} alt="fille étudiant" className="girl-image" />
        </div>
        <div className="text-content">
          <h1>
            Ne perdez pas de temps cet Été.
            <br />
            <span className="highlight">Développer tes compétences</span>
          </h1>
          <p>
            Profitez de votre temps libre pour apprendre de nouvelles
            compétences ou approfondir vos connaissances
          </p>
          <button
            className="cta-button"
            onClick={() => navigation("/register-student")}
          >
            S’inscrire maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
