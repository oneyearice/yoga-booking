// booking/list/list.js
const { showError, showModal, loading } = require('../../utils/errorHandler');

Page({
  data: {
    currentTab: 'all',
    bookingList: [],
    allBookings: [
      {
        id: 1,
        courseId: 1,
        courseName: '基础瑜伽',
        courseCover: '/images/yoga.jpg',
        coachName: '张教练',
        bookingDate: '明天',
        bookingTime: '10:00',
        peopleCount: 1,
        status: 'upcoming',
        statusText: '待上课',
        location: '1号楼2楼瑜伽室',
        canCancel: true,
        reviewed: false
      },
      {
        id: 2,
        courseId: 3,
        courseName: '塑形普拉提',
        courseCover: '/images/pilates.jpg',
        coachName: '王教练',
        bookingDate: '后天',
        bookingTime: '19:00',
        peopleCount: 2,
        status: 'upcoming',
        statusText: '待上课',
        location: '1号楼3楼普拉提室',
        canCancel: true,
        reviewed: false
      },
      {
        id: 3,
        courseId: 2,
        courseName: '流瑜伽',
        courseCover: '/images/liuyoga.jpg',
        coachName: '李教练',
        bookingDate: '昨天',
        bookingTime: '18:00',
        peopleCount: 1,
        status: 'completed',
        statusText: '已完成',
        location: '1号楼2楼瑜伽室',
        canCancel: false,
        reviewed: true
      },
      {
        id: 4,
        courseId: 4,
        courseName: '中医推拿',
        courseCover: '/images/tuina.jpg',
        coachName: '刘医师',
        bookingDate: '上周三',
        bookingTime: '15:00',
        peopleCount: 1,
        status: 'completed',
        statusText: '已完成',
        location: '2号楼1楼理疗室',
        canCancel: false,
        reviewed: true
      },
      {
        id: 5,
        courseId: 5,
        courseName: '温灸养生',
        courseCover: '/images/moxibustion.jpg',
        coachName: '陈医师',
        bookingDate: '上月',
        bookingTime: '14:00',
        peopleCount: 1,
        status: 'cancelled',
        statusText: '已取消',
        location: '2号楼2楼艾灸室',
        canCancel: false,
        reviewed: false
      }
    ],
    emptyText: '暂无预约记录'
  },

  onLoad: function(options) {
    // 如果有状态参数，应用筛选
    if (options.status) {
      this.setData({
        currentTab: options.status
      });
    }
    
    // 初始化显示
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
    // 优化导航：立即执行，不进行不必要的检查
    wx.navigateTo({
      url: `/pages/booking/detail?id=${id}`
    });
  },

  // 联系教练
  contactCoach: function(e) {
    const coach = e.currentTarget.dataset.coach;
    showModal({
      title: '联系教练',
      content: `您可以通过电话或微信联系${coach}`,
      confirmText: '拨打电话',
      cancelText: '取消'
    }).then((res) => {
      if (res.confirm) {
        // 这里应该是实际的拨号功能
        wx.makePhoneCall({
          phoneNumber: '13800138000' // 示例电话号码
        }).catch((error) => {
          showError('拨打电话失败，请稍后再试');
        });
      }
    });
  },

  // 查看位置
  viewLocation: function(e) {
    const location = e.currentTarget.dataset.location;
    showModal({
      title: '上课地点',
      content: location,
      showCancel: false,
      confirmText: '确定'
    });
  },

  // 取消预约
  cancelBooking: function(e) {
    const id = e.currentTarget.dataset.id;
    
    showModal({
      title: '确认取消',
      content: '确定要取消此次预约吗？请注意：提前3小时内取消将扣除1课时。',
      confirmText: '确认取消',
      cancelText: '暂不取消'
    }).then((res) => {
      if (res.confirm) {
        this.performCancel(id);
      }
    });
  },

  // 执行取消操作
  performCancel: function(id) {
    loading.show('取消中...');

    // 模拟取消预约
    setTimeout(() => {
      loading.hide();
      showError('已取消预约', 'success');

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

  // 再次预约
  rebook: function(e) {
    const courseId = e.currentTarget.dataset.course;
    wx.navigateTo({
      url: `/pages/courses/detail?id=${courseId}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 添加评价
  addReview: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/booking/review?id=${id}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  }
});