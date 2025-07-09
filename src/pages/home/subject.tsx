import React, { useContext, useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomButton from "../../shared/custom-button/custom-button";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate, useParams } from "react-router-dom";
import {
  createSubjectService,
  deleteSubjectService,
  getAllSubjectsByGroupId,
  getAllUserSubjectService,
  updateSubjectService,
} from "../../services/subject-service";
import { useSelector } from "react-redux";
import WelcomeCard from "../../componet/welcome-card";
import Newsletter from "../landig-page/home-content/newsletter";
import SubjectModal from "../../componet/subject-modal";
import { RootState } from "../../redux/store/store";
import { SnackbarContext } from "../../config/hooks/use-toast";

interface Subject {
  id: number;
  backgroundImageUrl: string;
  mainImageUrl: string;
  level: string;
  teacherId: string;
  speciality: string;
  sections: {
    sectionColor: string;
    sectionName: string;
  }[];
}

const Subject: React.FC = () => {
  const snackbarContext = useContext(SnackbarContext);
  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      getAllSubjectsByGroupId(Number(id))
        .then((res) => {
          setSubjects(res.data);
        })
        .catch((error) => {
          console.error("Failed to fetch subjects:", error);
        });
    } else {
      getAllUserSubjectService()
        .then((res) => {
          setSubjects(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id]);

  const handleOpenModal = (profile: Subject | null) => {

    if (profile) {
      setIsEdit(true);
      setModalData(currentItem);
    } else {
      setIsEdit(false);
      setModalData(null);
    }
    setCurrentItem(profile);
    setModalOpen(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setCurrentItem(null);
    setIsEdit(false);
    setModalOpen(false);
    handleCloseMenu();
  };

  const handleSave = (formData: any) => {
    formData.append("groupId", id);
    if (isEdit && currentItem) {
      updateSubjectService(currentItem.id, formData)
        .then(() => {
          getAllSubjectsByGroupId(Number(id))
            .then((res) => {
              setSubjects(res.data);
              if (snackbarContext) {
                snackbarContext.showMessage(
                  "Succes",
                  "Matiére Modifier avec succée",
                  "success",
                );
              }
              window.location.reload();
              setModalOpen(false);
            })
            .catch((error) => {
              console.error("Failed to fetch subjects:", error);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      createSubjectService(formData)
        .then(() => {
          getAllSubjectsByGroupId(Number(id))
            .then((res) => {
              setSubjects(res.data);
              window.location.reload();
              if (snackbarContext) {
                snackbarContext.showMessage(
                  "Succes",
                  "Matiére Ajouter avec succée",
                  "success",
                );
              }
              setModalOpen(false);
            })
            .catch((error) => {
              console.error("Failed to fetch subjects:", error);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handleClickMenu = (
    event: React.MouseEvent<HTMLElement>,
    item: Subject,
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickAlert = () => {
    setOpenAlert(true);
    handleCloseMenu();
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleDelete = () => {
    if (currentItem) {
      deleteSubjectService(currentItem.id)
        .then(() => {
          getAllSubjectsByGroupId(Number(id))
            .then((res) => {
              setSubjects(res.data);
              if (snackbarContext) {
                snackbarContext.showMessage(
                  "Succes",
                  "Matière Supprimer avec succée",
                  "success",
                );
              }
            })
            .catch((error) => {
              console.error("Failed to fetch subjects:", error);
            });
          setOpenAlert(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="pt-20 px-4 md:px-12 flex flex-col items-center">
      <WelcomeCard />
     
      <div className="w-full flex flex-wrap justify-center my-10">
        {subjects.map((item) => (
          <div
            key={item.id}
            className="relative  w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-4 rounded-3xl overflow-hidden shadow-lg bg-white h-96"
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
                  open={Boolean(anchorEl)}
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
                  <MenuItem onClick={() => handleOpenModal(currentItem)}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={handleClickAlert}>Delete</MenuItem>
                </Menu>
              </div>
            )}
            <div className="flex justify-left items-end -mt-6 p-2 ">
              <img
                className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 object-cover border-white"
                src={item.mainImageUrl}
                alt="Profile"
              />
              <div className="px-3 py-5">
                <p className="text-title text-base md:text-lg font-montserrat_semi_bold">
                  {item.level}
                </p>
                <p className="text-title text-sm md:text-base font-montserrat_medium">
                  {item.speciality}
                </p>
              </div>
            </div>
            <div className="w-full flex ps-5 items-center justify-left flex-wrap  px-2">
              <p className="md:text-base text-sm font-montserrat_regular pe-5 text-text ">
                Section:
              </p>
              {item.sections.map(
                (
                  section: {
                    sectionColor: string;
                    sectionName: string;
                  },
                  index: number,
                ) => (
                  <div
                    key={index}
                    className="m-1 px-3 w-min text-center py-1 rounded-xl text-white text-nowrap md:text-base text-sm"
                    style={{ backgroundColor: section.sectionColor }}
                  >
                    {section.sectionName}
                  </div>
                ),
              )}
            </div>
            <div className="w-full flex justify-center px-3 pt-2 text-sm text-white">
              <CustomButton
                onClick={() => navigate(`/subject-details?id=${item.id}`)}
                text={"Rejoindre"}
                width={"w-22"}
                className="text-white"
              />
            </div>
            <div className="w-full flex justify-end px-3 position: absolute bottom-2.5 -left-3">
              <p className="font-montserrat_semi_bold text-title text-base">
                {item.superTeacherFullName}
              </p>
            </div>
          </div>
        ))}
        {(role === "ROLE_ADMIN" || role === "ROLE_SUPER_TEACHER") && (
          <div className="flex items-center justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-4">
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
     
      <SubjectModal
        open={modalOpen}
        onClose={handleCloseModal}
        initialData={modalData ?? undefined}
        modalTitle={isEdit ? "Modifier Matiere" : "Ajouter Matiere"}
        buttonText={isEdit ? "Mettre à jour" : "Ajouter Matiere"}
        onButtonClick={handleSave}
      />
      <Dialog
        open={openAlert}
        keepMounted
        onClose={handleCloseAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <p className="text-2xl font-montserrat_semi_bold text-title">
            {"Confirmer?"}
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p className="font-montserrat_medium text-text">
              Vous êtes sûr de supprimer cetter Offre?
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
            onClick={handleDelete}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Subject;
