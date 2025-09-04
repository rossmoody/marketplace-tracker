import { StorageUtilities } from "@/src/storage-utilities";
import { Data, Message } from "./content";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message: Message) => {
    switch (message.type) {
      case "load-item": {
        const parsedData = parseVehicleTextEnhanced(message.data.innerText);
        const data: Data = await StorageUtilities.getStorageData();
        const dataMap = new Map(data.map((item) => [item.itemId, item]));
        dataMap.set(message.data.itemId, { ...message.data, ...parsedData });
        await StorageUtilities.setStorageData(Array.from(dataMap.values()));
        console.log(dataMap.values());
        break;
      }
      default:
        console.log("Unknown message type:", message.type);
    }
  });
});

// Enhanced version with regex patterns for more reliable extraction
function parseVehicleTextEnhanced(rawText: string) {
  const patterns = {
    title:
      /(\d{4}\s+[\w\s]+(?:Pickup|Sedan|SUV|Coupe|Convertible|Wagon|Hatchback)[\w\s]*)/i,
    price: /\$[\d,]+/,
    listedTime: /Listed (.+?) in/,
    location: /Listed .+? in ([^,]+, [A-Z]{2})/,
    mileage: /Driven ([\d,]+) miles/,
    transmission: /(Manual|Automatic) transmission/,
    exteriorColor: /Exterior color:\s*([^·\n]+)/,
    interiorColor: /Interior color:\s*([^\n]+)/,
    fuelType: /Fuel type:\s*([^\n]+)/,
    titleStatus: /(Clean title|Salvage title|Rebuilt title|Lien title)/,
    seller: /Seller details\s*\n\s*([^\n]+)/,
    sellerJoinDate: /Joined Facebook in (\d{4})/,
  };

  const vehicleData: { [key: string]: string } = {};

  // Extract using regex patterns
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = rawText.match(pattern);
    vehicleData[key] = match ? match[1] || match[0] : "";
  });

  // Handle description separately (between "Seller's description" and location)
  const descMatch = rawText.match(
    /Seller's description\s*\n([\s\S]*?)(?=\n[A-Z][a-z]+,\s[A-Z]{2}|$)/
  );
  vehicleData.description = descMatch
    ? descMatch[1].replace(/\n/g, " ").trim()
    : "";

  // Handle condition
  const conditionMatch = rawText.match(
    /(This vehicle has no significant damage or problems|[\w\s]*damage[\w\s]*)/
  );
  vehicleData.condition = conditionMatch ? conditionMatch[0] : "";

  return vehicleData;
}
