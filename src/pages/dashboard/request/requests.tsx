import React, { useEffect, useState } from "react";
import CustomTable from "../../../shared/custom-table/custom-table";
import { columnsRequests } from "../../../mocks/fakeData";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  getAllTeacherRequests,
  respondOfferTeacherService,
} from "../../../services/teacher-offer";

const Requests = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [slectedStatus, setSelectedStatus] = useState<"ACCEPTED" | "REJECTED">(
    "ACCEPTED",
  );
  const [confirmAction, setConfirmAction] = useState("");
  const fetchData = () => {
    getAllTeacherRequests()
      .then((res) => {
        res.data = res.data.map((item: any) => {
          return {
            ...item,
            endDate: item.status === "PENDING" ? "N/A" : item.endDate,
          };
        });
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleActionClick = (
    row: any,
    action: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    setSelectedRow(row);
    setConfirmAction(action);
    setOpenConfirmDialog(true);
    setSelectedStatus(status);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedRow(null);
  };

  const handleActionConfirm = () => {
    respondOfferTeacherService(selectedRow.id, slectedStatus)
      .then(() => {
        fetchData();
        setOpenConfirmDialog(false);
        setSelectedRow(null);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const ActionButtons: React.FC<{ row: any }> = ({ row }) => (
    <div className="flex items-center justify-center space-x-2">
      <button
        className="bg-primary_bg px-3 py-1 text-white rounded-full"
        onClick={() => handleActionClick(row, "Accepted", "ACCEPTED")}
      >
        Accept
      </button>
      <button
        onClick={() => handleActionClick(row, "Rejected", "REJECTED")}
        className="bg-red text-white px-3 py-1 rounded-full"
      >
        Reject
      </button>
    </div>
  );
  const ActionStatus: React.FC<{ row: any }> = ({ row }) => (
    <div className="flex items-center justify-center space-x-2">
      <a
        className="bg-text px-3 py-1 text-white rounded-full"
        href={row.paymentImageUrl}
        target="_blank"
        rel="noreferrer"
      >
        Voir le Doc
      </a>
    </div>
  );

  const renderActions = (row: any) => <ActionButtons row={row} />;
  const renderStatus = (row: any) => <ActionStatus row={row} />;

  return (
    <div className="p-1 lg:p-10 w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 space-y-4 md:space-y-0">
        <h1 className="text-title font-montserrat_bold text-2xl md:text-3xl">
          Les Demandes des prof
        </h1>
      </div>
      <CustomTable
        title="Gérer Demandes des prof"
        columns={columnsRequests}
        data={data}
        actions={renderActions}
        status={renderStatus}
      />

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmer</DialogTitle>
        <DialogContent>
          Are you sure you want to {confirmAction.toLowerCase()} the request for{" "}
          {selectedRow?.nom}?
        </DialogContent>
        <DialogActions>
          <button
            className="bg-red px-2 py-1 text-white rounded"
            onClick={handleCloseConfirmDialog}
          >
            Cancel
          </button>
          <button
            className="bg-primary px-2 py-1 text-white rounded"
            onClick={handleActionConfirm}
          >
            {confirmAction}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Requests;
