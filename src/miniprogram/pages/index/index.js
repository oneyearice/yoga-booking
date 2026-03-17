//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    categories: [
      { id: 1, name: '瑜伽', icon: '🧘' },
      { id: 2, name: '普拉提', icon: '🤸' },
      { id: 3, name: '推拿', icon: '💆' },
      { id: 4, name: '艾灸', icon: '🔥' }
    ],
    recommendedCourses: [
      { 
        id: 1, 
        name: '基础瑜伽', 
        duration: 60, 
        coachName: '张教练', 
        price: 120, 
        capacity: 10, 
        bookedCount: 6, 
        coverImage: '/images/yoga.jpg' 
      },
      { 
        id: 2, 
        name: '塑形普拉提', 
        duration: 45, 
        coachName: '李教练', 
        price: 150, 
        capacity: 8, 
        bookedCount: 3, 
        coverImage: '/images/pilates.jpg' 
      },
      { 
        id: 3, 
        name: '中医推拿', 
        duration: 60, 
        coachName: '王医生', 
        price: 200, 
        capacity: 5, 
        bookedCount: 2, 
        coverImage: '/images/tuina.jpg' 
      }
    ],
    myBookings: [
      { 
        id: 1, 
        courseName: '基础瑜伽', 
        startTime: '明天 10:00', 
        status: 'confirmed', 
        statusText: '已确认' 
      },
      { 
        id: 2, 
        courseName: '塑形普拉提', 
        startTime: '后天 19:00', 
        status: 'pending', 
        statusText: '待确认' 
      }
    ]
  },

  onLoad: function() {
    // 页面加载时获取用户信息
    this.getUserInfo()
  },

  getUserInfo: function() {
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      // 如果没有用户信息，跳转到授权页面
      wx.navigateTo({
        url: '/pages/auth/login'
      })
    }
  },

  // 立即预约按钮
  goToBooking: function() {
    wx.navigateTo({
      url: '/pages/courses/list',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    })
  },

  // 查看所有课程
  goToCourses: function() {
    wx.navigateTo({
      url: '/pages/courses/list',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    })
  },

  // 按分类筛选
  filterByCategory: function(e) {
    const category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: `/pages/courses/list?category=${category.id}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    })
  },

  // 查看课程详情
  viewCourseDetail: function(e) {
    const course = e.currentTarget.dataset.course
    wx.navigateTo({
      url: `/pages/courses/detail?id=${course.id}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    })
  },

  // 查看我的预约
  viewMyBookings: function() {
    wx.switchTab({
      url: '/pages/booking/list',
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    })
  },

  // 查看预约详情
  viewBookingDetail: function(e) {
    const booking = e.currentTarget.dataset.booking
    wx.navigateTo({
      url: `/pages/booking/list/detail?id=${booking.id}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    })
  }
})