"use strict";

const colors = require("ansi-colors");
const gulp = require("gulp");
const log = require("fancy-log");
const process = require("child_process");

gulp.task("build", () => {
  log.info(colors.cyan("Starting main process."));
  let pid = process.spawn("npm", ["run", "dev:build"]);

  pid.stdout.on("data", data => {
    log.info(colors.green(data.toString()));
  });

  pid.stderr.on("data", data => {
    log.error(colors.red(data.toString()));
  });

  return pid;
});

gulp.task("watch", () => {
  log.info(colors.cyan("Starting main process."));
  let pid = process.spawn("npm", ["run", "dev:watch"]);

  pid.stdout.on("data", data => {
    log.info(colors.green(data.toString()));
  });

  pid.stderr.on("data", data => {
    log.error(colors.red(data.toString()));
  });

  return pid;
});

gulp.task("server", () => {
  log.info(colors.cyan("Starting main process."));
  let pid = process.spawn("npm", ["run", "dev:server"]);

  pid.stdout.on("data", data => {
    log.info(colors.green(data.toString()));
  });

  pid.stderr.on("data", data => {
    log.error(colors.red(data.toString()));
  });

  return pid;
});

gulp.task(
  "default",
  gulp.series(
    "build",
    gulp.parallel("watch", "server", done => {
      done();
    })
  )
);
