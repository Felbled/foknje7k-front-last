import React from "react";
import { AuthImage, Logo ,Elearning} from "../../assets/images";

import "./auth.css";
interface AuthLayoutComponentProps {
  title1?: string;
  title2?: string;
  title3?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutComponentProps> = ({
  title1,
  title2,
  title3,
  children,
}) => {
  return (
    <div className="auth-container flex flex-col lg:flex-row items-center justify-center w-full lg:h-screen px-4  lg:px-28">
      {/* Left Section */}
      <div className="leftttt bg-green-800 text-white flex flex-col px-8 py-12 w-full lg:w-1/2 min-h-screen">
        <img src={Logo} alt="Mascotte" className="w-40 h-40 mb-4" />

        <h1 className="first-tag left-heading-title">
          {title1} <br />
          {title2}
        </h1>
        <p className="left-heading-title ">{title3}</p>

        <img
          src={Elearning}
          alt="Illustration"
          className="mt-8 w-60 h-60 object-cover rounded-full border-4 border-white self-center"
        />
      </div>

      {/* Right Section */}
      <div className="right-auth w-full lg:w-1/2 flex flex-col justify-start items-center px-4 lg:px-28 mt-8 lg:mt-0">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
