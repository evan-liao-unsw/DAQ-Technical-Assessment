const { readFile, writeFile } = require('fs');

function decodeWheelSpeeds(payload) {
  
  const payloadBinary = BigInt('0x' + payload).toString(2).padStart(64, '0');// convert to binary, make sure it's 64 bits

  let payloadBinaryReversed = '';
  for (let i = 0; i < 64; i += 8) {
        payloadBinaryReversed = payloadBinary.substring(i, i + 8) + payloadBinaryReversed; // little endian works
  }

  const wheelSpeedFR = parseInt(payloadBinaryReversed.substring(48, 64), 2) * 0.1;
  const wheelSpeedRR = parseInt(payloadBinaryReversed.substring(16, 32), 2) * 0.1;

  return { wheelSpeedFR, wheelSpeedRR };
}


readFile('dump.log', 'utf8', (err, data) => {// read the dump file
  const lines = data.split('\n');
  const output = [];

  lines.forEach((line) => {
    if (line.trim()) {
      const [timestamp, , idPayload] = line.split(' ');
      const [idHex, payload] = idPayload.split('#');

      
      if (idHex.toLowerCase() === '705') {// make sure the frame ID matches (1797 in decimal but 705 in hex)
        const { wheelSpeedFR, wheelSpeedRR } = decodeWheelSpeeds(payload);

        output.push(`${timestamp}: WheelSpeedFR: ${wheelSpeedFR.toFixed(1)}`);
        output.push(`${timestamp}: WheelSpeedRR: ${wheelSpeedRR.toFixed(1)}`);
      }
    }
  });

  
  writeFile('output.txt', output.join('\n'), function(err) {
    if (err) throw err;
    console.log('Output file saved!');
  });// write the output
});