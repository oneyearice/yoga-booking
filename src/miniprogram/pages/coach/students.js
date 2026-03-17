// pages/coach/students/students.js
Page({
  data: {
    searchKeyword: '',
    currentTab: 'all',
    studentList: [
      {
        id: 1,
        name: '李小明',
        gender: 'male',
        genderText: '男',
        phone: '138****1234',
        level: 'beginner',
        levelText: '初级',
        bookingCount: 8,
        attendanceCount: 6,
        creditBalance: 5,
        avatar: '李先生'
      },
      {
        id: 2,
        name: '王美丽',
        gender: 'female',
        genderText: '女',
        phone: '139****5678',
        level: 'intermediate',
        levelText: '中级',
        bookingCount: 15,
        attendanceCount: 14,
        creditBalance: 12,
        avatar: '王女士'
      },
      {
        id: 3,
        name: '张伟',
        gender: 'male',
        genderText: '男',
        phone: '136****9012',
        level: 'advanced',
        levelText: '高级',
        bookingCount: 20,
        attendanceCount: 18,
        creditBalance: 8,
        avatar: '张先生'
      },
      {
        id: 4,
        name: '刘晓雨',
        gender: 'female',
        genderText: '女',
        phone: '137****3456',
        level: 'beginner',
        levelText: '初级',
        bookingCount: 5,
        attendanceCount: 3,
        creditBalance: 2,
        avatar: '刘女士'
      },
      {
        id: 5,
        name: '陈志强',
        gender: 'male',
        genderText: '男',
        phone: '135****7890',
        level: 'intermediate',
        levelText: '中级',
        bookingCount: 12,
        attendanceCount: 11,
        creditBalance: 7,
        avatar: '陈先生'
      }
    ],
    allStudents: [],
    todayStudents: [],
    recentStudents: [],
    emptyText: '暂无学员信息'
  },

  onLoad: function() {
    // 初始化数据
    this.setData({
      allStudents: this.data.studentList,
      todayStudents: this.data.studentList.slice(0, 3), // 假设今天上课的学员
      recentStudents: this.data.studentList.slice(0, 5) // 假设近期活跃的学员
    });
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索
  onSearch: function() {
    if (!this.data.searchKeyword.trim()) {
      this.filterStudents();
      return;
    }

    const keyword = this.data.searchKeyword.toLowerCase();
    const filtered = this.data.studentList.filter(student => {
      return (
        student.name.toLowerCase().includes(keyword) ||
        student.phone.includes(this.data.searchKeyword)
      );
    });

    this.setData({
      studentList: filtered
    });
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
    this.filterStudents();
  },

  // 筛选学员
  filterStudents: function() {
    let filteredList = [];

    switch(this.data.currentTab) {
      case 'all':
        filteredList = this.data.allStudents;
        break;
      case 'today':
        filteredList = this.data.todayStudents;
        break;
      case 'recent':
        filteredList = this.data.recentStudents;
        break;
      default:
        filteredList = this.data.allStudents;
    }

    // 如果有搜索关键词，再进行搜索过滤
    if (this.data.searchKeyword.trim()) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filteredList = filteredList.filter(student => {
        return (
          student.name.toLowerCase().includes(keyword) ||
          student.phone.includes(this.data.searchKeyword)
        );
      });
    }

    this.setData({
      studentList: filteredList
    });

    // 设置空状态文本
    const tabNames = {
      all: '暂无学员信息',
      today: '暂无今日上课学员',
      recent: '暂无近期活跃学员'
    };
    this.setData({
      emptyText: tabNames[this.data.currentTab] || '暂无学员信息'
    });
  },

  // 查看学员详情
  viewStudentDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coach/student-detail?id=${id}`
    });
  },

  // 联系学员
  contactStudent: function(e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    const phone = e.currentTarget.dataset.phone;
    wx.showActionSheet({
      itemList: [`呼叫${phone}`, `发送短信`],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 拨打电话
          wx.makePhoneCall({
            phoneNumber: phone.replace(/\*/g, '') // 清除隐藏的星号
          });
        } else if (res.tapIndex === 1) {
          // 发送短信
          wx.showToast({
            title: '暂不支持发送短信',
            icon: 'none'
          });
        }
      }
    });
  },

  // 导出学员名单
  exportStudentList: function() {
    wx.showModal({
      title: '导出学员名单',
      content: '确定要导出当前学员名单吗？',
      confirmText: '导出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '导出中...'
          });

          // 模拟导出操作
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '导出成功',
              icon: 'success'
            });
            
            // 这里实际项目中会调用后端API导出数据
            console.log('Exporting student list...');
          }, 1500);
        }
      }
    });
  },

  // 阻止事件冒泡
  stopPropagation: function(e) {
    e.stopPropagation();
  }
});