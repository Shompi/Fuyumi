#include <stdio.h>

void dist_before_takeoff() {

  float acceleration = 3.20;
  float time = 32.8;
  float initialTime = 0;
  float initialV = 0.0;
  float distance = (initialV * initialTime) + (0.5 * acceleration * (time * time));

  printf("\nDistance before takeoff is: %0.2f", distance);
}


int main() {
  dist_before_takeoff();
  getchar();getchar();
}