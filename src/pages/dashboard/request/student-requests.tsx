import React, { useEffect, useState } from "react";
import CustomTable from "../../../shared/custom-table/custom-table";
import { columnsRequestsStudent } from "../../../mocks/fakeData";
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
  getAllStudentRequests,
  respondOfferService,
} from "../../../services/student-offer";

interface RequestData {
  id: number;
  nom: string;
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
  const [slectedStatus, setSelectedStatus] = useState<"ACCEPTED" | "REJECTED">("ACCEPTED");
  const [confirmAction, setConfirmAction] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [searchName, setSearchName] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"asc" | "desc" | "none">("none");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllStudentRequests();
      
      console.log("Données reçues de l'API:", res.data);
      
      const formattedData = res.data.map((item: any) => ({
        ...item,
        id: item.id,
        nom: item.studentName || "Inconnu",
        offerType: item.studentOffer?.title || "Type inconnu",
        status: item.status,
        createdAt: item.requestDate,
        startDate: item.startDate,
        endDate: item.status === "PENDING" ? "N/A" : item.endDate,
        paymentImageUrl: item.paymentImageUrl || "#",
      }));
      
      console.log("Données formatées:", formattedData);
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
    console.log("--- FILTRE DEBOGAGE ---");
    console.log("Original Data:", originalData);
    
    if (originalData.length === 0) {
      console.log("Données originales vides - retour");
      return;
    }

    let filteredData = [...originalData];
    console.log("Données initiales (après copie):", filteredData);

    // Filtre par nom
    if (searchName.trim()) {
      const searchTerm = searchName.toLowerCase().trim();
      console.log(`Filtre par nom: '${searchTerm}'`);
      
      filteredData = filteredData.filter(item => {
        const nom = item.nom.toLowerCase();
        console.log(`Item [${item.id}] nom: ${nom} - match: ${nom.includes(searchTerm)}`);
        return nom.includes(searchTerm);
      });
      console.log("Après filtre par nom:", filteredData);
    }

    // Filtre par statut
    if (selectedStatusFilter !== "all") {
      console.log(`Filtre par statut: ${selectedStatusFilter}`);
      
      filteredData = filteredData.filter(item => {
        console.log(`Item [${item.id}] statut: ${item.status} - match: ${item.status === selectedStatusFilter}`);
        return item.status === selectedStatusFilter;
      });
      console.log("Après filtre par statut:", filteredData);
    }

    // Tri par date avec critères multiples
    if (dateFilter !== "none") {
      console.log(`Tri par date: ${dateFilter}`);
      
      filteredData.sort((a, b) => {
        // 1. Comparaison par date de création (critère principal)
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        let comparison = dateFilter === "asc" 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
        
        // 2. Si les dates de création sont identiques, tri par ID
        if (comparison === 0) {
          console.log(`Dates identiques - tri par ID [${a.id} vs ${b.id}]`);
          comparison = dateFilter === "asc" 
            ? a.id - b.id 
            : b.id - a.id;
        }
        
        // 3. Si les IDs sont identiques (très improbable), tri par date de début
        if (comparison === 0 && a.startDate && b.startDate) {
          console.log(`IDs identiques - tri par date de début [${a.id}]`);
          const startA = new Date(a.startDate);
          const startB = new Date(b.startDate);
          comparison = dateFilter === "asc" 
            ? startA.getTime() - startB.getTime() 
            : startB.getTime() - startA.getTime();
        }
        
        console.log(
          `Comparaison finale [${a.id} vs ${b.id}]: ${comparison}`
        );
        
        return comparison;
      });
      console.log("Après tri par date:", filteredData);
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
      await respondOfferService(selectedRow.id, slectedStatus);
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
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 space-y-4 md:space-y-0">
        <h1 className="text-title font-montserrat_bold text-2xl md:text-3xl">
          Les Demandes des élèves
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
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#388E3C',
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
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Chargement en cours...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <CustomTable
          title="Gérer Demandes des élèves"
          columns={columnsRequestsStudent}
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