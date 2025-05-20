bool zapnuto = false;

void setup()
{
  pinMode(3, OUTPUT);
  pinMode(4, INPUT);
}

void loop()
{
  zapnuto = digitalRead(4);

  if (zapnuto == true) {
    tone(3, 440);
  }
  else {
    noTone(3);
  }
    
  delay(10);
}