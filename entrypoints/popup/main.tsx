import { StorageUtilities } from "@/src/storage-utilities";
import { saveAs } from "file-saver";

const FILE_NAME = "marketplace-tracker-data.json";

export const Main = () => {
  const handleExport = async () => {
    const storageData = await StorageUtilities.getStorageData();
    const data = JSON.stringify(storageData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    saveAs(blob, FILE_NAME);
  };

  const handleClear = async () => {
    await StorageUtilities.setStorageData([]);
  };

  return (
    <main className="p-12 flex flex-col gap-4 min-w-80">
      <button
        className="bg-amber-100 p-3 rounded-xl cursor-pointer"
        onClick={handleExport}
      >
        Export Data
      </button>
      <button
        className="outline p-3 rounded-xl cursor-pointer"
        onClick={handleClear}
      >
        Clear Data
      </button>
    </main>
  );
};
