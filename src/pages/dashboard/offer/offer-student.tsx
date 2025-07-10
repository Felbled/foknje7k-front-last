import React, { useContext, useEffect, useState } from "react";
import { RootState } from "../../../redux/store/store";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../../../shared/custom-button/custom-button";
import Carousel from "react-material-ui-carousel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import OfferCard from "../../../componet/offer-card";
import { fakeProfiles } from "../../../mocks/classes-data";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { useSelector } from "react-redux";
import OfferStudentModal from "../../../componet/offer-student-modal";
import {
  createStudentOfferService,
  getAllStudentOfferService,
  sendOfferService,
} from "../../../services/student-offer";
import { getAllUserByRole } from "../../../services/super-teacher";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import { SnackbarContext } from "../../../config/hooks/use-toast";

const OfferStudent = () => {
  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );

  const [data, setData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filterText, setFilterText] = useState(""); // State for the filter text
  const snackbarContext = useContext(SnackbarContext);

  const fetchData = () => {
    getAllStudentOfferService()
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
    if (role === "ROLE_STUDENT") {
      getAllUserByRole("ROLE_SUPER_TEACHER")
        .then((res) => {
          setTeachers(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAction = (formData: any) => {
    createStudentOfferService(formData)
      .then((res) => {
        fetchData();
        handleCloseModal();
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Offre ajouter avec succée",
            "success",
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
    sendOfferService(selectedOffer.id, confirmedData)
      .then((res) => {
        console.log(res);
        handleBackToMainView();
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Votre Payment est envoyée avec succée",
            "success",
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Filter teachers based on the input text
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.fullName.toLowerCase().includes(filterText.toLowerCase()),
  );

  return (
    <div
      className={`flex flex-col lg:flex-row items-center w-full ${
        data.length === 0 ? "justify-center h-[60vh]" : ""
      }`}
    >
      {isConfirmModal && selectedOffer && selectedOffer.price !== 0 ? (
        <div className="w-full h-[70vh] flex flex-col items-center">
          <div className="w-9/12 mb-10">
            <h1 className="text-lg text-title lg:text-3xl font-montserrat_semi_bold">
              Confirmer offre
            </h1>
          </div>
          <div className="flex flex-col items-center w-3/4 p-5 bg-white sm:w-1/2 rounded-3xl">
            <h1 className="mb-5 text-lg font-montserrat_semi_bold lg:text-3xl text-title">
              Confirmer le Payement
            </h1>
            <p className="mb-5 text-sm font-montserrat_regular text-text">
              veuillez fournir une image claire du reçu de paiment
            </p>
            <Card
              className="flex flex-col items-center justify-center w-full p-6 mb-5 border-2 border-dashed cursor-pointer border-primary"
              onClick={handleCardClick}
            >
              <input
                type="file"
                id="file-input"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <AddIcon className="mb-2 text-6xl text-primary" />
              <Typography className="text-primary font-montserrat_semi_bold">
                {selectedFile ? selectedFile.name : "Ajouter le reçu"}
              </Typography>
            </Card>
            <div className="flex flex-col justify-between w-full sm:flex-row">
              <CustomButton
                className="w-full h-10 mb-4 bg-white border rounded-md border-primary text-primary sm:mb-0 sm:w-1/3"
                text={"Précedent"}
                onClick={handleBackToMainView}
              />
              <CustomButton
                className="w-full h-10 text-white rounded-md bg-primary sm:w-1/3"
                text={"Envoyer"}
                onClick={handleConfirmPayment}
              />
            </div>
          </div>
        </div>
      ) : isConfirmModal && selectedOffer && selectedOffer.price === 0 ? (
        <div className="w-full h-[40vh] flex flex-col items-center justify-center">
          <div className="w-9/12 mb-10">
            <h1 className="text-lg text-title lg:text-3xl font-montserrat_semi_bold">
              Offre gratuite
            </h1>
          </div>
          <div className="flex flex-col items-center w-3/4 p-5 bg-white sm:w-1/2 rounded-3xl">
            <h1 className="mb-5 text-lg font-montserrat_semi_bold lg:text-3xl text-title">
              Vous allez rejoindre cette offre gratuitement !
            </h1>
            <CustomButton
              className="w-full h-10 text-white rounded-md bg-primary sm:w-1/3"
              text={"Confirmer"}
              onClick={() => {
                // Call backend to subscribe student to free offer
                sendOfferService(selectedOffer.id, {})
                  .then(() => {
                    fetchData();
                    setIsConfirmModal(false);
                    if (snackbarContext) {
                      snackbarContext.showMessage(
                        "Succes",
                        "Vous avez rejoint l'offre gratuite avec succès",
                        "success"
                      );
                    }
                    if (selectedOffer.groupId) {
                      window.location.href = `/dashboard/group/${selectedOffer.groupId}`;
                    }
                  })
                  .catch((e: any) => {
                    console.log(e);
                    if (snackbarContext) {
                      snackbarContext.showMessage(
                        "Erreur",
                        "Erreur lors de la souscription à l'offre gratuite",
                        "error"
                      );
                    }
                  });
              }}
            />
          </div>
        </div>
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="w-full h-full md:w-8/12">
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
            <div className="flex justify-center w-full mt-5 item-center md:w-1/3 md:mt-0">
              <div
                onClick={handleOpenModal}
                className="p-5 rounded-full cursor-pointer bg-primary"
              >
                <AddIcon className="text-white" style={{ fontSize: 50 }} />
              </div>
            </div>
          )}
          {role === "ROLE_STUDENT" && (
            <div
              className={
                "flex flex-col item center p-5 w-80 h-[65vh] bg-white rounded-3xl overflow-y-auto shadow-lg"
              }
            >
              <h1
                className={"text-title font-montserrat_semi_bold text-2xl mb-7"}
              >
                Autre Profs
              </h1>
              {/* Filter input for teachers */}
              <input
                type="text"
                placeholder="Rechercher un professeur..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="p-2 mb-4 border rounded"
              />
              {filteredTeachers.map((item, index) => (
                <div
                  key={index.toString()}
                  className="flex items-center justify-between w-full mb-5"
                >
                  <p className="text-lg text-title font-montserrat_semi_bold">
                    {item.fullName}
                  </p>
                  <div className={"flex"}>
                    <div
                      className="mx-3 cursor-pointer"
                      onClick={() => handleOpenProfileDialog(item)}
                    >
                      <VisibilityIcon className="text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <OfferStudentModal
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
        <DialogTitle className="mb-3 text-2xl font-semibold text-center text-primary">
          Profile Details
        </DialogTitle>
        <DialogContent className="flex flex-col items-center">
          {selectedProfile && (
            <>
              <div className="flex items-center mb-4">
                <PersonIcon className="mr-2 text-primary" />
                <Typography variant="h6" className="text-xl font-medium">
                  {selectedProfile.fullName}
                </Typography>
              </div>
              <div className="flex items-center mb-4">
                <MailOutlineOutlinedIcon className="mr-2 text-primary" />
                <Typography variant="body1" className="text-lg">
                  {selectedProfile.email}
                </Typography>
              </div>
              <div className="flex items-center mb-4">
                <PhoneIcon className="mr-2 text-primary" />
                <Typography variant="body1" className="text-lg">
                  {selectedProfile.phoneNumber}
                </Typography>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions className="justify-center">
          <Button
            onClick={handleCloseProfileDialog}
            className="px-6 py-2 text-white rounded-full bg-primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OfferStudent;
