// app.js
const { showError } = require('./utils/errorHandler');

App({
  globalData: {
    userInfo: null
  },
  
  onLaunch: function () {
    // 小程序启动时执行
    console.log('小程序启动');
  },

  onShow: function (options) {
    // 小程序显示时执行
    console.log('小程序显示', options);
  },

  onHide: function () {
    // 小程序隐藏时执行
    console.log('小程序隐藏');
  },

  onError: function (msg) {
    // 小程序发生错误时执行
    console.error('小程序错误:', msg);
    
    // 在实际项目中，这里可以记录错误日志到服务器
    // 为用户提供友好的错误提示
    if (typeof msg === 'string' && msg.includes('thirdScriptError')) {
      showError('系统遇到一点小问题，请稍后重试', 'error');
    } else {
      showError('系统异常，请稍后重试', 'error');
    }
  },

  onPageNotFound: function (res) {
    // 页面不存在时执行
    console.warn('页面不存在:', res);
    wx.redirectTo({
      url: '/pages/index/index' // 重定向到首页
    });
  }
});