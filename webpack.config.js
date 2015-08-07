module.exports = {
    entry: './src/_assets/js/main.js',
    output: {
        path: 'dist/build',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.json', '.coffee']
    }
};
