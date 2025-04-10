export const getSynchronizableTables = async (): Promise<Table[]> => {
  try {
    const response = await fetch('http://localhost:3001/api/BCApi/GetSynchronizableTables');
    if (!response.ok) {
      throw new Error(`Błąd HTTP przy pobieraniu danych. Status: ${response.status}`);
    }
    const data: Table[] = await response.json();
    return data;
  } catch (error) {
    console.error('Błąd w funkcji getSynchronizableTables:', error);
    throw error;
  }
};

export const saveSynchronizableTables = async (payload: UpdateTable): Promise<Table> => {
  try {
    const response = await fetch('http://localhost:3001/api/BCSync/SaveSynchronizableTables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Błąd HTTP przy zapisywaniu danych. Status: ${response.status}`);
    }
    const updatedTable: Table = await response.json();
    return updatedTable;
  } catch (error) {
    console.error('Błąd w funkcji saveSynchronizableTable:', error);
    throw error;
  }
};

export interface Table {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    isSynced?: boolean;
    configurationError?: string;
  }>;
  isSynced?: boolean;
  configurationError?: string;
}

export interface UpdateTable {
  itemsToSave: ItemsToSave[];
}
export interface ItemsToSave {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    isSynced?: boolean;
  }>;
  isSynced?: boolean;
}