import chalkAnimation from "chalk-animation";
import { sleep } from "./sleep.js";

export async function displayTitle() {
  const title = chalkAnimation.rainbow("Welcome to the Authenticated CLI App");
  await sleep(2000);
  title.stop();
}
// NOT USED ANYWHERE FOR NOW
