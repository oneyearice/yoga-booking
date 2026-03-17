// pages/admin/users/users.js
Page({
  data: {
    searchKeyword: '',
    roleIndex: 0,
    statusIndex: 0,
    roleOptions: ['全部', '用户', '教练', '管理员'],
    statusOptions: ['全部', '启用', '禁用'],
    userList: [
      {
        id: 1,
        name: '张三',
        phone: '138****1234',
        email: 'zhangsan@example.com',
        role: 'user',
        roleText: '用户',
        status: 'active',
        statusText: '启用',
        registerTime: '2026-01-15',
        creditBalance: 8,
        bookingCount: 12,
        attendanceCount: 10,
        totalSpent: 1440
      },
      {
        id: 2,
        name: '李四',
        phone: '139****5678',
        email: 'lisi@example.com',
        role: 'user',
        roleText: '用户',
        status: 'active',
        statusText: '启用',
        registerTime: '2026-02-20',
        creditBalance: 5,
        bookingCount: 8,
        attendanceCount: 7,
        totalSpent: 960
      },
      {
        id: 3,
        name: '王五',
        phone: '136****9012',
        email: 'wangwu@example.com',
        role: 'coach',
        roleText: '教练',
        status: 'active',
        statusText: '启用',
        registerTime: '2026-01-10',
        creditBalance: 0,
        bookingCount: 0,
        attendanceCount: 0,
        totalSpent: 0
      },
      {
        id: 4,
        name: '赵六',
        phone: '137****3456',
        email: 'zhaoliu@example.com',
        role: 'admin',
        roleText: '管理员',
        status: 'inactive',
        statusText: '禁用',
        registerTime: '2026-01-05',
        creditBalance: 0,
        bookingCount: 0,
        attendanceCount: 0,
        totalSpent: 0
      },
      {
        id: 5,
        name: '钱七',
        phone: '135****7890',
        email: 'qianqi@example.com',
        role: 'user',
        roleText: '用户',
        status: 'active',
        statusText: '启用',
        registerTime: '2026-03-01',
        creditBalance: 12,
        bookingCount: 15,
        attendanceCount: 14,
        totalSpent: 1800
      }
    ],
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
    emptyText: '暂无用户数据',
    showUserModal: false,
    showResetModal: false,
    modalTitle: '',
    resetUserId: null,
    resetPassword: '',
    confirmPassword: '',
    formData: {
      id: null,
      name: '',
      phone: '',
      email: '',
      role: 'user',
      roleText: '用户',
      status: 'active',
      creditBalance: '0'
    }
  },

  onLoad: function() {
    this.initData();
  },

  initData: function() {
    this.updatePagination();
  },

  updatePagination: function() {
    const total = this.data.userList.length;
    const totalPages = Math.ceil(total / this.data.pageSize);
    this.setData({
      totalPages: totalPages
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
    this.filterUsers();
  },

  // 角色筛选
  onRoleChange: function(e) {
    this.setData({
      roleIndex: e.detail.value
    });
    this.filterUsers();
  },

  // 状态筛选
  onStatusChange: function(e) {
    this.setData({
      statusIndex: e.detail.value
    });
    this.filterUsers();
  },

  // 筛选用户
  filterUsers: function() {
    let filteredList = this.data.userList;

    // 按关键词筛选
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filteredList = filteredList.filter(user => 
        user.name.toLowerCase().includes(keyword) ||
        user.phone.includes(this.data.searchKeyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    }

    // 按角色筛选
    if (this.data.roleIndex > 0) {
      const role = this.data.roleOptions[this.data.roleIndex];
      filteredList = filteredList.filter(user => 
        user.roleText === role
      );
    }

    // 按状态筛选
    if (this.data.statusIndex > 0) {
      const status = this.data.statusOptions[this.data.statusIndex].toLowerCase();
      if (status === '启用') {
        filteredList = filteredList.filter(user => user.status === 'active');
      } else if (status === '禁用') {
        filteredList = filteredList.filter(user => user.status === 'inactive');
      }
    }

    this.setData({
      userList: filteredList
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

  // 添加用户
  addUser: function() {
    this.setData({
      showUserModal: true,
      modalTitle: '添加用户',
      formData: {
        id: null,
        name: '',
        phone: '',
        email: '',
        role: 'user',
        roleText: '用户',
        status: 'active',
        creditBalance: '0'
      }
    });
  },

  // 编辑用户
  editUser: function(e) {
    const user = e.currentTarget.dataset.user;
    this.setData({
      showUserModal: true,
      modalTitle: '编辑用户',
      formData: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        roleText: user.roleText,
        status: user.status,
        creditBalance: user.creditBalance.toString()
      }
    });
  },

  // 删除用户
  deleteUser: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可恢复。',
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
      const updatedList = this.data.userList.filter(user => user.id !== id);
      this.setData({
        userList: updatedList
      });
      
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 重置密码
  resetPassword: function(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      showResetModal: true,
      resetUserId: id,
      resetPassword: '',
      confirmPassword: ''
    });
  },

  // 切换用户状态
  toggleUserStatus: function(e) {
    const id = e.currentTarget.dataset.id;
    const currentStatus = e.currentTarget.dataset.status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const statusText = newStatus === 'active' ? '启用' : '禁用';

    wx.showModal({
      title: '确认操作',
      content: `确定要${statusText}这个用户吗？`,
      success: (res) => {
        if (res.confirm) {
          this.performToggle(id, newStatus);
        }
      }
    });
  },

  // 执行状态切换
  performToggle: function(id, newStatus) {
    const updatedList = this.data.userList.map(user => {
      if (user.id === id) {
        return {
          ...user,
          status: newStatus,
          statusText: newStatus === 'active' ? '启用' : '禁用'
        };
      }
      return user;
    });

    this.setData({
      userList: updatedList
    });

    wx.showToast({
      title: newStatus === 'active' ? '已启用' : '已禁用',
      icon: 'success'
    });
  },

  // 表单输入处理
  onNameInput: function(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  onPhoneInput: function(e) {
    this.setData({
      'formData.phone': e.detail.value
    });
  },

  onEmailInput: function(e) {
    this.setData({
      'formData.email': e.detail.value
    });
  },

  onFormRoleChange: function(e) {
    const index = e.detail.value;
    const role = this.data.roleOptions[index];
    this.setData({
      'formData.role': role.toLowerCase(),
      'formData.roleText': role
    });
  },

  onCreditInput: function(e) {
    this.setData({
      'formData.creditBalance': e.detail.value
    });
  },

  onStatusSwitchChange: function(e) {
    this.setData({
      'formData.status': e.detail.value ? 'active' : 'inactive'
    });
  },

  // 保存用户
  saveUser: function() {
    const formData = this.data.formData;

    // 验证必填字段
    if (!formData.name || !formData.phone) {
      wx.showToast({
        title: '请填写必填字段',
        icon: 'none'
      });
      return;
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // 验证邮箱格式（如果填写了邮箱）
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      wx.showToast({
        title: '请输入正确的邮箱格式',
        icon: 'none'
      });
      return;
    }

    // 验证课时余额
    if (formData.creditBalance && isNaN(formData.creditBalance)) {
      wx.showToast({
        title: '课时余额应为数字',
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
        // 编辑现有用户
        const updatedList = this.data.userList.map(user => {
          if (user.id === formData.id) {
            return {
              ...user,
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              role: formData.role,
              roleText: formData.roleText,
              status: formData.status,
              statusText: formData.status === 'active' ? '启用' : '禁用',
              creditBalance: parseInt(formData.creditBalance) || 0
            };
          }
          return user;
        });

        this.setData({
          userList: updatedList,
          showUserModal: false
        });

        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
      } else {
        // 新增用户
        const newUser = {
          id: this.data.userList.length + 1,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          role: formData.role,
          roleText: formData.roleText,
          status: formData.status,
          statusText: formData.status === 'active' ? '启用' : '禁用',
          registerTime: this.getCurrentDate(),
          creditBalance: parseInt(formData.creditBalance) || 0,
          bookingCount: 0,
          attendanceCount: 0,
          totalSpent: 0
        };

        const updatedList = [newUser, ...this.data.userList];
        this.setData({
          userList: updatedList,
          showUserModal: false
        });

        wx.showToast({
          title: '新增成功',
          icon: 'success'
        });
      }
    }, 1000);
  },

  // 关闭用户模态框
  closeModal: function() {
    this.setData({
      showUserModal: false
    });
  },

  // 新密码输入
  onNewPasswordInput: function(e) {
    this.setData({
      resetPassword: e.detail.value
    });
  },

  // 确认密码输入
  onConfirmPasswordInput: function(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  // 确认重置密码
  confirmResetPassword: function() {
    if (!this.data.resetPassword) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      });
      return;
    }

    if (this.data.resetPassword !== this.data.confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      });
      return;
    }

    if (this.data.resetPassword.length < 6) {
      wx.showToast({
        title: '密码长度至少6位',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '重置中...'
    });

    // 模拟重置密码
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '密码重置成功',
        icon: 'success'
      });

      this.setData({
        showResetModal: false,
        resetPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  },

  // 关闭重置密码模态框
  closeResetModal: function() {
    this.setData({
      showResetModal: false,
      resetPassword: '',
      confirmPassword: ''
    });
  },

  // 导入用户
  importUsers: function() {
    wx.showModal({
      title: '导入用户',
      content: '确定要从外部导入用户数据吗？',
      confirmText: '导入',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '导入功能待实现',
            icon: 'none'
          });
        }
      }
    });
  },

  // 导出用户
  exportUsers: function() {
    wx.showModal({
      title: '导出用户',
      content: '确定要导出当前用户数据吗？',
      confirmText: '导出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '导出功能待实现',
            icon: 'none'
          });
        }
      }
    });
  },

  // 获取当前日期
  getCurrentDate: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});