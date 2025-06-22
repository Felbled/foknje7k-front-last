import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import OfferCard from "../../../componet/offer-card";
import FormModal from "../../../componet/offerModal";
import { fakeProfiles } from "../../../mocks/classes-data";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CustomButton from "../../../shared/custom-button/custom-button";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import {
  createTeacherOfferService,
  getAllTeacherOfferService,
  sendOfferTeacherService,
} from "../../../services/teacher-offer";
import { SnackbarContext } from "../../../config/hooks/use-toast";

const Offer = () => {
  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );
  const snackbarContext = useContext(SnackbarContext);

  const [data, setData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fetchData = () => {
    getAllTeacherOfferService()
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleUpdateOffer = (updatedOffer: any) => {
    setData((prevOffers: any[]) =>
      prevOffers.map((offer) =>
        offer.id === updatedOffer.id ? updatedOffer : offer,
      ),
    );
  };
  const handleUpdateAfterDelete = () => {
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleAction = (formData: any) => {
    createTeacherOfferService(formData)
      .then((res) => {
        fetchData();
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
    console.log("Form Data:", formData);
  };

  const handleOpenProfileDialog = (profile: any) => {
    setSelectedProfile(profile);
  };

  const handleCloseProfileDialog = () => {
    setSelectedProfile(null);
  };

  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    setIsConfirmModal(true);
  };

  const handleBackToMainView = () => {
    setIsConfirmModal(false);
    setSelectedOffer(null);
  };

  const groupedSrcList: any[] = data.reduce(
    (result: any, src: any, index: number) => {
      const pairIndex = Math.floor(index / 2);
      if (!result[pairIndex]) {
        result[pairIndex] = [];
      }
      result[pairIndex].push(src);
      return result;
    },
    [],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleCardClick = () => {
    const inputElement = document.getElementById("file-input");
    if (inputElement) {
      inputElement.click();
    }
  };
  const handleConfirmPayment = () => {
    const confirmedData = new FormData();
    if (selectedFile) {
      confirmedData.append("paymentImage", selectedFile);
    }
    sendOfferTeacherService(selectedOffer.id, confirmedData)
      .then((res) => {
        console.log(res);
        handleBackToMainView();
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Votre Payment a étè envoyer  avec succée",
            "success",
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div
      className={`flex flex-col  lg:flex-row items-center w-full ${
        data.length === 0 ? "justify-center h-[60vh]" : ""
      }`}
    >
      {isConfirmModal ? (
        <div className="w-full h-[70vh] flex flex-col items-center">
          <div className="w-9/12 mb-10">
            <h1 className="text-title text-lg lg:text-3xl font-montserrat_semi_bold">
              Confirmer offre
            </h1>
          </div>
          <div className="w-3/4 sm:w-1/2 p-5 flex flex-col items-center bg-white rounded-3xl">
            <h1 className="font-montserrat_semi_bold text-lg lg:text-3xl  text-title mb-5">
              Confirmer le Payement
            </h1>
            <p className="font-montserrat_regular text-sm text-text mb-5">
              veuillez fournir une image claire du reçu de paiment
            </p>
            <Card
              className="w-full p-6 mb-5 flex flex-col items-center justify-center cursor-pointer border-dashed border-2 border-primary"
              onClick={handleCardClick}
            >
              <input
                type="file"
                id="file-input"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <AddIcon className="text-primary text-6xl mb-2" />
              <Typography className="text-primary font-montserrat_semi_bold">
                {selectedFile ? selectedFile.name : "Ajouter le reçu"}
              </Typography>
            </Card>
            <div className="w-full flex flex-col sm:flex-row justify-between">
              <CustomButton
                className="bg-white border border-primary w-full text-primary rounded-md h-10 mb-4 sm:mb-0 sm:w-1/3"
                text={"Précedent"}
                onClick={handleBackToMainView}
              />
              <CustomButton
                className="bg-primary text-white rounded-md h-10 w-full sm:w-1/3"
                text={"Envoyer"}
                onClick={handleConfirmPayment}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="w-full md:w-8/12 h-full">
              <Carousel
                navButtonsAlwaysVisible={true}
                navButtonsProps={{
                  style: {
                    backgroundColor: "white",
                    color: "black",
                    margin: "0 0px",
                  },
                }}
                NextIcon={<ArrowForwardIosIcon />}
                PrevIcon={<ArrowBackIosIcon />}
                animation={"slide"}
                autoPlay={false}
                indicators={false}
              >
                {groupedSrcList.map((pair, index) => (
                  <Grid
                    container
                    spacing={2}
                    className="px-5 md:px-16"
                    key={index}
                  >
                    {pair.map(
                      (src: any, imgIndex: React.Key | null | undefined) => (
                        <Grid item xs={12} sm={6} key={imgIndex}>
                          <OfferCard
                            offer={src}
                            onclick={() => handleOfferClick(src)}
                            onUpdateOffer={handleUpdateOffer}
                            onDeleteOffer={handleUpdateAfterDelete}
                          />
                        </Grid>
                      ),
                    )}
                  </Grid>
                ))}
              </Carousel>
            </div>
          ) : (
            <div></div>
          )}

          {role === "ROLE_ADMIN" && (
            <div className="flex item-center justify-center w-full md:w-1/3 mt-5 md:mt-0">
              <div
                onClick={handleOpenModal}
                className="cursor-pointer bg-primary p-5 rounded-full"
              >
                <AddIcon className="text-white" style={{ fontSize: 50 }} />
              </div>
            </div>
          )}
        </>
      )}

      <FormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        modalTitle="Ajouter Offre"
        buttonText="Ajouter"
        onButtonClick={handleAction}
      />
      <Dialog
        open={Boolean(selectedProfile)}
        onClose={handleCloseProfileDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-xl p-5",
          style: { maxWidth: "800px" },
        }}
      >
        <DialogTitle className="text-center font-semibold text-2xl text-primary mb-3">
          Profile Details
        </DialogTitle>
        <DialogContent className="flex flex-col items-center">
          {selectedProfile && (
            <>
              <img
                alt="img"
                src={selectedProfile.photo}
                className="w-32 h-32 rounded-full mb-5 shadow-lg"
              />
              <div className="flex items-center mb-4">
                <PersonIcon className="text-primary mr-2" />
                <Typography variant="h6" className="font-medium text-xl">
                  {selectedProfile.name}
                </Typography>
              </div>
              <div className="flex items-center mb-4">
                <PhoneIcon className="text-primary mr-2" />
                <Typography variant="body1" className="text-lg">
                  {selectedProfile.phone}
                </Typography>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions className="justify-center">
          <Button
            onClick={handleCloseProfileDialog}
            className="bg-primary text-white px-6 py-2 rounded-full"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Offer;
