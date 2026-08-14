try {
  const provider = require('./haiwaikan.js');
  console.log("Successfully loaded provider:", provider);
} catch (error) {
  console.error("Error during require:", error);
}
