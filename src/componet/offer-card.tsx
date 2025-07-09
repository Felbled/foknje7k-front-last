import React, { useContext, useState, useEffect } from "react";
import "./cards.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddTaskIcon from '@mui/icons-material/AddTask';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from "../shared/custom-button/custom-button";
import FormModal from "./offerModal";
import { RootState } from "../redux/store/store";
import { cardsback } from "../assets/images";
import { useSelector } from "react-redux";
import {
  deleteTeacherOfferService,
  updateTeacherOfferService,
} from "../services/teacher-offer";
import { useLocation } from "react-router-dom";
import OfferStudentModal from "./offer-student-modal";
import {
  deleteStudentOfferService,
  updateStudentOfferService,
} from "../services/student-offer";
import { SnackbarContext } from "../config/hooks/use-toast";

interface Offer {
  title: string;
  price: string;
  infos: string[];
}

interface Offers {
  [key: string]: Offer;
}

interface OfferCardProps {
  offer: any;
  onclick: () => void;
  onUpdateOffer: (offer: any) => void;
  onDeleteOffer: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ 
  offer, 
  onclick, 
  onUpdateOffer, 
  onDeleteOffer 
}) => {
  const location = useLocation();
  const isOfferStudent = location.pathname.includes("offer-student");
  const snackbarContext = useContext(SnackbarContext);
  const [selected, setSelected] = useState<string>("gratuit");
  const [animateItems, setAnimateItems] = useState(false);
  const bonusInfos = [
    "Live = 2 heures",
    "Création 8 classes (1 an)",
  ];
  
  const offres: Offers = {
    gratuit: {
      title: "Offre Gratuite",
      price: "0 DT",
      infos: [
        "Dashboard controle",
        "Inscription gratuite",
        "Accès 2 ans gratuit",
        "Création 2 classes (2 ans)",
        "Nombre d'élèves illimité",
        "Nombre de profs assistantes illimité",
        "Live / record = cours 1 heure",
        "Calendrier = accès",
      ],
    },
    payant: {
      title: "Offre Payante",
      price: "100 DT / an (1ère année)",
      infos: [
        "Dashboard controle",
        "Inscription gratuite",
        "Accès 2 ans gratuit",
        "Création 8 classes (1 an)",
        "Nombre d'élèves illimité",
        "Nombre de profs assistantes illimité",
        "Live = 2 heures",
        "Calendrier = accès",
      ],
    },
  };

  const current: Offer = offres[selected];

  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (formData: any) => {
    if (isOfferStudent) {
      updateStudentOfferService(offer.id, formData)
        .then((updatedOffer) => {
          onUpdateOffer(updatedOffer.data);
          handleClose();
          handleCloseModal();
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succes",
              "Offre Modifiée avec succès",
              "success",
            );
          }
        })
        .catch((e) => {
          console.log(e);
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Erreur",
              "Échec de la modification de l'offre",
              "error",
            );
          }
        });
    } else {
      updateTeacherOfferService(offer.id, formData)
        .then((updatedOffer) => {
          onUpdateOffer(updatedOffer.data);
          handleClose();
          handleCloseModal();
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succes",
              "Offre Modifiée avec succès",
              "success",
            );
          }
        })
        .catch((e) => {
          console.log(e);
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Erreur",
              "Échec de la modification de l'offre",
              "error",
            );
          }
        });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleClickAlert = () => {
    handleClose();
    setOpen(true);
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (isOfferStudent) {
      deleteStudentOfferService(offer.id)
        .then(() => {
          setOpen(false);
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succes",
              "Offre supprimée avec succès",
              "success",
            );
          }
          handleClose();
          onDeleteOffer();
        })
        .catch((e) => {
          console.log(e);
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Erreur",
              "Échec de la suppression de l'offre",
              "error",
            );
          }
        });
    } else {
      deleteTeacherOfferService(offer.id)
        .then(() => {
          setOpen(false);
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succes",
              "Offre supprimée avec succès",
              "success",
            );
          }
          handleClose();
          onDeleteOffer();
        })
        .catch((e) => {
          console.log(e);
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Erreur",
              "Échec de la suppression de l'offre",
              "error",
            );
          }
        });
    }
  };

  const handleSelectOffer = (offerType: string) => {
    setSelected(offerType);
    setAnimateItems(false);
    // Réactive l'animation après un court délai
    setTimeout(() => setAnimateItems(true), 50);
  };

  useEffect(() => {
    // Active l'animation au premier rendu
    setAnimateItems(true);
  }, []);

  return (
    <div className="flex flex-col justify-between overflow-hidden w-full sm:w-96 md:w-[28rem]">     
      <div className="px-7 lg:px-14 h-full">
        <div className="max-w-md mx-auto shadow-lg bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          
          {/* ✅ Image Full Width with No Padding */}
          <div className="relative w-full h-40 overflow-hidden m-0 p-0">
            <img 
              src={cardsback}
              alt="Offre éducation"
              className="w-full h-full object-cover"
            />
            {role === "ROLE_ADMIN" && (
              <div className="absolute top-2 right-2 z-10">
                <IconButton onClick={handleClick} className="bg-white bg-opacity-80 hover:bg-opacity-100">
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleOpenModal}>Modifier</MenuItem>
                  <MenuItem onClick={handleClickAlert}>Supprimer</MenuItem>
                </Menu>
              </div>
            )}
          </div>

          {/* ✅ Main content with padding */}
          <div className="p-6">
            {/* Titre */}
            <h3 className="text-lg text-center font-semibold text-gray-800 mb-3 tracking-wide animate-bounce">
              Sélectionnez l'offre qui vous convient
            </h3>

            {/* Boutons de sélection */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded-full shadow-lg hover:shadow-lg transition-all duration-1500 ${
                  selected === "gratuit"
                    ? "bg-[#07b98e] text-white scale-105"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleSelectOffer("gratuit")}
              >
                Gratuite
              </button>

              <button
                className={`px-4 py-2 rounded-full shadow-lg hover:shadow-lg transition-all duration-1500 ${
                  selected === "payant"
                    ? "bg-[#07b98e] text-white scale-105"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleSelectOffer("payant")}
              >
                Payante
              </button>
            </div>

            {/* Prix */}
            <div className="w-full flex justify-center mt-6 mb-6">
              <div className="inline-block bg-[#e0edff] text-[#256cf0] text-base font-bold px-4 py-2 rounded-2xl shadow-sm border border-[#256cf0]">
                Prix : {current.price}
              </div>
            </div>

            {/* Liste des infos */}
            <ul className="pl-2 space-y-2 text-sm text-gray-700">
              {current.infos.map((info: string, index: number) => {
                const isBonus =
                  selected === "payant" && bonusInfos.includes(info);

                return (
                  <li 
                    key={index} 
                    className="flex items-start gap-2"
                    style={{
                      animation: animateItems ? `fadeInLeft 1s ease-out ${index * 0.1}s forwards` : 'none',
                      opacity: 0
                    }}
                  >
                    {isBonus ? (
                      <AddTaskIcon htmlColor="#256cf0" className="mt-0.5 w-4 h-4" />
                    ) : (
                      <CheckCircleIcon htmlColor="#16a34a" className="mt-0.5 w-4 h-4" />
                    )}
                    <span>{info}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center my-3">
        {!offer.subscribed && role !== "ROLE_ADMIN" && (
          <CustomButton
            text="Commencer"
            width="w-full sm:w-2/3"
            className="rounded-6xl text-white bg-green-600 hover:bg-green-700"
            onClick={onclick}
          />
        )}
      </div>

      {/* Modal Section */}
      {isOfferStudent ? (
        <OfferStudentModal
          open={isModalOpen}
          onClose={handleCloseModal}
          initialData={{ image: offer.imageUrl, ...offer }}
          modalTitle="Modifier l'offre"
          buttonText="Mettre à jour"
          onButtonClick={handleAction}
        />
      ) : (
        <FormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          initialData={{ image: offer.imageUrl, ...offer }}
          modalTitle="Modifier l'offre"
          buttonText="Mettre à jour"
          onButtonClick={handleAction}
        />
      )}

      <Dialog
        open={open}
        keepMounted
        onClose={handleCloseAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <p className="text-2xl font-montserrat_semi_bold text-title">Confirmer la suppression</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p className="font-montserrat_medium text-text">
              Êtes-vous sûr de vouloir supprimer cette offre ?
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

export default OfferCard;