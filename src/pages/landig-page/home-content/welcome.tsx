import React from "react";
import "./welcome.css";
import { Home1, Home2 } from "../../../assets/images";
import { RoundedImage1, RoundedImage2 } from "../../../assets/images";

const Welcome = () => {
  return (
    <div className="container" id="home">
      <div className="left">
        <div className="Badge">N'arrêtez jamais d'apprendre</div>
        <div className="max-w-xl text-container">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
            Développez vos compétences <br />
            avec <span className="text-white">FOK NJE7IK</span>
          </h1>
          <p className="text-[12.45px]  leading-relaxed text-[#dddddd]">
            FOK NJE7IK est une plateforme basée à travers la Tunisie spécialisée
          </p>
          <p className="text-[12.45px]  leading-relaxed text-[#dddddd]">
            dans les formations accréditées et sur mesure. Nous brisons les
          </p>

          <p className="text-[12.45px]  leading-relaxed text-[#dddddd]">
            barrières pour obtenir un diplôme
          </p>
        </div>
      </div>
      <div className="right ">
        {/* Images circulaires */}
        <div
          className="image-wrapper-bottom  w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg"
          style={{ width: "221px", height: "221px" }}
        >
          <img
            src={RoundedImage2}
            alt="Enseignante avec élève"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="image-wrapper-top w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg"
          style={{ width: "258px", height: "258px" }}
        >
          <img
            src={RoundedImage1}
            alt="Professeur et étudiant"
            className="w-full h-full object-cover "
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
