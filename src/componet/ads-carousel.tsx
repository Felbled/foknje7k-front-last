import React, { useEffect, useState } from "react";
import { offerList } from "../mocks/offers";
import { Grid, IconButton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import {
  getUserGroupService,
  getUserPublicGroupService,
} from "../services/group-service";
import { useNavigate } from "react-router-dom";

const AdsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const navigation = useNavigate();

  useEffect(() => {
    getUserPublicGroupService()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const handleNext = () => {
    if (currentIndex < data.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleItems = data.slice(currentIndex, currentIndex + 3);

  return (
    <div className="w-11/12 h-96">
      <h1 className="text-title text-3xl font-montserrat_semi_bold mb-10">
        Espace Publicitaire
      </h1>
      <Grid container spacing={2}>
        {visibleItems.map(
          (src: any, imgIndex: React.Key | null | undefined) => (
            <Grid item xs={4} key={imgIndex}>
              <div
                className="w1/4  cursor-pointer h-72 border-8 border-white rounded-3xl flex flex-col justify-end py-8"
                onClick={() => navigation(`/subject/${src.id}`)}
                style={{
                  backgroundImage: `url(${src.backgroundImageUrl})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <p className="bg-white text-primary w-min font-montserrat_medium text-lg rounded-e-2xl px-3  mb-2">
                  {src?.title}
                </p>
                <p className="bg-white text-text w-min font-montserrat_regular text-md rounded-e-2xl px-3">
                  {src?.educationLevel}
                </p>
              </div>
            </Grid>
          ),
        )}
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className="mt-10 w-44"
      >
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            color: "white",
            backgroundColor: "#09745F",
            marginInlineEnd: 10,
          }}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          disabled={currentIndex >= offerList.length - 3}
          style={{ color: "white", backgroundColor: "#09745F" }}
        >
          <NavigateNextIcon />
        </IconButton>
      </Grid>
    </div>
  );
};

export default AdsCarousel;
