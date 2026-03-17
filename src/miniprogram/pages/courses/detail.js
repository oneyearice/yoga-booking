// courses/detail/detail.js
const { showError, showModal, loading } = require('../../../utils/errorHandler');

Page({
  data: {
    courseId: '',
    courseDetail: {
      id: 1,
      name: '基础瑜伽',
      category: '瑜伽',
      duration: 60,
      price: 120,
      coachName: '张教练',
      description: '适合初学者的基础瑜伽课程，帮助放松身心，提升柔韧性。课程包括呼吸练习、基础体式和冥想环节，让您在舒缓的节奏中感受瑜伽的魅力。',
      capacity: 10,
      bookedCount: 6,
      coverImage: '/images/yoga.jpg'
    },
    availableSlots: [
      { id: 1, date: '今天', time: '10:00', available: true },
      { id: 2, date: '今天', time: '14:00', available: true },
      { id: 3, date: '今天', time: '19:00', available: false },
      { id: 4, date: '明天', time: '09:00', available: true },
      { id: 5, date: '明天', time: '15:00', available: true },
      { id: 6, date: '明天', time: '18:00', available: true }
    ],
    selectedSlot: null,
    loading: false
  },

  onLoad: function(options) {
    // 获取传入的课程ID
    if (options.id) {
      this.setData({
        courseId: options.id
      });
      
      // 在实际项目中这里会通过API获取课程详情
      // 这里使用模拟数据
      this.loadCourseDetail(options.id);
    }
  },

  // 加载课程详情（模拟）
  loadCourseDetail: function(courseId) {
    // 这里可以根据courseId加载不同的课程数据
    // 暂时使用固定数据
    console.log('Loading course detail for ID:', courseId);
  },

  // 选择时间槽
  selectTimeSlot: function(e) {
    const slot = e.currentTarget.dataset.slot;
    if (!slot.available) {
      showError('该时间段已约满，请选择其他时间');
      return;
    }
    
    this.setData({
      selectedSlot: slot
    });
    
    showError('已选择 ' + slot.date + ' ' + slot.time, 'success');
  },

  // 立即预约
  bookNow: function() {
    if (!this.data.selectedSlot) {
      showError('请选择预约时间');
      return;
    }

    // 检查用户登录状态
    const app = getApp();
    if (!app.globalData.userInfo) {
      showModal({
        title: '需要登录',
        content: '请先登录后预约课程',
        confirmText: '去登录',
        cancelText: '取消'
      }).then((res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/auth/login',
            fail: (err) => {
              console.error('页面跳转失败:', err);
            }
          });
        }
      });
      return;
    }

    // 立即跳转到预约确认页面 (优化：不进行额外检查，直接导航)
    wx.navigateTo({
      url: `/pages/booking/confirm?courseId=${this.data.courseId}&courseName=${encodeURIComponent(this.data.courseDetail.name)}&slotId=${this.data.selectedSlot.id}&time=${encodeURIComponent(this.data.selectedSlot.date + ' ' + this.data.selectedSlot.time)}&price=${this.data.courseDetail.price}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 添加收藏
  addToFavorites: function() {
    showError('已收藏', 'success');
  }
});