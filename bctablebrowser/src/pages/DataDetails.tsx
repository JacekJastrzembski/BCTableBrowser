import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Checkbox, CircularProgress, Snackbar, Stack, Tooltip, Typography } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ItemsToSave, Table, UpdateTable } from '../api/api';
import { TableService } from '../api/TableService';

export default function DataDetails() {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const location = useLocation();
  const locTable = location.state as { table: Table };
  const [initialTable] = useState<Table>(locTable.table);
  const [table, setTable] = useState<Table>(locTable.table);
  const [editedSync, setEditedSync] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });

  const showSnackbar = (type: 'success' | 'error', message: string) => {
    setSnackbar({ open: true, type, message });
  };

  if (!table) {
    return <Typography color="error">Tabela nie została przekazana.</Typography>;
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nazwa kolumny',
      width: 350,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography>{params.value}</Typography>
          {params.row.configurationError && (
            <Tooltip title={params.row.configurationError} placement="bottom" arrow={true}>
              <Typography color="error" variant="body2">
                {params.row.configurationError.length > 45
                  ? `${params.row.configurationError.slice(0, 45)}...`
                  : params.row.configurationError}
              </Typography>
            </Tooltip>
          )}
        </Box>
      ),
    },
    { field: 'type', headerName: 'Typ', width: 300, minWidth: 200 },
    {
      field: 'isSynced',
      headerName: 'Synchronizowana?',
      width: 250,
      renderCell: (params) => (
        <Checkbox
          checked={editedSync[params.row.name]?.isSynced ?? params.value ?? false}
          onChange={(event) => handleCheckboxChange(event, params.row)}
          color="secondary"
        />
      ),
    },
  ];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    const isChecked = event.target.checked;

    setEditedSync((prev) => ({
      ...prev,
      [row.name]: { ...row, isSynced: isChecked },
    }));
    if (!table.isSynced && isChecked) {
      setTable((prevTable) => ({
        ...prevTable,
        isSynced: true,
      }));
      showSnackbar('success', 'Synchronizacja tabeli została automatycznie włączona.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedColumns = table.columns.map((column) =>
      editedSync[column.name] ? editedSync[column.name] : column
    );

    const hasColumnChanges = Object.keys(editedSync).length > 0;

    if (!hasColumnChanges) {
      showSnackbar('error', 'Brak zmian do zapisania.');
      setLoading(false);
      return;
    }

    const tableData: ItemsToSave = {
      name: table.name,
      columns: updatedColumns,
      isSynced: table.isSynced,
    };

    const payload: UpdateTable = {
      itemsToSave: [tableData],
    };

    try {
      await TableService.saveTable(payload);
      const updatedTable = { ...table, columns: updatedColumns, isSynced: table.isSynced };
      setTable(updatedTable);
      showSnackbar('success', 'Dane zapisane pomyślnie!');
      setEditedSync({});
      setTimeout(() => {
        navigate('/tables');
      }, 700);
    } catch (error) {
      console.error('Nie udało się zapisać danych:', error);
      showSnackbar('error', 'Nie udało się zapisać danych.');
    } finally {
      setLoading(false);
    }

  };

  const handleSyncToggle = async () => {
    const newSync = !table.isSynced;

    setTable((prevTable) => ({
      ...prevTable,
      isSynced: newSync,
    }));

    const tableData: ItemsToSave = {
      name: table.name,
      columns: table.columns,
      isSynced: newSync,
    };

    const payload: UpdateTable = {
      itemsToSave: [tableData],
    };

    try {
      await TableService.saveTable(payload);
      showSnackbar(
        'success',
        newSync
          ? `Udało się włączyć synchronizację tabelki ${table.name}!`
          : `Udało się wyłączyć synchronizację tabelki ${table.name}!`
      );
    } catch (error) {
      console.error('Nie udało się zapisać stanu synchronizacji:', error);
      showSnackbar('error', 'Nie udało się zapisać stanu synchronizacji.');
      setTable((prevTable) => ({
        ...prevTable,
        isSynced: !newSync,
      }));
    }
  };
  // Potrzebne do zmiany wyświetlania przycisku "Zaznacz wszystkie / Odznacz wszystkie"
  const allSelected = table.columns.every(
    (col) => editedSync[col.name]?.isSynced ?? col.isSynced
  );

  const handleSelectAllColumns = () => {
    const allSelected = table.columns.every(
      (col) => editedSync[col.name]?.isSynced ?? col.isSynced
    );

    const updatedColumns = Object.fromEntries(
      table.columns.map((col) => [
        col.name,
        { ...col, isSynced: !allSelected },
      ])
    );
    setEditedSync(updatedColumns);
    if (!table.isSynced && !allSelected) {
      setTable((prevTable) => ({
        ...prevTable,
        isSynced: true,
      }));

      showSnackbar('success', 'Synchronizacja tabeli została automatycznie włączona.');
    }
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleReset = () => {
    setTable(initialTable);
    setEditedSync({});
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
      <div className="container" style={{ marginLeft: '1rem', paddingTop: '0rem' }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ color: (theme) => theme.palette.secondary.light }} marginBottom={'0.5rem'} variant="h5">
            Szczegóły tabeli: <Typography component="span" variant="h5" sx={{ fontWeight: "bold", color: (theme) => theme.palette.secondary.main }}>{tableName}</Typography>
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1, paddingTop: '1rem' }}>
            <div style={{ width: '100%', maxHeight: '74dvh' }}>
              <DataGrid
                rows={table.columns}
                columns={columns}
                getRowId={(row) => row.name}
                checkboxSelection={false}
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2}>
              {table.isSynced
                ? (
                  <Button
                    sx={{ border: 1, fontWeight: "bold", }}
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={handleSyncToggle}
                  >
                    Wyłącz synchronizację
                  </Button>
                )
                : (
                  <Button
                    sx={{ border: 1, fontWeight: "bold" }}
                    type="button"
                    variant="contained"
                    color="success"
                    onClick={handleSyncToggle}
                  >
                    Włącz synchronizację
                  </Button>
                )}
              <Button
                sx={{ border: 1, fontWeight: "bold" }}
                type="submit"
                variant="contained"
                color="info"
                onClick={handleSave}
              >
                Zapisz
              </Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button sx={{ fontWeight: "bold" }} type="button" variant="outlined" color="inherit" onClick={handleSelectAllColumns}>
                {allSelected ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
              </Button>
              <Button sx={{ fontWeight: "bold" }} type="button" variant="text" color="warning" onClick={handleReset}>
                Przywróć poprzednie wartości
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.type}
            sx={(theme) => ({
              width: '100%',
              backgroundColor:
                snackbar.type === 'success'
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              color:
                snackbar.type === 'success'
                  ? theme.palette.success.contrastText
                  : theme.palette.error.contrastText,
              '& .MuiAlert-icon': {
                color:
                  snackbar.type === 'success'
                    ? theme.palette.success.contrastText
                    : theme.palette.error.contrastText,
              },
            })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1300,
            }}
          >
            <CircularProgress size={60} color="inherit" />
          </Box>
        )}
      </div>
  );
}