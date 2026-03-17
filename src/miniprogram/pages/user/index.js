// user/index/index.js
const { showError, showModal, loading } = require('../../utils/errorHandler');

Page({
  data: {
    userInfo: {
      avatar: '/images/default-avatar.png',
      nickName: '张三',
      creditBalance: 8
    },
    bookingStats: {
      total: 15,
      upcoming: 3,
      completed: 10,
      cancelled: 2
    },
    loading: false
  },

  onLoad: function() {
    // 页面加载时获取用户信息
    this.getUserInfo();
  },

  onShow: function() {
    // 页面显示时刷新数据
    this.refreshData();
  },

  // 获取用户信息
  getUserInfo: function() {
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  // 刷新数据
  refreshData: function() {
    // 模拟获取最新数据
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        creditBalance: 8 // 模拟当前课时余额
      },
      bookingStats: {
        total: 15,
        upcoming: 3,
        completed: 10,
        cancelled: 2
      }
    });
  },

  // 前往资料编辑
  goToProfileEdit: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往充值
  goToRecharge: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往我的预约
  goToMyBookings: function() {
    wx.navigateTo({
      url: '/pages/booking/list',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往课程记录
  goToCourseHistory: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往我的收藏
  goToFavorites: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往优惠券
  goToCoupons: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往预约记录
  goToBookingRecords: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往课时记录
  goToCreditHistory: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往地址管理
  goToAddressManage: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往客服中心
  goToCustomerService: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 前往设置
  goToSettings: function() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 按状态查看预约
  goToMyBookingsByStatus: function(e) {
    const status = e.currentTarget.dataset.status;
    wx.switchTab({
      url: '/pages/booking/list',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    loading.showRefresh();
    
    // 模拟刷新数据
    setTimeout(() => {
      this.refreshData();
      loading.hideRefresh();
      wx.stopPullDownRefresh(); // 停止下拉刷新动画
      showError('数据已刷新', 'success');
    }, 1000);
  }
});