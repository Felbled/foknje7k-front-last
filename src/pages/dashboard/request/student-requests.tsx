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
  getAvailableSubjects,
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
  subjects: string;
  subjectCount: number;
  totalPrice: string;
}

type TableData = Record<string, any>;

const Requests = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RequestData | null>(null);
  const [data, setData] = useState<RequestData[]>([]);
  const [originalData, setOriginalData] = useState<RequestData[]>([]);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [slectedStatus, setSelectedStatus] = useState<"ACCEPTED" | "REJECTED">("ACCEPTED");
  const [confirmAction, setConfirmAction] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"asc" | "desc" | "none">("none");

  const fetchData = async () => {
    try {
      setLoading(true);
      const subjectsRes = await getAvailableSubjects();
      const subjectsArr = Array.isArray(subjectsRes) ? subjectsRes : subjectsRes.data || [];
      setSubjectsList(subjectsArr);

      const res = await getAllStudentRequests();

      const formattedData = res.data.map((item: any) => {
        const subjectCount = Array.isArray(item.subjectIds) ? item.subjectIds.length : 0;
        const unitPrice = item.studentOffer?.price ?? 0;
        const total = unitPrice * subjectCount;
        const isFree = total === 0;

        return {
          ...item,
          id: item.id,
          nom: item.studentName || "Inconnu",
          offerType: item.studentOffer?.title || "Type inconnu",
          status: item.status,
          createdAt: item.requestDate,
          startDate: item.startDate,
          endDate: item.status === "PENDING" ? "N/A" : item.endDate,
          paymentImageUrl: item.paymentImageUrl || "#",
          subjectCount: isFree ? "tous les matières" : subjectCount,
          totalPrice: isFree ? "Free" : `${total} TND`,
        };
      });

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

    if (searchName.trim()) {
      const searchTerm = searchName.toLowerCase().trim();
      filteredData = filteredData.filter((item) =>
        item.nom.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedStatusFilter !== "all") {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatusFilter
      );
    }

    if (dateFilter !== "none") {
      filteredData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        let comparison =
          dateFilter === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();

        if (comparison === 0) {
          comparison = dateFilter === "asc" ? a.id - b.id : b.id - a.id;
        }

        if (comparison === 0 && a.startDate && b.startDate) {
          const startA = new Date(a.startDate);
          const startB = new Date(b.startDate);
          comparison =
            dateFilter === "asc"
              ? startA.getTime() - startB.getTime()
              : startB.getTime() - startA.getTime();
        }

        return comparison;
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
        {requestRow.status === "PENDING" ? (
          <>
            <button
              className="px-3 py-1 text-white rounded-full bg-primary_bg"
              onClick={() => handleActionClick(requestRow, "Accepted", "ACCEPTED")}
            >
              Accept
            </button>
            <button
              onClick={() => handleActionClick(requestRow, "Rejected", "REJECTED")}
              className="px-3 py-1 text-white rounded-full bg-red"
            >
              Reject
            </button>
          </>
        ) : (
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
          className="px-3 py-1 text-white rounded-full bg-text"
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
    <div className="w-full p-1 lg:p-10">
      <div className="flex flex-col items-start justify-between w-full mb-5 space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-2xl text-title font-montserrat_bold md:text-3xl">
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
                },
              }}
            >
              Réinitialiser les filtres
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Chargement en cours...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <CustomTable
          title="Gérer Demandes des élèves"
          columns={[
            ...columnsRequestsStudent,
            {
              Header: "Nombre de matières",
              accessor: "subjectCount",
            },
            {
              Header: "Prix total",
              accessor: "totalPrice",
            },
          ]}
          data={data}
          actions={renderActions}
          status={renderStatus}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmer</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir {confirmAction.toLowerCase()} la demande de{" "}
          {selectedRow?.nom || "cet utilisateur"} ?
        </DialogContent>
        <DialogActions>
          <button
            className="px-2 py-1 text-white rounded bg-red"
            onClick={handleCloseConfirmDialog}
          >
            Annuler
          </button>
          <button
            className="px-2 py-1 text-white rounded bg-primary"
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
