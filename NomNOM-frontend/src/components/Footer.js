import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function Footer() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:4000/logs/combined.log");
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const text = await response.text();
        const logLines = text.split("\n").filter((line) => line.trim() !== "");

        const parsedLogs = logLines.map((logLine) => {
          try {
            return JSON.parse(logLine);
          } catch (error) {
            console.error("Error parsing log line", { logLine, error: error.message });
            return null;
          }
        }).filter((log) => log);

        setLogs(parsedLogs);
      } catch (err) {
        setError(err.message);
        console.error("Error loading logs", { error: err.message });
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-dark bottom-0 align-bottom h-20 bg-dark w-screen">
      <div className="grid grid-cols-9 text-neutral-400 justify-start w-full h-full align-top">
        <div
          onClick={() => setShowPopover(!showPopover)}
          className="no-scrollbar col-span-5 font-medium text-2xl flex flex-col items-start justify-start overflow-y-scroll transition-all duration-200"
        >
          <div className="px-2 py-2 w-full h-full flex flex-row gap-2 items-end align-middle text-xl font-semibold text-neutral-700">
            {['L', 'E', 'G'].map((letter, index) => (
              <div
                key={letter}
                className="size-8 hover:bg-[#6e969c] duration-200 transition-all flex flex-row items-center justify-center"
              >
                {letter}
                <span className="h-full">
                  <div className={`bg-${index === 1 || index === 5 ? 'red' : 'green'}-700 size-1.5 rounded-full`}></div>
                </span>
              </div>
            ))}
          </div>
        </div>

        {showPopover && (
          <div className="fixed inset-0 flex items-center justify-center z-20 backdrop-blur-sm bg-dark bg-opacity-50">
            <div className="bg-dark w-3/4 h-3/4 rounded-xl shadow-xl">
              <div className="flex justify-between p-8 h-1/6 flex-row">
                <h3 className="font-medium text-xl text-light">Combined Logs</h3>
                <button
                  onClick={() => setShowPopover(false)}
                  className="size-6 rounded-full bg-dark hover:bg-gray-700 flex justify-center items-center align-middle"
                >
                  <X className="text-[#EBE9E1] size-5" />
                </button>
              </div>

              <div className="overflow-auto h-5/6 text-neutral-300 px-8">
                {error ? (
                  <div className="text-red-500">Error: {error}</div>
                ) : (
                  <table className="w-full text-xs text-left font-mono border-collapse">
                    <thead className="sticky top-0 bg-dark">
                    <tr>
                      <th className="py-2 pr-4 w-48">Timestamp</th>
                      <th className="py-2 pr-4 w-1/3">Message</th>
                      <th className="py-2">Metadata</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...logs].reverse().map((log, index) => (
                      <tr key={index} className="border-b border-neutral-800">
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              log.level === "error" ? "bg-red-500" : "bg-green-500"
                            }`}
                          />
                          {log.timestamp}
                        </td>
                        <td className="py-2 pr-4 break-normal">{log.message}</td>
                        <td className="py-2 break-all max-w-0">
                          {Object.keys(log.metadata).length === 0
                            ? "No metadata"
                            : JSON.stringify(log.metadata, null, 2)}
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="col-span-2 text-2xl px-8 font-medium flex flex-row items-center justify-end transition-all duration-200">
          ⌥
        </div>
        <div className="col-span-2 text-2xl px-8 font-medium flex flex-row items-center justify-end transition-all duration-200">
          ⌘
        </div>
      </div>
    </div>
  );
}
