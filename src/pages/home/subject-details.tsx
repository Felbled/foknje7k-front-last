import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Pdf } from "../../assets/svg";
import { getSubjectServiceById } from "../../services/subject-service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { SnackbarContext } from "../../config/hooks/use-toast";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { deletePlaylistService } from "../../services/playList-service";

interface Video {
  id: number;
  title: string;
  url: string;
  isCompleted: boolean;
}

interface Resource {
  id: number;
  title: string;
  url: string;
  isCompleted: boolean;
}

interface Playlist {
  id: number;
  title: string;
  videos: Video[];
  qcms: Resource[];
  fiches: Resource[];
  exercices: Resource[];
  corrections: Resource[];
}

interface SubjectData {
  playLists: Playlist[];
}

interface SnackbarContextType {
  showToast?: (message: string, severity: "success" | "error") => void;
  showSnackbar?: (message: string, severity: "success" | "error") => void;
}

const SubjectDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [subjectData, setSubjectData] = useState<SubjectData | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>("videos");
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);
  const [localSnackbar, setLocalSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const snackbarContext = useContext(SnackbarContext) as SnackbarContextType;

  const showToast = (message: string, severity: "success" | "error") => {
    if (snackbarContext?.showToast) {
      snackbarContext.showToast(message, severity);
    } else if (snackbarContext?.showSnackbar) {
      snackbarContext.showSnackbar(message, severity);
    } else {
      setLocalSnackbar({ open: true, message, severity });
    }
  };

  useEffect(() => {
    if (id) {
      getSubjectServiceById(Number(id))
        .then((res) => {
          const data = res.data;
          setSubjectData(data);
          if (data.playLists.length > 0) {
            const firstPlaylist = data.playLists[0];
            setActivePlaylist(firstPlaylist);
            if (firstPlaylist.videos?.length > 0) {
              setVideoUrl(firstPlaylist.videos[0].url);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch subject:", error);
          showToast("Erreur lors du chargement du sujet", "error");
        });
    }
  }, [id]);

  const handleVideoClick = (url: string) => {
    setVideoUrl(url);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.setAttribute("controlslist", "nodownload");
    }
  }, [videoUrl]);

  const handleStatusClick = (statusName: string) => {
    setActiveStatus(statusName);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setActivePlaylist(playlist);
    setActiveStatus("videos");
    if (playlist.videos?.length > 0) {
      setVideoUrl(playlist.videos[0].url);
    }
  };

  const handleDeleteClick = (playlist: Playlist) => {
    setPlaylistToDelete(playlist);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setPlaylistToDelete(null);
  };

  const handleDeletePlaylist = () => {
    if (!playlistToDelete || !subjectData) return;

    deletePlaylistService(playlistToDelete.id)
      .then(() => {
        const updatedPlaylists = subjectData.playLists.filter(
          pl => pl.id !== playlistToDelete.id
        );
        
        setSubjectData({
          ...subjectData,
          playLists: updatedPlaylists
        });
        
        if (activePlaylist?.id === playlistToDelete.id) {
          const newActivePlaylist = updatedPlaylists[0] || null;
          setActivePlaylist(newActivePlaylist);
          setVideoUrl(newActivePlaylist?.videos?.[0]?.url || "");
        }
        
        showToast("Chapitre supprimé avec succès", "success");
      })
      .catch((error) => {
        console.error("Failed to delete playlist:", error);
        showToast("Échec de la suppression du chapitre", "error");
      })
      .finally(() => {
        handleDeleteClose();
      });
  };

  const getFilteredResources = () => {
    if (!activePlaylist) return [];

    switch (activeStatus) {
      case "videos": return activePlaylist.videos || [];
      case "qcms": return activePlaylist.qcms || [];
      case "fiches": return activePlaylist.fiches || [];
      case "exercices": return activePlaylist.exercices || [];
      case "corrections": return activePlaylist.corrections || [];
      default: return [];
    }
  };

  const statuses = ["videos", "qcms", "fiches", "exercices", "corrections"];
  const filteredResources = getFilteredResources();

  const preventContextMenu = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.preventDefault();
  };

  return (
    <div className="pt-20 md:pt-40 px-4 md:px-12 flex flex-col items-center pb-20">
      <div className="w-full md:w-11/12 flex flex-col md:flex-row justify-between bg-purple_bg px-4 md:px-10 py-5 h-[78vh] rounded-3xl mb-5">
        <div className="w-full md:w-9/12 h-full p-5">
          <div className="relative w-full h-full overflow-hidden bg-black">
            <video
              key={videoUrl}
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              controlsList="nodownload"
              onContextMenu={preventContextMenu}
              playsInline
              preload="auto"
            >
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-title text-xl md:text-2xl font-montserrat_semi_bold mt-3">
            {activePlaylist?.title || "Video title"}
          </p>
        </div>

        <div className="w-full md:w-1/4 p-4">
          <h2 className="text-xl md:text-2xl text-title font-montserrat_semi_bold mb-2">
            Les Chapitres
          </h2>
          <ul className="overflow-y-auto h-[65vh]">
            {subjectData?.playLists.map((playlist) => (
              <li
                key={playlist.id}
                className={`bg-white rounded-xl mb-1 px-2 py-3 list-none cursor-pointer ${
                  playlist.id === activePlaylist?.id ? "bg-purple text-primary" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div 
                    className="text-lg font-montserrat_semi_bold flex-grow"
                    onClick={() => handlePlaylistClick(playlist)}
                  >
                    {playlist.title}
                  </div>
                  <button
  className="relative bg-red text-white px-4 py-2 rounded-full text-sm ml-2
             transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
             hover:scale-[1.03] hover:shadow-lg hover:bg-red-700
             active:scale-95 active:shadow-md
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
             group"
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteClick(playlist);
  }}
  aria-label="Supprimer"
>
  <FontAwesomeIcon 
    icon={faTrash} 
    className="text-white group-hover:text-red-100 transition-colors duration-200"
  />
  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-200
                  text-xs text-red font-medium whitespace-nowrap">
    Supprimer
  </span>
</button>
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
              className={`capitalize font-montserrat_semi_bold text-lg px-4 py-2 cursor-pointer ${
                status === activeStatus ? "text-white bg-purple rounded-lg" : "text-title"
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
                .filter((item) => item.isCompleted === true)
                .sort((a, b) => a.id - b.id)
                .map((item) =>
                  activeStatus !== "videos" ? (
                    <li key={item.id} className="mb-2 list-none flex">
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
                      className="list-none flex items-center cursor-pointer"
                      onClick={() => handleVideoClick(item.url)}
                    >
                      <OndemandVideoIcon className="text-purple text-3xl" fontSize="large" />
                      <p className="ms-4 text-title text-lg font-montserrat_semi_bold">
                        {item.title}
                      </p>
                    </li>
                  )
                )}
            </ul>
          ) : (
            <p>Aucune ressource disponible pour cette section.</p>
          )}
        </div>
      </div>

      <Dialog open={openDeleteDialog} onClose={handleDeleteClose} fullWidth maxWidth="sm">
        <Box className="p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-2xl">
              Supprimer Chapitre
            </p>
            <IconButton onClick={handleDeleteClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="space-y-6">
            <p>Êtes-vous sûr de vouloir supprimer ce chapitre et tous ses contenus ?</p>
            <div className="flex justify-end mt-6 space-x-4">
              <Button
                className="w-44 rounded-2xl border"
                variant="outlined"
                color="error"
                onClick={handleDeleteClose}
              >
                Annuler
              </Button>
              <Button
                className="w-44 rounded-2xl bg-red text-white"
                variant="contained"
                onClick={handleDeletePlaylist}
              >
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Box>
      </Dialog>

      <Snackbar
        open={localSnackbar.open}
        autoHideDuration={6000}
        onClose={() => setLocalSnackbar({...localSnackbar, open: false})}
      >
        <Alert 
          onClose={() => setLocalSnackbar({...localSnackbar, open: false})}
          severity={localSnackbar.severity}
          sx={{ width: '100%' }}
        >
          {localSnackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SubjectDetails;