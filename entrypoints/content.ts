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
        const itemId = window.location.pathname.match(
          /\/marketplace\/item\/(\d+)/
        )?.[1];

        try {
          browser.runtime.sendMessage({
            type: "load-item",
            data: {
              itemId,
              url: window.location.href,
              title: document.title,
              timestamp: Date.now(),
            },
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
        loadMarketplaceItem();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
