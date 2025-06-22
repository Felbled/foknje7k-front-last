import React from "react";
import { HomeBooks } from "../assets/images";

const WelcomeCard = () => {
  return (
    <div className="w-full h-56 bg-pink rounded-3xl text-center  md:text-left flex items-center justify-around">
      <h1 className="w-56 text-title text-3xl font-montserrat_semi_bold">
        Bienvenu à FOK NJE7IK
      </h1>
      {
        window.innerWidth > 1024 && (
          <img
          alt={"home Book"}
          src={HomeBooks}
          className="h-56 w-80 object-cover"
        />
        )
      }
     
    </div>
  );
};

export default WelcomeCard;
