import React, { useEffect, useRef, useState, useCallback, useContext } from "react";


import { useLocation } from "react-router-dom";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { Pdf } from "../../assets/svg";
import { getSubjectServiceById } from "../../services/subject-service";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { SnackbarContext } from "../../config/hooks/use-toast";
const SubjectDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [subjectData, setSubjectData] = useState<any>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const snackbarContext = useContext(SnackbarContext);
  useEffect(() => {
    if (id) {
      getSubjectServiceById(Number(id))
        .then((res) => {
          setSubjectData(res.data);
          setActivePlaylist(res.data.playLists[0]);
          setActiveStatus("videos");
          if (res.data.playLists[0]?.videos?.length > 0) {
            setVideoUrl(res.data.playLists[0].videos[0].url);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch subject:", error);
        });
    }
  }, [id]);

  const handleVideoClick = (videoUrl: string) => {
    setVideoUrl(videoUrl);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.load();

      videoRef.current.setAttribute("controlslist", "nodownload");
    }
  }, [videoUrl]);

  const handleStatusClick = (statusName: string) => {
    setActiveStatus(statusName);
  };

  const handlePlaylistClick = (playlist: any) => {
    setActivePlaylist(playlist);
    setActiveStatus("videos");
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const { duration, currentTime } = videoRef.current;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  }, [videoRef, setProgress]);


  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime =
        (event.target.valueAsNumber / 100) * videoRef.current.duration;
      setProgress(event.target.valueAsNumber);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const getFilteredResources = () => {
    if (!activePlaylist || !activeStatus) return [];

    switch (activeStatus) {
      case "videos":
        return activePlaylist.videos || [];
      case "qcms":
        return activePlaylist.qcms || [];
      case "fiches":
        return activePlaylist.fiches || [];
      case "exercices":
        return activePlaylist.exercices || [];
      case "corrections":
        return activePlaylist.corrections || [];
      default:
        return [];
    }
  };

  const statuses = ["videos", "qcms", "fiches", "exercices", "corrections"];
  const filteredResources = getFilteredResources();

  // Prevent the context menu on right-click
  const preventContextMenu = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.preventDefault();
  };


  return (
    <div className="pt-20 md:pt-40 px-4 md:px-12 flex flex-col items-center pb-20">
      <div className="w-full md:w-11/12 flex flex-col md:flex-row justify-between bg-purple_bg px-4 md:px-10 py-5 h-[78vh] rounded-3xl mb-5">
        <div className="w-full md:w-9/12 h-full p-5">
          <div className="relative w-full h-full overflow-hidden  bg-black">
            <video
              key={videoUrl}
              ref={videoRef}
              className="w-full h-full object-cover"
              //onClick={handlePlayPause}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              controls={true}
              controlsList="nodownload"
              onContextMenu={preventContextMenu}
              playsInline
              preload="auto"
            >
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
            {
              /*!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                  <PlayCircleFilledIcon
                    style={{ fontSize: 40, color: "#09745F" }}
                  />
                </button>
              )*/
            }

          </div>
          <p className="text-title text-xl md:text-2xl font-montserrat_semi_bold mt-3">
            {activePlaylist ? activePlaylist.title : "Video title"}
          </p>
        </div>
        <div className="w-full md:w-1/4 p-4">
          <h2 className="text-xl md:text-2xl text-title font-montserrat_semi_bold mb-2">
            Les Chapitres
          </h2>
          <ul className="overflow-y-auto h-[65vh]">
            {subjectData?.playLists.map((playlist: any) => (
              <li
                key={playlist.id}
                className={`bg-white rounded-xl mb-1 px-2 py-3 list-none cursor-pointer ${playlist.id === activePlaylist?.id
                    ? "bg-purple text-primary"
                    : ""
                  }`}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="text-lg font-montserrat_semi_bold">
                  {playlist.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full md:w-11/12 flex items-center flex-col bg-purple_bg p-4 md:p-10 rounded-xl">
        <div className="flex mb-4 w-full items-center justify-between flex-wrap">
          {statuses.map((status) => (
            <div
              key={status}
              className={`capitalize font-montserrat_semi_bold text-lg px-4 py-2 cursor-pointer ${status === activeStatus
                  ? "text-white bg-purple rounded-lg"
                  : "text-title"
                }`}
              onClick={() => handleStatusClick(status)}
            >
              {status}
            </div>
          ))}
        </div>
        <div className="w-full pt-10">
          {filteredResources.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {filteredResources
                .filter((item: any) => item.isCompleted === true)
                .sort((a: any, b: any) => a.id - b.id)
                .map((item: any) =>
                  activeStatus !== "videos" ? (
                    <li
                      key={item.id}
                      className="mb-2 list-none flex "
                    >
                      <a
                        href={item.url}
                        className="text-title hover:underline flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img alt="pdf" src={Pdf} className="mr-2 w-8 h-8" />
                        <p className="text-title text-lg font-montserrat_semi_bold">
                          {item.title}
                        </p>
                      </a>
                    </li>
                  ) : (
                    <li
                      key={item.id}
                      className=" list-none flex items-center cursor-pointer" // removed alternating styles
                      onClick={() => handleVideoClick(item.url)}
                    >
                      <OndemandVideoIcon
                        className="text-purple text-3xl"
                        fontSize={"large"}
                      />
                      <p className="ms-4 text-title text-lg font-montserrat_semi_bold">
                        {item.title}
                      </p>
                    </li>
                  )
                )}
            </ul>
          ) : (
            <p>No resources available for the selected status.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetails;
