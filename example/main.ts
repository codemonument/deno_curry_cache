import { } from "@/mod.ts";
import { log } from "@/deps/std.ts";

try {
  log.info(`Your module is currently empty! Add some code to the lib folder and export it in mod.ts!`);
} catch (error) {
  console.error(error);
  Deno.exit();
}
