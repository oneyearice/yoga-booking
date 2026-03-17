// booking/confirm/confirm.js
const { validate, showError, showModal, loading } = require('../../utils/errorHandler');

Page({
  data: {
    bookingInfo: {
      courseId: '',
      courseName: '基础瑜伽',
      coachName: '张教练',
      duration: 60,
      price: 120,
      bookingTime: '明天 10:00'
    },
    array: [1, 2, 3, 4, 5],
    index: 0,
    phone: '',
    remark: '',
    totalFee: 120,
    creditBalance: 8,
    showCreditInfo: true,
    loading: false
  },

  onLoad: function(options) {
    // 获取传入的预约信息
    if (options.courseName && options.time && options.price) {
      this.setData({
        bookingInfo: {
          courseName: options.courseName,
          bookingTime: options.time,
          price: parseFloat(options.price)
        }
      });
      
      // 计算总费用
      this.calculateTotalFee();
    }
  },

  // 选择预约人数
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    });
    this.calculateTotalFee();
  },

  // 输入手机号
  bindPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 输入备注
  bindRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 计算总费用
  calculateTotalFee: function() {
    const quantity = this.data.array[this.data.index];
    const unitPrice = this.data.bookingInfo.price;
    const total = unitPrice * quantity;
    
    this.setData({
      totalFee: total
    });
  },

  // 确认预约
  confirmBooking: function() {
    // 使用改进的表单验证
    const phoneValidation = validate.phone(this.data.phone);
    if (!phoneValidation.valid) {
      // 在输入框附近显示更直观的错误提示
      this.setData({
        phoneError: phoneValidation.message
      });
      
      // 显示错误提示
      showError(phoneValidation.message);
      return;
    }
    
    // 清除错误提示
    this.setData({
      phoneError: ''
    });

    // 检查课时余额
    if (this.data.creditBalance < 1) {
      showModal({
        title: '课时不足',
        content: '您的课时余额不足，请充值后再预约',
        showCancel: true,
        confirmText: '去充值',
        cancelText: '取消'
      }).then((res) => {
        if (res.confirm) {
          // 跳转到充值页面
          wx.navigateTo({
            url: '/pages/user/recharge'
          });
        }
      });
      return;
    }

    // 显示预约确认弹窗
    showModal({
      title: '确认预约',
      content: `您确定要预约${this.data.bookingInfo.courseName}吗？\n时间：${this.data.bookingInfo.bookingTime}\n费用：¥${this.data.totalFee.toFixed(2)}`
    }).then((res) => {
      if (res.confirm) {
        this.processBooking();
      }
    });
  },

  // 处理预约
  processBooking: function() {
    // 使用改进的加载状态提示
    loading.show('正在为您预约课程...');
    this.setData({
      loading: true
    });

    // 模拟预约处理
    setTimeout(() => {
      loading.hide();
      this.setData({
        loading: false
      });

      // 预约成功
      showModal({
        title: '预约成功',
        content: '您的课程已预约成功，请按时参加！',
        showCancel: false,
        confirmText: '确定'
      }).then((res) => {
        if (res.confirm) {
          // 返回上一页或跳转到我的预约页面
          wx.navigateBack({
            delta: 1
          });
          // 或者跳转到预约详情页
          // wx.redirectTo({
          //   url: '/pages/booking/detail?id=new_booking_id'
          // });
        }
      });
    }, 1500);
  }
});