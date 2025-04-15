import { getJsonData, saveJsonTableData, getSynchronizableTables, 
    saveSynchronizableTables, Table, UpdateTable } from './api';

const useJsonData = import.meta.env.VITE_USE_JSON_DATA === 'true'

export const TableService = {

    async getTables(): Promise<Table[]> {
      if (useJsonData) {
        return await getJsonData();
      } else {
        return await getSynchronizableTables();
      }
    },
  
    async saveTable(payload: UpdateTable): Promise<void> {
      try {
        if (!payload.itemsToSave.length) {
          throw new Error('Brak tabel do zapisania');
        }
        const table = payload.itemsToSave[0];
        if (!table || !table.name || !table.columns) {
          throw new Error('Nieprawidłowe dane tabeli w payloadzie');
        }
  
        if (useJsonData) {
          const jsonPayload = {
            name: table.name,
            columns: table.columns,
            isSynced: table.isSynced,
          };
          await saveJsonTableData(table.name, jsonPayload);
        } else {
          await saveSynchronizableTables(payload);
        }
      } catch (error) {
        console.error('Błąd podczas zapisywania tabeli:', error);
        throw error;
      }
    },
  };