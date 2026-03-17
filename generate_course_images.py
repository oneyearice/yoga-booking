#!/usr/bin/env python3
"""生成课程分类封面图片"""

from PIL import Image, ImageDraw
import os

OUTPUT_DIR = "/root/.openclaw/workspace-dev/projects/yoga-booking/src/miniprogram/images"
SIZE = (400, 300)

# 颜色定义
COLORS = {
    'yoga': (102, 126, 234),      # 紫色
    'pilates': (118, 75, 162),    # 深紫
    'tuina': (255, 107, 107),     # 红色
    'moxibustion': (255, 167, 38) # 橙色
}

LABELS = {
    'yoga': '瑜伽',
    'pilates': '普拉提',
    'tuina': '推拿',
    'moxibustion': '艾灸'
}

def create_course_image(filename, color, label):
    """创建课程封面图"""
    img = Image.new('RGB', SIZE, color)
    draw = ImageDraw.Draw(img)
    
    # 渐变效果
    for y in range(SIZE[1]):
        alpha = y / SIZE[1]
        r = int(color[0] * (1 - alpha * 0.3))
        g = int(color[1] * (1 - alpha * 0.3))
        b = int(color[2] * (1 - alpha * 0.3))
        draw.line([(0, y), (SIZE[0], y)], fill=(r, g, b))
    
    # 绘制文字
    try:
        # 使用默认字体，放大
        font_size = 60
        # 计算文字位置（居中）
        text_width = len(label) * font_size * 0.6
        x = (SIZE[0] - text_width) / 2
        y = (SIZE[1] - font_size) / 2
        draw.text((x, y), label, fill=(255, 255, 255))
    except:
        # 如果字体加载失败，简单绘制
        draw.text((150, 120), label, fill=(255, 255, 255))
    
    img.save(os.path.join(OUTPUT_DIR, filename), 'JPEG', quality=90)
    print(f"✓ 生成：{filename}")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# 生成 4 张课程图片
courses = [
    ('yoga.jpg', 'yoga', '瑜伽'),
    ('pilates.jpg', 'pilates', '普拉提'),
    ('tuina.jpg', 'tuina', '推拿'),
    ('moxibustion.jpg', 'moxibustion', '艾灸'),
]

for filename, color_key, label in courses:
    create_course_image(filename, COLORS[color_key], label)

print(f"\n✅ 完成！共生成 4 张课程图片到：{OUTPUT_DIR}")
