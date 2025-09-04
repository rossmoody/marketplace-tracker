import { compressToUTF16, decompressFromUTF16 } from "lz-string";

/**
 * A helper for working with Chrome storage and automating compression.
 */
export const StorageUtilities = {
  /**
   * Stringify and compress a string to base64.
   */
  compressToBase64(input: unknown): string {
    return compressToUTF16(JSON.stringify(input));
  },

  /**
   * Decompress and parse a string from base64.
   */
  decompressFromBase64<T>(input: string): T {
    return JSON.parse(decompressFromUTF16(input));
  },

  /**
   * Get various types of collection data from storage. Automatically decompresses data.
   */
  async getStorageData<T>(key = "marketplace-tracker"): Promise<T | undefined> {
    try {
      const data = await browser.storage.local.get(key);
      return this.decompressFromBase64(data[key]);
    } catch {
      return;
    }
  },

  /**
   * Sets data in storage based on key. Automatically compresses data.
   */
  async setStorageData(
    data: unknown,
    key = "marketplace-tracker"
  ): Promise<void> {
    await browser.storage.local.set({
      [key]: this.compressToBase64(data),
    });
  },
};
