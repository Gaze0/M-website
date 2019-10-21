const path = require('path');
const {src,dest,series,parallel,watch} = require("gulp");
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');
const proxy = require('http-proxy-middleware'); //服务器代理

const devPath = '../../dev';

function copyHTML(){
    return src('../*.html')
    .pipe(dest(devPath))
    .pipe(connect.reload())
}

function packSCSS(){
    return src('../styles/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(dest(`${devPath}/styles/`))
        .pipe(connect.reload())
}

function copylibs(){
    return src('../libs/**/*')
    .pipe(dest(`${devPath}/libs/`))
}

function gulpServer(){
    return connect.server({
        name: 'Dist App',
        root: devPath,
        port: 8000,
        // host:'10.9.49.161',
        livereload: true,
        middleware:()=>{
            return [
               proxy('/api',{
                target: 'http://m.maoyan.com',
                changeOrigin:true,
                pathRewrite: {
                    '^/api': ''
                }
            })
            ]
        }
      });
}

function packJS(){
    return src('../scripts/*.js')
    .pipe(webpack({//production 压缩
        mode:'development', //development开发
        entry: {
            app:'../scripts/app.js',
            'app-mine':'../scripts/app-mine.js'
        },//入口
        output:{ //出口
            path:path.resolve(__dirname,devPath),
            // __dirname 表示当前文件的物理路径
            filename:'[name].js'
        },
        module:{
            rules:[
                // {
                //     test:/\.html$/,
                //     loader:'string-loader'
                // },
                {
                    test:/\.art$/,
                    loader:'art-template-loader'
                },
                {
                    test:/\.scss$/,
                    use:[
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        }
    }))
    .pipe(dest(`${devPath}/scripts`))
    .pipe(connect.reload())
}

function copyAssets(){
    return src('../assets/**/*')
    .pipe(dest(`${devPath}/assets`))
}
function watchFiles(){
    watch('../*.html',series(copyHTML))
    watch('../libs/*', series(copylibs))
    watch('../**/*', series(packJS))
    watch('../**/*.scss', series(packSCSS))
}

exports.default = series(parallel(copyHTML,packSCSS,packJS,copylibs,copyAssets),parallel(gulpServer,watchFiles));