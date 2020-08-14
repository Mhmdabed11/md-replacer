const fs = require("fs");
const { spawn } = require("child_process");
const { Toolkit } = require("actions-toolkit");
const core = require("@actions/core");
const axios = require("axios");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  breaks: true
});

/**
 * Execute shell commands
 * @param {stringt} cmd
 * @param {array} args
 */
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

/**
 * Commit changes to github
 */
const commitFile = async () => {
  await exec("git", ["config", "--global", "user.email", "mabed4297@gmail.com"]);
  await exec("git", ["config", "--global", "user.name", "mhmdabed123"]);
  await exec("git", ["add", "README.md"]);
  await exec("git", ["commit", "-m", "update"]);
  await exec("git", ["push"]);
};

function getLatestTweets(username, count) {
  return axios.get(
    `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&exclude_replies=true`,
    {
      headers: {
        Authorization:
          "Bearer AAAAAAAAAAAAAAAAAAAAAK0PGwEAAAAAtnxlgULEI2FJmfu2DLLv4sq7tSY%3DI1Nmq5rOdGafTOu7zuwP0NMZUnx9mnCVIHszOex2epyx9gnj9M"
      }
    }
  );
}

Toolkit.run(
  async tools => {
    const twitterUserName = core.getInput("USERNAME");
    const numberOfTweets = core.getInput("NUMBER_OF_TWEETS");
    getLatestTweets(twitterUserName, numberOfTweets).then(res => {
      tweets = res.data.map(tweet => ({
        text: tweet.text,
        url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
      }));
      let readmeContent = fs.readFileSync("./README.md", "utf-8").split("\n");
      const startIndex = readmeContent.findIndex(entry => entry === "<!--TWITTER_STATS_START-->");
      const endIndex = readmeContent.findIndex(entry => entry === "<!--TWITTER_STATS_END-->");
      latestTweets = tweets.reduce(
        (list, tweet) => list + `- 🐤 [${tweet.text.split("\n").join(" ")}](${tweet.url})\n`,
        ""
      );
      if (endIndex - startIndex === 1) {
        readmeContent = [
          ...readmeContent.slice(0, endIndex),
          md.render(latestTweets).trim(),
          ...readmeContent.slice(endIndex)
        ];
      } else {
        readmeContent = [
          ...readmeContent.slice(0, startIndex + 1),
          ...readmeContent.slice(endIndex)
        ];
        const tempEndIndex = readmeContent.findIndex(entry => entry === "<!--TWITTER_STATS_END-->");
        readmeContent = [
          ...readmeContent.slice(0, tempEndIndex),
          md.render(latestTweets).trim(),
          ...readmeContent.slice(tempEndIndex)
        ];
      }

      fs.writeFileSync("./README.md", readmeContent.join("\n"));
      await commitFile();
      tools.exit.success("Updated");
    });
  },
  {
    event: ["schedule", "workflow_dispatch", "push"]
  }
);
