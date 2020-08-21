const Dotenv = require("dotenv-webpack");
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, "src", "index.js"), 
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, ".env"),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            }
        ]
    }
};