import { StorageUtilities } from "@/src/storage-utilities";
import { Data, Message } from "./content";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message: Message) => {
    switch (message.type) {
      case "load-item": {
        const data: Data = await StorageUtilities.getStorageData();
        const dataMap = new Map(data.map((item) => [item.itemId, item]));
        dataMap.set(message.data.itemId, message.data);
        console.log(dataMap);
        await StorageUtilities.setStorageData(Array.from(dataMap.values()));
        break;
      }
      default:
        console.log("Unknown message type:", message.type);
    }
  });
});
