import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import data from '../assets/data.json';
import { useEffect, useState } from 'react';

export interface Table {
  name: string;
  columns: Array<{ 
    name: string; 
    type: string; 
    isSynced?: boolean; 
    configurationError?: string | undefined; 
  }>;
  isSynced?: boolean;
}

export default function DataList () {
    
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:3001/itemsToSave');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Błąd podczas pobierania danych z API:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleRowClick = (table: Table) => {
    navigate(`/details/${table.name}`, { state: { table } });
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nazwa tabeli', width: 350 },
    { field: 'columns', headerName: 'Liczba kolumn', width: 200 },
    {
      field: 'isSynced',
      headerName: 'Synchronizowana?',
      width: 200,
      renderCell: (params) => (
        <Checkbox checked={params.value} readOnly color='secondary' />
      ),
    },
  ];

  const rows = tables.map((table : Table) => ({
    id: table.name,
    name: table.name,
    columns: table.columns.length,
    isSynced: table.isSynced
  }));
    
  if (loading){
    return <Typography color='warning'>Ładowanie danych...</Typography>;
  }

  return (
    <div className="container" style={{ marginLeft: '1rem' }}>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ color: (theme) => theme.palette.secondary.light }} marginBottom={'1rem'} color='textPrimary' variant="h5">
          Lista tabel
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.name}
            onRowClick={(params) => handleRowClick(tables.find((t) => t.name === params.row.name)!)}
            checkboxSelection={false}
          />
        </Stack>
      </Box>
    </div>
  );
};

