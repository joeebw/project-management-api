import fetch from "node-fetch";

const keepAliveService = {
  start: function (serverUrl) {
    setInterval(async () => {
      try {
        await fetch(serverUrl);
        console.log(`[${new Date().toISOString()}] Keep-alive ping successful`);
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Keep-alive ping failed:`,
          error.message
        );
      }
    }, 14 * 60 * 1000); // 14 minutes
  },
};

export default keepAliveService;
