// const fs = require("fs");
// fs.readFile("readme.md", "utf8", (err, data) => {
//   console.log(data);
// });

const core = require("@actions/core");
const github = require("@actions/github");

// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput("who-to-greet");
//   console.log(`Hello ${nameToGreet}!`);
//   const time = new Date().toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2);
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }

const spawn = require("child_process").spawn;
const path = require("path");

const exec = (cmd, args = []) =>
  new Promise((resolve, reject) => {
    console.log(`Started: ${cmd} ${args.join(" ")}`);
    const app = spawn(cmd, args, { stdio: "inherit" });
    app.on("close", code => {
      if (code !== 0) {
        err = new Error(`Invalid status code: ${code}`);
        err.code = code;
        return reject(err);
      }
      return resolve(code);
    });
    app.on("error", reject);
  });

// const main = async () => {
//   await exec("bash", [
//     path.join(__dirname, "./script.sh"),
//     "Mhmdabed11",
//     "Mhmdabed11",
//     "4fb3774e1a85590148bbedb9d36e3190e4840590"
//   ]);
// };

const main = async () => {
  await exec("git", ["config", "--global", "user.name", "Mhmdabed11"]);
  await exec("git", ["add", "."]);
  await exec("git", ["commit", "-m", "update"]);
  await exec("git", ["push"]);
};

main().catch(err => {
  console.error(err);
  console.error(err.stack);
  process.exit(err.code || -1);
});
