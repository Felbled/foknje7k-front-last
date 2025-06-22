import React, { useContext, useEffect, useState } from "react";
import CustomTable from "../../../shared/custom-table/custom-table";
import { columnsProf, columnsStudent } from "../../../mocks/fakeData";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import {
  getAllStudentFromSuperTeacher,
  getAllUserByRole,
} from "../../../services/super-teacher";
import {
  addStudentGroupService,
  RemoveStudentGroupService,
  getUserGroupService,
} from "../../../services/group-service";
import CustomButton from "../../../shared/custom-button/custom-button";
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { SnackbarContext } from "../../../config/hooks/use-toast";
import CustomAutocomplete from "../../../shared/custom-autoComplete/custom-autocomplete";

const ManagementStudent = () => {
  const id = useSelector((state: RootState) => state?.user?.userData?.id);
  const [data, setData] = useState<any>([]);
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [student, setStudent] = useState<any>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>("");
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [deleteGroup, setDeleteGroup] = useState<number | null>(null);
  const snackbarContext = useContext(SnackbarContext);

  useEffect(() => {
    getAllStudentFromSuperTeacher()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    getAllUserByRole("ROLE_STUDENT")
      .then((res) => {
        const teacherOptions = res.data.map((student: any) => ({
          label: student.fullName,
          value: student.id,
        }));
        setStudent(teacherOptions);
      })
      .catch((e) => {
        console.log(e);
      });
    getUserGroupService()
      .then((res) => {
        const groupOptions = res.data.map((group: any) => ({
          label: group.title,
          value: group.id,
        }));
        setGroupOptions(groupOptions);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleAddClick = () => setOpenAddDialog(true);
  const handleAddClose = () => setOpenAddDialog(false);
  const handleDeleteClick = (row: any) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };
  const handleDeleteClose = () => setOpenDeleteDialog(false);

  const handleSave = () => {
    addStudentGroupService(selectedGroup, selectedStudent)
      .then((res) => {
        getAllStudentFromSuperTeacher()
          .then((res) => {
            setData(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
        if (snackbarContext) {
          snackbarContext.showMessage(
            "Succes",
            "Elève ajouter avec succée",
            "success",
          );
        }
        handleAddClose();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = () => {
    if (selectedRow && deleteGroup) {
      RemoveStudentGroupService(deleteGroup, selectedRow.id)
        .then(() => {
          getAllStudentFromSuperTeacher()
            .then((res) => {
              setData(res.data);
            })
            .catch((e) => {
              console.log(e);
            });
          if (snackbarContext) {
            snackbarContext.showMessage(
              "Succes",
              "Élève est supprimé avec succée",
              "success",
            );
          }
          handleDeleteClose();
        })
        .catch((e) => {
          console.log(e);
        });
    }
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
  const ActionStatus: React.FC<{ row: any }> = ({ row }) => (
    <div className="flex items-center justify-center space-x-2">
      <div>
        {row?.groups
          ?.filter((item: any) => item.superTeacherId === id)
          .map((group: any) => group.title)
          .join(" ,  ")}
      </div>
    </div>
  );

  const renderActions = (row: any) => <ActionButtons row={row} />;
  const renderStatus = (row: any) => <ActionStatus row={row} />;

  return (
    <div className="p-1 lg:p-10 w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 space-y-4 md:space-y-0">
        <h1 className="text-title font-montserrat_bold text-2xl md:text-3xl">
          Gestion éleves
        </h1>
        <CustomButton text={"Ajouter éleves"} onClick={handleAddClick} />
      </div>

      <CustomTable
        title="Gérer éleves"
        columns={columnsStudent}
        //@ts-ignore
        data={[...new Map(data.map((item) => [item.id, item])).values()]}
        actions={renderActions}
        status={renderStatus}
        statusName={"Groups"}
      />

      {/* Add Student Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleAddClose}
        fullWidth
        maxWidth="md"
      >
        <Box className="p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-2xl">
              Ajouter éleves
            </p>
            <IconButton onClick={handleAddClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="space-y-6">
            <FormControl fullWidth className="mb-4">
              <label id="select-student-label">Choisir éleves</label>
              <CustomAutocomplete
                options={student}
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e)}
                placeholder="élève..."
              />
            </FormControl>

            <FormControl fullWidth className="mb-4">
              <label>Choisir Groupe</label>
              <Select
                labelId="select-group-label"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value as number)}
              >
                {groupOptions.map((group: any) => (
                  <MenuItem key={group.value} value={group.value}>
                    {group.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="flex justify-end mt-6 space-x-4">
              <Button
                className={"w-44 rounded-2xl border"}
                variant="outlined"
                color={"error"}
                onClick={handleAddClose}
              >
                Annuler
              </Button>
              <CustomButton
                text={"Enregister"}
                width={"w-44"}
                onClick={handleSave}
              />
            </div>
          </DialogContent>
        </Box>
      </Dialog>

      {/* Delete Student Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        fullWidth
        maxWidth="md"
      >
        <Box className="p-6">
          <DialogTitle className="flex justify-between items-center">
            <p className="text-title font-montserrat_bold text-2xl">
              Supprimer éleves
            </p>
            <IconButton onClick={handleDeleteClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="space-y-6">
            <p>Êtes-vous sûr de vouloir supprimer cet élève du groupe ?</p>
            <FormControl fullWidth className="mb-4">
              <label>Choisir Groupe à supprimer</label>
              <Select
                labelId="select-delete-group-label"
                value={deleteGroup}
                onChange={(e) => setDeleteGroup(e.target.value as number)}
              >
                {selectedRow?.groups
                  ?.filter((item: any) => item.superTeacherId === id)
                  .map((group: any) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <div className="flex justify-end mt-6 space-x-4">
              <Button
                className={"w-44 rounded-2xl border"}
                variant="outlined"
                color={"error"}
                onClick={handleDeleteClose}
              >
                Annuler
              </Button>
              <CustomButton
                text={"Supprimer"}
                width={"w-44"}
                onClick={handleDelete}
              />
            </div>
          </DialogContent>
        </Box>
      </Dialog>
    </div>
  );
};

export default ManagementStudent;
