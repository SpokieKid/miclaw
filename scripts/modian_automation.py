#!/usr/bin/env python3
"""
摩点众筹项目创建自动化脚本
使用 Playwright 自动化填写众筹项目信息
"""

import asyncio
from playwright.async_api import async_playwright

# 项目配置
PROJECT_CONFIG = {
    "title": "EinClaw AI对讲机 —— 给你的智能体装上耳朵",
    "subtitle": "按下按钮，说出指令，你的AI助理马上开工",
    "category": "科技",  # 科技/智能硬件
    "target_amount": "50000",  # 众筹目标金额
    "duration": "30",  # 众筹天数
    
    # 项目简介（200字内）
    "summary": """EinClaw是一款为AI时代设计的极简对讲机。

你的AI智能体能写代码、回邮件、管日程，但它被困在聊天窗口里——只有当你主动打字时，它才知道你在做什么。

EinClaw改变这一切：按下按钮，说出指令，松手走人。开车时想到的事、散步时的灵感、不方便掏手机的场景，一句话就搞定。

它是你跟AI之间的直线电话，一个按钮，极致简单。""",
    
    # 项目详情
    "detail": """### 我是谁

我们是 EinClaw 团队，一群相信「AI应该像空气一样无处不在」的创作者。

过去半年，我们做了两件事：
- **EINKO**：一款AI截图管理App，已有449名用户，帮助用户自动理解、分类、搜索截图
- **OpenClaw**：一个开源AI Agent框架，让AI真正能为用户执行任务

现在我们正在构建第二条感知通道——让AI不仅能「看见」，还能「听见」。

### 为什么众筹

我们完成了技术验证：
- ✅ 端到端链路已打通
- ✅ 核心固件开发完成
- ✅ 首批原型机已测试

但硬件量产需要一笔启动资金。我们希望通过众筹：
1. 验证市场对「AI硬件遥控器」的真实需求
2. 筹集首批500台量产资金
3. 找到第一批种子用户，一起打磨产品

这不是一个 idea，而是一个已经跑通技术、即将进入量产的产品。

### 项目进度

| 阶段 | 状态 | 时间 |
|------|------|------|
| 技术架构设计 | ✅ 完成 | 2025 Q4 |
| 核心固件开发 | ✅ 完成 | 2026 Q1 |
| 端到端链路验证 | ✅ 完成 | 2026 Q1 |
| 首批原型测试 | ✅ 完成 | 2026 Q1 |
| 众筹 & 预生产 | 🔄 进行中 | 2026 Q2 |
| 量产交付 | 📅 计划 | 2026 Q3 |

### 产品详情

**EinClaw 是什么？**

EinClaw 是一个夹子式AI对讲机，约AirPods充电盒一半大小。

**核心使用场景：**

| 场景 | 传统方式 | EinClaw方式 |
|------|---------|-------------|
| 开车时想到待办 | 掏手机→解锁→打开App→打字 | 按按钮→说话→松手 |
| 散步时灵感爆发 | 努力记住，回家就忘 | 一句话发给AI记录 |
| 做饭时查信息 | 擦手→掏手机→搜索 | 按按钮直接问AI |

**硬件规格：**
- 主控：ESP32-S3
- 麦克风：数字I2S麦克风
- 连接：WiFi（手机热点/家庭WiFi）
- 续航：3-5天
- 存储：MicroSD离线缓存
- 尺寸：夹子式，便携佩戴

**工作原理：**
按下按钮 → 红灯亮+振动 → 说话 → 松开按钮 → 绿灯闪 → 语音上传 → AI理解 → 执行任务 → 结果推送

**和手机的区别？**
- 不需要解锁、不需要看屏幕
- 单手操作，3步完成
- 专注场景下也能用（开车、做饭、运动）

### FAQ

**Q: 对讲机需要插SIM卡吗？**
A: 不需要。通过WiFi连接网络，可以用手机热点或家庭WiFi。

**Q: 没有网络能用吗？**
A: 支持离线缓存，录音先存到本地SD卡，有网络后自动同步。

**Q: 需要搭配什么App使用？**
A: 需要配合 EINKO App 使用（iOS已上架），Android版本开发中。

**Q: 发货时间？**
A: 众筹成功后3个月内发货。我们已完成原型验证，正在进行量产准备。

**Q: 质量问题怎么办？**
A: 提供12个月质保。众筹期间支持无条件退款（发货前）。""",
}

# 回报档位
REWARD_TIERS = [
    {
        "name": "支持我们",
        "price": "1",
        "description": "感谢支持，你的名字将出现在项目感谢名单中",
        "quantity": "9999",  # 不限
        "delivery": "众筹成功后7天内发送电子版感谢名单"
    },
    {
        "name": "早鸟特惠",
        "price": "299",
        "description": "EinClaw对讲机 ×1 + 1年AI服务订阅（限量100份）",
        "quantity": "100",
        "delivery": "众筹成功后90天内发货"
    },
    {
        "name": "标准套装",
        "price": "349",
        "description": "EinClaw对讲机 ×1 + 1年AI服务订阅",
        "quantity": "500",
        "delivery": "众筹成功后90天内发货"
    },
    {
        "name": "双人同行",
        "price": "599",
        "description": "EinClaw对讲机 ×2 + 2年AI服务订阅（限量50份）",
        "quantity": "50",
        "delivery": "众筹成功后90天内发货"
    },
    {
        "name": "极客套装",
        "price": "499",
        "description": "EinClaw对讲机 ×1 + 终身AI服务 + 开发者API权限（限量30份）",
        "quantity": "30",
        "delivery": "众筹成功后90天内发货"
    }
]

async def create_modian_project():
    """创建摩点众筹项目"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, slow_mo=100)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()
        
        print("🚀 启动浏览器...")
        
        # 1. 访问摩点众筹创建页面
        print("📍 访问摩点众筹创建页面...")
        await page.goto("https://zhongchou.modian.com/add", wait_until="networkidle")
        
        # 等待页面加载
        await page.wait_for_timeout(3000)
        
        # 截图查看当前状态
        await page.screenshot(path="/root/coding/miclaw/.playwright-mcp/modian-step1-landing.png")
        print("✅ 已截图: modian-step1-landing.png")
        
        # 检查是否需要登录
        if "login" in page.url or "auth" in page.url:
            print("⚠️ 需要登录摩点账号，请在浏览器中完成登录...")
            print("⏳ 等待登录完成（60秒）...")
            await page.wait_for_timeout(60000)
        
        # 2. 填写项目基本信息
        print("\n📝 步骤1: 填写项目基本信息...")
        
        try:
            # 项目标题
            title_input = await page.query_selector('input[name="title"], input[placeholder*="标题"], #title')
            if title_input:
                await title_input.fill(PROJECT_CONFIG["title"])
                print(f"  ✓ 标题: {PROJECT_CONFIG['title']}")
            
            # 项目简介/副标题
            subtitle_input = await page.query_selector('input[name="subtitle"], textarea[name="summary"], input[placeholder*="简介"]')
            if subtitle_input:
                await subtitle_input.fill(PROJECT_CONFIG["subtitle"])
                print(f"  ✓ 副标题: {PROJECT_CONFIG['subtitle']}")
            
            # 众筹目标金额
            target_input = await page.query_selector('input[name="target_amount"], input[placeholder*="目标"], input[type="number"]')
            if target_input:
                await target_input.fill(PROJECT_CONFIG["target_amount"])
                print(f"  ✓ 目标金额: ¥{PROJECT_CONFIG['target_amount']}")
            
            # 众筹时长
            duration_select = await page.query_selector('select[name="duration"], select[name="days"]')
            if duration_select:
                await duration_select.select_option(PROJECT_CONFIG["duration"])
                print(f"  ✓ 众筹时长: {PROJECT_CONFIG['duration']}天")
            
        except Exception as e:
            print(f"  ⚠️ 填写基本信息时出错: {e}")
        
        await page.screenshot(path="/root/coding/miclaw/.playwright-mcp/modian-step2-basic-info.png")
        print("✅ 已截图: modian-step2-basic-info.png")
        
        # 3. 填写项目详情
        print("\n📝 步骤2: 填写项目详情...")
        
        try:
            # 查找详情编辑器（可能是富文本编辑器）
            detail_editor = await page.query_selector('textarea[name="detail"], .editor-content, [contenteditable="true"]')
            if detail_editor:
                await detail_editor.fill(PROJECT_CONFIG["detail"])
                print("  ✓ 项目详情已填写")
            else:
                print("  ⚠️ 未找到详情编辑器，可能需要手动填写")
        except Exception as e:
            print(f"  ⚠️ 填写详情时出错: {e}")
        
        await page.screenshot(path="/root/coding/miclaw/.playwright-mcp/modian-step3-detail.png")
        print("✅ 已截图: modian-step3-detail.png")
        
        # 4. 设置回报档位
        print("\n📝 步骤3: 设置回报档位...")
        
        for i, tier in enumerate(REWARD_TIERS):
            try:
                print(f"\n  添加回报档位 {i+1}: {tier['name']}")
                
                # 点击添加回报按钮
                add_reward_btn = await page.query_selector('button:has-text("添加回报"), .add-reward, [data-action="add-reward"]')
                if add_reward_btn:
                    await add_reward_btn.click()
                    await page.wait_for_timeout(1000)
                
                # 填写回报名称
                reward_name = await page.query_selector(f'.reward-item:nth-child({i+1}) input[name="reward_name"], .reward-form input[placeholder*="名称"]')
                if reward_name:
                    await reward_name.fill(tier["name"])
                
                # 填写回报金额
                reward_price = await page.query_selector(f'.reward-item:nth-child({i+1}) input[name="reward_price"], .reward-form input[placeholder*="金额"]')
                if reward_price:
                    await reward_price.fill(tier["price"])
                
                # 填写回报描述
                reward_desc = await page.query_selector(f'.reward-item:nth-child({i+1}) textarea[name="reward_desc"], .reward-form textarea')
                if reward_desc:
                    await reward_desc.fill(tier["description"])
                
                # 填写回报数量
                reward_qty = await page.query_selector(f'.reward-item:nth-child({i+1}) input[name="reward_quantity"], .reward-form input[placeholder*="数量"]')
                if reward_qty:
                    await reward_qty.fill(tier["quantity"])
                
                print(f"    ✓ {tier['name']} - ¥{tier['price']}")
                
            except Exception as e:
                print(f"    ⚠️ 添加回报档位 {i+1} 时出错: {e}")
        
        await page.screenshot(path="/root/coding/miclaw/.playwright-mcp/modian-step4-rewards.png")
        print("✅ 已截图: modian-step4-rewards.png")
        
        # 5. 保存或提交
        print("\n📝 步骤4: 保存项目...")
        
        try:
            # 查找保存按钮
            save_btn = await page.query_selector('button:has-text("保存"), button:has-text("下一步"), .btn-save, [type="submit"]')
            if save_btn:
                await save_btn.click()
                print("  ✓ 已点击保存按钮")
                await page.wait_for_timeout(3000)
            else:
                print("  ⚠️ 未找到保存按钮")
        except Exception as e:
            print(f"  ⚠️ 保存时出错: {e}")
        
        await page.screenshot(path="/root/coding/miclaw/.playwright-mcp/modian-step5-saved.png")
        print("✅ 已截图: modian-step5-saved.png")
        
        print("\n" + "="*50)
        print("🎉 自动化流程完成！")
        print("="*50)
        print("\n⚠️ 注意事项：")
        print("1. 请检查所有截图确认填写内容是否正确")
        print("2. 需要手动上传封面图（3张）")
        print("3. 需要手动上传项目视频（如有）")
        print("4. 确认无误后点击提交审核")
        print("\n📁 截图保存位置: /root/coding/miclaw/.playwright-mcp/")
        
        # 保持浏览器打开供用户手动操作
        print("\n⏳ 浏览器保持打开状态，请在60秒后手动关闭或继续操作...")
        await page.wait_for_timeout(60000)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(create_modian_project())
