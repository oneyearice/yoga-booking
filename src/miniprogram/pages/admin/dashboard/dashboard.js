// pages/admin/dashboard/dashboard.js
Page({
  data: {
    stats: {
      totalUsers: 0,
      totalCourses: 0,
      todayBookings: 0,
      revenue: 0
    },
    recentActivities: [],
    loading: true
  },

  onLoad: function(options) {
    this.loadDashboardData();
  },

  onShow: function() {
    // 每次进入页面都刷新数据
    this.loadDashboardData();
  },

  // 加载仪表盘数据
  loadDashboardData: function() {
    this.setData({ loading: true });
    
    // 模拟API调用
    setTimeout(() => {
      this.setData({
        stats: {
          totalUsers: 1247,
          totalCourses: 24,
          todayBookings: 32,
          revenue: 4850
        },
        recentActivities: [
          { id: 1, type: 'booking', user: '张三', course: '基础瑜伽', time: '10分钟前', status: 'confirmed' },
          { id: 2, type: 'booking', user: '李四', course: '流瑜伽', time: '25分钟前', status: 'confirmed' },
          { id: 3, type: 'user', user: '王五', time: '1小时前', status: 'registered' },
          { id: 4, type: 'booking', user: '赵六', course: '普拉提', time: '2小时前', status: 'pending' }
        ],
        loading: false
      });
    }, 800);
  },

  // 刷新数据
  refreshData: function() {
    this.loadDashboardData();
  },

  // 跳转到用户管理
  goToUserManagement: function() {
    wx.navigateTo({
      url: '/pages/admin/users/users',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 跳转到课程管理
  goToCourseManagement: function() {
    wx.navigateTo({
      url: '/pages/admin/courses/courses',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 跳转到排课管理
  goToScheduleManagement: function() {
    wx.navigateTo({
      url: '/pages/admin/schedule/schedule',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  }
});