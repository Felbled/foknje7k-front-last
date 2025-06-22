import React from "react";
import { WitchList } from "../../../assets/images";
import CustomButton from "../../../shared/custom-button/custom-button";
import { useNavigate } from "react-router-dom";

const InscriptionPro = () => {
  const navigation = useNavigate();
  return (
    <div className="w-full bg-backgroundHome py-10 px-6 md:py-16 md:px-24 flex flex-col lg:flex-row justify-between items-center">
      <img
        alt={"inscription-prof"}
        src={WitchList}
        className="w-full md:w-1/3 h-[30vh] md:h-[50vh] object-contain mb-6 md:mb-0 md:me-3.5"
      />
      <div className="w-full md:w-11/12 text-center md:text-left">
        <h1 className="font-montserrat_bold text-title text-3xl md:text-5xl w-full md:w-9/12 mb-4 md:mb-6">
          Vous souhaitez partager votre connaissance ? Rejoignez-nous comme un
          Professeur
        </h1>
        <p className="text-text font-montserrat_regular w-full md:w-9/12 mb-4 md:mb-6">
          Rejoignez notre équipe dynamique et enthousiaste de professeurs et
          contribuez à l'épanouissement de la prochaine génération.
        </p>
        <CustomButton
          text={"Rejoignez-nous"}
          width="w-min"
          className="text-nowrap"
          onClick={() => navigation("/register")}
        />
      </div>
    </div>
  );
};

export default InscriptionPro;
