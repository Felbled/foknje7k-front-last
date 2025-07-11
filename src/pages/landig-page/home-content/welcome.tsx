import React from "react";
import "./welcome.css";
import { RoundedImage1, RoundedImage2 } from "../../../assets/images";

const Welcome = () => {
  return (
    <div className="welcome-container" id="home">
      <div className="welcome-content">
        <div className="welcome-badge">N'arrêtez jamais d'apprendre</div>
        
        <div className="welcome-text">
          <h1>
            Développez vos compétences <br />
            avec <span className="highlight">FOK NJE7IK</span>
          </h1>
          <p>
            FOK NJE7IK est une plateforme basée à travers la Tunisie spécialisée
            dans les formations accréditées et sur mesure. Nous brisons les
            barrières pour obtenir un diplôme
          </p>
        </div>
      </div>
      
      <div className="welcome-images">
        <div className="circle-image-wrapper bottom-image">
          <img
            src={RoundedImage2}
            alt="Enseignante avec élève"
            className="circle-image"
          />
        </div>
        <div className="circle-image-wrapper top-image">
          <img
            src={RoundedImage1}
            alt="Professeur et étudiant"
            className="circle-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;