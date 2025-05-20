int potenciometr;
int svetlo;

void setup() {
pinMode(6, OUTPUT);
pinMode(A0, INPUT);
}

void loop() {
potenciometr = analogRead(A0);
svetlo = map(potenciometr, 0, 1023, 0, 255);
analogWrite(6, svetlo);

}