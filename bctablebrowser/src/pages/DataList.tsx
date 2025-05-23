import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import localData from '../assets/data.json';
import { useEffect, useState } from 'react';
import { Table } from '../api/api';
import { TableService } from '../api/TableService';

export default function DataList() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await TableService.getTables();
      setTables(data);
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
    { field: 'columns', headerName: 'Liczba kolumn', width: 150, align: 'right',  },
    { field: 'rowsCount', headerName: 'Liczba rekordów', width: 150, align: 'right', },
    {
      field: 'lastUpdateDateTime',
      headerName: 'Data ostatniego pobrania',
      width: 200,
      renderCell: (params) => {
        if (!params.value) return ' ';
        const date = new Date(params.value);
        const formattedDate = date.toLocaleString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return <span>{formattedDate}</span>;
      },
    },
    { field: 'version', headerName: 'Wersja', width: 150, align: 'right', },
    {
      field: 'isSynced',
      headerName: 'Synchronizowana?',
      width: 170,
      // align: 'center',
      renderCell: (params) => (
        <Checkbox checked={params.value} readOnly color='secondary' />
      ),
    },
  ];

  const rows = tables.map((table: Table) => ({
    name: table.name,
    columns: table.columns ? table.columns.length : 0,
    rowsCount: table.rowsCount,
    lastUpdateDateTime: table.lastUpdateDateTime,
    version: table.version,
    isSynced: table.isSynced,
  }));

  return (
    <>
      <div className="container" style={{ marginLeft: '1rem', padding: '1rem', paddingTop: '0rem' }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ color: (theme) => theme.palette.secondary.light }} marginBottom={'0.5rem'} color='textPrimary' variant="h5">
            Lista tabel
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1, paddingTop: '1rem' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.name}
              onRowClick={(params) => handleRowClick(tables.find((t) => t.name === params.row.name)!)}
              checkboxSelection={false}
              loading={loading}
            />
          </Stack>
        </Box>
      </div>
    </>
  );
};

