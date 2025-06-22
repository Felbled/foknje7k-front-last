import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { AddAPhoto as AddAPhotoIcon } from "@mui/icons-material";
import CustomInput from "../shared/custom-input/custom-input";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CustomButton from "../shared/custom-button/custom-button";
import { FormModalProps } from "./offerModal";
import { getUserGroupService } from "../services/group-service";
import CustomSelect from "../shared/custom-select/custom-select";
import { SnackbarContext } from "../config/hooks/use-toast";

interface FormData {
  image: string;
  title: string;
  subTitle: string;
  description: string;
  price: number | string;
  monthlyPeriod: number;
  offerDetails: string;
  classId: number | string;
}

const defaultData: FormData = {
  image: "",
  title: "",
  subTitle: "",
  description: "",
  price: "",
  monthlyPeriod: 0,
  offerDetails: "",
  classId: "",
};

const OfferStudentModal: React.FC<FormModalProps> = ({
  open,
  onClose,
  initialData = defaultData,
  modalTitle,
  buttonText,
  onButtonClick,
  onImageChange,
}) => {
  const snackbarContext = useContext(SnackbarContext);
  // @ts-ignore
  const [sendeData, setSendeData] = useState<FormData>(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState<string>("");
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSendeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageFile(file);
        if (onImageChange) {
          onImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected or file is invalid.");
    }
  };

  const handleAddBenefit = () => {
    if (benefits.length < 5) {
      if (benefitInput.trim() && benefitInput.length < 30) {
        setBenefits([...benefits, benefitInput.trim()]);
        setBenefitInput("");
      }
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleActionClick = () => {
    const formData = new FormData();
    const { image, ...selectedUser } = sendeData;

    const offerDetails = benefits.join(" \n ");

    formData.append(
      "studentOfferDTOJson",
      JSON.stringify({ ...selectedUser, offerDetails }),
    );
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (!imageFile || sendeData.image) {
      if (snackbarContext) {
        snackbarContext.showMessage(
          "Erreur",
          "Veuiller importer une image",
          "error",
        );
      }
    }

    onButtonClick(formData);
  };

  useEffect(() => {
    if (open) {
      getUserGroupService()
        .then((res) => {
          const options = res.data.map((group: any) => ({
            label: group.title,
            value: group.id,
          }));
          setGroupOptions(options);
        })
        .catch((e) => {
          console.log(e);
        });
      // @ts-ignore
      setSendeData(initialData);
      setBenefits(
        initialData.offerDetails ? initialData.offerDetails.split("\n") : [],
      );
    }
  }, [open, initialData]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSendeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setSendeData(defaultData);
        setImageFile(null);
        onClose();
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="bg-backgroundHome absolute top-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto shadow p-10">
        <div className="w-full flex justify-center mb-5">
          <h1 className="font-montserrat_semi_bold text-primary text-3xl">
            {modalTitle}
          </h1>
        </div>

        <div className="w-full h-40 my-2 flex items-center justify-center bg-gray-200">
          <label className="flex flex-col items-center cursor-pointer">
            {imageFile || sendeData.image ? (
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : sendeData.image
                }
                alt="Uploaded"
                className="w-40 h-40 object-cover rounded-3xl"
              />
            ) : (
              <div className="flex flex-col items-center cursor-pointer">
                <AddAPhotoIcon />
                <Typography variant="caption">Add an image</Typography>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomInput
            label="Title"
            inputType="text"
            CustomStyle="mb-5"
            value={sendeData.title}
            name="title"
            onChange={handleChange}
          />
          <CustomInput
            label="Sous Titre"
            inputType="text"
            CustomStyle="mb-5"
            value={sendeData.subTitle}
            name="subTitle"
            onChange={handleChange}
          />
          <CustomInput
            label="Description"
            inputType="text"
            CustomStyle="mb-5"
            value={sendeData.description}
            name="description"
            onChange={handleChange}
          />
          <CustomInput
            label="Price"
            inputType="number"
            CustomStyle="mb-5"
            value={sendeData.price}
            name="price"
            onChange={handleChange}
          />
          <CustomInput
            label="Duration"
            inputType="number"
            CustomStyle="mb-5"
            value={sendeData.monthlyPeriod}
            name="monthlyPeriod"
            onChange={handleChange}
          />
          <CustomSelect
            label="Class"
            placeholder={"Select Class"}
            customStyle="me-3"
            options={groupOptions}
            value={sendeData.classId}
            onChange={handleSelectChange}
            name="classId"
          />
          <div className="w-full">
            <div className="w-full flex items-center justify-between">
              <CustomInput
                label="Add Benefit"
                inputType="text"
                CustomStyle="w-11/12 mb-2"
                value={benefitInput}
                name="benefitInput"
                onChange={(e) => setBenefitInput(e.target.value)}
              />
              <div onClick={handleAddBenefit}>
                <AddCircleIcon className={"text-primary"} />
              </div>
            </div>

            <ul className={"flex flex-wrap"}>
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center border rounded border-primary mb-5 mx-1 px-2"
                >
                  <span className={"font-montserrat_regular text-title"}>
                    {benefit}
                  </span>
                  <div
                    className="mx-3"
                    onClick={() => handleRemoveBenefit(index)}
                  >
                    <RemoveCircleIcon className={"text-red"} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <CustomButton text={buttonText} onClick={handleActionClick} />
        </div>
      </Box>
    </Modal>
  );
};

export default OfferStudentModal;
