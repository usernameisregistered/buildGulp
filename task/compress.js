const chalk = require('chalk');
const moment = require("moment")
const util = require('util')
const fs = require('fs')
const path = require('path')
const process = require('process')
const exec = util.promisify(require('child_process').exec)
const taskName = "压缩源文件";
const concat = require('gulp-concat');
const gulp = require('gulp')
/**
 * 判断压缩文件包是否安装
 * @method uglifyExist
 */
async function uglifyExist(){
    let dir = path.parse(process.execPath).dir;
    let list = fs.readdirSync(dir)
    if(list.indexOf("uglifyjs") == -1){
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.red("uglify-js依赖包不存在")}`)
        await installUglify()
    }
}
/**
 * 安装依赖包
 * @method installUglify
 */
async function installUglify(){
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("开始安装依赖包uglify-js")}`)
    let startTime = Date.now()
    let { npmout, npmerr } = await exec(`npm install -g uglify-js`)
    if (npmerr) {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.red("安装依赖包uglify-js失败 失败原因"+npmerr)}`)
    } else {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功安装uglify-js依赖包 用时：")} ${chalk.red((Date.now() - startTime) / 1000)}秒`)
    }
}

/**
 * 编译文件
 * @method removeFile
 * @param {String} rootDir
 * @default path.join(__dirname,"../src")
 */
async function compressFile(rootDir = path.join(__dirname,"../lib")){
    let dir = fs.readdirSync(rootDir)
    for(let item of dir){
        let pathInfo = path.join(rootDir,item)
        if(fs.statSync(pathInfo).isDirectory()){
            await compressFile(pathInfo)
        }else{
            let { uglifyout, uglifyerr } = await exec(`uglifyjs ${pathInfo} --compress --output ${path.join(rootDir,item.split(".")[0] + '.min.js')}`)
            if (uglifyerr) {
                console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.red("文件 "+pathInfo + "编译失败")}`)
            } else {
                console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("文件 "+pathInfo + "编译成功")}`)
            }
        }
    } 
}
/**
 * 合并文件
 * @method combinFile
 */
async function combinFile(){
    gulp.src('../src/jsLib/Event/*.min.js')
    .pipe(concat({ path: 'Event.all.js', stat: { mode: 0666 }}))
    .pipe(gulp.dest('../dist/jsLib'))
    
    gulp.src('../src/jsLib/Preload/**/*.min.js')
    .pipe(concat({ path: 'Preload.all.js', stat: { mode: 0666 }}))
    .pipe(gulp.dest('../dist/jsLib'))
}

/**
 * 创建文件夹
 * @method createDIr
 */
async function createDIr() {
    try{
        if(fs.statSync(path.join(__dirname, "../dist")).isDirectory()){
            let { rmout, rmerr } = await exec(`rm -rf ${path.join(__dirname,"../dist")}`)
            if (rmerr) {
                console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.red("删除文件夹"+path.join(__dirname,'../dist')+"失败")}`)
            } else {
                console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功删除文件夹")}${chalk.cyan(path.join(__dirname,'../dist'))}`)
            }
        }
    }catch(e){

    }
    let { mkdirout, mkdirerr } = await exec(`mkdir ${path.join(__dirname, "../dist")}`)
    if (mkdirout) {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.magenta("创建文件夹dist失败 原因:")} ${chalk.red(mkdirout)}`)
    } else {
        console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.cyan("成功创建文件夹dist")}`)
    }
}


module.exports = async function compress(){
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('开始任务 任务名称：')} ${chalk.yellow(taskName)}`)
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第一步')} ${chalk.blue('检测依赖包是否存在')}`)
    await uglifyExist()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第二步')} ${chalk.blue('编译文件')}`)
    await compressFile()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第三步')} ${chalk.blue('创建必要文件夹')}`)
    await createDIr()
    // console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('第四步')} ${chalk.blue('合并文件')}`)
    // await combinFile()
    console.log(`[${chalk.gray(moment().format("HH:mm:ss"))}] ${chalk.green('完成任务 任务名称: ')} ${chalk.yellow(taskName)}`)
}