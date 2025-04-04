import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Checkbox, Stack, Tooltip, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import data from '../assets/data.json';
import { useState } from 'react';
import { Table } from './DataList';

interface RouteParams extends Record<string, string | undefined> {
  tableName?: string;
}

export default function DataDetails() {
  const { tableName } = useParams<RouteParams>();
  const [editedSync, setEditedSync] = useState<Record<string, any>>({});
  const [tables, setTables] = useState<Table[]>(data.itemsToSave);

  const table = tables.find((t: Table) => t.name === tableName);
  if (!table) {
    return <Typography color='warning'>Tabela nie znaleziona</Typography>;
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
            <Tooltip title={params.row.configurationError} placement="bottom" arrow={true} >
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
          color='secondary'
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
    const updatedTables = tables.map((t) =>
      t.name === tableName ? { ...t, isSynced: !t.isSynced } : t
    );
    setTables(updatedTables);
    console.log('Zmieniono synchronizację tabeli:', updatedTables);
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
          {table.isSynced 
            ? <Button type="button" variant="contained" color='error' onClick={handleSyncChange}>Wyłącz synchronizację</Button>
            : <Button type="button" variant="contained" color='success' onClick={handleSyncChange}>Włącz synchronizację</Button>
          }
          <Button type="submit" variant='contained' color="info" onClick={handleSave}>
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