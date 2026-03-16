/**
 * 错误处理和表单验证工具
 * 提供中文友好的错误提示和验证功能
 */

/**
 * 显示中文错误提示
 * @param {string} message - 错误信息
 * @param {string} type - 提示类型 ('error', 'warning', 'info')
 */
function showError(message, type = 'error') {
  let icon = 'none';
  let title = message;
  
  if (type === 'success') {
    icon = 'success';
  } else if (type === 'loading') {
    wx.showLoading({
      title: message
    });
    return;
  }
  
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示模态对话框
 * @param {Object} options - 对话框配置
 * @param {string} options.title - 标题
 * @param {string} options.content - 内容
 * @param {boolean} options.showCancel - 是否显示取消按钮
 */
function showModal(options) {
  const defaultOptions = {
    title: '提示',
    content: '',
    showCancel: true,
    confirmText: '确定',
    cancelText: '取消'
  };
  
  const mergedOptions = Object.assign(defaultOptions, options);
  
  return new Promise((resolve) => {
    wx.showModal(Object.assign(mergedOptions, {
      success: (res) => {
        resolve(res);
      }
    }));
  });
}

/**
 * 表单验证函数集合
 */
const validate = {
  /**
   * 验证手机号
   * @param {string} phone - 手机号
   * @returns {Object} 验证结果 {valid: boolean, message: string}
   */
  phone: function(phone) {
    if (!phone) {
      return {
        valid: false,
        message: '请输入联系电话'
      };
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return {
        valid: false,
        message: '请输入正确的手机号格式'
      };
    }
    
    return {
      valid: true,
      message: ''
    };
  },
  
  /**
   * 验证非空字符串
   * @param {string} value - 要验证的值
   * @param {string} fieldName - 字段名称（用于错误提示）
   * @returns {Object} 验证结果
   */
  required: function(value, fieldName = '该字段') {
    if (!value || String(value).trim() === '') {
      return {
        valid: false,
        message: `${fieldName}不能为空`
      };
    }
    
    return {
      valid: true,
      message: ''
    };
  },
  
  /**
   * 验证数字
   * @param {number|string} value - 要验证的值
   * @param {string} fieldName - 字段名称
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {Object} 验证结果
   */
  number: function(value, fieldName = '数值', min = -Infinity, max = Infinity) {
    const num = Number(value);
    
    if (isNaN(num)) {
      return {
        valid: false,
        message: `${fieldName}必须是数字`
      };
    }
    
    if (num < min) {
      return {
        valid: false,
        message: `${fieldName}不能小于${min}`
      };
    }
    
    if (num > max) {
      return {
        valid: false,
        message: `${fieldName}不能大于${max}`
      };
    }
    
    return {
      valid: true,
      message: ''
    };
  }
};

/**
 * 页面加载状态管理
 */
const loading = {
  /**
   * 显示加载状态
   * @param {string} message - 加载提示信息
   */
  show: function(message = '加载中...') {
    wx.showLoading({
      title: message,
      mask: true
    });
  },
  
  /**
   * 隐藏加载状态
   */
  hide: function() {
    wx.hideLoading();
  },
  
  /**
   * 显示下拉刷新状态
   */
  showRefresh: function() {
    wx.showNavigationBarLoading();
  },
  
  /**
   * 隐藏下拉刷新状态
   */
  hideRefresh: function() {
    wx.hideNavigationBarLoading();
  }
};

module.exports = {
  showError,
  hideLoading,
  showModal,
  validate,
  loading
};