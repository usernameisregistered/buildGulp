const { series } = require('gulp');
// const chalk = require('chalk');
// const moment = require("moment")
const getFile = require("./task/getFile")
function defaultTask(cb) {
    // place code for your default task here
    cb();
}

async function build(cb) {
    await getFile()
    // console.log(`[${chalk.gray(moment().format("hh:mm:ss"))}] ${chalk.blue('Hello world!')}`);
    cb();
}

exports.build = build;
exports.default = series(defaultTask, build);
