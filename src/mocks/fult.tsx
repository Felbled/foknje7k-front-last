import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Login from "../pages/auth/login/login";
import CustomButton from "../shared/custom-button/custom-button";

const Fult = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigate();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };
  useEffect(() => {
    document.documentElement.dir = i18n.t("direction"); // Set the dir attribute
  }, [i18n.language]);
  return (
    <div>
      {/*<p>{t("messages.thanks")}</p>
      <p>{t("messages.info")}</p>
      <button onClick={() => changeLanguage("ar")}>
        {t("buttons.change_to_german")}
      </button>
      <br />
      <button onClick={() => changeLanguage("fr")}>
        {t("buttons.change_to_english")}
      </button>
      <CustomInput
        label="Search"
        placeholder="Type here..."
        width="w-96"
        inputType="password"
        iconPrefix={
          <AcUnitIcon className="text-placeholder " style={{ fontSize: 20 }} />
        }
      />
      <CustomInput
        label="Email"
        placeholder="Enter your email"
        width="w-80"
        inputType="email"
      />
      <Login />*/}
      <CustomButton onClick={() => navigation("/role")} text={"click Me "} />
    </div>
  );
};

export default Fult;
