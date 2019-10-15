const chalk = require('chalk');
const moment = require("moment")
const util = require('util')
const fs = require('fs')
const path = require('path')
const process = require('process')
const exec = util.promisify(require('child_process').exec)
const taskName = "获取源文件";
/**
 * 获取源文件通过git
 * @method getResourceFile
 */
async function getResourceFile() {
    let { rmout, rmerr } = await exec(`rm -rf ${path.join(__dirname,"jsLib")}`)
    if (rmerr) {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.red("删除文件夹"+path.join(__dirname,'jsLib')+"失败")}`)
    } else {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功删除文件夹:")}${chalk.cyan(path.join(__dirname,'jsLib'))}`)
    }
    let startTime = Date.now()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("切换目录到task")}`)
    process.chdir(__dirname)
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("开始从远程获取文件")}`)
    let { gitout, giterr } = await exec(`git clone git@github.com:usernameisregistered/jsLib.git`)
    if (giterr) {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.magenta("文件获取失败 失败原因：")}${chalk.red(giterr)}`)
    } else {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("文件获取成功 用时：")}${chalk.red((Date.now() - startTime) / 1000)}秒`)
    }
    process.chdir(path.join(__dirname,"../"))
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("切换目录到../")}`)
}
/**
 * 创建文件夹
 * @method createDIr
 */
async function createDIr() {
    if(fs.statSync(path.join(__dirname, "../src")).isDirectory()){
        let { rmout, rmerr } = await exec(`rm -rf ${path.join(__dirname,"../src")}`)
        if (rmerr) {
            console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.red("删除文件夹"+path.join(__dirname,'../src')+"失败")}`)
        } else {
            console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功删除文件夹")}${chalk.cyan(path.join(__dirname,'../src'))}`)
        }
    }
    let { mkdirout, mkdirerr } = await exec(`mkdir ${path.join(__dirname, "../src")}`)
    if (mkdirout) {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.magenta("创建文件夹src失败 原因:")} ${chalk.red(mkdirout)}`)
    } else {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功创建文件夹src")}`)
    }
}
/**
 * 删除文件
 * @method removeFile
 * @param {String} rootDir
 * @default path.join(__dirname,"jsLib")
 */
async function removeFile(rootDir = path.join(__dirname,"jsLib")){
    let dir = fs.readdirSync(rootDir)
    for(let item of dir){
        let pathInfo = path.join(rootDir,item)
        if(fs.statSync(pathInfo).isDirectory()){
            removeFile(pathInfo)
        }else if(item.split(".").slice(-1)[0] != "js"){
            fs.unlinkSync(pathInfo)
        }
    }
    
}
/**
 * 移动文件
 * @method moveFile
 */
async function moveFile(){
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("开始移动文件")}`)
    let { mkdirout, mkdirerr } = await exec(`move ${path.join(__dirname,"jsLib")} ${path.join(__dirname,"../src")}`)
    if (mkdirout) {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.magenta("移动文件失败")} 原因${chalk.red(mkdirout)}`)
    } else {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功移动文件")}`)
    }
}
  
module.exports = async function getFile(){
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('开始任务 任务名称：')} ${chalk.yellow(taskName)}`)
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第一步')} ${chalk.blue('获取远程目录')}`)
    await getResourceFile()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第二步')} ${chalk.blue('创建必要文件夹')}`)
    await createDIr()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第三步')} ${chalk.blue('删除不必要的文件')}`)
    await removeFile()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第四步')} ${chalk.blue('移动文件到指定目录')}`)
    await moveFile()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('完成任务 任务名称: ')} ${chalk.yellow(taskName)}`)
}

