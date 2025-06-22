import React, { useContext, useEffect, useState } from "react";
import CustomInput from "../../../shared/custom-input/custom-input";
import CustomButton from "../../../shared/custom-button/custom-button";
import CustomSelect from "../../../shared/custom-select/custom-select";
import {
  getAllSubjectsByGroupId,
  getAllUserSubjectService,
} from "../../../services/subject-service";
import {
  createPlayListService,
  deletePlaylistService,
  updatePlayListService,
} from "../../../services/playList-service";
import { SnackbarContext } from "../../../config/hooks/use-toast";
import { getUserGroupService } from "../../../services/group-service";
const ManagementCourse = () => {
  const [subject, setSubjects] = useState<any>([]);
  const [allSubjects, setAllSubjects] = useState<any>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const snackbarContext = useContext(SnackbarContext);
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null); // New state for selected group
  const [createPlaylistData, setCreatePlaylistData] = useState({
    title: "",
    description: "",
    subjectId: "",
  });

  const [deletePlaylistData, setDeletePlaylistData] = useState({
    selectedSubject: "",
    selectedMatiere: "",
  });
  const [modifyPlaylistData, setModifyPlaylistData] = useState({
    title: "",
    description: "",
    selectedOption: "",
    selectedPlaylist: "",
  });

  useEffect(() => {
    getUserGroupService()
      .then((res) => {
        const options = res.data.map((group: any) => ({
          label: group.title,
          value: group.id,
        }));
        console.log(options);
        setSelectedGroupId(options[0].value);
        setGroupOptions(options);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      getAllSubjectsByGroupId(selectedGroupId)
        .then((res) => {
          const subjectsOptions = res.data.map((item: any) => ({
            label: item.speciality,
            value: item.id,
          }));
          setAllSubjects(res.data);
          setSubjects(subjectsOptions);
        })
        .catch((e) => {
          console.log(e);
        });
        
      setDeletePlaylistData({ selectedSubject: "", selectedMatiere: "" });
      setModifyPlaylistData({
        selectedOption: "",
        selectedPlaylist: "",
        title: "",
        description: "",
      });
      setCreatePlaylistData({ title: "", description: "", subjectId: "" });
    } else {
      setSubjects([]); // Clear subjects if no group is selected
      setAllSubjects([]);
    }
  }, [selectedGroupId]); // Update the effect dependency to selectedGroupId

  const selectPlaylistBySubject = (subjectId: string) => {
    const filteredValue = allSubjects.filter(
      (item: { id: number }) => item.id === Number(subjectId),
    );
    const Playlist = filteredValue[0]?.playLists.map((item: any) => ({
      label: item.title,
      value: item.id,
    }));
    setPlaylists(Playlist || []);
  };

  useEffect(() => {
    if (createPlaylistData.subjectId) {
      selectPlaylistBySubject(createPlaylistData.subjectId);
    }
  }, [createPlaylistData.subjectId]);

  useEffect(() => {
    if (deletePlaylistData.selectedSubject) {
      selectPlaylistBySubject(deletePlaylistData.selectedSubject);
      setDeletePlaylistData({...deletePlaylistData, selectedMatiere: ""});
    }
  }, [deletePlaylistData.selectedSubject]);

  useEffect(() => {
    if (modifyPlaylistData.selectedOption) {
      selectPlaylistBySubject(modifyPlaylistData.selectedOption);
    }
  }, [modifyPlaylistData.selectedOption]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    card: string,
  ) => {
    const { name, value } = event.target;
    if (card === "create") {
      setCreatePlaylistData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (card === "modify") {
      setModifyPlaylistData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    card: string,
  ) => {
    const { name, value } = event.target;
    if (name === "classId") {
      setSelectedGroupId(Number(value));
      console.log(value);
    } else if (card === "create") {
      setCreatePlaylistData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (card === "delete") {
      setDeletePlaylistData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (card === "modify") {
      setModifyPlaylistData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCreatePlaylist = () => {
    const { subjectId, ...selectedData } = createPlaylistData;
    if(selectedData.title === "" || selectedData.description === "" || subjectId === "") {
      if (snackbarContext) {
        snackbarContext.showMessage(
          "Erreur",
          "Veuillez remplir les champs",
          "error",
        );
      }
      return;
    }
    createPlayListService(Number(subjectId), selectedData)
      .then((res) => {
        setCreatePlaylistData({
          subjectId: "",
          title: "",
          description: "",
        });
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Chapitre Crée avec succée",
            "success",
          );
        }
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeletePlaylist = () => {

    if(deletePlaylistData.selectedMatiere === "") {
      if (snackbarContext) {
        snackbarContext.showMessage(
          "Erreur",
          "Veuillez selectionner un Chapitre",
          "error",
        );
      }
      return;
    }

    deletePlaylistService(Number(deletePlaylistData.selectedMatiere))
      .then((res) => {
        setDeletePlaylistData({ selectedMatiere: "", selectedSubject: "" });
        setPlaylists([]);
        window.location.reload();
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Chapitre est Supprimé avec succée",
            "success",
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleModifyPlaylist = () => {
    const { selectedPlaylist, selectedOption, ...selectedData } =
      modifyPlaylistData;
    
    if(selectedData.title === "" || selectedData.description === "" || selectedOption === "" || selectedPlaylist === "") {
      if (snackbarContext) {
        snackbarContext.showMessage(
          "Erreur",
          "Veuillez remplir les champs",
          "error",
        );
      }
      return;
    }
    updatePlayListService(
      Number(selectedPlaylist),
      Number(selectedOption),
      selectedData,
    )
      .then((res) => {
        setModifyPlaylistData({
          selectedOption: "",
          selectedPlaylist: "",
          title: "",
          description: "",
        });
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Chapitreest  Modifie avec succée",
            "success",
          );
        }
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="p-4 md:p-10 w-[90vw] lg:w-full mb-10 overflow-x-hidden">
      <div className="w-full flex flex-col items-center md:flex-row justify-between mb-5">
        <h1 className="text-title text-xl md:text-2xl font-montserrat_semi_bold mb-6 md:mb-10">
          Gestion des cours
        </h1>
        <CustomSelect
          placeholder={"Select Class"}
          customStyle="me-3"
          width={"w-full md:w-1/6 "}
          options={groupOptions}
          onChange={(e) => {
            console.log(e);
            setSelectedGroupId(Number(e.target.value));
          }}
          name="classId"
          //@ts-ignore
          value={selectedGroupId}
        />
      </div>

      <div className="bg-white rounded-3xl lg:w-11/12 md:px-14 md:py-10">
        <div className="flex flex-col md:flex-row items-center w-11/12 md:w-full mb-6 md:mb-10 justify-between">
          <div className="shadow-xl w-full md:w-1/2 mb-6 md:mb-0 rounded-3xl lg:me-2 p-6 md:p-10">
            <div className="text-title text-lg mb-3 md:mb-5 font-montserrat_semi_bold">
              Crée Chapitre
            </div>
            <CustomSelect
              placeholder={"Selectionner matière"}
              name="subjectId"
              value={createPlaylistData.subjectId}
              onChange={(e) => handleSelectChange(e, "create")}
              options={subject}
            />
            <div className="flex flex-col md:flex-row justify-between items-center mb-3">
              <CustomInput
                placeholder={"Titre du Chapitre"}
                name="title"
                value={createPlaylistData.title}
                onChange={(e) => handleInputChange(e, "create")}
                CustomStyle={"w-full md:me-3"}
              />
              <CustomInput
                placeholder={"Description du Chapitre"}
                name="description"
                value={createPlaylistData.description}
                onChange={(e) => handleInputChange(e, "create")}
                CustomStyle={"w-full mt-3 md:mt-0"}
              />
            </div>
            <div className="flex justify-end">
              <CustomButton
                text={"Crée"}
                width={"w-1/2 md:w-1/3"}
                className={"text-sm"}
                onClick={handleCreatePlaylist}
              />
            </div>
          </div>

          {/* Delete Playlist Card */}
          <div className="shadow-xl w-full md:w-1/2 rounded-3xl p-6 md:p-10">
            <div className="text-title text-lg mb-3 md:mb-5 font-montserrat_semi_bold">
              Supprimer Chapitre
            </div>
            <div className="flex flex-col justify-between items-center mb-3">
              <CustomSelect
                placeholder={"selectinner Matière"}
                name="selectedSubject"
                value={deletePlaylistData.selectedSubject}
                onChange={(e) => handleSelectChange(e, "delete")}
                options={subject}
              />
              <CustomSelect
                placeholder={"selectinner Chapitre"}
                name="selectedMatiere"
                value={deletePlaylistData.selectedMatiere}
                onChange={(e) => handleSelectChange(e, "delete")}
                options={playlists}
              />
            </div>
            <div className="flex justify-end">
              <CustomButton
                text={"Supprimer"}
                className={"bg-red"}
                onClick={handleDeletePlaylist}
              />
            </div>
          </div>
        </div>

        {/* Modify Playlist Card */}
        <div className="shadow-xl w-full max-w-full lg:w-5/6 rounded-3xl p-6 md:p-10">
          <div className="text-title text-lg mb-3 md:mb-5 font-montserrat_semi_bold">
            Modifier Chapitre
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <CustomSelect
              placeholder={"selectinner Matière"}
              name="selectedOption"
              value={modifyPlaylistData.selectedOption}
              onChange={(e) => handleSelectChange(e, "modify")}
              options={subject}
              customStyle={"md:me-5 -mt-3"}
            />
            <CustomSelect
              placeholder={"selectinner Chapitre"}
              name="selectedPlaylist"
              value={modifyPlaylistData.selectedPlaylist}
              onChange={(e) => handleSelectChange(e, "modify")}
              options={playlists}
              customStyle={"md:me-5 -mt-3"}
            />
            <CustomInput
              placeholder={"Titre du Chapitre"}
              name="title"
              value={modifyPlaylistData.title}
              onChange={(e) => handleInputChange(e, "modify")}
              CustomStyle={"w-full md:me-3"}
            />
            <CustomInput
              placeholder={"Description du Chapitre"}
              name="description"
              value={modifyPlaylistData.description}
              onChange={(e) => handleInputChange(e, "modify")}
              CustomStyle={"w-full mt-3 md:mt-0"}
            />
          </div>
          <div className="flex justify-end">
            <CustomButton
              text={"Modifier"}
              className={"w-1/2 md:w-1/3"}
              onClick={handleModifyPlaylist}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementCourse;
