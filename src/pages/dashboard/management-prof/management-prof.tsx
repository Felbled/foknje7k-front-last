import React, { useContext, useEffect, useState } from "react";
import CustomTable from "../../../shared/custom-table/custom-table";
import { columnsProf } from "../../../mocks/fakeData";
import {
  addTeacherToSuperTeacherService,
  getAllTeacherFromSuperTeacher,
  getAllUserByRole,
  removeTeacherToSuperTeacherService,
} from "../../../services/super-teacher";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../../../shared/custom-button/custom-button";
import { SnackbarContext } from "../../../config/hooks/use-toast";
import CustomAutocomplete from "../../../shared/custom-autoComplete/custom-autocomplete";

const ManagementProf = () => {
  const [data, setData] = useState<any>([]);
  const [teachers, setTeachers] = useState<any>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | number>(""); // Adjust type to accept number as well
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null); // For storing the selected row to delete
  const snackbarContext = useContext(SnackbarContext);

  useEffect(() => {
    getAllTeacherFromSuperTeacher()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    getAllUserByRole("ROLE_TEACHER")
      .then((res) => {
        const teacherOptions = res.data.map((teacher: any) => ({
          label: teacher.fullName,
          value: teacher.id,
        }));
        setTeachers(teacherOptions);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleAddClick = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const handleSave = () => {
    addTeacherToSuperTeacherService(selectedTeacher)
      .then((res) => {
        getAllTeacherFromSuperTeacher().then((res) => {
          setData(res.data);
        });
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Prof Ajouter avec succée",
            "success",
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
    handleCloseAddDialog();
  };

  const handleDeleteClick = (row: any) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRow(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedRow) {
      removeTeacherToSuperTeacherService(selectedRow.id)
        .then(() => {
          getAllTeacherFromSuperTeacher().then((res) => {
            setData(res.data);
          });
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succes",
              "Prof est supprimé avec succée",
              "success",
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    handleCloseDeleteDialog();
  };

  const ActionButtons: React.FC<{ row: any }> = ({ row }) => (
    <div className="flex items-center justify-center space-x-2">
      <button
        className={`px-5 py-1 text-white rounded-full bg-red`}
        onClick={() => handleDeleteClick(row)}
      >
        Supprimer
      </button>
    </div>
  );

  const renderActions = (row: any) => <ActionButtons row={row} />;

  return (
    <div className="p-1 lg:p-10 w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 space-y-4 md:space-y-0">
        <h1 className="text-title font-montserrat_bold text-2xl md:text-3xl">
          Gestion Prof
        </h1>
        <CustomButton text={"Ajouter Prof"} onClick={handleAddClick} />
      </div>

      <CustomTable
        title="Gérer Professeurs"
        columns={columnsProf}
        data={data}
        actions={renderActions}
      />

      {/* Add Teacher Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="md"
      >
        <Box className="p-4 md:p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-xl md:text-2xl">
              Ajouter Professeur
            </p>
            <IconButton onClick={handleCloseAddDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="space-y-6">
            <div className="mb-4">
              <label htmlFor="select-teacher">Choisir Enseignant</label>
              <CustomAutocomplete
                options={teachers}
                value={selectedTeacher}
                onChange={(value) => setSelectedTeacher(value)}
                placeholder="Professeur..."
              />
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <Button
                className="w-full md:w-44 rounded-2xl border"
                variant="outlined"
                color={"error"}
                onClick={handleCloseAddDialog}
              >
                Annuler
              </Button>
              <CustomButton
                text={"Enregister"}
                width={"w-full md:w-44"}
                onClick={handleSave}
              />
            </div>
          </DialogContent>
        </Box>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer cet enseignant ?</p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDeleteDialog}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManagementProf;
