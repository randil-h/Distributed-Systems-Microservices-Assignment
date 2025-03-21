const sendLogToServer = async (level, message, metadata = {}) => {
  try {
    const response = await fetch('http://localhost:4000/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, metadata }),
    });

    if (!response.ok) {
      console.error('Failed to send log to server:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending log to server:', error);
  }
};

const logger = {
  info: (message, metadata) => sendLogToServer('info', message, metadata),
  warn: (message, metadata) => sendLogToServer('warn', message, metadata),
  error: (message, metadata) => sendLogToServer('error', message, metadata),
  debug: (message, metadata) => sendLogToServer('debug', message, metadata),
};

export default logger;
