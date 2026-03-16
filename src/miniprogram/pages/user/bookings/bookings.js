// pages/user/bookings/bookings.js
Page({
  data: {
    currentTab: 'all',
    bookingList: [],
    allBookings: [
      {
        id: 1,
        bookingId: 'BK20260315001',
        courseName: '基础瑜伽',
        coachName: '张教练',
        bookingDate: '明天',
        bookingTime: '10:00',
        peopleCount: 1,
        location: '1号楼2楼瑜伽室',
        status: 'upcoming',
        statusText: '待上课',
        createTime: '2026-03-15 10:30',
        canCancel: true
      },
      {
        id: 2,
        bookingId: 'BK20260315002',
        courseName: '塑形普拉提',
        coachName: '王教练',
        bookingDate: '后天',
        bookingTime: '19:00',
        peopleCount: 2,
        location: '1号楼3楼普拉提室',
        status: 'upcoming',
        statusText: '待上课',
        createTime: '2026-03-15 09:15',
        canCancel: true
      },
      {
        id: 3,
        bookingId: 'BK20260314001',
        courseName: '流瑜伽',
        coachName: '李教练',
        bookingDate: '昨天',
        bookingTime: '18:00',
        peopleCount: 1,
        location: '1号楼2楼瑜伽室',
        status: 'completed',
        statusText: '已完成',
        createTime: '2026-03-14 14:20',
        canCancel: false
      },
      {
        id: 4,
        bookingId: 'BK20260310001',
        courseName: '中医推拿',
        coachName: '刘医师',
        bookingDate: '上周五',
        bookingTime: '15:00',
        peopleCount: 1,
        location: '2号楼1楼理疗室',
        status: 'completed',
        statusText: '已完成',
        createTime: '2026-03-10 11:45',
        canCancel: false
      },
      {
        id: 5,
        bookingId: 'BK20260308001',
        courseName: '温灸养生',
        coachName: '陈医师',
        bookingDate: '上周日',
        bookingTime: '14:00',
        peopleCount: 1,
        location: '2号楼2楼艾灸室',
        status: 'cancelled',
        statusText: '已取消',
        createTime: '2026-03-08 16:30',
        canCancel: false
      }
    ],
    emptyText: '暂无预约记录'
  },

  onLoad: function(options) {
    // 页面加载时初始化
    if (options.tab) {
      this.setData({
        currentTab: options.tab
      });
    }
    this.filterBookings();
  },

  // 切换标签页
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
    this.filterBookings();
  },

  // 筛选预约
  filterBookings: function() {
    let filteredList = this.data.allBookings;

    if (this.data.currentTab !== 'all') {
      filteredList = filteredList.filter(booking => {
        return booking.status === this.data.currentTab;
      });
    }

    this.setData({
      bookingList: filteredList
    });

    // 设置空状态文本
    const statusTextMap = {
      all: '暂无预约记录',
      upcoming: '暂无待上课的预约',
      completed: '暂无已完成的预约',
      cancelled: '暂无已取消的预约'
    };
    this.setData({
      emptyText: statusTextMap[this.data.currentTab] || '暂无预约记录'
    });
  },

  // 查看预约详情
  viewBookingDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/booking/detail?id=${id}`
    });
  },

  // 取消预约
  cancelBooking: function(e) {
    e.stopPropagation(); // 阻止事件冒泡到父元素的tap事件
    
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此次预约吗？请注意：提前3小时内取消将扣除1课时。',
      confirmText: '确认取消',
      cancelText: '暂不取消',
      success: (res) => {
        if (res.confirm) {
          this.performCancel(id);
        }
      }
    });
  },

  // 执行取消操作
  performCancel: function(id) {
    wx.showLoading({
      title: '取消中...'
    });

    // 模拟取消预约
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '已取消预约',
        icon: 'success'
      });

      // 更新本地数据
      const updatedBookings = this.data.allBookings.map(booking => {
        if (booking.id === id) {
          return {
            ...booking,
            status: 'cancelled',
            statusText: '已取消',
            canCancel: false
          };
        }
        return booking;
      });

      this.setData({
        allBookings: updatedBookings
      });

      // 重新筛选显示
      this.filterBookings();
    }, 1000);
  },

  // 联系教练
  contactCoach: function(e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    const coach = e.currentTarget.dataset.coach;
    wx.showActionSheet({
      itemList: [`呼叫${coach}`, `微信联系${coach}`],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 拨打电话
          wx.makePhoneCall({
            phoneNumber: '13800138000' // 示例电话
          });
        } else if (res.tapIndex === 1) {
          // 微信联系（实际项目中可能需要其他实现）
          wx.showToast({
            title: `已向${coach}发送微信邀请`,
            icon: 'none'
          });
        }
      }
    });
  },

  // 阻止事件冒泡（辅助函数）
  stopPropagation: function(e) {
    e.stopPropagation();
  }
});