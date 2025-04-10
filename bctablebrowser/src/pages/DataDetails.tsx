import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Checkbox, Snackbar, Stack, Tooltip, Typography } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ItemsToSave, saveSynchronizableTables, Table, UpdateTable } from '../api/api';

export default function DataDetails() {
  const navigate = useNavigate();
  const { tableName } = useParams();
  const location = useLocation();
  const locTable = location.state as { table: Table };
  const [table, setTable] = useState<Table>(locTable.table);
  const [editedSync, setEditedSync] = useState<Record<string, any>>({});
  const [isTableSyncChanged, setIsTableSyncChanged] = useState<boolean | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });

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

  const handleSyncToggle = () => {
    setIsTableSyncChanged((prev) => (prev === null ? !table.isSynced : !prev));
  };

  const handleSave = async () => {
    const updatedColumns = table.columns.map((column) =>
      editedSync[column.name] ? editedSync[column.name] : column
    );

    const hasColumnChanges = Object.keys(editedSync).length > 0;
    const hasTableSyncChange = isTableSyncChanged !== null;

    if (!hasColumnChanges && !hasTableSyncChange) {
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
      isSynced: hasTableSyncChange ? isTableSyncChanged : table.isSynced,
    };
    
    const payload: UpdateTable = {
      itemsToSave: [tableData],
    };

    try {
      const updatedTable = await saveSynchronizableTables(payload);
      setSnackbar({
        open: true,
        type: 'success',
        message: 'Dane zapisane pomyślnie!',
      });
      setTable(updatedTable);
      setEditedSync({});
      setIsTableSyncChanged(null);
      setTimeout(() => {
        navigate('/tables');
      }, 300);
    } catch (error) {
      console.error('Nie udało się zapisać danych:', error);
      setSnackbar({
        open: true,
        type: 'error',
        message: 'Nie udało się zapisać danych.',
      });
    }
  };

  const handleReset = () => {
    setEditedSync({});
    setIsTableSyncChanged(null);
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="container" style={{ marginLeft: '1rem', padding: '1rem' }}>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ color: (theme) => theme.palette.secondary.light }} marginBottom={'1rem'} variant="h5">
          Szczegóły tabeli: {tableName}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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
            {table.isSynced ? (
              <Button type="button" variant="contained" color="error" onClick={handleSyncToggle}>
                Wyłącz synchronizację
              </Button>
            ) : (
              <Button type="button" variant="contained" color="success" onClick={handleSyncToggle}>
                Włącz synchronizację
              </Button>
            )}
            <Button type="submit" variant="contained" color="info" onClick={handleSave}>
              Zapisz
            </Button>
          </Stack>
          <Button type="button" variant="text" color="warning" onClick={handleReset}>
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
        <Alert onClose={handleSnackbarClose} severity={snackbar.type} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}