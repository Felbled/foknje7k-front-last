import React, { useEffect, useState } from "react";
import CustomTable from "../../../shared/custom-table/custom-table";
import { columnsRequests } from "../../../mocks/fakeData";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Button,
} from "@mui/material";
import {
  getAllTeacherRequests,
  respondOfferTeacherService,
} from "../../../services/teacher-offer";

interface RequestData {
  id: number;
  nom: string; // Changé pour garantir que nom existe toujours
  offerType: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  startDate: string;
  endDate: string;
  paymentImageUrl: string;
}

type TableData = Record<string, any>;

const Requests = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RequestData | null>(null);
  const [data, setData] = useState<RequestData[]>([]);
  const [originalData, setOriginalData] = useState<RequestData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"ACCEPTED" | "REJECTED">("ACCEPTED");
  const [confirmAction, setConfirmAction] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [searchName, setSearchName] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"asc" | "desc" | "none">("none");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllTeacherRequests();
      
      console.log("Données reçues de l'API:", res.data); // Debug
      
      const formattedData = res.data.map((item: any) => ({
        ...item,
        id: item.id,
        nom: item.superTeacherName || "Inconnu",
        offerType: item.teacherOffer?.title || "Type inconnu",
        status: item.status,
        createdAt: item.requestDate,
        startDate: item.startDate,
        endDate: item.status === "PENDING" ? "N/A" : item.endDate,
        paymentImageUrl: item.paymentImageUrl || "#",
      }));
      
      console.log("Données formatées:", formattedData); // Debug
      setData(formattedData);
      setOriginalData(formattedData);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (originalData.length === 0) return;

    let filteredData = [...originalData];

    // Filtre par nom
    if (searchName.trim()) {
      const searchTerm = searchName.toLowerCase().trim();
      filteredData = filteredData.filter(item => {
        const nom = item.nom.toLowerCase();
        return nom.includes(searchTerm);
      });
    }

    // Filtre par statut
    if (selectedStatusFilter !== "all") {
      filteredData = filteredData.filter(item => item.status === selectedStatusFilter);
    }

    // Tri par date
    if (dateFilter !== "none") {
      filteredData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateFilter === "asc" 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      });
    }

    setData(filteredData);
  }, [searchName, selectedStatusFilter, dateFilter, originalData]);

  const handleResetFilters = () => {
    setSearchName("");
    setSelectedStatusFilter("all");
    setDateFilter("none");
    setData(originalData);
  };

  const handleActionClick = (
    row: RequestData,
    action: string,
    status: "ACCEPTED" | "REJECTED"
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

  const handleActionConfirm = async () => {
    if (!selectedRow) return;
    
    try {
      await respondOfferTeacherService(selectedRow.id, selectedStatus);
      await fetchData();
      setOpenConfirmDialog(false);
      setSelectedRow(null);
    } catch (e) {
      console.error("Error responding to offer:", e);
    }
  };

  const renderActions = (row: TableData) => {
    const requestRow = row as RequestData;
    return (
      <div className="flex items-center justify-center space-x-2">
        {requestRow.status === "PENDING" && (
          <>
            <button
              className="bg-primary_bg px-3 py-1 text-white rounded-full"
              onClick={() => handleActionClick(requestRow, "Accepted", "ACCEPTED")}
            >
              Accept
            </button>
            <button
              onClick={() => handleActionClick(requestRow, "Rejected", "REJECTED")}
              className="bg-red text-white px-3 py-1 rounded-full"
            >
              Reject
            </button>
          </>
        )}
        {requestRow.status !== "PENDING" && (
          <span className="text-gray-500">
            {requestRow.status === "ACCEPTED" ? "Accepted" : "Rejected"}
          </span>
        )}
      </div>
    );
  };

  const renderStatus = (row: TableData) => {
    const requestRow = row as RequestData;
    return (
      <div className="flex items-center justify-center space-x-2">
        <a
          className="bg-text px-3 py-1 text-white rounded-full"
          href={requestRow.paymentImageUrl}
          target="_blank"
          rel="noreferrer"
        >
          Voir le Doc
        </a>
      </div>
    );
  };

  return (
    <div className="p-1 lg:p-10 w-full">
      <div className=" w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 space-y-4 md:space-y-0">
        <h1 className="text-title font-montserrat_bold text-2xl md:text-3xl">
          Les Demandes des prof
        </h1>
      </div>

      {/* Filtres */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Rechercher par nom"
              variant="outlined"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={selectedStatusFilter}
                label="Statut"
                onChange={(e) => setSelectedStatusFilter(e.target.value as string)}
              >
                <MenuItem value="all">Tous les statuts</MenuItem>
                <MenuItem value="PENDING">En attente</MenuItem>
                <MenuItem value="ACCEPTED">Accepté</MenuItem>
                <MenuItem value="REJECTED">Rejeté</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tri par date</InputLabel>
              <Select
                value={dateFilter}
                label="Tri par date"
                onChange={(e) => setDateFilter(e.target.value as "asc" | "desc" | "none")}
              >
                <MenuItem value="none">Aucun tri</MenuItem>
                <MenuItem value="asc">Plus ancien</MenuItem>
                <MenuItem value="desc">Plus récent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
           <Button
  fullWidth
  variant="contained"
  onClick={handleResetFilters}
  sx={{ 
    height: '56px',
    backgroundColor: '#4CAF50', // Vert standard
    '&:hover': {
      backgroundColor: '#388E3C', // Vert plus foncé au survol
    }
  }}
>
  Réinitialiser les filtres
</Button>
          </Grid>
        </Grid>
      </Box>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex justify-center items-center h-64 ">
          <p className="text-lg text-gray-500">Chargement en cours...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <CustomTable
          title="Gérer Demandes des prof"
          columns={columnsRequests}
          data={data}
          actions={renderActions}
          status={renderStatus}
        />
      )}

      {/* Dialogue de confirmation */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmer</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir {confirmAction.toLowerCase()} la demande de{" "}
          {selectedRow?.nom || "cet utilisateur"} ?
        </DialogContent>
        <DialogActions>
          <button
            className="bg-red px-2 py-1 text-white rounded"
            onClick={handleCloseConfirmDialog}
          >
            Annuler
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