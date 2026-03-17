// pages/admin/schedule/schedule.js
Page({
  data: {
    selectedDate: '2026-03-15',
    selectedDateText: '今天 (3月15日)',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    futureEndDate: '2026-12-31',
    courseFilterIndex: 0,
    coachFilterIndex: 0,
    courseOptions: ['全部课程', '基础瑜伽', '流瑜伽', '塑形普拉提', '中医推拿', '温灸养生'],
    coachOptions: ['全部教练', '张教练', '李教练', '王教练', '刘医师', '陈医师'],
    scheduleList: [
      {
        id: 1,
        date: '2026-03-15',
        startTime: '09:00',
        endTime: '10:00',
        courseName: '基础瑜伽',
        coachName: '张教练',
        location: '1号楼2楼瑜伽室',
        bookedCount: 8,
        maxCapacity: 10,
        status: 'active',
        statusText: '正常'
      },
      {
        id: 2,
        date: '2026-03-15',
        startTime: '11:00',
        endTime: '12:00',
        courseName: '流瑜伽',
        coachName: '李教练',
        location: '1号楼2楼瑜伽室',
        bookedCount: 6,
        maxCapacity: 8,
        status: 'active',
        statusText: '正常'
      },
      {
        id: 3,
        date: '2026-03-15',
        startTime: '14:00',
        endTime: '15:00',
        courseName: '塑形普拉提',
        coachName: '王教练',
        location: '1号楼3楼普拉提室',
        bookedCount: 1,
        maxCapacity: 12,
        status: 'active',
        statusText: '正常'
      },
      {
        id: 4,
        date: '2026-03-15',
        startTime: '19:00',
        endTime: '20:00',
        courseName: '晚课阴瑜伽',
        coachName: '张教练',
        location: '1号楼2楼瑜伽室',
        bookedCount: 12,
        maxCapacity: 15,
        status: 'full',
        statusText: '约满'
      },
      {
        id: 5,
        date: '2026-03-16',
        startTime: '10:00',
        endTime: '11:00',
        courseName: '中医推拿',
        coachName: '刘医师',
        location: '2号楼1楼理疗室',
        bookedCount: 2,
        maxCapacity: 5,
        status: 'active',
        statusText: '正常'
      }
    ],
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
    emptyText: '暂无排课数据',
    showScheduleModal: false,
    showAutoScheduleModal: false,
    modalTitle: '',
    formData: {
      id: null,
      date: '',
      startTime: '',
      endTime: '',
      courseName: '',
      coachName: '',
      location: '',
      maxCapacity: ''
    },
    autoFormData: {
      coachName: '',
      startDate: '',
      endDate: '',
      repeatRule: 'daily'
    },
    allCourses: [
      { id: 1, name: '基础瑜伽', duration: 60 },
      { id: 2, name: '流瑜伽', duration: 75 },
      { id: 3, name: '塑形普拉提', duration: 45 },
      { id: 4, name: '中医推拿', duration: 60 },
      { id: 5, name: '温灸养生', duration: 90 },
      { id: 6, name: '晚课阴瑜伽', duration: 60 }
    ],
    allCoaches: [
      { id: 1, name: '张教练', specialty: ['瑜伽'] },
      { id: 2, name: '李教练', specialty: ['瑜伽'] },
      { id: 3, name: '王教练', specialty: ['普拉提'] },
      { id: 4, name: '刘医师', specialty: ['推拿'] },
      { id: 5, name: '陈医师', specialty: ['艾灸'] }
    ]
  },

  onLoad: function() {
    this.initData();
  },

  initData: function() {
    // 初始化日期显示
    this.updateDateDisplay();
    this.updatePagination();
  },

  updateDateDisplay: function() {
    const now = new Date();
    const selected = new Date(this.data.selectedDate);
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
  },

  updatePagination: function() {
    const total = this.data.scheduleList.length;
    const totalPages = Math.ceil(total / this.data.pageSize);
    this.setData({
      totalPages: totalPages
    });
  },

  // 日期选择改变
  bindDateChange: function(e) {
    const date = e.detail.value;
    this.setData({
      selectedDate: date
    });
    this.updateDateDisplay();
    this.filterSchedules();
  },

  // 课程筛选
  onCourseFilterChange: function(e) {
    this.setData({
      courseFilterIndex: e.detail.value
    });
    this.filterSchedules();
  },

  // 教练筛选
  onCoachFilterChange: function(e) {
    this.setData({
      coachFilterIndex: e.detail.value
    });
    this.filterSchedules();
  },

  // 筛选排课
  filterSchedules: function() {
    let filteredList = this.data.scheduleList;

    // 按日期筛选
    if (this.data.selectedDate) {
      filteredList = filteredList.filter(schedule => 
        schedule.date === this.data.selectedDate
      );
    }

    // 按课程筛选
    if (this.data.courseFilterIndex > 0) {
      const course = this.data.courseOptions[this.data.courseFilterIndex];
      filteredList = filteredList.filter(schedule => 
        schedule.courseName === course
      );
    }

    // 按教练筛选
    if (this.data.coachFilterIndex > 0) {
      const coach = this.data.coachOptions[this.data.coachFilterIndex];
      filteredList = filteredList.filter(schedule => 
        schedule.coachName === coach
      );
    }

    this.setData({
      scheduleList: filteredList
    });
  },

  // 上一页
  prevPage: function() {
    if (this.data.currentPage > 1) {
      this.setData({
        currentPage: this.data.currentPage - 1
      });
    }
  },

  // 下一页
  nextPage: function() {
    if (this.data.currentPage < this.data.totalPages) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
    }
  },

  // 刷新列表
  refreshList: function() {
    // 这里实际项目中会从后端重新获取数据
    wx.showToast({
      title: '列表已刷新',
      icon: 'success'
    });
  },

  // 新增排课
  addSchedule: function() {
    this.setData({
      showScheduleModal: true,
      modalTitle: '新增排课',
      formData: {
        id: null,
        date: this.data.selectedDate,
        startTime: '09:00',
        endTime: '10:00',
        courseName: '',
        coachName: '',
        location: '',
        maxCapacity: ''
      }
    });
  },

  // 编辑排课
  editSchedule: function(e) {
    const schedule = e.currentTarget.dataset.schedule;
    this.setData({
      showScheduleModal: true,
      modalTitle: '编辑排课',
      formData: {
        id: schedule.id,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        courseName: schedule.courseName,
        coachName: schedule.coachName,
        location: schedule.location,
        maxCapacity: schedule.maxCapacity.toString()
      }
    });
  },

  // 删除排课
  deleteSchedule: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条排课吗？此操作不可恢复。',
      confirmText: '删除',
      confirmColor: '#ff4757',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.performDelete(id);
        }
      }
    });
  },

  // 执行删除
  performDelete: function(id) {
    wx.showLoading({
      title: '删除中...'
    });

    // 模拟删除操作
    setTimeout(() => {
      wx.hideLoading();
      const updatedList = this.data.scheduleList.filter(schedule => schedule.id !== id);
      this.setData({
        scheduleList: updatedList
      });
      
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 切换排课状态
  toggleScheduleStatus: function(e) {
    const id = e.currentTarget.dataset.id;
    const currentStatus = e.currentTarget.dataset.status;
    const newStatus = currentStatus === 'active' ? 'cancelled' : 'active';
    const statusText = newStatus === 'active' ? '启用' : '取消';

    wx.showModal({
      title: '确认操作',
      content: `确定要${statusText}这条排课吗？`,
      success: (res) => {
        if (res.confirm) {
          this.performToggle(id, newStatus);
        }
      }
    });
  },

  // 执行状态切换
  performToggle: function(id, newStatus) {
    const updatedList = this.data.scheduleList.map(schedule => {
      if (schedule.id === id) {
        return {
          ...schedule,
          status: newStatus,
          statusText: newStatus === 'active' ? '正常' : '已取消'
        };
      }
      return schedule;
    });

    this.setData({
      scheduleList: updatedList
    });

    wx.showToast({
      title: newStatus === 'active' ? '已启用' : '已取消',
      icon: 'success'
    });
  },

  // 表单输入处理
  onFormCourseChange: function(e) {
    const index = e.detail.value;
    const course = this.data.allCourses[index];
    this.setData({
      'formData.courseName': course.name
    });
  },

  onFormCoachChange: function(e) {
    const index = e.detail.value;
    const coach = this.data.allCoaches[index];
    this.setData({
      'formData.coachName': coach.name
    });
  },

  onFormDateChange: function(e) {
    this.setData({
      'formData.date': e.detail.value
    });
  },

  onFormStartTimeChange: function(e) {
    this.setData({
      'formData.startTime': e.detail.value
    });
  },

  onFormEndTimeChange: function(e) {
    this.setData({
      'formData.endTime': e.detail.value
    });
  },

  onLocationInput: function(e) {
    this.setData({
      'formData.location': e.detail.value
    });
  },

  onMaxCapacityInput: function(e) {
    this.setData({
      'formData.maxCapacity': e.detail.value
    });
  },

  // 保存排课
  saveSchedule: function() {
    const formData = this.data.formData;

    // 验证必填字段
    if (!formData.date || !formData.startTime || !formData.endTime || 
        !formData.courseName || !formData.coachName || !formData.location || 
        !formData.maxCapacity) {
      wx.showToast({
        title: '请填写必填字段',
        icon: 'none'
      });
      return;
    }

    // 验证时间逻辑
    if (formData.startTime >= formData.endTime) {
      wx.showToast({
        title: '结束时间必须大于开始时间',
        icon: 'none'
      });
      return;
    }

    // 验证容量
    if (isNaN(formData.maxCapacity) || parseInt(formData.maxCapacity) <= 0) {
      wx.showToast({
        title: '请检查容量设置',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...'
    });

    // 模拟保存操作
    setTimeout(() => {
      wx.hideLoading();

      if (formData.id) {
        // 编辑现有排课
        const updatedList = this.data.scheduleList.map(schedule => {
          if (schedule.id === formData.id) {
            return {
              ...schedule,
              date: formData.date,
              startTime: formData.startTime,
              endTime: formData.endTime,
              courseName: formData.courseName,
              coachName: formData.coachName,
              location: formData.location,
              maxCapacity: parseInt(formData.maxCapacity)
            };
          }
          return schedule;
        });

        this.setData({
          scheduleList: updatedList,
          showScheduleModal: false
        });

        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
      } else {
        // 新增排课
        const newSchedule = {
          id: this.data.scheduleList.length + 1,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          courseName: formData.courseName,
          coachName: formData.coachName,
          location: formData.location,
          bookedCount: 0,
          maxCapacity: parseInt(formData.maxCapacity),
          status: 'active',
          statusText: '正常'
        };

        const updatedList = [newSchedule, ...this.data.scheduleList];
        this.setData({
          scheduleList: updatedList,
          showScheduleModal: false
        });

        wx.showToast({
          title: '新增成功',
          icon: 'success'
        });
      }
    }, 1000);
  },

  // 关闭排课模态框
  closeModal: function() {
    this.setData({
      showScheduleModal: false
    });
  },

  // 自动排课
  autoSchedule: function() {
    this.setData({
      showAutoScheduleModal: true,
      autoFormData: {
        coachName: '',
        startDate: this.data.selectedDate,
        endDate: this.data.selectedDate,
        repeatRule: 'daily'
      }
    });
  },

  // 自动排课教练选择
  onAutoCoachChange: function(e) {
    const index = e.detail.value;
    const coach = this.data.allCoaches[index];
    this.setData({
      'autoFormData.coachName': coach.name
    });
  },

  onAutoStartDateChange: function(e) {
    this.setData({
      'autoFormData.startDate': e.detail.value
    });
  },

  onAutoEndDateChange: function(e) {
    this.setData({
      'autoFormData.endDate': e.detail.value
    });
  },

  onRepeatRuleChange: function(e) {
    this.setData({
      'autoFormData.repeatRule': e.detail.value
    });
  },

  // 执行自动排课
  performAutoSchedule: function() {
    const formData = this.data.autoFormData;

    if (!formData.coachName || !formData.startDate || !formData.endDate) {
      wx.showToast({
        title: '请填写必要信息',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '生成中...'
    });

    // 模拟自动排课
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '自动排课已生成',
        icon: 'success'
      });

      // 关闭模态框
      this.setData({
        showAutoScheduleModal: false
      });
    }, 1500);
  },

  // 关闭自动排课模态框
  closeAutoScheduleModal: function() {
    this.setData({
      showAutoScheduleModal: false
    });
  }
});