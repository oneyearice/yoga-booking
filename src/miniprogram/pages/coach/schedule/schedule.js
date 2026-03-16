// pages/coach/schedule/schedule.js
Page({
  data: {
    coachInfo: {
      name: '张教练',
      title: '资深瑜伽导师',
      todayClasses: 3,
      todayStudents: 15
    },
    selectedDate: '2026-03-15',
    selectedDateText: '今天 (3月15日)',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    currentFilter: 'all',
    scheduleList: [
      {
        id: 1,
        className: '基础瑜伽',
        startTime: '09:00',
        endTime: '10:00',
        type: 'group',
        typeText: '团课',
        studentCount: 8,
        maxStudents: 10,
        location: '1号楼2楼瑜伽室',
        status: 'ongoing',
        statusText: '进行中'
      },
      {
        id: 2,
        className: '流瑜伽',
        startTime: '11:00',
        endTime: '12:00',
        type: 'group',
        typeText: '团课',
        studentCount: 6,
        maxStudents: 8,
        location: '1号楼2楼瑜伽室',
        status: 'upcoming',
        statusText: '待上课'
      },
      {
        id: 3,
        className: '私教普拉提',
        startTime: '14:00',
        endTime: '15:00',
        type: 'private',
        typeText: '私教',
        studentCount: 1,
        maxStudents: 1,
        location: '1号楼3楼私教室',
        status: 'upcoming',
        statusText: '待上课'
      },
      {
        id: 4,
        className: '晚课阴瑜伽',
        startTime: '19:00',
        endTime: '20:00',
        type: 'group',
        typeText: '团课',
        studentCount: 12,
        maxStudents: 15,
        location: '1号楼2楼瑜伽室',
        status: 'upcoming',
        statusText: '待上课'
      }
    ]
  },

  onLoad: function(options) {
    // 页面加载时获取教练信息
    this.getCoachInfo();
  },

  // 获取教练信息
  getCoachInfo: function() {
    // 实际项目中会从后端获取教练信息
    console.log('Loading coach info...');
  },

  // 日期选择改变
  bindDateChange: function(e) {
    const date = e.detail.value;
    this.setData({
      selectedDate: date
    });
    
    // 更新显示文本
    const now = new Date();
    const selected = new Date(date);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (selected.getTime() === today.getTime()) {
      this.setData({
        selectedDateText: '今天 (' + (selected.getMonth()+1) + '月' + selected.getDate() + '日)'
      });
    } else {
      this.setData({
        selectedDateText: (selected.getMonth()+1) + '月' + selected.getDate() + '日'
      });
    }
    
    // 重新加载课程表
    this.loadSchedule();
  },

  // 切换筛选条件
  switchFilter: function(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter
    });
    this.filterSchedule();
  },

  // 筛选课程
  filterSchedule: function() {
    let filteredList = this.data.scheduleList;
    
    if (this.data.currentFilter !== 'all') {
      filteredList = filteredList.filter(item => {
        return item.type === this.data.currentFilter;
      });
    }
    
    this.setData({
      scheduleList: filteredList
    });
  },

  // 加载课程表
  loadSchedule: function() {
    // 实际项目中会从后端获取课程表数据
    console.log('Loading schedule for date:', this.data.selectedDate);
  },

  // 查看课程详情
  viewClassDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coach/class-detail?id=${id}`
    });
  },

  // 查看学员名单
  viewStudentList: function() {
    wx.navigateTo({
      url: '/pages/coach/students'
    });
  },

  // 生成课时报告
  createClassReport: function() {
    wx.showModal({
      title: '生成课时报告',
      content: '确定要生成今天的课时报告吗？',
      confirmText: '生成',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '生成中...'
          });
          
          // 模拟生成报告
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '报告生成成功',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  }
});