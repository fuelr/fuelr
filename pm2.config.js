module.exports = {
  apps: [
    {
      script: "./lib/index.js",
      name: "fuelr",
      node_args: "-r dotenv/config",
    },
  ],
}
