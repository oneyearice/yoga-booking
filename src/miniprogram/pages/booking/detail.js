// pages/booking/list/detail/detail.js
Page({
  data: {
    bookingId: '',
    bookingDetail: {
      id: 1,
      courseName: '基础瑜伽',
      coachName: '张教练',
      date: '2026-03-18',
      time: '10:00',
      duration: 60,
      price: 120,
      status: 'confirmed',
      statusText: '已确认',
      studentName: '张三',
      studentPhone: '138****8765',
      bookingTime: '2026-03-17 09:30',
      paymentStatus: 'paid',
      paymentMethod: '微信支付',
      specialRequirements: '无',
      createdAt: '2026-03-17 09:30',
      updatedAt: '2026-03-17 09:30'
    },
    loading: true
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        bookingId: options.id
      });
      this.loadBookingDetail(options.id);
    }
  },

  onShow: function() {
    // 每次进入页面都刷新数据
    if (this.data.bookingId) {
      this.loadBookingDetail(this.data.bookingId);
    }
  },

  // 加载预约详情
  loadBookingDetail: function(bookingId) {
    this.setData({ loading: true });
    
    // 模拟API调用
    setTimeout(() => {
      // 根据ID设置详细信息
      const bookingDetail = {
        ...this.data.bookingDetail,
        id: bookingId,
        courseName: bookingId % 2 === 0 ? '流瑜伽' : '基础瑜伽',
        coachName: bookingId % 3 === 0 ? '李教练' : bookingId % 2 === 0 ? '王教练' : '张教练',
        date: '2026-03-' + (18 + (bookingId % 7)),
        time: ['09:00', '10:00', '14:00', '15:00', '19:00'][bookingId % 5],
        status: bookingId % 3 === 0 ? 'cancelled' : bookingId % 2 === 0 ? 'pending' : 'confirmed',
        statusText: bookingId % 3 === 0 ? '已取消' : bookingId % 2 === 0 ? '待确认' : '已确认'
      };
      
      this.setData({
        bookingDetail,
        loading: false
      });
    }, 800);
  },

  // 取消预约
  cancelBooking: function() {
    if (this.data.bookingDetail.status === 'confirmed') {
      wx.showModal({
        title: '确认取消',
        content: '确定要取消此预约吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟取消预约
            setTimeout(() => {
              wx.showToast({
                title: '已取消',
                icon: 'success'
              });
              
              // 更新状态
              const newDetail = { ...this.data.bookingDetail, status: 'cancelled', statusText: '已取消' };
              this.setData({ bookingDetail: newDetail });
            }, 300);
          }
        }
      });
    } else {
      wx.showToast({
        title: '无法取消',
        icon: 'none'
      });
    }
  },

  // 联系教练
  contactCoach: function() {
    wx.makePhoneCall({
      phoneNumber: '13900000000', // 示例电话
      fail: () => {
        wx.showToast({
          title: '无法拨打电话',
          icon: 'none'
        });
      }
    });
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  }
});