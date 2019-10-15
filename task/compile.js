const chalk = require('chalk');
const moment = require("moment")
const util = require('util')
const fs = require('fs')
const path = require('path')
const process = require('process')
const exec = util.promisify(require('child_process').exec)
const taskName = "编译源文件";

module.exports = async function compile(){
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('开始任务 任务名称：')} ${chalk.yellow(taskName)}`)
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第一步')} ${chalk.blue('删除文件夹lib')}`)
    if(fs.statSync(path.join(__dirname, "../lib")).isDirectory()){
        let { rmout, rmerr } = await exec(`rm -rf ${path.join(__dirname,"../lib")}`)
        if (rmerr) {
            console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.red("删除文件夹"+path.join(__dirname,'../src')+"失败")}`)
        } else {
            console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功删除文件夹")}${chalk.cyan(path.join(__dirname,'../lib'))}`)
        }
    }
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第二步')} ${chalk.blue('编译所有的文件')}`)
    let startTime = Date.now()
    let { cmout, cmerr } = await exec(`${path.join(__dirname,"../node_modules/.bin/babel")} ${path.join(__dirname,"../src")} --plugins @babel/plugin-proposal-class-properties --presets=@babel/env  --out-dir ${path.join(__dirname,"../lib")}`)
    if (cmerr) {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.magenta("文件编译失败 失败原因：")}${chalk.red(cmerr)}`)
    } else {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("文件编译失败 用时：")}${chalk.red((Date.now() - startTime) / 1000)}秒`)
    }

    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('完成任务 任务名称: ')} ${chalk.yellow(taskName)}`)
}