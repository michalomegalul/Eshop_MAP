const int analogInPin1 = A0;
const int analogOutPin1 = 9;

int sensorVRx = 0;
int outputValue1 = 0;

const int analogInPin2 = A1;
const int analogOutPin2 = 11;

int sensorVRy = 0;
int outputValue2 = 0;

void setup() {
  }

void loop() {
 
  sensorVRx = analogRead(analogInPin1);
  outputValue1 = map(sensorVRx, 0, 1023, 0, 255);
  analogWrite(analogOutPin1, outputValue1);

  sensorVRy = analogRead(analogInPin2);
  outputValue2 = map(sensorVRy, 0, 1023, 0, 255);
  analogWrite(analogOutPin2, outputValue2);
  delay(2);
}