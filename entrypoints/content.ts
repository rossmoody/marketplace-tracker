export type Message = {
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
    /**
     * The inner text of the marketplace item page
     */
    innerText: string;
  };
};

export type Data = Array<Message["data"]>;

export default defineContentScript({
  matches: ["*://*.facebook.com/marketplace/*"],
  main() {
    /**
     * Check if we are on a marketplace item page and run the script
     */
    async function loadMarketplaceItem() {
      const isItemPage = /\/marketplace\/item\/\d+/.test(
        window.location.pathname
      );

      if (isItemPage) {
        try {
          const data: Message["data"] = {
            itemId:
              window.location.pathname.match(
                /\/marketplace\/item\/(\d+)/
              )?.[1] ?? "",
            url: window.location.href,
            title: document.title.replace("Marketplace - ", ""),
            timestamp: Date.now(),
            innerText: document.body.innerText,
          };

          browser.runtime.sendMessage({
            type: "load-item",
            data,
          });
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      }
    }

    loadMarketplaceItem();

    /**
     * Observe URL changes in SPA (Single Page Application)
     */
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        setTimeout(loadMarketplaceItem, 2000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
