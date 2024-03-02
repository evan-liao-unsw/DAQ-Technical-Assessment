import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

let violations: VehicleData[] = [];

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    console.log(`Received: ${msg.toString()}`);
    try {
      const currJSON = JSON.parse(msg.toString());
      if (!isValidData(currJSON)) { // make sure currJSON is of valid type
        return;
      }
      if (currJSON.battery_temperature < 20 || currJSON.battery_temperature > 80) {
        violations.push(currJSON); // push the data to the violations array
      }
      trimViolations(currJSON);
      console.log(violations);
      if (violations.length > 3) {
          logViolation(currJSON.timestamp); // log to the file
      }

      websocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          const response = {
            ...currJSON,
            temWarning: currJSON.battery_temperature < 20 || currJSON.battery_temperature > 80,
            batWarning: violations.length > 3
          };

          client.send(JSON.stringify(response));
        }
      });
    } catch (error) {
      console.error('An error occurred when parsing JSON:', error);
    }
    // Send JSON over WS to frontend clients
    
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});

function isValidData(data: any): boolean {
  return typeof data === 'object' && // make sure currJSON is not parsed to something else like string or array
         'battery_temperature' in data && // make sure the keys exist
         typeof data.battery_temperature === 'number' && // make sure the value for the given key is number which is a tempreture
         'timestamp' in data; // make sure the keys exist
}

function trimViolations(currJSON: VehicleData): void {
  violations = violations.filter(violation => violation.timestamp >= currJSON.timestamp - 5000);
}

function logViolation(timestamp: number): void {
    const violationDate = new Date(timestamp); // assume its based on miliseonds
    console.log(`The battery was not running safely at ${violationDate.toLocaleString()}\n`);
}