//export const IP_ADDRESS = "";

// Toggle this boolean depending on whether you are working locally or pushing to production
const IS_PRODUCTION = false;

// 1. Your Local Machine IP (Make sure your phone and laptop are on the same Wi-Fi)
const LOCAL_IP = "192.168.1.102";
const LOCAL_PORT = "5000"; // Change to your local backend port if different

// 2. Your Live Render Production URL (Replace with your actual Render Web Service URL)
const PRODUCTION_URL = "https://campus-ecommerce-backend.onrender.com";

// Automatically constructs the correct base URL
export const API_BASE_URL = IS_PRODUCTION
  ? `${PRODUCTION_URL}/api`
  : `http://${LOCAL_IP}:${LOCAL_PORT}/api`;
console.log(`[API Connection] Operating on Base URL: ${LOCAL_IP}`);
