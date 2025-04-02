import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Checkbox, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import data from '../assets/data.json';
import { useState } from 'react';

interface Table {
  name: string;
  columns: Array<{ name: string; type: string; isSynced?: boolean }>;
  isSynced?: boolean;
}

interface RouteParams extends Record<string, string | undefined> {
  tableName?: string;
}

export default function DataDetails() {
  const { tableName } = useParams<RouteParams>();
  const [editedSync, setEditedSync] = useState<Record<string, any>>({});

  const table = data.itemsToSave.find((t: Table) => t.name === tableName);
  if (!table) {
    return <Typography color='warning'>Tabela nie znaleziona</Typography>;
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nazwa kolumny', width: 350, minWidth: 200 },
    { field: 'type', headerName: 'Typ', width: 300, minWidth: 200 },
    {
      field: 'isSynced',
      headerName: 'Synchronizowana?',
      width: 250,
      renderCell: (params) => (
        <Checkbox
          checked={editedSync[params.row.name]?.isSynced ?? params.value ?? false}
          onChange={(event) => handleCheckboxChange(event, params.row)}
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
    const updatedColumns = Object.values(editedSync);
    console.log('Zapisz:', updatedColumns);

    if (updatedColumns.length === 0) {
      console.log('Brak zmian do zapisania.');
      return;
    }

    const allColumnsSynced = table.columns.every((column) => {
      const updatedColumn = updatedColumns.find((uc) => uc.name === column.name);
      return updatedColumn ? updatedColumn.isSynced : column.isSynced ?? false;
    });

    const payload = {
      name: table.name,
      columns: updatedColumns,
      isSynced: allColumnsSynced,
    };
    console.log(payload);

  };


  const handleSyncChange = () => {
    const syncedCount = table.columns.reduce((count, column) => {
      const isSynced = editedSync[column.name]?.isSynced ?? column.isSynced ?? false;
      return isSynced ? count + 1 : count;
    }, 0);

    const shouldSync = syncedCount <= table.columns.length / 2;

    const updatedSync: Record<string, any> = {};
    table.columns.forEach((column) => {
      updatedSync[column.name] = { ...column, isSynced: shouldSync };
    });

    setEditedSync(updatedSync);
  };

  const handleReset = () => {
    setEditedSync({});
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography color='textPrimary' marginBottom={'1rem'} variant="h5">
        Szczegóły tabeli: {tableName}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <div style={{ width: '100%', maxHeight: 720 }}>
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
          <Button type="button" variant="contained" onClick={handleSyncChange}>
            Włącz/Wyłącz synchronizację
          </Button>
          <Button type="submit" variant="contained" color="success" onClick={handleSave}>
            Zapisz
          </Button>
        </Stack>
        <Button type="button" variant="text" color="warning" onClick={handleReset}>
          Przywróć poprzednie wartości
        </Button>
      </Stack>
    </Box>
  );
}