const { series } = require('gulp');
const chalk = require('chalk');
const moment = require("moment")
const getFile = require("./task/getFile")
const compile = require("./task/compile")
async function defaultTask(cb) {
    let startTime = Date.now()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("开始所有任务")}`)
    await getFile()

    await compile()

    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("完成所有任务： 共用时：")}${chalk.red((Date.now() - startTime) / 1000)}秒`)
    cb();
}

exports.default = series(defaultTask);
