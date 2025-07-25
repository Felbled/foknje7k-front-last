import React, { useContext, useState, MouseEvent } from "react";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from "../shared/custom-button/custom-button";
import FormModal from "./offerModal";
import { RootState } from "../redux/store/store";
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

// @ts-ignore
const OfferCard = ({ offer, onclick, onUpdateOffer, onDeleteOffer }) => {
  const location = useLocation();
  const isOfferStudent = location.pathname.includes("offer-student");
  const snackbarContext = useContext(SnackbarContext);

  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const isFreeOffer = offer.price === 0;

  const themeColors = {
    free: {
      border: "#3B82F6",        
      title: "#1D4ED8",         
      subTitle: "#60A5FA",      
      price: "#2563EB",         
      priceBg: "#DBEAFE",       
      badgeBg: "#DBEAFE",       
      badgeText: "#1E40AF",   
      check: "#3B82F6",        
      icon: "#3B82F6",          
      buttonStart: "#3B82F6",   
      buttonEnd: "#2563EB",     
      buttonHoverStart: "#2563EB", 
      buttonHoverEnd: "#3B82F6",   
    },
    paid: {
      border: "#10B981",        
      title: "#047857",         
      subTitle: "#34D399",      
      price: "#059669",         
      priceBg: "#D1FAE5",       
      badgeBg: "#D1FAE5",       
      badgeText: "#065F46",     
      check: "#10B981",        
      icon: "#10B981",          
      buttonStart: "#10B981",  
      buttonEnd: "#059669",    
      buttonHoverStart: "#059669", 
      buttonHoverEnd: "#10B981",   
    }
  };

  const colors = isFreeOffer ? themeColors.free : themeColors.paid;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const benefitsArray = offer?.offerDetails?.split(" \n ");
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
              "Offre Modifier avec succée",
              "success",
            );
          }
        })
        .catch((e) => {
          console.log(e);
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
              "Offre Ajouter avec succée",
              "success",
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [open, setOpen] = React.useState(false);

  const handleClickAlert = () => {
    handleClose();
    console.log(offer);
    setOpen(true);
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    if (isOfferStudent) {
      deleteStudentOfferService(offer.id)
        .then((res) => {
          setOpen(false);
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succes",
              "Offre supprimer avec succée",
              "success",
            );
          }
          handleClose();
          onDeleteOffer();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      deleteTeacherOfferService(offer.id)
        .then((res) => {
          setOpen(false);
          handleClose();
          onDeleteOffer();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div 
      className="flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] w-full max-w-sm h-full"
      style={{ borderTop: `4px solid ${colors.border}` }}
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          src={offer?.imageUrl || "https://via.placeholder.com/300x192?text=Offre"}
          alt={offer.title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
        />
      </div>

      {offer.subscribed && (
        <div 
          className="absolute px-3 py-1 text-xs font-semibold rounded-full top-4 right-4"
          style={{ 
            backgroundColor: colors.badgeBg,
            color: colors.badgeText
          }}
        >
          Abonné
        </div>
      )}

      <div className="flex flex-col h-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 
              className="mb-1 text-xl font-bold"
              style={{ color: colors.title }}
            >
              {offer.title}
            </h2>
            <p 
              className="font-medium"
              style={{ color: colors.subTitle }}
            >
              {offer.subTitle}
            </p>
          </div>
          
          {role === "ROLE_ADMIN" && (
            <div>
              <IconButton 
                onClick={handleClick} 
                style={{ color: colors.icon }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleOpenModal}>Modifier</MenuItem>
                <MenuItem onClick={handleClickAlert}>Supprimer</MenuItem>
              </Menu>
            </div>
          )}
        </div>

        <div className="h-16 mb-4 overflow-hidden">
          <p className="text-sm text-gray-600">
            {offer.description}
          </p>
        </div>

        <div className="flex flex-col mb-6">
          <div 
            className="flex items-center justify-between px-4 py-3 mb-3 rounded-xl"
            style={{ backgroundColor: colors.priceBg }}
          >
            <span className="text-lg font-semibold text-gray-700">
              {isOfferStudent ? `Matière/ ${offer.monthlyPeriod} mois` : `${offer.monthlyPeriod} mois`}
            </span>
            <div className="flex items-baseline">
              <span 
                className="text-4xl font-bold"
                style={{ color: colors.price }}
              >
                {offer.price}
              </span>
              <span 
                className="ml-1 text-xl font-medium"
                style={{ color: colors.price }}
              >
                DT
              </span>
            </div>
          </div>
          
          {isFreeOffer && (
            <div className="py-2 mb-4 text-center text-blue-800 bg-blue-100 rounded-lg">
              Offre 100% gratuite - Aucun paiement requis
            </div>
          )}
        </div>

        <div className="flex-grow mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            Ce que vous obtenez
          </h3>
          
          <div className="h-48 pr-2 space-y-3 overflow-y-auto">
            {benefitsArray.map((benefit: any, index: React.Key) => (
              <div 
                className="flex items-start"
                key={index}
              >
                <CheckCircleIcon 
                  style={{ color: colors.check }} 
                  className="flex-shrink-0 mt-1 mr-3" 
                />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-auto">
          {(!offer.subscribed && role !== "ROLE_ADMIN") && (
            <div
              className="w-full py-3 font-semibold text-center text-white transition-all shadow-md cursor-pointer rounded-xl hover:shadow-lg"
              style={{
                background: `linear-gradient(to right, ${colors.buttonStart}, ${colors.buttonEnd})`,
                backgroundSize: '200% auto',
                transition: 'background-position 0.5s',
              }}
              onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colors.buttonHoverStart}, ${colors.buttonHoverEnd})`;
              }}
              onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colors.buttonStart}, ${colors.buttonEnd})`;
              }}
              onClick={onclick}
            >
              {isFreeOffer ? "Rejoindre gratuitement" : "Souscrire maintenant"}
            </div>
          )}
        </div>
      </div>

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
          <p className="text-2xl font-bold text-gray-800">
            Confirmer la suppression
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette offre? Cette action est irréversible.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseAlert}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            className="text-white bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OfferCard;