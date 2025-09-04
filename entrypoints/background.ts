import { StorageUtilities } from "@/src/storage-utilities";

type Message = {
  type: "load-item";
  data: {
    /**
     * The ID of the marketplace item
     */
    itemId: string;
    /**
     * The URL of the marketplace item
     */
    url: string;
    /**
     * The title of the marketplace item
     */
    title: string;
    /**
     * The timestamp when the item was loaded
     */
    timestamp: number;
  };
};

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message: Message) => {
    switch (message.type) {
      case "load-item":
        StorageUtilities.setStorageData(message.data);
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  });
});
