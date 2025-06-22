import React from "react";
import "./services.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faCirclePlay,
  faTowerCell,
} from "@fortawesome/free-solid-svg-icons";
import { servie, backservice } from "../../../assets/images";
import {
  LiveIcon,
  Read,
  rectangular,
  ServiceImage,
  SoundIcon,
} from "../../../assets/images";
import CustomButton from "../../../shared/custom-button/custom-button";

const Service = () => {
  return (
    <div className="services-container">
      <div className="cours-details">
        <h1 className=" title-Cour  font-montserrat_medium mb-3 text-center">
          Cours filmés en HD, diffusés en direct
        </h1>
        <p>
          Apprenez en ligne comme si vous y étiez ! Des cours en direct avec
          vidéo et audio haute qualité pour une expérience immersive et
          interactive.
        </p>
        <p> Engagement accru, meilleure rétention et accessibilité pour tous</p>
        <button id="about">Visiter les cours</button>
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
          <FontAwesomeIcon icon={faTowerCell} style={{ color: "#ec1818" }} />
          <p>Cours en direct</p>
        </div>
        <div className="box">
          <FontAwesomeIcon icon={faCirclePlay} style={{ color: "#250693" }} />
          <p>Cours enregistré</p>
        </div>
      </div>
    </div>
  );
};

export default Service;
