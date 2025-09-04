export default defineContentScript({
  matches: ["*://*.facebook.com/marketplace/*"],
  main() {
    console.log("Hello content.");
  },
});
