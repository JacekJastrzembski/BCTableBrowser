export const sendTableDataToServer = async (tableName: string, payload: Payload) => {
    try {
      const response = await fetch(`http://localhost:3001/itemsToSave?name=${tableName}`);
      const data = await response.json();
  
      if (data.length === 0) {
        throw new Error('Nie znaleziono wpisu o nazwie: ' + tableName);
      }

      const foundItem = data[0];
  
      const updateData = await fetch(`http://localhost:3001/itemsToSave/${foundItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...foundItem,
          ...payload,
        }),
      });
  
      if (!updateData.ok) {
        throw new Error(`HTTP error! status: ${updateData.status}`);
      }
  
      return await updateData.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  interface Payload {
    name: string;
    columns: Array<{ name: string; type: string; isSynced?: boolean; configurationError?: string }>;
    isSynced?: boolean;
  }