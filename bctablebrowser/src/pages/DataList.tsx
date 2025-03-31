import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import data from '../assets/data.json';

interface Table {
  name: string;
  columns: Array<{ name: string; type: string; isSynced?: boolean }>;
}

export default function DataList () {
    
  const navigate = useNavigate();

  const handleRowClick = (tableName: string) => {
    navigate(`/details/${tableName}`);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nazwa tabeli', width: 350 },
    { field: 'columns', headerName: 'Liczba kolumn', width: 200 },
    {
      field: 'isSynced',
      headerName: 'Synchronizowana?',
      width: 200,
      renderCell: (params) => (
        <Checkbox checked={params.value} readOnly />
      ),
    },
  ];

  const rows = data.map((table : Table) => ({
    id: table.name,
    name: table.name,
    columns: table.columns.length,
    isSynced: table.columns.some(col => col.isSynced),
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography marginBottom={'1rem'} color='textPrimary' variant="h5">Lista tabel</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        {/* <div style={{ width: '100%' }}> */}
        <DataGrid
          rows={rows}
          columns={columns}
          //   paginationModel={{ page: 0, pageSize: 10 }}
          getRowId={(row) => row.name}
          onRowClick={(params) => handleRowClick(params.row.name)}
          checkboxSelection={false}
        />
        {/* </div> */}
      </Stack>
    </Box>
  );
};

