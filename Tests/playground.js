//Physics problems

const dist_before_takeoff = () => {

  /**
 * An airplane accelerates down a runway at 3.20 m/s2
 * for 32.8 s until is finally lifts off the ground.
 * Determine the distance traveled before takeoff.
 */

  const acceleration = 3.20 // m/s^2
  const time = 32.8 // seconds

  let distance; // d = vi * time + 1/2 * acceleraton * time * time

  distance = 0 * 0 + (0.5 * acceleration * (time * time));

  console.log(distance + ' meters');

}

const determine_acceleration = () => {
  /**
   * A car starts from rest and accelerates uniformly
   * over a time of 5.21 seconds for a distance of 110 m.
   * Determine the acceleration of the car.
   */
  // d = vi * time + 1/2 * acceleraton * time * time
  // Acceleration = deltaV / deltaT = V - Vo / deltaT

  const distance = 110 //meters
  const time = 5.21 //seconds
  const vi = 0;
  let formula = (vi * time) + (0.5 * time * time);
  let acceleration = distance / formula;

  console.log(acceleration);
}

const final_velocity_freefall = () => {
  /**
   * Upton Chuck is riding the Giant Drop at Great America.
   * If Upton free falls for 2.60 seconds.
   * what will be his final velocity and how far will he fall?
   */

  const GRAVITY = 9.8;
  const time = 2.60;

  let height = 0.5 * GRAVITY * time * time;
  console.log(`Altura: ${height} metros`)
  let finalVelocity = GRAVITY * time;
  console.log(finalVelocity);
}

const race_car_acceleration = () => {
  /**
   * A race car accelerates uniformly from 18.5 m/s to 46.1 m/s in 2.47 seconds.
   * Determine the acceleration of the car and the distance traveled.
   */

  const initialV = 18.5, finalV = 46.1, time = 2.47;

  //Aceleration = DeltaVelocity / DeltaTime or FinalV - InitialV / DeltaTime
  let acceleration = (finalV - initialV) / time;
  console.log(acceleration);

  //Distance = InitialV * time + (0.5 * acceleration * time * time)
  let distance = initialV * time + (0.5 * acceleration * (time * time));
  console.log(distance.toFixed(1));
}

const feather_in_moon = (height) => {
  /**
   * A feather is dropped on the moon from a height of 1.40 meters.
   * The acceleration of gravity on the moon is 1.67 m/s2.
   * Determine the time for the feather to fall to the surface of the moon.
   */

   /**Formula
    * height = 0.5 * GRAVITY * time * time
    */
  const GRAVITY = 1.67;
  let time = (height) / (0.5 * GRAVITY); // This is time^2
  let finalTime = Math.sqrt(time);

  console.log(finalTime + ' seconds');

}

const rocket_powered_sled = () => {
  /**
   * Rocket-powered sleds are used to test the human response to acceleration.
   * If a rocket-powered sled is accelerated to a speed of 444 m/s in 1.83 seconds
   * what is the acceleration and what is the distance that the sled travels?
   */

  //Acceleration = FinalVelocity - InitialVelocity / timeTaken
  const initialV = 0;
  const finalV = 444;
  const time = 1.83;
  let acceleration = (finalV - initialV) / time;
  console.log(acceleration);

  //Distance = InitialVelocity * time + (0.5 * acceleration * time * time)
  let distance = (initialV * time) + (0.5 * acceleration * (time * time));
  console.log(distance);
}
//dist_before_takeoff();
//determine_acceleration();
//final_velocity_freefall();
//race_car_acceleration();
//feather_in_moon(1.40); //height in meters
rocket_powered_sled();