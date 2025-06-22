import React, { useState, useContext } from "react";
import AuthLayout from "../../../shared/auth-layout/auth-layout";
import CustomInput from "../../../shared/custom-input/custom-input";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import CustomButton from "../../../shared/custom-button/custom-button";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../../shared/custom-select/custom-select";
import { Flag } from "../../../assets/images";
import { classesLevel, regions } from "../../../mocks/education-level";
import { RegisterStudentService } from "../../../services/auth-service";
import { SnackbarContext } from "../../../config/hooks/use-toast";
import "./register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    governorate: "",
    birthday: "",
    phoneNumber: "",
    educationLevel: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    educationLevel: "",
    birthday: "",
    phoneNumber: "",
    governorate: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    educationLevel: false,
    birthday: false,
    phoneNumber: false,
  });
  const navigate = useNavigate();
  const snackbarContext = useContext(SnackbarContext);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the field in real-time
    validateField(name, value);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value) error = "Nom Complet est requis.";
        if (value.length < 7)
          error = "Nom Complet doit contenir au moins 7 caractères.";
        break;
      case "email":
        if (!value) error = "Email est requis.";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email invalide.";
        break;
      case "password":
        if (!value) error = "Mot de passe est requis.";
        else if (value.length < 8)
          error = "Mot de passe doit contenir au moins 8 caractères.";
        else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\/+\[\]\\\-])[A-Za-z\d!@#$%^&*(),.?":{}|<>\/+\[\]\\\-]{8,}$/.test(
            value
          )
        )
          error =
            "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.";
        break;
      case "governorate":
        if (!value) error = "Governorate est requise.";
        break;
      case "confirmPassword":
        if (value !== formData.password)
          error = "Les mots de passe ne correspondent pas.";
        break;
      case "educationLevel":
        if (!value) error = "Classe est requise.";
        break;
      case "birthday":
        if (!value) error = "Date de naissance est requise.";
        break;
      case "phoneNumber":
        if (!value) error = "Numéro de téléphone est requis.";
        else if (!/^\d{8}$/.test(value))
          error = "Numéro de téléphone invalide.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error;
  };

  const validateForm = () => {
    let isValid = true;

    for (const [name, value] of Object.entries(formData)) {
      const error = validateField(name, value as string);
      if (error) {
        isValid = false;
        snackbarContext?.showMessage("Error", error, "error");
        break;
      }
    }

    return isValid;
  };

  const handleSubmit = () => {
    const { confirmPassword, ...dataWithoutConfirmPassword } = formData;

    if (!isChecked) {
      alert("Please accept the terms and conditions.");
      return;
    }

    if (validateForm()) {
      RegisterStudentService(dataWithoutConfirmPassword)
        .then(() => {
          if (snackbarContext)
            snackbarContext.showMessage(
              "Success",
              "Inscription réussie, veille confirmer votre email",
              "success"
            );
          navigate("/login");
        })
        .catch((e) => {
          console.log(e);
        });
    }

    // Handle form submission (e.g., send data to an API)
    console.log("Form data submitted:", formData);

    // Redirect after successful submission (e.g., navigate to another page)
  };

  return (
    <AuthLayout
      title1={"Bienvenue à Fok Nje7ik"}
      title2={"s'inscrire en tant"}
      title3={" qu'élève"}
    >
      <form className={"form-container w-full"}>
        <CustomInput
          label={"Nom Complet"}
          placeholder={"Votre Nom"}
          inputType={"text"}
          iconPrefix={<PersonOutlineOutlinedIcon className="text-title" />}
          CustomStyle={"mb-5"}
          value={formData.fullName}
          name="fullName"
          onChange={handleInputChange}
          onBlur={handleInputBlur} // Handle blur
          error={!!errors.fullName}
          errorMessage={errors.fullName}
        />
        <CustomInput
          label={"Email"}
          inputType="email"
          iconPrefix={<MailOutlineOutlinedIcon className="text-title" />}
          placeholder={"Votre E-mail"}
          CustomStyle={"mb-5"}
          value={formData.email}
          name="email"
          onChange={handleInputChange}
          onBlur={handleInputBlur} // Handle blur
          error={!!errors.email}
          errorMessage={errors.email}
        />
        <div className="flex justify-between mb-5">
          <CustomInput
            label="Mot de passe"
            inputType={"password"}
            placeholder={"Votre Mot de passe"}
            CustomStyle={" w-1/2 me-3"}
            iconPrefix={<LockOutlinedIcon className="text-title" />}
            value={formData.password}
            name="password"
            onChange={handleInputChange}
            onBlur={handleInputBlur} // Handle blur
            error={!!errors.password}
            errorMessage={errors.password}
          />
          <CustomInput
            label="Confirmer Mot de passe"
            inputType={"password"}
            CustomStyle={"w-1/2"}
            placeholder={"Confirmer Mot de passe"}
            iconPrefix={<LockOutlinedIcon className="text-title" />}
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleInputChange}
            onBlur={handleInputBlur} // Handle blur
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
          />
        </div>
        <div className="flex justify-between mb-5">
          <CustomSelect
            label="Governerat"
            placeholder={"selectionner governorat"}
            customStyle="me-3 w-1/2"
            width={"w1/2"}
            options={regions}
            value={formData.governorate}
            onChange={handleSelectChange}
            name="governorate"
          />
          <CustomInput
            label="Date de naissance"
            placeholder={"JJ/MM/AAAA"}
            inputType={"date"}
            value={formData.birthday}
            CustomStyle={" w-1/2"}
            name="birthday"
            onChange={handleInputChange}
            onBlur={handleInputBlur} // Handle blur
            error={!!errors.birthday}
            errorMessage={errors.birthday}
          />
        </div>
        <div className="flex justify-between mb-5">
          <CustomSelect
            label="class"
            customStyle="me-3 w-1/2"
            width={"w1/2"}
            options={classesLevel}
            placeholder={"selectionner class"}
            value={formData.educationLevel}
            onChange={handleSelectChange}
            name="educationLevel"
          />
          <CustomInput
            label="Numéro de Téléphone"
            placeholder={"Numéro de Téléphone"}
            CustomStyle={"w-1/2"}
            inputType={"tel"}
            iconPrefix={
              <img alt={"flag"} src={Flag} className="w-5 h-4 object-cover" />
            }
            value={formData.phoneNumber}
            name="phoneNumber"
            onChange={handleInputChange}
            onBlur={handleInputBlur} // Handle blur
            error={!!errors.phoneNumber}
            errorMessage={errors.phoneNumber}
          />
        </div>
        <div className="flex w-full justify-start mb-5">
          <label className={`flex items-center space-x-3`}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 me-1 w-4 accent-primary border-primary rounded "
            />
            <p className="text-title text-xs font-montserrat_regular">
              J'ai accepté{" "}
              <span className={"font-montserrat_bold cursor-pointer"}>
                les Termes Et Conditions
              </span>
            </p>
          </label>
        </div>
        <CustomButton
          text="S'inscrire"
          className={"register-btn w-full h-14 mt-6 mb-4"}
          onClick={() => handleSubmit()}
        />
        <p className="text-title text-xs font-montserrat_regular w-full text-center">
          Vous avez déjà un compte ?{" "}
          <span
            onClick={() => navigate("/login")}
            className={"font-montserrat_semi_bold cursor-pointer text-primary"}
          >
            Se connecter
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};
export default Register;
