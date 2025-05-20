
#include <Servo.h>

Servo servo;

int ppin = 0;
int val;        
void setup() {
  servo.attach(9); 
  servo.write(0);
}

void loop() {
  val = analogRead(ppin); 
  val = map(val, 0, 1023, 0, 180); 
  servo.write(val);
  delay(15);
}