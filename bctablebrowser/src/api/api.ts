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

export const saveSynchronizableTables = async (payload: UpdateTable): Promise<void> => {
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
  } catch (error) {
    console.error('Błąd w funkcji saveSynchronizableTable:', error);
    throw error;
  }
};

export const saveJsonTableData = async (name: string, payload: ItemsToSave) => {
  try {
    const response = await fetch(`http://localhost:3001/items?name=${name}`);
    if (!response.ok) {
      throw new Error(`Błąd HTTP przy pobieraniu danych. Status: ${response.status}`);
    }
    const [foundItem] = await response.json();

    if (!foundItem) {
      throw new Error(`Nie znaleziono rekordu z nazwą: ${name}`);
    }

    const updateData = await fetch(`http://localhost:3001/items/${foundItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...foundItem,
        ...payload,
      }),
    });

    if (!updateData.ok) {
      throw new Error(`Błąd HTTP przy zapisywaniu danych. Status: ${updateData.status}`);
    }

  } catch (error) {
    console.error('Błąd w funkcji saveJsonTableData:', error);
    throw error;
  }
};

export const getJsonData = async (): Promise<Table[]> => {
  try {
    const response = await fetch('http://localhost:3001/items');
    if (!response.ok) {
      throw new Error(`Błąd HTTP przy pobieraniu danych. Status: ${response.status}`);
    }
    const data: Table[] = await response.json();
    return data;
  } catch (error) {
    console.error('Błąd w funkcji getJsonData:', error);
    throw error;
  }
};

export interface Table {
  id?: string;
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