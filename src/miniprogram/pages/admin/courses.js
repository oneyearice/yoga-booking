// pages/admin/courses/courses.js
const { validate, showError, showModal, loading } = require('../../utils/errorHandler');

Page({
  data: {
    searchKeyword: '',
    categoryIndex: 0,
    statusIndex: 0,
    categoryOptions: ['全部', '瑜伽', '普拉提', '推拿', '艾灸'],
    statusOptions: ['全部', '启用', '停用'],
    courseList: [
      {
        id: 1,
        name: '基础瑜伽',
        category: '瑜伽',
        status: 'active',
        statusText: '启用',
        coachName: '张教练',
        duration: 60,
        price: 120,
        capacity: 10,
        description: '适合初学者的基础瑜伽课程，帮助放松身心，提升柔韧性。'
      },
      {
        id: 2,
        name: '流瑜伽',
        category: '瑜伽',
        status: 'active',
        statusText: '启用',
        coachName: '李教练',
        duration: 75,
        price: 150,
        capacity: 8,
        description: '流畅的瑜伽动作串联，提升力量与平衡。'
      },
      {
        id: 3,
        name: '塑形普拉提',
        category: '普拉提',
        status: 'inactive',
        statusText: '停用',
        coachName: '王教练',
        duration: 45,
        price: 180,
        capacity: 12,
        description: '核心力量训练，塑造完美体型。'
      },
      {
        id: 4,
        name: '中医推拿',
        category: '推拿',
        status: 'active',
        statusText: '启用',
        coachName: '刘医师',
        duration: 60,
        price: 200,
        capacity: 5,
        description: '传统中医手法，缓解肌肉疲劳，疏通经络。'
      },
      {
        id: 5,
        name: '温灸养生',
        category: '艾灸',
        status: 'active',
        statusText: '启用',
        coachName: '陈医师',
        duration: 90,
        price: 160,
        capacity: 6,
        description: '温经散寒，养生保健的传统艾灸疗法。'
      }
    ],
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
    showCourseModal: false,
    modalTitle: '',
    formData: {
      id: null,
      name: '',
      category: '',
      coachName: '',
      duration: '',
      price: '',
      capacity: '',
      description: ''
    },
    coachOptions: ['张教练', '李教练', '王教练', '刘医师', '陈医师'],
    formErrors: {}, // 表单错误信息
    inputTimer: null // 输入防抖定时器
  },

  onLoad: function() {
    this.initData();
  },

  initData: function() {
    // 初始化分页信息
    this.updatePagination();
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

  // 分类筛选
  onCategoryChange: function(e) {
    this.setData({
      categoryIndex: e.detail.value
    });
    this.filterCourses();
  },

  // 状态筛选
  onStatusChange: function(e) {
    this.setData({
      statusIndex: e.detail.value
    });
    this.filterCourses();
  },

  // 更新分页
  updatePagination: function() {
    const total = this.data.courseList.length;
    const totalPages = Math.ceil(total / this.data.pageSize);
    this.setData({
      totalPages: totalPages
    });
  },

  // 筛选课程
  filterCourses: function() {
    let filteredList = this.data.courseList;

    // 按关键词筛选
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filteredList = filteredList.filter(course => 
        course.name.toLowerCase().includes(keyword) ||
        course.coachName.toLowerCase().includes(keyword)
      );
    }

    // 按分类筛选
    if (this.data.categoryIndex > 0) {
      const category = this.data.categoryOptions[this.data.categoryIndex];
      filteredList = filteredList.filter(course => 
        course.category === category
      );
    }

    // 按状态筛选
    if (this.data.statusIndex > 0) {
      const status = this.data.statusOptions[this.data.statusIndex].toLowerCase();
      if (status === '启用') {
        filteredList = filteredList.filter(course => course.status === 'active');
      } else if (status === '停用') {
        filteredList = filteredList.filter(course => course.status === 'inactive');
      }
    }

    this.setData({
      courseList: filteredList
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
    showError('列表已刷新', 'success');
  },

  // 新增课程
  addCourse: function() {
    this.setData({
      showCourseModal: true,
      modalTitle: '新增课程',
      formData: {
        id: null,
        name: '',
        category: '',
        coachName: '',
        duration: '',
        price: '',
        capacity: '',
        description: ''
      },
      formErrors: {} // 清空错误信息
    });
  },

  // 编辑课程
  editCourse: function(e) {
    const course = e.currentTarget.dataset.course;
    this.setData({
      showCourseModal: true,
      modalTitle: '编辑课程',
      formData: {
        id: course.id,
        name: course.name,
        category: course.category,
        coachName: course.coachName,
        duration: course.duration.toString(),
        price: course.price.toString(),
        capacity: course.capacity.toString(),
        description: course.description
      },
      formErrors: {} // 清空错误信息
    });
  },

  // 删除课程
  deleteCourse: function(e) {
    const id = e.currentTarget.dataset.id;
    showModal({
      title: '确认删除',
      content: '确定要删除这个课程吗？此操作不可恢复。',
      confirmText: '删除',
      confirmColor: '#ff4757',
      cancelText: '取消'
    }).then((res) => {
      if (res.confirm) {
        this.performDelete(id);
      }
    });
  },

  // 执行删除
  performDelete: function(id) {
    loading.show('删除中...');

    // 模拟删除操作
    setTimeout(() => {
      loading.hide();
      const updatedList = this.data.courseList.filter(course => course.id !== id);
      this.setData({
        courseList: updatedList
      });
      
      showError('删除成功', 'success');
    }, 1000);
  },

  // 切换课程状态
  toggleCourseStatus: function(e) {
    const id = e.currentTarget.dataset.id;
    const currentStatus = e.currentTarget.dataset.status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const statusText = newStatus === 'active' ? '启用' : '停用';

    showModal({
      title: '确认操作',
      content: `确定要${statusText}这个课程吗？`
    }).then((res) => {
      if (res.confirm) {
        this.performToggle(id, newStatus);
      }
    });
  },

  // 执行状态切换
  performToggle: function(id, newStatus) {
    const updatedList = this.data.courseList.map(course => {
      if (course.id === id) {
        return {
          ...course,
          status: newStatus,
          statusText: newStatus === 'active' ? '启用' : '停用'
        };
      }
      return course;
    });

    this.setData({
      courseList: updatedList
    });

    showError(newStatus === 'active' ? '已启用' : '已停用', 'success');
  },

  // 表单输入处理
  onNameInput: function(e) {
    // 优化输入响应：使用防抖减少不必要的 setData 调用
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      this.setData({
        'formData.name': e.detail.value
      });
      
      // 实时验证
      if (this.data.formErrors.name) {
        const errors = {...this.data.formErrors};
        delete errors.name;
        this.setData({
          formErrors: errors
        });
      }
    }, 100); // 100ms 防抖，提高响应速度
  },

  onFormCategoryChange: function(e) {
    this.setData({
      'formData.category': this.data.categoryOptions[parseInt(e.detail.value)]
    });
  },

  onFormCoachChange: function(e) {
    this.setData({
      'formData.coachName': this.data.coachOptions[parseInt(e.detail.value)]
    });
  },

  onDurationInput: function(e) {
    // 优化输入响应：使用防抖减少不必要的 setData 调用
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      this.setData({
        'formData.duration': e.detail.value
      });
      
      // 实时验证数字字段
      if (this.data.formErrors.duration) {
        const errors = {...this.data.formErrors};
        delete errors.duration;
        this.setData({
          formErrors: errors
        });
      }
    }, 100); // 100ms 防抖，提高响应速度
  },

  onPriceInput: function(e) {
    // 优化输入响应：使用防抖减少不必要的 setData 调用
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      this.setData({
        'formData.price': e.detail.value
      });
      
      // 实时验证数字字段
      if (this.data.formErrors.price) {
        const errors = {...this.data.formErrors};
        delete errors.price;
        this.setData({
          formErrors: errors
        });
      }
    }, 100); // 100ms 防抖，提高响应速度
  },

  onCapacityInput: function(e) {
    // 优化输入响应：使用防抖减少不必要的 setData 调用
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      this.setData({
        'formData.capacity': e.detail.value
      });
      
      // 实时验证数字字段
      if (this.data.formErrors.capacity) {
        const errors = {...this.data.formErrors};
        delete errors.capacity;
        this.setData({
          formErrors: errors
        });
      }
    }, 100); // 100ms 防抖，提高响应速度
  },

  onDescriptionInput: function(e) {
    this.setData({
      'formData.description': e.detail.value
    });
  },

  // 保存课程
  saveCourse: function() {
    const formData = this.data.formData;
    const errors = {};

    // 验证必填字段
    if (!formData.name.trim()) {
      errors.name = '课程名称不能为空';
    }
    
    if (!formData.category) {
      errors.category = '请选择课程分类';
    }
    
    if (!formData.coachName) {
      errors.coachName = '请选择教练';
    }
    
    if (!formData.duration) {
      errors.duration = '请输入课程时长';
    } else {
      const durationValidation = validate.number(formData.duration, '课程时长', 1, 240);
      if (!durationValidation.valid) {
        errors.duration = durationValidation.message;
      }
    }
    
    if (!formData.price) {
      errors.price = '请输入课程价格';
    } else {
      const priceValidation = validate.number(formData.price, '课程价格', 0, 9999);
      if (!priceValidation.valid) {
        errors.price = priceValidation.message;
      }
    }
    
    if (!formData.capacity) {
      errors.capacity = '请输入课程容量';
    } else {
      const capacityValidation = validate.number(formData.capacity, '课程容量', 1, 100);
      if (!capacityValidation.valid) {
        errors.capacity = capacityValidation.message;
      }
    }

    // 如果有错误，显示第一个错误并聚焦到对应字段
    if (Object.keys(errors).length > 0) {
      this.setData({
        formErrors: errors
      });
      
      // 显示第一个错误
      const firstErrorKey = Object.keys(errors)[0];
      showError(errors[firstErrorKey]);
      return;
    }

    // 清除错误信息
    this.setData({
      formErrors: {}
    });

    loading.show('保存中...');

    // 模拟保存操作
    setTimeout(() => {
      loading.hide();

      if (formData.id) {
        // 编辑现有课程
        const updatedList = this.data.courseList.map(course => {
          if (course.id === formData.id) {
            return {
              ...course,
              name: formData.name,
              category: formData.category,
              coachName: formData.coachName,
              duration: parseInt(formData.duration),
              price: parseFloat(formData.price),
              capacity: parseInt(formData.capacity),
              description: formData.description
            };
          }
          return course;
        });

        this.setData({
          courseList: updatedList,
          showCourseModal: false
        });

        showError('更新成功', 'success');
      } else {
        // 新增课程
        const newCourse = {
          id: this.data.courseList.length + 1,
          name: formData.name,
          category: formData.category,
          status: 'active',
          statusText: '启用',
          coachName: formData.coachName,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          description: formData.description
        };

        const updatedList = [newCourse, ...this.data.courseList];
        this.setData({
          courseList: updatedList,
          showCourseModal: false
        });

        showError('新增成功', 'success');
      }
    }, 1000);
  },

  // 关闭模态框
  closeModal: function() {
    this.setData({
      showCourseModal: false,
      formErrors: {} // 清空错误信息
    });
  }
});