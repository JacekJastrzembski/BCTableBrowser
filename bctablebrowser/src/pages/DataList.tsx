import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import localData from '../assets/data.json';
import { useEffect, useState } from 'react';
import { Table, getJsonData, getSynchronizableTables } from '../api/api';

export default function DataList () {
    
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);

  const useJsonData = import.meta.env.VITE_USE_JSON_DATA === 'true' ? true : false;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (useJsonData) {
        const jsonData = await getJsonData();
        setTables(jsonData);
      } else {
        const data = await getSynchronizableTables();
        setTables(data);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

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
    name: table.name,
    columns: table.columns ? table.columns.length : 0,
    isSynced: table.isSynced
  }));
    
  if (loading){
    return <Typography color='warning'>Ładowanie danych...</Typography>;
  }

  return (
    <div className="container" style={{ marginLeft: '1rem', padding: '1rem', paddingTop: '0rem' }}>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ color: (theme) => theme.palette.secondary.light }} marginBottom={'1rem'} color='textPrimary' variant="h5">
          Lista tabel
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1, paddingTop: '1rem' }}>
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

