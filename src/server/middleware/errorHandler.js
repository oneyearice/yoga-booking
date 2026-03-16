/**
 * 错误处理中间件
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // 根据错误类型返回适当的响应
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '验证错误',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '认证失败',
      details: err.message
    });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: '数据已存在',
      details: '尝试插入重复的数据'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW_1') {
    return res.status(404).json({
      success: false,
      message: '引用的资源不存在',
      details: '关联的数据不存在'
    });
  }

  if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(404).json({
      success: false,
      message: '引用的资源不存在',
      details: '关联的数据不存在'
    });
  }

  // 数据库连接错误
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: '数据库连接失败',
      details: '无法连接到数据库服务器'
    });
  }

  // 默认错误处理
  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;