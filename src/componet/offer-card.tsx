import React, { useContext, useState } from "react";
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
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: { currentTarget: any }) => {
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

  // Debug log for offer subscription state
  console.log('OFFER DEBUG:', {
    id: offer?.id,
    title: offer?.title,
    price: offer?.price,
    subscribed: offer?.subscribed,
    userRole: role,
    isOfferStudent,
  });

  return (
    <div className="flex flex-col justify-between bg-white shadow-md overflow-hidden w-full sm:w-80 p-4 sm:p-8 h-auto sm:h-[65vh] rounded-3xl">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={offer?.imageUrl}
              alt={offer.title}
              className="object-cover w-12 h-12 shadow rounded-xl"
            />
            <div className="ml-4">
              <h2 className="text-text font-montserrat_regular">
                {offer.title}
              </h2>
              <p className="text-xl text-title font-montserrat_medium">
                {offer.subTitle}
              </p>
            </div>
          </div>
          {role === "ROLE_ADMIN" && (
            <div>
              <IconButton onClick={handleClick}>
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
                <MenuItem onClick={handleOpenModal}>Edit</MenuItem>
                <MenuItem onClick={handleClickAlert}>Delete</MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <div className="py-4">
          <p className="mb-2 text-sm text-text font-montserrat_regular">
            {offer.description}
          </p>
          <div className="flex items-end">
            <p className="text-3xl font-montserrat_bold">{offer.price} DT</p>
            <p className="ml-1 text-text font-montserrat_regular">
              / {offer.monthlyPeriod} Mois
            </p>
          </div>
          <p className="mt-2 font-montserrat_semi_bold">Ce qui est inclu</p>
          <div className="mt-2">
            {benefitsArray.map((benefit: any, index: React.Key) => (
              <div className="flex mb-2" key={index}>
                <CheckCircleIcon className="mr-3 text-primary" />
                <p className="text-title font-montserrat_regular">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full my-3">
        {(!offer.subscribed && role !== "ROLE_ADMIN") && (
          <CustomButton
            text="Commencer"
            width="w-full sm:w-2/3"
            className="text-white rounded-6xl"
            onClick={onclick}
          />
        )}
      </div>
      {isOfferStudent ? (
        <OfferStudentModal
          open={isModalOpen}
          onClose={handleCloseModal}
          initialData={{ image: offer.imageUrl, ...offer }}
          modalTitle="Edit Item"
          buttonText="Update"
          onButtonClick={handleAction}
        />
      ) : (
        <FormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          initialData={{ image: offer.imageUrl, ...offer }}
          modalTitle="Edit Item"
          buttonText="Update"
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

export default OfferCard;