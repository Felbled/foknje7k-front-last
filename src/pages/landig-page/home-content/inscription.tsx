import React from "react";
import { useNavigate } from "react-router-dom";
import { girl } from "../../../assets/images";
import "./inscription.css";

const Inscription = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="image-container">
          <div className="green-circle">
            <div className="image-wrapper">
              <img 
                src={girl} 
                alt="Étudiante souriante avec ordinateur portable" 
                className="girl-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        
        <div className="text-content">
          <h1>
            Ne perdez pas de temps cet Été
            <br />
            <span className="highlight">Développez vos compétences</span>
          </h1>
          <p>
            Profitez de votre temps libre pour apprendre de nouvelles
            compétences ou approfondir vos connaissances
          </p>
          
          <button
            className="cta-button"
            onClick={() => navigate("/register-student")}
            aria-label="S'inscrire maintenant"
          >
            S’inscrire maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inscription;