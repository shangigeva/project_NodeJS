import chalk from "chalk";

class Logger {
  static error(...messages: any[]) {
    console.error(chalk.red(messages));
  }

  static info(...messages: any[]) {
    if (process.env.NODE_ENV === "prod") return;
    console.error(chalk.yellow(messages));
  }
  static success(...messages: any[]) {
    console.error(chalk.green(messages));
  }

  static debug(...messages: any[]) {
    console.debug(chalk.blue(messages));
  }

  static verbose(...messages: any[]) {
    if (process.env.NODE_ENV === "prod") return;
    console.log(chalk.magenta(messages));
  }

  static log(...messages: any[]) {
    if (process.env.NODE_ENV === "prod") return;
  }
}

export { Logger };
