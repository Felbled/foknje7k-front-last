import React, { useContext } from "react";
import { SnackbarContext } from "../../../config/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faCirclePlay,
  faTowerCell,
} from "@fortawesome/free-solid-svg-icons";
import { servie, backservice } from "../../../assets/images";
import CustomButton from "../../../shared/custom-button/custom-button";
import "./services.css";

const Service = () => {
  const snackBar = useContext(SnackbarContext);

  return (
    <div className="services-container"
    id="about">
      <div className="cours-details">
        <h1 className="title-Cour font-montserrat_medium mb-3 text-center">
          Cours filmés en HD, diffusés en direct
        </h1>
        <p className="service-description">
          Apprenez en ligne comme si vous y étiez ! Des cours en direct avec
          vidéo et audio haute qualité pour une expérience immersive et
          interactive.
        </p>
        <p className="service-benefit">
          Engagement accru, meilleure rétention et accessibilité pour tous
        </p>
        
        <CustomButton
        
          text={"Visitez des cours"}
          onClick={() => 
            snackBar?.showMessage(
              "Détails du cours",
              "Veuillez vous authentifier pour accéder aux détails du cours.", 
              "info"
            )
          }
          className="visit-courses-btn"
        />
      </div>
      
      <div className="ImageContainer">
        <div className="white-container">
          <img
            src={servie}
            alt="Enseignante avec élève"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="features-boxes">
        <div className="box">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faTowerCell} className="feature-icon lg live-icon text-red" />
          </div>
          <p>Cours en direct</p>
        </div>
        
        <div className="box">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faCirclePlay} className="feature-icon recorded-icon  text-[#173587]" />
          </div>
          <p>Cours enregistré</p>
        </div>
      </div>
    </div>
  );
};

export default Service;