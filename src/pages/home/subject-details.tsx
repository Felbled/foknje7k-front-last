import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Pdf } from "../../assets/svg";
import { getSubjectServiceById } from "../../services/subject-service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
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
import { 
  deletePlaylistService, 
  createPlayListService,
  updatePlayListService,
  deleteItemPlaylistService
} from "../../services/playList-service";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./subject-detail.css";

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
  description: string;
  videos: Video[];
  qcms: Resource[];
  fiches: Resource[];
  exercices: Resource[];
  corrections: Resource[];
  [key: string]: any;
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
  
  // Récupération du rôle utilisateur
  const role = useSelector((state: RootState) => state?.user?.userData?.role?.name);
  const isAdmin = role === "ROLE_ADMIN";

  const [subjectData, setSubjectData] = useState<SubjectData | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>("videos");
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteFileDialog, setOpenDeleteFileDialog] = useState(false);
  
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);
  const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null);
  const [fileToDelete, setFileToDelete] = useState<{
    id: number;
    type: string;
    playlistId: number;
  } | null>(null);
  
  const [localSnackbar, setLocalSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });
  
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    description: "",
  });
  
  const [editPlaylist, setEditPlaylist] = useState({
    title: "",
    description: "",
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

  const fileTypeMapping: Record<string, string> = {
    Video: "videos",
    Fiche: "fiches",
    Exercice: "exercices",
    Correction: "corrections",
    QCM: "qcms"
  };

  const statusToTypeMap: Record<string, string> = {
    videos: 'Video',
    qcms: 'QCM',
    fiches: 'Fiche',
    exercices: 'Exercice',
    corrections: 'Correction'
  };

  useEffect(() => {
    if (id) {
      fetchSubjectData();
    }
  }, [id]);

  const fetchSubjectData = () => {
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
  };

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

  const handleCreateOpen = () => setOpenCreateDialog(true);
  const handleCreateClose = () => {
    setOpenCreateDialog(false);
    setNewPlaylist({ title: "", description: "" });
  };

  const handleEditClick = (playlist: Playlist) => {
    setPlaylistToEdit(playlist);
    setEditPlaylist({
      title: playlist.title,
      description: playlist.description || ""
    });
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setPlaylistToEdit(null);
    setEditPlaylist({ title: "", description: "" });
  };

  const handleDeleteFileClick = (fileId: number, fileType: string) => {
    if (!activePlaylist) return;
    
    setFileToDelete({
      id: fileId,
      type: fileType,
      playlistId: activePlaylist.id
    });
    setOpenDeleteFileDialog(true);
  };

  const handleDeleteFileClose = () => {
    setOpenDeleteFileDialog(false);
    setFileToDelete(null);
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

  const handleCreatePlaylist = () => {
    if (!id) {
      showToast("ID du sujet non disponible", "error");
      return;
    }

    if (!newPlaylist.title.trim()) {
      showToast("Veuillez saisir un titre pour le chapitre", "error");
      return;
    }

    createPlayListService(Number(id), newPlaylist)
      .then(() => {
        fetchSubjectData();
        showToast("Chapitre créé avec succès", "success");
        handleCreateClose();
      })
      .catch((error) => {
        console.error("Failed to create playlist:", error);
        showToast("Échec de la création du chapitre", "error");
      });
  };

  const handleUpdatePlaylist = () => {
    if (!playlistToEdit || !id) {
      showToast("Données de modification invalides", "error");
      return;
    }

    if (!editPlaylist.title.trim()) {
      showToast("Veuillez saisir un titre pour le chapitre", "error");
      return;
    }

    updatePlayListService(playlistToEdit.id, Number(id), {
      title: editPlaylist.title,
      description: editPlaylist.description
    })
      .then(() => {
        fetchSubjectData();
        showToast("Chapitre modifié avec succès", "success");
        
        if (activePlaylist?.id === playlistToEdit.id) {
          setActivePlaylist({
            ...activePlaylist,
            title: editPlaylist.title,
            description: editPlaylist.description
          });
        }
        
        handleEditClose();
      })
      .catch((error) => {
        console.error("Failed to update playlist:", error);
        showToast("Échec de la modification du chapitre", "error");
      });
  };

  const handleDeleteFile = () => {
    if (!fileToDelete || !subjectData) return;

    deleteItemPlaylistService(fileToDelete.playlistId, fileToDelete.id)
      .then(() => {
        const updatedPlaylists = subjectData.playLists.map(playlist => {
          if (playlist.id === fileToDelete.playlistId) {
            const resourceType = fileTypeMapping[fileToDelete.type];
            return {
              ...playlist,
              [resourceType]: playlist[resourceType].filter(
                (item: any) => item.id !== fileToDelete.id
              )
            };
          }
          return playlist;
        });

        setSubjectData({
          ...subjectData,
          playLists: updatedPlaylists
        });

        if (activePlaylist && activePlaylist.id === fileToDelete.playlistId) {
          const updatedActivePlaylist = updatedPlaylists.find(
            pl => pl.id === activePlaylist.id
          );
          if (updatedActivePlaylist) {
            setActivePlaylist(updatedActivePlaylist);
          }
        }

        showToast("Fichier supprimé avec succès", "success");
      })
      .catch(error => {
        console.error("Failed to delete file:", error);
        showToast("Échec de la suppression du fichier", "error");
      })
      .finally(() => {
        handleDeleteFileClose();
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
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl md:text-2xl text-title font-montserrat_semi_bold">
              Les Chapitres
            </h2>
            
            {/* Bouton Ajouter chapitre (seulement pour admin) */}
            {isAdmin && (
              <button
                onClick={handleCreateOpen}
                className="bg-purple text-white rounded-full p-2 hover:bg-purple-700 transition-colors"
                aria-label="Ajouter un chapitre"
              >
                <AddIcon />
              </button>
            )}
          </div>
          <ul className="overflow-y-auto h-[65vh] hide-scrollbar">
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
                  
                  {/* Boutons Modifier/Supprimer (seulement pour admin) */}
                  {isAdmin && (
                    <div className="flex space-x-1">
                      <button
                        className="relative bg-[#3e38db] text-white px-3 py-1 rounded-full text-sm
                                 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                 hover:scale-[1.03] hover:shadow-lg hover:bg-blue-600
                                 active:scale-95 active:shadow-md
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                 group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(playlist);
                        }}
                        aria-label="Modifier"
                      >
                        <FontAwesomeIcon 
                          icon={faEdit} 
                          className="text-red-500 group-hover:text-red-300 transition-colors duration-200"
                        />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 
                                      group-hover:opacity-100 transition-opacity duration-200
                                      text-xs text-blue-500 text-[#3e38db] font-medium whitespace-nowrap">
                          Modifier
                        </span>
                      </button>
                      <button
                        className="relative bg-red  px-3 py-1 rounded-full text-sm
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
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full md:w-11/12 flex items-center flex-col bg-purple_bg p-4 md:p-10 rounded-xl">
        <div className="flex mb-4 w-full items-center justify-between flex-wrap">
          <div className="flex">
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
          
          {/* Bouton Ajouter un fichier (seulement pour admin) */}
          {isAdmin && activePlaylist && (
            <a
              href={`http://localhost:3000/dashboard/files?subjectId=${id}&playlistId=${activePlaylist.id}&type=${statusToTypeMap[activeStatus]}`}
              className="flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <InsertDriveFileIcon sx={{ fontSize: 20 }} />
              <span>Ajouter un fichier</span>
            </a>
          )}
        </div>

        <div className="w-full pt-10">
          {filteredResources.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {filteredResources
                .filter((item) => item.isCompleted === true)
                .sort((a, b) => a.id - b.id)
                .map((item) =>
                  activeStatus !== "videos" ? (
                    <li key={item.id} className="mb-2 list-none flex justify-between items-center">
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
                      
                      {/* Bouton Supprimer fichier (seulement pour admin) */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteFileClick(
                            item.id, 
                            statusToTypeMap[activeStatus]
                          )}
                          className="ml-4 text-red hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </li>
                  ) : (
                    <li
                      key={item.id}
                      className="list-none flex justify-between items-center"
                    >
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleVideoClick(item.url)}
                      >
                        <OndemandVideoIcon className="text-purple text-3xl" fontSize="large" />
                        <p className="ms-4 text-title text-lg font-montserrat_semi_bold">
                          {item.title}
                        </p>
                      </div>
                      
                      {/* Bouton Supprimer vidéo (seulement pour admin) */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteFileClick(
                            item.id, 
                            statusToTypeMap[activeStatus]
                          )}
                          className="ml-4 text-red hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </li>
                  )
                )}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-10">Aucune ressource disponible pour cette section.</p>
          )}
        </div>
      </div>

      {/* Dialog pour supprimer un chapitre */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose} fullWidth maxWidth="sm">
        <Box className="p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-2xl ">
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
                className="w-44 rounded-2xl border border-gray-400 text-gray-600 hover:bg-gray-50"
                variant="outlined"
                onClick={handleDeleteClose}
              >
                Annuler
              </Button>
              <Button
                className="w-44 rounded-2xl bg-red text-white hover:bg-red-700"
                variant="contained"
                onClick={handleDeletePlaylist}
              >
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Box>
      </Dialog>

      {/* Dialog pour créer un nouveau chapitre */}
      <Dialog open={openCreateDialog} onClose={handleCreateClose} fullWidth maxWidth="sm">
        <Box className="p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-2xl">
              Créer un nouveau chapitre
            </p>
            <IconButton onClick={handleCreateClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="space-y-6">
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-title font-medium mb-2">Titre du chapitre *</label>
                <input
                  type="text"
                  placeholder="Ex: Introduction à la programmation"
                  value={newPlaylist.title}
                  onChange={(e) => setNewPlaylist({...newPlaylist, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-title font-medium mb-2">Description</label>
                <textarea
                  placeholder="Ex: Ce chapitre couvre les bases de la programmation..."
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <Button
                className="w-44 rounded-2xl border border-gray-400 text-gray-600 hover:bg-gray-50"
                variant="outlined"
                onClick={handleCreateClose}
              >
                Annuler
              </Button>
              <Button
                className="w-44 rounded-2xl bg-purple text-white hover:bg-purple-700"
                variant="contained"
                onClick={handleCreatePlaylist}
              >
                Créer
              </Button>
            </div>
          </DialogContent>
        </Box>
      </Dialog>

      {/* Dialog pour modifier un chapitre */}
      <Dialog open={openEditDialog} onClose={handleEditClose} fullWidth maxWidth="sm">
        <Box className="p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-2xl">
              Modifier le chapitre
            </p>
            <IconButton onClick={handleEditClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="space-y-6">
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-title font-medium mb-2">Titre du chapitre *</label>
                <input
                  type="text"
                  placeholder="Ex: Introduction à la programmation"
                  value={editPlaylist.title}
                  onChange={(e) => setEditPlaylist({...editPlaylist, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-title font-medium mb-2">Description</label>
                <textarea
                  placeholder="Ex: Ce chapitre couvre les bases de la programmation..."
                  value={editPlaylist.description}
                  onChange={(e) => setEditPlaylist({...editPlaylist, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <Button
                className="w-44 rounded-2xl border border-gray-400 text-gray-600 hover:bg-gray-50"
                variant="outlined"
                onClick={handleEditClose}
              >
                Annuler
              </Button>
              <Button
                className="w-44 rounded-2xl bg-blue-500 text-white hover:bg-blue-600"
                variant="contained"
                onClick={handleUpdatePlaylist}
              >
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Box>
      </Dialog>

      {/* Dialog pour supprimer un fichier */}
      <Dialog open={openDeleteFileDialog} onClose={handleDeleteFileClose} fullWidth maxWidth="sm">
        <Box className="p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-2xl">
              Supprimer Fichier
            </p>
            <IconButton onClick={handleDeleteFileClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="space-y-6">
            <p>Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.</p>
            <div className="flex justify-end mt-6 space-x-4">
              <Button
                className="w-44 rounded-2xl border border-gray-400 text-gray-600 hover:bg-gray-50"
                variant="outlined"
                onClick={handleDeleteFileClose}
              >
                Annuler
              </Button>
              <Button
                className="w-44 rounded-2xl bg-red text-white hover:bg-red-700"
                variant="contained"
                onClick={handleDeleteFile}
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