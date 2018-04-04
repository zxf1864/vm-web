const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: false,
    entry: './app/main/main.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.sass', '.css'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            components: path.join(__dirname, './app/components')
        }
    },
    module: {
        loaders: [{   //引入babel模块处理ES6代码
            test: /\.js|jsx$/,
            exclude: /node_modules/,
            loaders: 'babel-loader',

            query: {
                presets: ['react', 'es2015']
            }
        }, {
            test: /\.(css|scss)$/,
            // loader: "style-loader!css-loader!sass-loader",

            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            })

        }]
    },
    plugins: [
        // 将代码中有重复的依赖包去重
        new webpack.optimize.DedupePlugin(),
        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin("bundle.css"),//分离css资源
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }),
        //gzip 压缩,使用了express的gzip
        // new CompressionPlugin({
        //     asset: '[path].gz[query]',   // 目标文件名
        //     algorithm: 'gzip',   // 使用gzip压缩
        //     test: new RegExp(
        //         '\\.(js|css)$'    // 压缩 js 与 css
        //     ),
        //     threshold: 10240,   // 资源文件大于10240B=10kB时会被压缩
        //     minRatio: 1  // 最小压缩比达到0.8时才会被压缩
        // }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./dist/vendors-manifest.json")
        }),


    ]
}

console.log("==>> webpack.config.js#process.env.NODE_ENV is : " + process.env.NODE_ENV)