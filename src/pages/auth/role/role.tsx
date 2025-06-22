import React from "react";
import { useNavigate } from "react-router-dom";
import { roleEtudiant, roleProf } from "../../../assets/images";
import "./role.css";

const Role = () => {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <h2 className="role-title">- Choisissez Votre Profession -</h2>

      <div className="role-options">
        <div className="role-card">
          <div className="role-image-container">
            <img src={roleEtudiant} alt="Espace élève" className="role-image" />
          </div>
          <button
            className="role-button"
            onClick={() => navigate("/register-student")}
          >
            Espace élève
          </button>
        </div>

        <div className="role-card">
          <div className="role-image-container">
            <img
              src={roleProf}
              alt="Espace professeur"
              className="role-image"
            />
          </div>
          <button
            className="role-button teacher"
            onClick={() => navigate("/register")}
          >
            Espace professeur
          </button>
        </div>
      </div>
    </div>
  );
};

export default Role;
