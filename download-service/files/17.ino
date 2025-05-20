void setup()
{
  pinMode(6, OUTPUT);
  pinMode(A0, INPUT);
}

void loop()
{
  tone(6, map(analogRead(A0),10,1023,0,2500));
  delay(5);
 }