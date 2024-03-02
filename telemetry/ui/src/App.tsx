import { useState, useEffect } from "react";
import LiveValue from "./live_value";
import RedbackLogo from "./redback_logo.jpg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8080";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
  temWarning: boolean;
  batWarning: boolean;
}

function App() {
  const [temperature, setTemperature] = useState<number>(0);
  const [temWarning, setTemWarning] = useState<boolean>(false); // hold the state for warning
  const [batWarning, setBatWarning] = useState<boolean>(false);

  const {
    lastJsonMessage,
    readyState,
  }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } =
    useWebSocket(WS_URL, {
      share: false,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service");
        break;
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service");
        break;
      default:
        break;
    }
  }, [readyState]);

  useEffect(() => {
    console.log("Received: ", lastJsonMessage);
    if (lastJsonMessage === null) {
      return;
    }
    setTemperature(lastJsonMessage["battery_temperature"]);

    if(lastJsonMessage["temWarning"]) { // check value stored in key
      setTemWarning(true);
    } else {
      setTemWarning(false);
    }

    if(lastJsonMessage["batWarning"]) { // check value stored in key
      setBatWarning(true);
    } else {
      setBatWarning(false);
    }
  }, [lastJsonMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={RedbackLogo}
          className="redback-logo"
          alt="Redback Racing Logo"
        />
        <p className="value-title">Live Battery Temperature</p>
        <LiveValue temp={temperature} />
        {temWarning && <div className="warning">Warning! Temperature out of safe range!</div>}
        {batWarning && <div className="warning">Warning! Battery is not runnning safely!</div>}
      </header>
    </div>
  );
}

export default App;
