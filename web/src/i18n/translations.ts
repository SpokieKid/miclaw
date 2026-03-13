/**
 * [INPUT]: None (leaf module, pure data)
 * [OUTPUT]: Exports Locale type, TranslationKey type, translations map
 * [POS]: Data layer of i18n module, consumed by context.tsx
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

export type Locale = 'zh' | 'en'

export type TranslationKey =
  | 'nav.cta' | 'nav.about' | 'nav.einko' | 'nav.products'
  | 'about.heroTitle' | 'about.heroSubtitle'
  | 'about.missionTitle' | 'about.missionDesc'
  | 'about.product1.name' | 'about.product1.desc' | 'about.product1.status'
  | 'about.product2.name' | 'about.product2.desc' | 'about.product2.status'
  | 'about.product3.name' | 'about.product3.desc' | 'about.product3.status'
  | 'about.product4.name' | 'about.product4.desc' | 'about.product4.status'
  | 'about.contactTitle' | 'about.contactDesc'
  | 'footer.products' | 'footer.contact' | 'footer.social' | 'footer.copyright'
  | 'hero.badge'
  | 'hero.titleAccent1' | 'hero.titleMid' | 'hero.titleAccent2'
  | 'hero.subtitle' | 'hero.subtitleLine2' | 'hero.subtitleCaption'
  | 'hero.priceCta' | 'hero.priceOld' | 'hero.priceAvail'
  | 'hero.cta'
  | 'demo.title' | 'demo.titleLine2' | 'demo.subtitle'
  | 'battery.title' | 'battery.titleLine2' | 'battery.subtitle'
  | 'cases.title' | 'cases.titleLine2' | 'cases.titleAccent'
  | 'cases.card1.title' | 'cases.card1.desc'
  | 'cases.card2.title' | 'cases.card2.desc'
  | 'cases.card3.title' | 'cases.card3.desc'
  | 'problem.label' | 'problem.title' | 'problem.titleLine2' | 'problem.titleAccent'
  | 'problem.card1.title' | 'problem.card1.desc'
  | 'problem.card2.title' | 'problem.card2.desc'
  | 'problem.card3.title' | 'problem.card3.desc'
  | 'problem.service.badge' | 'problem.service.title' | 'problem.service.desc'
  | 'problem.service.point1' | 'problem.service.point2' | 'problem.service.point3'
  | 'pay.title' | 'pay.desc'
  | 'pay.methodLabel' | 'pay.methodWechat' | 'pay.methodAlipay'
  | 'pay.contactLabel' | 'pay.contactPlaceholder' | 'pay.contactHint'
  | 'pay.create' | 'pay.createWechat' | 'pay.createAlipay' | 'pay.creating'
  | 'pay.orderLabel' | 'pay.amountLabel' | 'pay.statusLabel'
  | 'pay.desktopHint' | 'pay.mobileHint' | 'pay.wechatHint'
  | 'pay.wechatDesc' | 'pay.alipayDesc'
  | 'pay.wechatDesktopHint' | 'pay.wechatMobileHint' | 'pay.wechatBrowserHint'
  | 'pay.alipayDesktopHint' | 'pay.alipayMobileHint' | 'pay.openAlipay'
  | 'pay.status.notpay' | 'pay.status.userpaying' | 'pay.status.success'
  | 'pay.status.waitBuyerPay' | 'pay.status.tradeSuccess' | 'pay.status.tradeFinished' | 'pay.status.tradeClosed'
  | 'pay.status.closed' | 'pay.status.failed' | 'pay.status.refund'
  | 'pay.successHint' | 'pay.errorGeneric' | 'pay.retry'

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  zh: {
    'nav.cta':        '锁定早鸟',
    'nav.about':      '关于我们',
    'nav.einko':      'Einko App',
    'nav.products':   '产品',

    'about.heroTitle':      '让 AI 走出屏幕，融入生活',
    'about.heroSubtitle':   '我们构建连接人与 AI 的硬件与平台，让智能无处不在。',
    'about.missionTitle':   '我们的使命',
    'about.missionDesc':    '我们相信 AI 不应被困在聊天窗口里。通过专用硬件和开放平台，我们让每个人都能用最自然的方式——说话——来驱动 AI 完成真实世界的任务。从语音输入到任务闭环，我们打通了从人到 AI 再到结果的最短路径。',
    'about.product1.name':  'EinClaw Mic',
    'about.product1.desc':  '一键语音输入硬件，4G 直连 OpenClaw 平台。按下说话，松手走人，AI 帮你干活。72 小时续航，离线录音，联网自动同步。',
    'about.product1.status': '',
    'about.product2.name':  'Einko App',
    'about.product2.desc':  'AI 截图整理助手——自动识别、分类和管理你的截图，让信息不再散落。',
    'about.product2.status': '',
    'about.product3.name':  'EinClaw',
    'about.product3.desc':  '云端托管的 OpenClaw 服务，开箱即用。无需自建服务器，一键接入 AI 工作流。',
    'about.product3.status': '即将上线',
    'about.product4.name':  'EinClaw Park',
    'about.product4.desc':  'Agent 交友网站——让你的 AI Agent 在这里相遇、协作、组队完成任务。',
    'about.product4.status': '即将上线',
    'about.contactTitle':   '联系我们',
    'about.contactDesc':    '合作咨询、商务合作或产品反馈，欢迎随时联系。',
    'footer.products':      '产品',
    'footer.contact':       '联系我们',
    'footer.social':        '社交媒体',
    'footer.copyright':     '© 2025 杭州市时之轨迹信息技术有限责任公司. All rights reserved.',

    'hero.badge':           '直连 OpenClaw 的语音输入硬件',
    'hero.titleAccent1':    '对小龙虾说话，',
    'hero.titleMid':        '忘掉它，',
    'hero.titleAccent2':    '看结果。',
    'hero.subtitle':        '按下按钮，说出指令，松手走人，让 OpenClaw 帮你干活。',
    'hero.subtitleLine2':   '4G 直连 OpenClaw，无需手机。',
    'hero.subtitleCaption': '',
    'hero.priceCta':        '¥299 预定 Demo 样机',
    'hero.priceOld':        '',
    'hero.priceAvail':      'Demo 样机 · 限量发售',
    'hero.cta':             '锁定早鸟',

    'demo.title':          '按一下，说一句，',
    'demo.titleLine2':     '任务搞定。',
    'demo.subtitle':       '不用掏出手机，最小启动成本，捕捉你的冲动与灵感。',

    'problem.label':       '痛点',
    'battery.title':       '超长待机，',
    'battery.titleLine2':  '离线可用。',
    'battery.subtitle':    '72 小时续航，离线也能录音存储。连上网络自动同步，不漏掉任何一条指令。',

    'problem.title':       '一键部署',
    'problem.titleLine2':  'OpenClaw',
    'problem.titleAccent': '',
    'problem.card1.title': '解锁 → 打开 → 等加载 → 打字',
    'problem.card1.desc':  '想给 AI 下个指令？先掏手机，解锁，打开 App，等加载，然后打字输入。五步才能说出你要做的事。',
    'problem.card2.title': '碎片想法，转瞬即逝',
    'problem.card2.desc':  '开车时想到的事、散步时的灵感、做饭时的念头——"等下记得买牛奶"，5 分钟后就忘了。',
    'problem.card3.title': 'AI 被困在屏幕里',
    'problem.card3.desc':  '你的 AI 很聪明，但它只在你打开聊天窗口时才知道你在做什么。它缺少一条持续的感知通道。',
    'problem.service.badge': '即将上线',
    'problem.service.title': '我们帮你部署一套自己的 OpenClaw',
    'problem.service.desc':  '提供完整自部署服务：从机器准备、环境安装到工作流接入一次打通。你只需填写参数，即可一键集成到现有系统。',
    'problem.service.point1': '一键安装脚本 + 标准化配置模板',
    'problem.service.point2': '支持私有云 / 本地机房 / 海外节点',
    'problem.service.point3': '包含监控、日志、回滚与升级支持',

    'cases.title':         '真实场景，',
    'cases.titleLine2':    '完整闭环，',
    'cases.titleAccent':   '从说话到结果。',
    'cases.card1.title':   '小红书内容创作',
    'cases.card1.desc':    '散步时说出选题灵感，OpenClaw 自动整理成大纲、生成文案、配图建议，一条笔记从录音到发布。',
    'cases.card2.title':   '从 Issue 到 PR',
    'cases.card2.desc':    '开车时说出 Bug 描述，OpenClaw 自动创建 Issue、分析代码、提交 PR，下车时修复已合并。',
    'cases.card3.title':   '日记与想法对话',
    'cases.card3.desc':    '随时说出想法和感受，OpenClaw 帮你记录成日记。回头翻看时，还能和自己的记录对话。',
    'pay.title':              '支付',
    'pay.desc':               '下单前请填写微信号或手机号。这样支付成功后，我们能知道是谁付的款。',
    'pay.methodLabel':        '支付方式',
    'pay.methodWechat':       '微信支付',
    'pay.methodAlipay':       '支付宝',
    'pay.contactLabel':       '联系信息',
    'pay.contactPlaceholder': '请输入微信号或手机号',
    'pay.contactHint':        '请先填写微信号或手机号',
    'pay.create':             '创建支付订单',
    'pay.createWechat':       '创建微信支付订单',
    'pay.createAlipay':       '前往支付宝支付',
    'pay.creating':           '正在创建订单...',
    'pay.orderLabel':         '订单号',
    'pay.amountLabel':        '支付金额',
    'pay.statusLabel':        '支付状态',
    'pay.desktopHint':        '请使用微信扫一扫完成支付。每次打开都会生成新的商户订单。',
    'pay.mobileHint':         '已创建移动端支付订单。如果没有自动跳转，请重新发起一次支付。',
    'pay.wechatHint':         '当前是微信内打开。第一版先支持桌面扫码和系统浏览器 H5 支付；如果你要微信内直付，我再给你补 JSAPI。',
    'pay.wechatDesc':         '微信支持桌面扫码 Native，手机系统浏览器走 H5(MWEB)。',
    'pay.alipayDesc':         '支付宝支持电脑网站支付和手机网站支付，都会跳转到支付宝官方收银台。',
    'pay.wechatDesktopHint':  '请使用微信扫一扫完成支付。每次打开都会生成新的商户订单。',
    'pay.wechatMobileHint':   '已创建微信移动端支付订单。如果没有自动跳转，请重新发起一次支付。',
    'pay.wechatBrowserHint':  '当前是微信内打开。第一版先支持桌面扫码和系统浏览器 H5 支付；如果你要微信内直付，我再给你补 JSAPI。',
    'pay.alipayDesktopHint':  '即将跳转到支付宝官方收银台。支付完成后会回到当前页面，并继续查单。',
    'pay.alipayMobileHint':   '即将拉起支付宝或跳转支付宝 H5 收银台。支付完成后会自动回到当前页面。',
    'pay.openAlipay':         '前往支付宝继续支付',
    'pay.status.notpay':      '待支付',
    'pay.status.userpaying':  '支付中',
    'pay.status.success':     '支付成功',
    'pay.status.waitBuyerPay': '待买家付款',
    'pay.status.tradeSuccess': '交易成功',
    'pay.status.tradeFinished': '交易结束',
    'pay.status.tradeClosed': '交易关闭',
    'pay.status.closed':      '已关闭',
    'pay.status.failed':      '支付失败',
    'pay.status.refund':      '已退款',
    'pay.successHint':        '付款成功。我们已经能根据订单号和你填写的联系信息识别这笔付款。',
    'pay.errorGeneric':       '支付服务暂时不可用，请稍后重试',
    'pay.retry':              '重新发起支付',
  },

  en: {
    'nav.cta':        'Reserve Now',
    'nav.about':      'About',
    'nav.einko':      'Einko App',
    'nav.products':   'Products',

    'about.heroTitle':      'Bringing AI Beyond the Screen',
    'about.heroSubtitle':   'We build hardware and platforms that connect people with AI — making intelligence ambient.',
    'about.missionTitle':   'Our Mission',
    'about.missionDesc':    'We believe AI shouldn\'t be trapped behind a chat window. Through dedicated hardware and an open platform, we let everyone use the most natural interface — their voice — to drive AI for real-world tasks. From voice input to task completion, we\'ve built the shortest path from human intent to AI action to tangible results.',
    'about.product1.name':  'EinClaw Mic',
    'about.product1.desc':  'One-click voice input hardware, 4G direct to OpenClaw. Press, speak, release, walk away — AI does the rest. 72-hour battery, offline recording, auto-sync when connected.',
    'about.product1.status': '',
    'about.product2.name':  'Einko App',
    'about.product2.desc':  'AI screenshot organizer — automatically recognizes, categorizes, and manages your screenshots so nothing gets lost.',
    'about.product2.status': '',
    'about.product3.name':  'EinClaw',
    'about.product3.desc':  'Cloud-hosted OpenClaw service, ready out of the box. No self-hosting needed — one-click access to AI workflows.',
    'about.product3.status': 'Coming Soon',
    'about.product4.name':  'EinClaw Park',
    'about.product4.desc':  'An Agent social network — where your AI Agents meet, collaborate, and team up to get things done.',
    'about.product4.status': 'Coming Soon',
    'about.contactTitle':   'Get in Touch',
    'about.contactDesc':    'For partnerships, business inquiries, or product feedback — reach out anytime.',
    'footer.products':      'Products',
    'footer.contact':       'Contact',
    'footer.social':        'Social',
    'footer.copyright':     '© 2025 Hangzhou Chronotrack Information Technology Co., Ltd. All rights reserved.',

    'hero.badge':           'OpenClaw\'s direct voice input',
    'hero.titleAccent1':    'Speak,',
    'hero.titleMid':        ' forget it,',
    'hero.titleAccent2':    ' see results.',
    'hero.subtitle':        'Press the button, speak your command, release and go. Let OpenClaw do the work.',
    'hero.subtitleLine2':   '4G direct to OpenClaw, no phone needed.',
    'hero.subtitleCaption': '',
    'hero.priceCta':        '$199 Demo Unit Pre-order',
    'hero.priceOld':        '',
    'hero.priceAvail':      'Demo unit · Limited release',
    'hero.cta':             'Reserve Now',

    'demo.title':          'One press. One sentence.',
    'demo.titleLine2':     'Done.',
    'demo.subtitle':       'No phone needed. Minimal friction. Capture your most fleeting thoughts and inspirations.',

    'problem.label':       'The Problem',
    'battery.title':       'Ultra-long standby,',
    'battery.titleLine2':  'anywhere, anytime.',
    'battery.subtitle':    '72-hour battery life. Records audio offline, auto-syncs when connected. Never miss a single command.',

    'problem.title':       'End-to-end.',
    'problem.titleLine2':  'Out of the box.',
    'problem.titleAccent': 'No setup hassle.',
    'problem.card1.title': 'Unlock → Open → Wait → Type',
    'problem.card1.desc':  'Want to give AI a command? Pull out your phone, unlock, open the app, wait for it to load, then type. Five steps before you can say what you need.',
    'problem.card2.title': 'Fleeting thoughts, instantly lost',
    'problem.card2.desc':  'That idea while driving, inspiration on a walk, a thought while cooking — "remember to buy milk" — forgotten in 5 minutes.',
    'problem.card3.title': 'AI is trapped behind a screen',
    'problem.card3.desc':  'Your AI is smart, but it only knows what you\'re doing when you open a chat window. It lacks a persistent channel of perception.',
    'problem.service.badge': 'Coming Soon',
    'problem.service.title': 'Deploy your own OpenClaw stack',
    'problem.service.desc':  'We provide a full self-hosting service: infrastructure prep, environment setup, and workflow wiring in one package. Fill in your params and integrate in one click.',
    'problem.service.point1': 'One-click installer + standardized config templates',
    'problem.service.point2': 'Private cloud, on-prem, and overseas nodes supported',
    'problem.service.point3': 'Monitoring, logs, rollback, and upgrade support included',

    'cases.title':         'Real scenarios.',
    'cases.titleLine2':    'End-to-end.',
    'cases.titleAccent':   'From voice to done.',
    'cases.card1.title':   'Content Creation',
    'cases.card1.desc':    'Speak your topic idea on a walk. OpenClaw turns it into an outline, draft, and image suggestions — one post from voice to publish.',
    'cases.card2.title':   'Issue to Pull Request',
    'cases.card2.desc':    'Describe a bug while driving. OpenClaw creates the issue, analyzes the code, and submits a PR. Fixed by the time you park.',
    'cases.card3.title':   'Journal & Reflect',
    'cases.card3.desc':    'Share thoughts anytime. OpenClaw keeps your journal. Later, have a conversation with your own past reflections.',
    'pay.title':              'Payment',
    'pay.desc':               'Please enter your WeChat ID or phone number before payment so we can identify your order after you pay.',
    'pay.methodLabel':        'Payment Method',
    'pay.methodWechat':       'WeChat Pay',
    'pay.methodAlipay':       'Alipay',
    'pay.contactLabel':       'Contact',
    'pay.contactPlaceholder': 'Enter your WeChat ID or phone number',
    'pay.contactHint':        'Please enter your WeChat ID or phone number first',
    'pay.create':             'Create payment order',
    'pay.createWechat':       'Create WeChat order',
    'pay.createAlipay':       'Go to Alipay',
    'pay.creating':           'Creating order...',
    'pay.orderLabel':         'Order No.',
    'pay.amountLabel':        'Amount',
    'pay.statusLabel':        'Status',
    'pay.desktopHint':        'Scan this QR code with WeChat. Each attempt creates a real merchant order.',
    'pay.mobileHint':         'A mobile payment order has been created. If WeChat did not open automatically, start a new payment attempt.',
    'pay.wechatHint':         'This page is opened inside WeChat. This first version supports desktop QR and system-browser H5 payment; JSAPI can be added next.',
    'pay.wechatDesc':         'WeChat supports desktop Native QR and mobile H5(MWEB) checkout.',
    'pay.alipayDesc':         'Alipay supports both desktop website checkout and mobile web checkout through the official cashier page.',
    'pay.wechatDesktopHint':  'Scan this QR code with WeChat. Each attempt creates a real merchant order.',
    'pay.wechatMobileHint':   'A mobile WeChat order has been created. If WeChat did not open automatically, start a new payment attempt.',
    'pay.wechatBrowserHint':  'This page is opened inside WeChat. This first version supports desktop QR and system-browser H5 payment; JSAPI can be added next.',
    'pay.alipayDesktopHint':  'You will be redirected to Alipay’s official cashier page. After payment, you will be sent back here and the order will be rechecked.',
    'pay.alipayMobileHint':   'Alipay app or Alipay H5 checkout will open next. After payment, you will be sent back here automatically.',
    'pay.openAlipay':         'Continue with Alipay',
    'pay.status.notpay':      'Pending',
    'pay.status.userpaying':  'Paying',
    'pay.status.success':     'Paid',
    'pay.status.waitBuyerPay': 'Awaiting payment',
    'pay.status.tradeSuccess': 'Trade successful',
    'pay.status.tradeFinished': 'Trade finished',
    'pay.status.tradeClosed': 'Trade closed',
    'pay.status.closed':      'Closed',
    'pay.status.failed':      'Failed',
    'pay.status.refund':      'Refunded',
    'pay.successHint':        'Payment succeeded. We can now match this payment using the order number and the contact you entered.',
    'pay.errorGeneric':       'Payment service is temporarily unavailable. Please try again later.',
    'pay.retry':              'Start a new payment',
  },
}
