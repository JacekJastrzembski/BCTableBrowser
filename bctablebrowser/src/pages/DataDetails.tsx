import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import data from '../assets/data.json';

interface Table {
  name: string;
  columns: Array<{ name: string; type: string; isSynced?: boolean }>;
}

interface RouteParams extends Record<string, string | undefined> {
  tableName?: string;
}

export default function DataDetails () {
  const { tableName } = useParams<RouteParams>();
  const table = data.find((t: Table) => t.name === tableName);

  if (!table) {
    return <Typography color='warning'>Tabela nie znaleziona</Typography>;
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nazwa kolumny', width: 280, minWidth: 150 },
    { field: 'type', headerName: 'Typ', width: 250, minWidth: 150 },
    {
      field: 'isSynced',
      headerName: 'Synchronizowana?',
      width: 200,
      renderCell: (params) => (
        <Checkbox checked={params.value} readOnly />
      ),
    },
  ];

    return (
            <Box sx={{ width: '100%' }}>
                <Typography color='textPrimary' marginBottom={'1rem'} variant="h5">Szczegóły tabeli: {tableName}</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>   
                    <div style={{ width: '100%', maxHeight: 750 }}>
                        <DataGrid
                            rows={table.columns}
                            columns={columns}
                            //   paginationModel={{ page: 0, pageSize: 11 }}
                            getRowId={(row) => row.name}
                            checkboxSelection={false}
                        />
                    </div>
                </Stack>
            </Box>
    );
};