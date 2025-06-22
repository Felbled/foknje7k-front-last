import React, { useEffect, useState } from "react";
import CustomTable from "../../../shared/custom-table/custom-table";
import { columnsAds } from "../../../mocks/fakeData";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  getUserGroupService,
  makePublicGroupService,
} from "../../../services/group-service";

const Advertisement = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [profileData, setProfileData] = useState<any[]>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Privée");

  useEffect(() => {
    getUserGroupService()
      .then((res) => {
        setProfileData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleDeleteClick = (status: boolean, title: string, row: any) => {
    setSelectedRow(row);
    setStatus(status);
    setTitle(title);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRow(null);
  };

  const handleConfirm = () => {
    makePublicGroupService(selectedRow.id, status).then((res) => {
      getUserGroupService()
        .then((res) => {
          setProfileData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
      handleCloseDialog();
      setSelectedRow(null);
    });
  };

  const ActionButtons: React.FC<{ row: any }> = ({ row }) => (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => handleDeleteClick(true, "Public", row)}
        className="bg-primary px-2 py-1 text-white rounded"
      >
        Rendre le groupe public
      </button>
      <button
        onClick={() => handleDeleteClick(false, "Privée", row)}
        className="bg-red text-white px-2 py-1 rounded"
      >
        Rendre le groupe Privée
      </button>
    </div>
  );

  const renderActions = (row: any) => <ActionButtons row={row} />;
  const ActionButtonsStatus: React.FC<{ row: any }> = ({ row }) => (
    <p className="font-montserrat_regular text-title">
      {row.isPublic ? "Public" : "Privé"}
    </p>
  );

  const renderActionsStatus = (row: any) => <ActionButtonsStatus row={row} />;

  return (
    <div className="p-10">
      <div className="w-full flex justify-between items-center mb-5">
        <h1 className="text-title font-montserrat_bold  text-3xl">Publicité</h1>
        <div></div>
      </div>
      <CustomTable
        title="Gérer Publicités"
        columns={columnsAds}
        data={profileData}
        actions={renderActions}
        status={renderActionsStatus}
        statusName={"Status"}
      />
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer</DialogTitle>
        <DialogContent>
          Est ce que vous êtes sur de mettre ce class {title}?
        </DialogContent>
        <DialogActions>
          <button
            className="bg-red px-2 py-1 text-white rounded"
            onClick={handleCloseDialog}
          >
            Cancel
          </button>
          <button
            className="bg-primary px-2 py-1 text-white rounded"
            onClick={handleConfirm}
          >
            Confirmer
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Advertisement;
