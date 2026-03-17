// user/index/index.js
const { showError, showModal, loading } = require('../../../utils/errorHandler');

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
    wx.navigateTo({
      url: '/pages/user/profile-edit',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往充值
  goToRecharge: function() {
    wx.navigateTo({
      url: '/pages/user/recharge',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往我的预约
  goToMyBookings: function() {
    // 优化导航：立即执行，不进行不必要的检查
    wx.navigateTo({
      url: '/pages/booking/list',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往课程记录
  goToCourseHistory: function() {
    wx.navigateTo({
      url: '/pages/user/course-history',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往我的收藏
  goToFavorites: function() {
    wx.navigateTo({
      url: '/pages/user/favorites',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往优惠券
  goToCoupons: function() {
    wx.navigateTo({
      url: '/pages/user/coupons',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往预约记录
  goToBookingRecords: function() {
    wx.navigateTo({
      url: '/pages/user/booking-records',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往课时记录
  goToCreditHistory: function() {
    wx.navigateTo({
      url: '/pages/user/credit-history',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往地址管理
  goToAddressManage: function() {
    wx.navigateTo({
      url: '/pages/user/address',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往客服中心
  goToCustomerService: function() {
    wx.navigateTo({
      url: '/pages/user/customer-service',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 前往设置
  goToSettings: function() {
    wx.navigateTo({
      url: '/pages/user/settings',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 按状态查看预约
  goToMyBookingsByStatus: function(e) {
    const status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: `/pages/booking/list?status=${status}`,
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