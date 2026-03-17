#!/usr/bin/env python3
"""生成微信小程序 tabBar 图标"""

from PIL import Image, ImageDraw
import os

OUTPUT_DIR = "/root/.openclaw/workspace-dev/projects/yoga-booking/src/miniprogram/images"
SIZE = 81

# 颜色定义
COLOR_DEFAULT = (128, 128, 128)  # 灰色 - 未选中
COLOR_ACTIVE = (255, 102, 153)   # 粉色 - 选中（瑜伽主题）

def create_icon(filename, draw_func, color):
    """创建单个图标"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    draw_func(draw, color)
    img.save(os.path.join(OUTPUT_DIR, filename), 'PNG')
    print(f"✓ 生成：{filename}")

def draw_home(draw, color):
    """首页 - 房子图标"""
    # 房顶（三角形）
    points = [(40, 20), (15, 45), (25, 45), (25, 65), (55, 65), (55, 45), (65, 45)]
    draw.polygon(points, fill=color)
    # 门
    draw.rectangle([35, 45, 45, 65], fill=(255, 255, 255, 200))

def draw_booking(draw, color):
    """预约 - 日历图标"""
    # 日历主体
    draw.rectangle([20, 25, 60, 65], fill=color, outline=color, width=2)
    # 日历顶部
    draw.rectangle([20, 25, 60, 35], outline=color, width=2)
    # 挂环
    draw.rectangle([28, 20, 33, 28], fill=color)
    draw.rectangle([48, 20, 53, 28], fill=color)
    # 日期格子
    for i in range(2):
        for j in range(2):
            x = 25 + i * 15
            y = 38 + j * 12
            draw.rectangle([x, y, x+10, y+8], fill=(255, 255, 255, 150))

def draw_profile(draw, color):
    """我的 - 用户头像图标"""
    # 头部（圆形）
    draw.ellipse([25, 20, 55, 50], fill=color)
    # 身体（半圆）
    draw.arc([15, 45, 65, 75], 0, 180, fill=color, width=12)

# 生成图标对
icons = [
    ("home.png", "home-active.png", draw_home),
    ("booking.png", "booking-active.png", draw_booking),
    ("profile.png", "profile-active.png", draw_profile),
]

os.makedirs(OUTPUT_DIR, exist_ok=True)

for default_file, active_file, draw_func in icons:
    create_icon(default_file, draw_func, COLOR_DEFAULT)
    create_icon(active_file, draw_func, COLOR_ACTIVE)

print(f"\n✅ 完成！共生成 6 个图标到：{OUTPUT_DIR}")
