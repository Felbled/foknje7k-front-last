import React, { ChangeEvent, useState, useEffect, useContext } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CustomInput from "../shared/custom-input/custom-input";
import CustomSelect from "../shared/custom-select/custom-select";
import CustomButton from "../shared/custom-button/custom-button";
import { classesLevel } from "../mocks/education-level";
import { SnackbarContext } from "../config/hooks/use-toast";

interface ClassData {
  backgroundImage: string;
  mainImage: string;
  title: string;
  educationLevel: string;
}

interface ClassModalProps {
  open: boolean;
  onClose: () => void;
  modalTitle: string;
  buttonText: string;
  handleActionClick: (data: FormData) => void;
  initialData?: any;
}

const ClassModal: React.FC<ClassModalProps> = ({
  open,
  onClose,
  modalTitle,
  buttonText,
  handleActionClick,
  initialData,
}) => {
  const snackbarContext = useContext(SnackbarContext);

  const [formData, setFormData] = useState<ClassData>({
    backgroundImage: "",
    mainImage: "",
    title: "",
    educationLevel: "",
  });
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null,
  );
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        backgroundImage: initialData.backgroundImageUrl,
        mainImage: initialData.mainImageUrl,
        title: initialData.title,
        educationLevel: initialData.educationLevel,
      });
    } else {
      setFormData({
        backgroundImage: "",
        mainImage: "",
        title: "",
        educationLevel: "",
      });
    }
  }, [initialData]);

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    type: "backgroundImage" | "mainImage",
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "backgroundImage") {
        setFormData((prevData) => ({ ...prevData, backgroundImage: imageUrl }));
        setBackgroundImageFile(file);
      } else {
        setFormData((prevData) => ({ ...prevData, mainImage: imageUrl }));
        setMainImageFile(file);
      }
    }
  };

  const handleSubmit = () => {
    const dataToSend = new FormData();
    const groupeDetailsJson = {
      title: formData.title,
      educationLevel: formData.educationLevel,
    };
    if (initialData) {
      dataToSend.append("groupDetailsJson", JSON.stringify(groupeDetailsJson));
    } else {
      dataToSend.append("groupeDetailsJson", JSON.stringify(groupeDetailsJson));
    }
    if (backgroundImageFile) {
      dataToSend.append("backgroundImage", backgroundImageFile);
    }
    if (mainImageFile) {
      dataToSend.append("mainImage", mainImageFile);
    }
    if (
      !mainImageFile ||
      !backgroundImageFile ||
      !formData.backgroundImage ||
      !formData.mainImage
    ) {
      if (snackbarContext) {
        snackbarContext.showMessage(
          "Erreur",
          "Veuiller importer une image",
          "error",
        );
      }
    }
    handleActionClick(dataToSend);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="bg-backgroundHome absolute top-10 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-9/12 md:w-7/12 lg:w-6/12 xl:w-5/12 shadow p-5 sm:p-10 max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="w-full flex justify-center mb-5">
          <h1 className="font-montserrat_semi_bold text-center text-primary text-3xl">
            {modalTitle}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="w-1/3 h-40 my-2 flex items-center justify-center">
            <label className="flex flex-col items-center cursor-pointer">
              {backgroundImageFile || formData.backgroundImage ? (
                <img
                  src={formData.backgroundImage}
                  alt="Cover"
                  className="w-80 h-40 object-cover rounded-3xl"
                />
              ) : (
                <div className="w-80 h-40 rounded-3xl border-2 border-primary flex flex-col items-center justify-center">
                  <AddAPhotoIcon />
                  <p className="text-sm text-title font-montserrat_regular">
                    Add a cover photo
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageUpload(event, "backgroundImage")
                }
                className="hidden"
              />
            </label>
          </div>

          <div className="w-1/3 h-40 my-2 flex items-center justify-center">
            <label className="flex flex-col items-center cursor-pointer">
              {mainImageFile || formData.mainImage ? (
                <img
                  src={formData.mainImage}
                  alt="Profile"
                  className="w-40 h-40 object-cover rounded-3xl"
                />
              ) : (
                <div className="w-40 h-40 rounded-3xl border-2 border-primary flex flex-col items-center justify-center">
                  <AddAPhotoIcon />
                  <p className="text-sm text-title font-montserrat_regular">
                    Add a profile Photo
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, "mainImage")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="mb-10">
          <CustomInput
            label="Titre"
            inputType="text"
            CustomStyle="mb-5"
            value={formData.title}
            name="title"
            onChange={handleChange}
          />
          <CustomSelect
            label="Class"
            customStyle="me-3"
            options={classesLevel}
            placeholder={"Select class"}
            value={formData.educationLevel}
            onChange={handleSelectChange}
            name="educationLevel"
          />
        </div>

        <div className="w-full flex justify-center">
          <CustomButton text={buttonText} onClick={handleSubmit} />
        </div>
      </Box>
    </Modal>
  );
};

export default ClassModal;
