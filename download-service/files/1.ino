int potenciometrPinR = A2;
int potenciometrPinG = A0;
int potenciometrPinB = A1;
int potencioR = 0;
int potencioG = 0;
int potencioB = 0;
  
void setup() {
  pinMode(11, OUTPUT); // zelený pin
  pinMode(10, OUTPUT); // modrý pin
  pinMode(9, OUTPUT);  // červený ýpin
  pinMode(A0,INPUT);
  pinMode(A1,INPUT);
  pinMode(A2,INPUT);
}
void loop() {
  potencioR = analogRead(potenciometrPinR);
  potencioG = analogRead(potenciometrPinG);
  potencioB = analogRead(potenciometrPinB);
  
  potencioR = map(potencioR, 0, 1023, 0, 255);
  potencioG = map(potencioG, 0, 1023, 0, 255);
  potencioB = map(potencioB, 0, 1023, 0, 255);
  
  analogWrite(11, potencioG);
  analogWrite(9, potencioR);
  analogWrite(10, potencioB);
  
 delay(5);
}