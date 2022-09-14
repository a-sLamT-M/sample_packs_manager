const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.js',
    
      builderOptions: {
        productName: "Sample Packs Manager",
        extraResources: [{
          from: "./resources/images",
          to: "images",
        },{
          from: "node_modules/@electron/remote",
          to: "node_modules/@electron/remote",
        }],
        mac: {
          icon: "./resources/images/lib.png"
        },
        win: {
          icon: "./resources/images/lib.ico"
        },
      },
    }
  }
})
