const requestTracker = (req, res, next) => {
  const { headers, method, originalUrl, body, params, query } = req;
  const ip = headers["x-forwarded-for"] || req.socket.remoteAddress; // Get client IP
  const timestamp = new Date().toISOString(); // Current timestamp

  console.log(`[${timestamp}] ${method} ${originalUrl} - IP: ${ip}`);
  console.log("request", { body, params, query });
  next();
};

module.exports = requestTracker;
