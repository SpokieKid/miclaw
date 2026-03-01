/**
 * [INPUT]: None (leaf module, pure data)
 * [OUTPUT]: Exports Locale type, TranslationKey type, translations map
 * [POS]: Data layer of i18n module, consumed by context.tsx
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

export type Locale = 'zh' | 'en'

export type TranslationKey =
  | 'nav.cta'
  | 'hero.badge'
  | 'hero.titleAccent1' | 'hero.titleMid' | 'hero.titleAccent2'
  | 'hero.subtitle' | 'hero.subtitleLine2' | 'hero.subtitleCaption'
  | 'hero.priceCta' | 'hero.priceOld' | 'hero.priceAvail'
  | 'hero.cta'
  | 'demo.title' | 'demo.titleLine2' | 'demo.subtitle'
  | 'battery.title' | 'battery.titleLine2' | 'battery.subtitle'
  | 'problem.label' | 'problem.title' | 'problem.titleLine2' | 'problem.titleAccent'
  | 'problem.card1.title' | 'problem.card1.desc'
  | 'problem.card2.title' | 'problem.card2.desc'
  | 'problem.card3.title' | 'problem.card3.desc'

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  zh: {
    'nav.cta':        '锁定早鸟',

    'hero.badge':           '直连 OpenClaw 的语音输入硬件',
    'hero.titleAccent1':    '对小龙虾说话，',
    'hero.titleMid':        '忘掉它，',
    'hero.titleAccent2':    '看结果。',
    'hero.subtitle':        '按下按钮，说出指令，松手走人，让 OpenClaw 帮你干活。',
    'hero.subtitleLine2':   '4G 直连 OpenClaw，无需手机。',
    'hero.subtitleCaption': '',
    'hero.priceCta':        '¥9 锁定早鸟资格',
    'hero.priceOld':        '',
    'hero.priceAvail':      '开售即抵 ¥50 · 限 100 名',
    'hero.cta':             '锁定早鸟',

    'demo.title':          '按一下，说一句，',
    'demo.titleLine2':     '任务搞定。',
    'demo.subtitle':       '72 小时使用时长，离线也可以存储音频文件，有网时自动上传，全天候全地点和你的小龙虾不离不弃。',

    'problem.label':       '痛点',
    'battery.title':       '超长待机，',
    'battery.titleLine2':  '随时随地。',
    'battery.subtitle':    '72 小时续航，离线也能录音存储。连上网络自动同步，不漏掉任何一条指令。',

    'problem.title':       '可选一条龙服务，',
    'problem.titleLine2':  '开箱即用，',
    'problem.titleAccent': '无需冗长配置。',
    'problem.card1.title': '解锁 → 打开 → 等加载 → 打字',
    'problem.card1.desc':  '想给 AI 下个指令？先掏手机，解锁，打开 App，等加载，然后打字输入。五步才能说出你要做的事。',
    'problem.card2.title': '碎片想法，转瞬即逝',
    'problem.card2.desc':  '开车时想到的事、散步时的灵感、做饭时的念头——"等下记得买牛奶"，5 分钟后就忘了。',
    'problem.card3.title': 'AI 被困在屏幕里',
    'problem.card3.desc':  '你的 AI 很聪明，但它只在你打开聊天窗口时才知道你在做什么。它缺少一条持续的感知通道。',
  },

  en: {
    'nav.cta':        'Reserve Now',

    'hero.badge':           'OpenClaw\'s direct voice input',
    'hero.titleAccent1':    'Speak,',
    'hero.titleMid':        ' forget it,',
    'hero.titleAccent2':    ' see results.',
    'hero.subtitle':        'Press the button, speak your command, release and go. Let OpenClaw do the work.',
    'hero.subtitleLine2':   '4G direct to OpenClaw, no phone needed.',
    'hero.subtitleCaption': '',
    'hero.priceCta':        '$1 VIP RESERVATION',
    'hero.priceOld':        '',
    'hero.priceAvail':      '$10 off at launch · 100 spots',
    'hero.cta':             'Reserve Now',

    'demo.title':          'One press. One sentence.',
    'demo.titleLine2':     'Done.',
    'demo.subtitle':       '72-hour battery life. Stores audio offline, auto-uploads when connected. Your MiClaw stays with you everywhere, all the time.',

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
  },
}
