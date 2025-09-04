import { StorageUtilities } from "@/src/storage-utilities";
import { saveAs } from "file-saver";

export const Main = () => {
  const handleExport = async () => {
    const data = await StorageUtilities.getStorageData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "marketplace-tracker-data.json");
  };

  return (
    <main className="p-12">
      <button onClick={handleExport}>Export Data</button>
    </main>
  );
};
