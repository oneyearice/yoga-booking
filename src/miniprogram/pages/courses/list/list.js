// courses/list/list.js
Page({
  data: {
    searchKeyword: '',
    currentCategory: 'all',
    courseList: [
      {
        id: 1,
        name: '基础瑜伽',
        category: '瑜伽',
        duration: 60,
        price: 120,
        coachName: '张教练',
        description: '适合初学者的基础瑜伽课程，帮助放松身心，提升柔韧性。',
        capacity: 10,
        bookedCount: 6,
        coverImage: '/images/yoga.jpg'
      },
      {
        id: 2,
        name: '流瑜伽',
        category: '瑜伽',
        duration: 75,
        price: 150,
        coachName: '李教练',
        description: '流畅的瑜伽动作串联，提升力量与平衡。',
        capacity: 8,
        bookedCount: 3,
        coverImage: '/images/liuyoga.jpg'
      },
      {
        id: 3,
        name: '塑形普拉提',
        category: '普拉提',
        duration: 45,
        price: 180,
        coachName: '王教练',
        description: '核心力量训练，塑造完美体型。',
        capacity: 12,
        bookedCount: 8,
        coverImage: '/images/pilates.jpg'
      },
      {
        id: 4,
        name: '中医推拿',
        category: '推拿',
        duration: 60,
        price: 200,
        coachName: '刘医师',
        description: '传统中医手法，缓解肌肉疲劳，疏通经络。',
        capacity: 5,
        bookedCount: 2,
        coverImage: '/images/tuina.jpg'
      },
      {
        id: 5,
        name: '温灸养生',
        category: '艾灸',
        duration: 90,
        price: 160,
        coachName: '陈医师',
        description: '温经散寒，养生保健的传统艾灸疗法。',
        capacity: 6,
        bookedCount: 4,
        coverImage: '/images/moxibustion.jpg'
      }
    ],
    filteredCourseList: []
  },

  onLoad: function(options) {
    // 初始化时显示全部课程
    this.setData({
      filteredCourseList: this.data.courseList
    });
    
    // 如果有分类参数，应用筛选
    if (options.category) {
      this.setData({
        currentCategory: options.category
      });
      this.filterCourses();
    }
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索
  onSearch: function() {
    this.filterCourses();
  },

  // 切换分类
  switchCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
    this.filterCourses();
  },

  // 筛选课程
  filterCourses: function() {
    let filteredList = this.data.courseList;

    // 按分类筛选
    if (this.data.currentCategory !== 'all') {
      filteredList = filteredList.filter(course => {
        let categoryMatch = false;
        switch(this.data.currentCategory) {
          case 'yoga':
            categoryMatch = course.category === '瑜伽';
            break;
          case 'pilates':
            categoryMatch = course.category === '普拉提';
            break;
          case 'tuina':
            categoryMatch = course.category === '推拿';
            break;
          case 'moxibustion':
            categoryMatch = course.category === '艾灸';
            break;
        }
        return categoryMatch;
      });
    }

    // 按关键词筛选
    if (this.data.searchKeyword.trim()) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filteredList = filteredList.filter(course => 
        course.name.toLowerCase().includes(keyword) ||
        course.coachName.toLowerCase().includes(keyword)
      );
    }

    this.setData({
      filteredCourseList: filteredList
    });
  },

  // 查看课程详情
  viewCourseDetail: function(e) {
    const courseId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/courses/detail?id=${courseId}`
    });
  }
});