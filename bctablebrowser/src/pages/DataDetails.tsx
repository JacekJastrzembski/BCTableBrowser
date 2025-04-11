import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Checkbox, Snackbar, Stack, Tooltip, Typography } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ItemsToSave, saveSynchronizableTables, Table, UpdateTable, saveJsonTableData } from '../api/api';

export default function DataDetails() {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const location = useLocation();
  const locTable = location.state as { table: Table };
  const [table, setTable] = useState<Table>(locTable.table);
  const [editedSync, setEditedSync] = useState<Record<string, any>>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });
  const useJsonData = import.meta.env.VITE_USE_JSON_DATA === 'true' ? true : false;

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
    setEditedSync((prev) => ({
      ...prev,
      [row.name]: { ...row, isSynced: event.target.checked },
    }));
  };

  const handleSave = async () => {
    const updatedColumns = table.columns.map((column) =>
      editedSync[column.name] ? editedSync[column.name] : column
    );

    const hasColumnChanges = Object.keys(editedSync).length > 0;

    if (!hasColumnChanges) {
      setSnackbar({
        open: true,
        type: 'error',
        message: 'Brak zmian do zapisania.',
      });
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
      if (!useJsonData) {
        const updatedTable = await saveSynchronizableTables(payload);
        setTable(updatedTable);
      } else {
        if (!table.id) {
          throw new Error('Table ID is undefined.');
        }
        const updatedTable = await saveJsonTableData(table.id, tableData);
        setTable(updatedTable);
      }
      setSnackbar({
        open: true,
        type: 'success',
        message: 'Dane zapisane pomyślnie!',
      });
      setEditedSync({});
      setTimeout(() => {
        navigate('/tables');
      }, 500);
    } catch (error) {
      console.error('Nie udało się zapisać danych:', error);
      setSnackbar({
        open: true,
        type: 'error',
        message: 'Nie udało się zapisać danych.',
      });
    }
  };

  const handleSyncToggle = async () => {
    const newSync = !table.isSynced;

    const tableData: ItemsToSave = {
      name: table.name,
      columns: table.columns,
      isSynced: newSync,
    };

    const payload: UpdateTable = {
      itemsToSave: [tableData],
    };

    try {
      if (!useJsonData) {
        const updatedTable = await saveSynchronizableTables(payload);
        setTable(updatedTable);
      } else {
        if (!table.id) {
          throw new Error('Table ID is undefined.');
        }
        const updatedTable = await saveJsonTableData(table.id, tableData);
        setTable(updatedTable);
      }
      setSnackbar({
        open: true,
        type: 'success',
        message: newSync
          ? `Udało się włączyć synchronizację tabelki ${table.name}!`
          : `Udało się wyłączyć synchronizację tabelki ${table.name}!`
      });
    } catch (error) {
      console.error('Nie udało się zapisać synchronizacji:', error);
      setSnackbar({
        open: true,
        type: 'error',
        message: 'Nie udało się zapisać synchronizacji.',
      });
    }
  };

  const handleReset = () => {
    setEditedSync({});
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="container" style={{ marginLeft: '1rem', padding: '1rem', paddingTop: '0rem' }}>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ color: (theme) => theme.palette.secondary.light }} marginBottom={'1rem'} variant="h5">
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
          <Button sx={{ fontWeight: "bold" }} type="button" variant="text" color="warning" onClick={handleReset}>
            Przywróć poprzednie wartości
          </Button>
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
            // fontWeight: 'bold',
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
    </div>
  );
}