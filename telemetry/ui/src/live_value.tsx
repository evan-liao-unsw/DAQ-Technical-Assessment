import "./App.css";

interface TemperatureProps {
  temp: number;
}

function LiveValue({ temp }: TemperatureProps) {
  let valueColour = getColor(temp);
  const fahrenheitValue = celsiusToFahrenheit(temp);
  return (
    <header className="live-value" style={{ color: valueColour }}>
      {`${temp.toFixed(2)}°C / ${fahrenheitValue.toFixed(2)}°F`}
    </header>
  );
}

function getColor(temp: number): string {
  if (temp <= 20 || temp >= 80) {
    return 'red';
  }

  const ratio = (temp - 20) / 60; // of range 0 to 1
  const distance = 2 * Math.abs(ratio - 0.5); // of range 0 to 1, identifying the distance to 60
  const red = Math.floor(distance * 255); // more red when gets closer to boundary
  const green = Math.floor(255 - red); // more green when gets closer to 50
  return `rgb(${red}, ${green}, 0)`;
}

// helper function
function celsiusToFahrenheit(celsius: number) {
  return (celsius * 9/5) + 32;
}

export default LiveValue;
