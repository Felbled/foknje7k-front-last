import React, { useContext, useEffect, useState } from "react";
import CustomButton from "../../shared/custom-button/custom-button";
import AddIcon from "@mui/icons-material/Add";
import AdsCarousel from "../../componet/ads-carousel";
import WelcomeCard from "../../componet/welcome-card";
import Newsletter from "../landig-page/home-content/newsletter";
import ClassesModal from "../../componet/classModal";
import { ClassesFakeData } from "../../mocks/classes-data";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createGroupService,
  deleteGroupService,
  getUserGroupService,
  updateGroupService,
} from "../../services/group-service";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { RootState } from "../../redux/store/store";
import { SnackbarContext } from "../../config/hooks/use-toast";
import { classesLevel } from "../../mocks/education-level";

const Home: React.FC = () => {
  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );
  const snackbarContext = useContext(SnackbarContext);
  const navigation = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  
  useEffect(() => {
    getUserGroupService()
      .then((res) => {
        setProfileData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleOpenModal = (profile: any | null) => {
    setSelectedProfile(profile);
    setIsEdit(profile !== null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProfile(null);
    setIsEdit(false);
    setCurrentItem(null);
    setModalOpen(false);
  };

  const handleSave = (formData: any) => {
    if (isEdit && selectedProfile) {
      updateGroupService(selectedProfile.id, formData)
        .then(() => {
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Success",
              "Class modified successfully",
              "success",
            );
          }
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating group:", error);
        });
    } else {
      createGroupService(formData)
        .then(() => {
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Success",
              "Class added successfully",
              "success",
            );
          }
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error creating group:", error);
        });
    }
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setCurrentItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentItem(null);
  };

  const handleClickAlert = (profile: any) => {
    setSelectedProfile(profile);
    setOpenAlert(true);
    handleCloseMenu();
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setSelectedProfile(null);
  };

  const handleSubmitAlert = () => {
    deleteGroupService(selectedProfile.id)
      .then(() => {
        setOpenAlert(false);
        setSelectedProfile(null);
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Success",
            "Class deleted successfully",
            "success",
          );
        }
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getEducationLevelLabel = (value: string) => {
    const level = classesLevel.find((level) => level.value === value);
    return level ? level.label : value;
  };

  return (
    <div className="pt-40 px-4 md:px-12 flex flex-col items-center">
      <WelcomeCard />
      <div className="mt-10">
        <CustomButton
          text={"Tableau de Bord"}
          width={"w-64"}
          onClick={() => {
            if (role !== "ROLE_STUDENT") {
              navigation("/dashboard/offer-teacher");
            } else {
              navigation("/dashboard/offer-student");
            }
          }}
          className="bg-white border border-primary text-primary rounded-md h-14"
        />
      </div>
      <div className="w-full flex flex-wrap justify-center mb-10">
        {profileData.filter(item => item.active === true).map((item) => (
          <div
            key={item.id}
            className="relative w-full sm:w-1/2 lg:w-1/3 m-5 rounded-3xl overflow-hidden shadow-lg bg-white h-72"
          >
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.backgroundImageUrl})` }}
            ></div>
            {(role === "ROLE_ADMIN" || role === "ROLE_SUPER_TEACHER") && (
              <div className="absolute top-2 right-2 bg-white rounded-full">
                <IconButton onClick={(event) => handleClickMenu(event, item)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && currentItem === item}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleOpenModal(item);
                      handleCloseMenu();
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleClickAlert(item)}>
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            )}
            <div className="flex justify-start items-end md:-mt-12 ms-5">
              <img
                className="w-32 h-32 rounded-full border-4 object-cover border-white md:block hidden"
                src={item.mainImageUrl}
                alt="Profile"
              />
              <div className="px-6 py-4">
                <div className="font-montserrat_semi_bold md:text-xl text-xs mb-2">
                  {item.title}
                </div>
                <p className="text-title font-montserrat_regular md:text-base text-xs lowercase">
                  {getEducationLevelLabel(item.educationLevel)}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <CustomButton
                onClick={() => navigation(`/subject/${item.id}`)}
                text={"Rejoindre"}
                width={"w-22"}
                className={"text-xs"}
              />
            </div>
            <div className="w-full flex justify-end px-3">
              <p className="font-montserrat_semi_bold text-title text-lg">
                {item.superTeacherFullName}
              </p>
            </div>
          </div>
        ))}
        {(role === "ROLE_ADMIN" || role === "ROLE_SUPER_TEACHER") && (
          <div className="flex items-center justify-center w-full sm:w-1/2 lg:w-1/3 m-5">
            <div
              onClick={() => handleOpenModal(null)}
              className="cursor-pointer bg-primary p-4 rounded-full h-20 w-20 flex items-center justify-center"
            >
              <AddIcon className="text-white" style={{ fontSize: 50 }} />
            </div>
          </div>
        )}
      </div>
      <div className="h-10"></div>
      
      <ClassesModal
        open={modalOpen}
        onClose={handleCloseModal}
        modalTitle={isEdit ? "Modifier Class" : "Ajouter Nouveau class"}
        buttonText={isEdit ? "Modifier" : "Ajouter"}
        handleActionClick={handleSave}
        initialData={selectedProfile}
      />
      <Dialog
        open={openAlert}
        keepMounted
        onClose={handleCloseAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <p className=" text-2xl font-montserrat_semi_bold text-title">
            {"Confirmer?"}
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p className="font-montserrat_medium text-text">
              Vous êtes sûr de supprimer ce class?
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton
            text={"Annuler"}
            className={"bg-text text-white"}
            width={"w-32"}
            onClick={handleCloseAlert}
          />
          <CustomButton
            text={"Supprimer"}
            className={"bg-red text-white"}
            width={"w-32"}
            onClick={handleSubmitAlert}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
