bool zapnutoRED = false;
bool zapnutoGREEN = false;
void setup()
{
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, INPUT_PULLUP);
  pinMode(5, INPUT)
void loop()
{
  zapnutoGREEN = digitalRead(5);
  digitalWrite(2, zapnutoGREEN);
  zapnutoRED = digitalRead(4);
  digitalWrite(3, zapnutoRED);
  delay(10);
}