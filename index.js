const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { Toolkit } = require("actions-toolkit");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  breaks: true
});

const exec = (cmd, args = []) =>
  new Promise((resolve, reject) => {
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

const commitFile = async () => {
  await exec("git", ["config", "--global", "user.email", "mohammad_aabed@hotmail.com"]);
  await exec("git", ["config", "--global", "user.name", "mhmdabed11"]);
  await exec("git", ["add", "README.md"]);
  await exec("git", ["commit", "-m", "update"]);
  await exec("git", ["push"]);
};

Toolkit.run(
  async tools => {
    const readmeContent = fs.readFileSync("./README.md", "utf-8").split("\n");
    const index = readmeContent.findIndex(entry => entry === "<!--TWITTER_STATS_START-->");
    readmeContent[index + 1] = md.render("## These are my twitter stats");
    fs.writeFileSync("./README.md", readmeContent.join("\n"));
    await commitFile();
    tools.exit.success("Updated ");
  },
  {
    event: ["schedule", "workflow_dispatch", "push"],
    secrets: ["GITHUB_TOKEN"]
  }
);
