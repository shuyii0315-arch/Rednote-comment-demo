/* 文档站：左边目录，右边一页一个主题；每个组件一页，按「变体 / 状态」分段展示，代码默认收起 */
(function () {
var $ = function (s, r) { return (r || document).querySelector(s); };
function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
var HINT = '3 人问过你刚看的「炸红葱头」这一步，先看看 ›';
var CMT = { avatar: 'i13', name: '🥔', text: '炸洋葱的油，你放哪一步处理了？', date: '10-17', place: '美国', likes: 1 };
var PHOTO = { avatar: 'i19', name: '516', badge: true, text: '交作业的来了', photo: 'i25', date: '10-06', place: '福建', likes: 9 };
function X(o, p) { return Object.assign({}, o, p); }

/* 示例框：items 是 [标签, 渲染函数, 是否套白底卡片]；code 是这个示例的代码 */
function ex(sec, o) {
  var box = el('div', 'ex'), pv = el('div', 'pv' + (o.layout ? ' ' + o.layout : ''));
  box.append(pv);
  (o.items || []).forEach(function (it) {
    var f = el('figure'), host = el('div', it[2] ? 'card' : ''); f.append(host);
    if (it[0]) f.append(el('figcaption', '', it[0]));
    pv.append(f); it[1](host);
  });
  if (o.build) o.build(pv);
  if (o.code) box.append(el('details', '', '<summary>代码</summary><div class="cw"><button class="cp">复制</button><pre><code>' + esc(o.code) + '</code></pre></div>'));
  sec.append(box); return box;
}
function section(page, title, text) {
  var s = el('div', 'sec'); page.append(s);
  if (title) s.append(el('h2', '', title)); if (text) s.append(el('p', '', text)); return s;
}
function propsTable(page, rows) {
  var s = section(page, '属性');
  s.append(el('table', '', '<tr><th>属性</th><th>类型</th><th>默认</th><th>说明</th></tr>' + rows.map(function (r) {
    return '<tr><td><code>' + r[0] + '</code></td><td>' + esc(r[1]) + '</td><td>' + (r[2] === '' ? '—' : '<code>' + esc(r[2]) + '</code>') + '</td><td>' + r[3] + '</td></tr>'; }).join('')));
}
document.addEventListener('click', function (e) {
  var b = e.target.closest('.cp'); if (!b) return;
  var t = b.parentNode.querySelector('code').textContent;
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = '已复制'; setTimeout(function () { b.textContent = '复制'; }, 1200); }).catch(function () {});
});

/* ---------------- 页面 ---------------- */
var P = {};
var NAV = [
  ['开始', [['intro', '介绍'], ['install', '安装与使用'], ['ai', '给 AI 用'], ['test', 'AI 测试']]],
  ['规则', [['rules', '社区规则']]],
  ['基础', [['colors', '颜色'], ['type', '文字'], ['materials', '圆角与阴影'], ['motion-tokens', '动效曲线'], ['icons', '图标'], ['reactions', '反应']]],
  ['基础组件', [['avatar', '头像', 'Avatar'], ['badge', '课代表徽章', 'Badge'], ['button', '按钮', 'Button'], ['chip', '胶囊', 'Chip'], ['tag', '标签', 'Tag'], ['like', '点赞', 'LikeButton'], ['toast', '轻提示', 'Toast']]],
  ['业务组件', [['comment', '评论', 'Comment'], ['composer', '评论输入', 'CommentComposer'], ['hint', '原位提示', 'InlineHint'], ['picker', '反应选择', 'ReactionPicker'], ['shared', '大家晒的', 'SharedEntry'], ['sheet', '弹层标题', 'SheetHeader'], ['end', '列表底部', 'EndOfList'], ['card', '笔记卡', 'NoteCard'], ['noti', '通知条目', 'NotificationItem']]],
  ['动效', [['motion', '交互动效']]]
];

P.intro = function (pg) {
  pg.append(el('h1', '', '评论区互动 Design System'));
  pg.append(el('p', 'lead', '从小红书笔试原型里抽出来的一套设计系统。组件可以传内容和状态，自动排版；尺寸取自原型的 Figma 数据，图标和动效沿用原型自己的代码。原型仓库本身不改动。'));
  var c = el('div', 'cards'); pg.append(c);
  [['colors', '基础', '颜色、文字、圆角、阴影、动效曲线，统一成有名字的 token'], ['avatar', '基础组件', '头像、徽章、按钮、胶囊、标签、点赞、轻提示'], ['comment', '业务组件', '评论、输入、提示、大家晒的、笔记卡、通知'], ['motion', '动效', '点赞、长按选反应、飘起、通知、加载']].forEach(function (x) {
    var a = el('a', '', '<b>' + x[1] + '</b><span>' + x[2] + '</span>'); a.href = '#/' + x[0]; c.append(a); });
  var s = section(pg, '文件结构');
  s.append(el('table', '', [['<code>src/tokens/</code>', 'tokens.json 是唯一源头，tokens.css 由它生成'], ['<code>src/ui.js</code> <code>ui.css</code>', '所有组件；每个组件上方写了可传的属性'], ['<code>src/motion.js</code>', '飘起、Toast、通知、加载，调用原型原函数'], ['<code>src/engine/</code>', '原型的图层数据、渲染器和动效，原样复制，只读'], ['<code>dist/</code>', 'rds.js、rds.css，页面里引用这两个文件'], ['<code>DESIGN.md</code> <code>llms.txt</code>', '给 AI 的规则和目录']].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('')));
};

P.install = function (pg) {
  pg.append(el('h1', '', '安装与使用'));
  pg.append(el('p', 'lead', '装好以后页面里有一个全局的 RDS，组件都在 RDS.ui 下面。'));
  var s = section(pg, '安装');
  s.append(el('pre', 'blk', '<code>npm install github:shuyii0315-arch/rednote-comment-ds</code>'));
  s.append(el('p', '', '或者不装，直接引用：'));
  s.append(el('pre', 'blk', '<code>' + esc('<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/shuyii0315-arch/rednote-comment-ds@main/dist/rds.css">\n<script src="https://cdn.jsdelivr.net/gh/shuyii0315-arch/rednote-comment-ds@main/dist/rds.js"></script>') + '</code>'));
  s = section(pg, '使用', '每个组件都是 RDS.ui.组件名(容器, 属性)。内容和状态都用属性传，返回的对象里有它的元素和当前状态。');
  s.append(el('pre', 'blk', '<code>' + esc("<div id=\"c\"></div>\n<script>\n  RDS.ui.Comment(document.getElementById('c'), {\n    avatar: 'i19', name: '516', badge: true,\n    text: '照着做了，油留着炒肉真的香', photo: 'i25',\n    date: '10-06', place: '福建', likes: 9,\n    onReact: kind => console.log(kind)\n  });\n</script>") + '</code>'));
  s = section(pg, '写新样式', '新元素只用 tokens.css 里的变量，比如 var(--color-brand-red)、var(--ease-standard)，不写死色值和像素。');
};

P.ai = function (pg) {
  pg.append(el('h1', '', '给 AI 用'));
  pg.append(el('p', 'lead', '让 AI（Claude Code、Cursor 等）做新页面时，把这个仓库给它，并用下面这段提示词。规则写在 DESIGN.md，目录在 llms.txt。'));
  pg.append(el('pre', 'blk', '<button class="cp">复制</button><code>1、先读 llms.txt 和 DESIGN.md，了解这套设计系统有哪些组件、规则和验收标准。\n2、用 RDS.ui 的组件和 RDS.motion 搭页面：已有组件直接用，不重画；新元素只用 tokens.css 的变量。\n3、要做的页面：【写清楚页面和场景，例如：跟做模式的「做过的人回答」卡片】\n4、不要改 src/engine 里的任何文件。\n验收标准：页面里搜不到写死的色值和像素值；每个新元素都能说出为什么在那里；和文档里的组件放在一起看不出差别。</code>'));
};

var TK = null;
function tokens(cb) { if (TK) return cb(TK); fetch('src/tokens/tokens.json').then(function (r) { return r.json(); }).then(function (t) { TK = t; cb(t); }).catch(function () { $('#page').append(el('p', 'note', '本地直接打开时浏览器不允许读取 tokens.json，请用 npm run docs 打开。')); }); }
P.colors = function (pg) {
  pg.append(el('h1', '', '颜色'));
  pg.append(el('p', 'lead', '原型里有 103 个色值，归并成 24 个有名字、有用途的颜色和 3 个遮罩。每个原始色值对应哪个 token，见 audit/mapping.md。'));
  tokens(function (T) {
    for (var g in T.color) { var v = T.color[g], s = section(pg, g), grid = el('div', 'grid'); s.append(grid);
      var add = function (n, o) { grid.append(el('div', 'tile', '<i style="background:' + o.value + ';box-shadow:inset 0 -1px 0 #EAEAEA"></i><div><b>' + n + '</b><br><code>' + o.value + '</code><br>' + (o.use || '') + '</div>')); };
      if (v.value) add(g, v); else for (var k in v) add('--color-' + g + '-' + k, v[k]); }
  });
};
P.type = function (pg) {
  pg.append(el('h1', '', '文字'));
  pg.append(el('p', 'lead', '原型里 27 种小数字号，归成 7 档（8–15pt）。下面每一档都用它自己的字号显示。'));
  tokens(function (T) {
    var s = section(pg, '字号'), t = el('table'); s.append(t);
    t.innerHTML = '<tr><th>token</th><th>字号</th><th>示例</th><th>用在哪</th></tr>' + Object.keys(T.typography.size).map(function (k) { var o = T.typography.size[k];
      return '<tr><td><code>--font-size-' + k + '</code></td><td>' + o.value + 'pt</td><td style="font-size:' + o.value + 'px;color:#333">炸洋葱的油</td><td>' + (o.use || '') + '</td></tr>'; }).join('');
    s = section(pg, '字重与字体'); t = el('table'); s.append(t);
    t.innerHTML = '<tr><th>token</th><th>值</th><th>用在哪</th></tr>' + ['family', 'weight', 'lineHeight'].map(function (g) { return Object.keys(T.typography[g]).map(function (k) { var o = T.typography[g][k];
      return '<tr><td><code>' + g + '.' + k + '</code></td><td>' + esc(String(o.value)) + '</td><td>' + (o.use || '') + '</td></tr>'; }).join(''); }).join('');
  });
};
P.materials = function (pg) {
  pg.append(el('h1', '', '圆角与阴影'));
  pg.append(el('p', 'lead', '圆角从 28 种收成 6 档，阴影 3 档。'));
  tokens(function (T) {
    var s = section(pg, '圆角'), g = el('div', 'grid'); s.append(g);
    for (var k in T.radius) { var o = T.radius[k]; g.append(el('div', 'tile', '<i style="height:72px;display:grid;place-items:center;background:#F7F7F7"><span style="display:block;width:44px;height:44px;background:#fff;box-shadow:0 0 0 1px #DADADA;border-radius:' + o.value + 'px"></span></i><div><b>--radius-' + k + '</b> · ' + o.value + 'px<br>' + (o.use || '') + '</div>')); }
    s = section(pg, '阴影'); g = el('div', 'grid'); s.append(g);
    for (k in T.elevation) { o = T.elevation[k]; g.append(el('div', 'tile', '<i style="height:88px;display:grid;place-items:center;background:#F7F7F7"><span style="display:block;width:64px;height:40px;background:#fff;border-radius:8px;box-shadow:' + o.value + '"></span></i><div><b>--elevation-' + k + '</b><br>' + (o.use || '') + '</div>')); }
  });
};
P['motion-tokens'] = function (pg) {
  pg.append(el('h1', '', '动效曲线'));
  pg.append(el('p', 'lead', '原型里 12 条曲线、28 种时长，按用途收成 7 条曲线、7 档时长。点「播放」看每条曲线怎么走。'));
  tokens(function (T) {
    var s = section(pg, '曲线');
    Object.keys(T.motion.easing).forEach(function (k) { var o = T.motion.easing[k];
      ex(s, { layout: 'col', build: function (pv) {
        pv.innerHTML = '<div style="font-size:13px"><b>--ease-' + k + '</b> <code>' + o.value + '</code><div style="color:#8F8F8F;margin-top:4px">' + (o.use || '') + '</div></div><div style="position:relative;width:100%;height:24px;background:#fff;border-radius:12px;box-shadow:0 0 0 1px #EAEAEA"><i style="position:absolute;left:4px;top:4px;width:16px;height:16px;border-radius:50%;background:#FF2442;transition:left .6s ' + o.value + '"></i></div><button class="btn">播放</button>';
        var dot = pv.querySelector('i'); pv.querySelector('button').onclick = function () { dot.style.left = dot.style.left === 'calc(100% - 20px)' ? '4px' : 'calc(100% - 20px)'; };
      } });
    });
    s = section(pg, '时长'); var t = el('table'); s.append(t);
    t.innerHTML = '<tr><th>token</th><th>毫秒</th><th>用在哪</th></tr>' + Object.keys(T.motion.duration).map(function (k) { var o = T.motion.duration[k]; return '<tr><td><code>--dur-' + k + '</code></td><td>' + o.value + '</td><td>' + (o.use || '') + '</td></tr>'; }).join('');
  });
};
P.icons = function (pg) {
  pg.append(el('h1', '', '图标'));
  pg.append(el('p', 'lead', '原型里所有 ic/* 图标，原样取自 Figma 导出，按图形实际大小统一放进 24px 的框里显示，下面标原尺寸。'));
  var g = el('div', 'ics'); pg.append(g);
  RDS.icons().forEach(function (ic) {
    if (/已赞/.test(ic.name)) ic.svg = HEART_ON;
    var d = el('div', '', '<span class="ib">' + ic.svg + '</span>' + ic.name + '<em>' + Math.round(ic.w * 375 / 260) + '×' + Math.round(ic.h * 375 / 260) + 'pt</em>'); g.append(d);
    var s = d.querySelector('svg'); if (!s) return;
    var w = +s.getAttribute('width') || ic.w, h = +s.getAttribute('height') || ic.h; if (!s.getAttribute('viewBox')) s.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    try { var bb = s.getBBox(), sw = 1.5, bw = bb.width + sw * 2, bh = bb.height + sw * 2; if (bw > 0 && bh > 0) { s.setAttribute('viewBox', (bb.x - sw) + ' ' + (bb.y - sw) + ' ' + bw + ' ' + bh); var k = 24 / Math.max(bw, bh); s.setAttribute('width', (bw * k).toFixed(1)); s.setAttribute('height', (bh * k).toFixed(1)); s.style.overflow = 'visible'; } } catch (e) {}
  });
};
P.reactions = function (pg) {
  pg.append(el('h1', '', '反应'));
  pg.append(el('p', 'lead', '长按爱心的 4 种反应。图标和颜色取自原型。'));
  var g = el('div', 'grid'); pg.append(g);
  RDS.reactions.forEach(function (r) { g.append(el('div', 'tile', '<i style="height:96px;display:grid;place-items:center;background:#F7F7F7">' + RDS.emoji(r.id, 48) + '</i><div><b>' + r.label + '</b> · <code>' + r.id + '</code><br><span style="color:' + r.color + '">' + r.color + '</span></div>')); });
};


P.test = function (pg) {
  pg.append(el('h1', '', 'AI 测试'));
  pg.append(el('p', 'lead', '同一个任务，交给三个没看过这个项目的 AI：一个不用设计系统，两个用（第一轮用 v0.4，按发现的问题改完后用 v0.5 再跑一次）。看做出来的样子、有没有守社区规则、写死了多少数值。'));
  var s = section(pg, '任务', '跟做模式：用户跟着《台式卤肉饭》视频做菜，停在第 3 步「炸红葱头」。在不离开视频的情况下，看到做过的人对这一步怎么说：最多人问的「油温多少合适？」和 3 条回答、一个还没人答的问题、86 人晒的成品。要能赞和回应、看图、提问、回到视频。手机宽 390。三个 AI 拿到的文字和图片完全一样。');
  s = section(pg, '结果', '上面一排是打开时的样子，下面一排是滑到底。');
  var g = el('div', 'shots3'); s.append(g);
  [['r1-without', '不用设计系统'], ['r1-with', '用 v0.4'], ['r2-with', '用 v0.5']].forEach(function (x) {
    g.append(el('figure', '', '<img src="img/test/' + x[0] + '.jpg" alt=""><img src="img/test/' + x[0] + '-b.jpg" alt=""><figcaption>' + x[1] + '</figcaption>'));
  });
  s = section(pg, '对比');
  s.append(el('table', '', '<tr><th></th><th>不用设计系统</th><th>用 v0.4</th><th>用 v0.5</th></tr>' + [
    ['写死的数值', '14 种颜色、187 处像素', '0', '0'],
    ['组件', '全部自己画', '评论、大家晒的、标签、评论输入', '同左，输入改成收起的一行'],
    ['课代表', '自己画了一个文字标', '原型的徽章', '原型的徽章'],
    ['回应', '只能点赞', '赞 + 长按 4 种反应', '赞 + 长按 4 种反应'],
    ['新发明的东西', '红色「问」图标、红色「我来答」按钮，都是新的强调色', '视频上的播放键（包里没有）', '同左'],
    ['社区规则', '没有违反', '没有违反；还主动没把没晒图的人算作「做过的人」', '没有违反'],
    ['它指出的包的问题', '—', '页面不在包目录时图片 404；没有日期时多出空格；「查看」点击区不够 44pt；输入面板占地方', '图片 404 仍要绕开；弹层标题写死；「回复」和标签不能点；token 字号和组件差 1px']
  ].map(function (r) { return '<tr><td style="color:#8F8F8F;white-space:nowrap">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('')));
  s = section(pg, '看到了什么', '');
  s.append(el('ul', 'obs', [
    '不用设计系统，AI 也能做出「像小红书」的页面，因为小红书本来就很常见。差别在细节：课代表、按钮、图标都是它自己发明的，颜色和尺寸全是写死的数字，下一个页面又会是另一套。',
    '用了设计系统，页面里没有一个写死的数值，课代表、点赞、长按反应和原型完全一样，6 条社区规则也都守住了。',
    'AI 用的时候会卡住的地方，就是系统没写清楚、没做好的地方。两轮一共指出 8 个问题，都已经改进系统里。'
  ].map(function (t) { return '<li>' + t + '</li>'; }).join('')));
  s = section(pg, '测完改了什么');
  s.append(el('table', '', '<tr><th>版本</th><th>改动</th></tr>' + [
    ['v0.5', '组件按 rds.js 的位置自己找图片，页面放哪里都行；评论输入加「收起」状态，平时一行；小按钮点击区扩到 44pt；没有日期地点时不留空格'],
    ['v0.6', '原型引擎的图片地址也一起修好，不会再 404，也不会改页面的地址栏；弹层标题可以传；评论加 onReply、onTag，标签加 onClick；写明组件字号和 token 的 1px 差别']
  ].map(function (r) { return '<tr><td><code>' + r[0] + '</code></td><td>' + r[1] + '</td></tr>'; }).join('')));
  pg.append(el('p', 'note', '测试里用的 AI 和这份文档都是同一个模型（Claude）。截图是 390×844 的真实渲染。'));
};

P.rules = function (pg) {
  pg.append(el('h1', '', '社区规则'));
  pg.append(el('p', 'lead', '组件管样子，这 6 条管能不能这样做。它们来自小红书社区公约里的「真诚分享，友好互动」：评论区的价值是真的做过的人说的真话，任何新页面都不能让它变味。'));
  var R = [
    ['晒的必须是真做过的', '只有带成品图、或明确说做了的评论，才能进入「大家晒的」和「做过的人」。', '用户来评论区就是为了看真实结果；混进没做过的，「做过的人」就不可信了。'],
    ['AI 只负责找到过来人', '可以识别、归类、匹配；不改写、不总结原话。引用时显示原话、头像和用户名。', 'AI 总结出来的答案没有人负责，也看不出是谁试过。原话加上人，才有人可以信。'],
    ['课代表只说明帮到过人', '不排名、不比较、不显示分数，不加「第一名」「最佳」。', '一旦排名，大家会为了名次去写，而不是为了帮人。'],
    ['评论区不卖东西', '不放商品卡、店铺、广告位。商业价值来自「做过 / 晒了」的度量，不在评论里卖货。', '评论区一有广告，真话就会被怀疑是软文。'],
    ['不打断', '能原地展开的不跳新页面，不用弹窗。', '跟做的时候手是油的，每多跳一页就多一次放下锅铲。'],
    ['回应只有 4 种', '有用、爱了、学到了、送花，不新增表情。', '4 种反应各对应一种帮助，数得清，才能用来判断谁帮到了人。']
  ];
  var t = el('table'); pg.append(t);
  t.innerHTML = '<tr><th style="width:28px"></th><th>规则</th><th>为什么</th></tr>' + R.map(function (r, i) { return '<tr><td style="color:#8F8F8F">0' + (i + 1) + '</td><td><b style="font-weight:500">' + r[0] + '</b><br><span style="color:#666">' + r[1] + '</span></td><td style="color:#666">' + r[2] + '</td></tr>'; }).join('');

  function pair(title, text, yes, no, yc, nc) {
    var s = section(pg, title, text), g = el('div', 'dd2'); s.append(g);
    [[yes, '这样做', yc, 'dd-yes'], [no, '不要这样', nc, 'dd-no']].forEach(function (x) {
      var w = el('div', 'dd ' + x[3]), pv = el('div', 'pv'); w.append(pv); w.append(el('div', 'vd', x[1] + '<span>' + x[2] + '</span>')); g.append(w); x[0](pv);
    });
  }
  var fake = function (h) { return function (pv) { var c = el('div', 'card'); c.style.cssText = 'width:390px;background:#fff'; c.innerHTML = h; pv.append(c); }; };
  pair('AI 只负责找到过来人', '同样是「油温多少合适」，左边把人带到原话，右边 AI 替他们说了。',
    function (pv) { var c = el('div', 'card'); c.style.background = '#fff'; c.style.padding = '10px 14px'; pv.append(c); RDS.ui.InlineHint(c, { avatars: ['i19', 'i14', 'i16'], text: '3 个做过的人回答过这一步，看看他们怎么说 ›' }); },
    fake('<div style="padding:14px 16px;font-size:13px;line-height:1.7;color:#333"><div style="font-size:12px;color:#8C8C8C;margin-bottom:6px">✦ AI 总结</div>油温建议控制在 160–170°C，小火慢炸至金黄色后捞出，避免炸糊。</div>'),
    '原话、头像、用户名都在，点进去是真人说的', 'AI 改写成了标准答案，看不出谁试过、在哪试过');
  pair('课代表只说明帮到过人', '左边是一枚徽章；右边把它变成了排名。',
    function (pv) { var c = el('div', 'card'); pv.append(c); RDS.ui.Comment(c, X(PHOTO, { photo: '' })); },
    fake('<div style="display:flex;gap:12px;padding:15px 16px"><span style="width:35px;height:35px;border-radius:50%;background:url(img/i19.jpg) center/cover;flex:none"></span><div style="font-size:13px;color:#333"><div style="color:#AEA7A7;font-size:12.5px">516 <span style="background:#FF2442;color:#fff;border-radius:3px;padding:0 4px;font-size:10px">TOP 1 课代表 · 98 分</span></div><div style="margin-top:3px">交作业的来了</div></div></div>'),
    '只说明「帮到过人」', '名次和分数会让人为了排名去写');
  pair('评论区不卖东西', '同一个评论列表，右边在中间插了一张商品卡。',
    function (pv) { var c = el('div', 'card'); pv.append(c); var a = el('div'), b = el('div'); c.append(a, b); RDS.ui.Comment(a, CMT); RDS.ui.Comment(b, { avatar: 'i14', name: 'zZ珍珍', text: '红葱酥那一步的油别倒，留着炒肉，特别香', date: '7天前', place: '青海', likes: 8 }); },
    function (pv) { var c = el('div', 'card'); c.style.background = '#fff'; pv.append(c); var a = el('div'); c.append(a); RDS.ui.Comment(a, CMT);
      c.append(el('div', '', '<div style="margin:0 15px 12px 63px;display:flex;gap:10px;padding:10px;border-radius:8px;background:#F7F7F7;font-size:12.5px;color:#333"><span style="width:52px;height:52px;border-radius:6px;background:url(img/i23.jpg) center/cover;flex:none"></span><div>同款铸铁锅 炸红葱头不粘<div style="color:#FF2442;margin-top:8px">¥129 去购买</div></div></div>')); },
    '只有做过的人说的话', '一张广告，会让旁边的真话也像软文');
};

/* ---------- 基础组件 ---------- */
var USE = {
  avatar: [['评论、回复、通知、笔记卡作者', '几个人一起出现时用头像组（「3 人问过」「86 人晒过」）'], ['装饰或占位：没有真实用户就不放头像', '头像组超过 3 个']],
  badge: [['晒的经验被很多人点「有用」的用户，挂在用户名后'], ['排名、等级、官方认证', '给 AI 或作者自己挂']],
  button: [['primary：一屏只有一个的主操作，如发送', 'outline：关注作者', 'link：评论里点完「有用」后顺手关注'], ['同一区域放两个 primary', '用按钮做筛选（用胶囊）']],
  chip: [['单选的筛选（大家晒的）和排序（搜索结果）'], ['说明状态（用标签）', '主操作（用按钮）', '多选']],
  tag: [['说明这条评论的状态：作者赞过、N 人在蹲、我也在蹲、作者'], ['分类筛选（用胶囊）', '超过 2 个挂在同一条评论下']],
  like: [['评论的赞和 4 种反应'], ['笔记本身的点赞（底栏另有样式）', '新增第 5 种表情']],
  toast: [['操作成功的轻提示：晒好啦、蹲上了'], ['出错、需要用户做决定的事', '超过一行的长句']],
  comment: [['任何一条用户评论、回复'], ['AI 自己生成的回答：AI 不以评论身份说话', '改写或总结过的用户原话']],
  composer: [['在评论区或跟做模式里提问、回复'], ['打字时弹窗打断']],
  hint: [['打字时提示「已经有人问过」，让用户先看答案'], ['广告、推荐笔记', '用户没在打字时']],
  picker: [['长按爱心时选反应'], ['单独常驻在页面上']],
  shared: [['评论区顶部，把晒图集中在一起'], ['还没有人晒图时（不显示入口）']],
  sheet: [['「大家晒的」弹层顶部'], ['普通页面标题']],
  end: [['列表翻到底'], ['列表还在加载时']],
  card: [['搜索结果双列流'], ['评论区内']],
  noti: [['收到的赞、回应、有人照着做成了'], ['系统公告、营销消息']]
};
function head(pg, name, zh, lead) {
  pg.append(el('h1', '', zh + '<small>' + name + '</small>')); pg.append(el('p', 'lead', lead));
  var id = (location.hash.replace(/^#\/?/, '') || ''), u = USE[id];
  if (u) pg.append(el('div', 'use', '<div><b>用在</b><ul>' + u[0].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div><div class="no"><b>不要用在</b><ul>' + u[1].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>'));
}

P.avatar = function (pg) {
  head(pg, 'Avatar / AvatarStack', '头像', '圆形头像。尺寸按出现的位置分 6 档；几个人一起出现时用头像组，叠在一起。');
  var s = section(pg, '尺寸');
  ex(s, { layout: 'c', items: ['xl', 'l', 'card', 'm', 's', 'xs'].map(function (z) { return [z + ' · ' + { xl: '通知', l: '评论', card: '笔记卡作者', m: '二级回复', s: '原位提示', xs: '晒过的人' }[z], function (b) { RDS.ui.Avatar(b, { src: 'i1', size: z }); }]; }),
    code: "RDS.ui.Avatar(box, { src: 'i1', size: 'l' });" });
  s = section(pg, '头像组', 'xs 用在笔记卡的「N 人晒过」，白边在外；s 用在原位提示，白边在内。最多显示 3 个。');
  ex(s, { layout: 'c', items: [['xs', function (b) { RDS.ui.AvatarStack(b, { srcs: ['i12', 'i1', 'i11'], size: 'xs' }); }, 1], ['s', function (b) { RDS.ui.AvatarStack(b, { srcs: ['i21', 'i13', 'i20'], size: 's' }); }, 1]],
    code: "RDS.ui.AvatarStack(box, { srcs: ['i21','i13','i20'], size: 's' });" });
  propsTable(pg, [['src', 'string', '', '图片：图片名或地址'], ['size', "'xs' | 's' | 'm' | 'card' | 'l' | 'xl'", 'l', '尺寸'], ['srcs', 'string[]', '[]', '头像组用，最多 3 个']]);
};
P.badge = function (pg) {
  head(pg, 'Badge', '课代表徽章', '用户晒的经验被很多人点「有用」后得到的标记，只说明帮到过人，不排名、不比较。挂在用户名后面。');
  var s = section(pg, '默认');
  ex(s, { layout: 'c', items: [['单独', function (b) { b.style.transform = 'scale(2)'; b.style.margin = '8px 40px'; RDS.ui.Badge(b); }], ['在评论里', function (b) { RDS.ui.Comment(b, X(PHOTO, { photo: '' })); }, 1]],
    code: "RDS.ui.Badge(box);\n// 在评论里：RDS.ui.Comment(box, { ..., badge: true })" });
};
P.button = function (pg) {
  head(pg, 'Button', '按钮', '三种：发送用实心红色；关注用红色描边；评论里点完「有用」后出现的关注，只有文字。');
  var s = section(pg, '类型');
  ex(s, { layout: 'c', items: [['primary', function (b) { RDS.ui.Button(b, { text: '发送' }); }], ['outline', function (b) { RDS.ui.Button(b, { text: '关注', variant: 'outline' }); }], ['link', function (b) { RDS.ui.Button(b, { text: '关注', variant: 'link' }); }]],
    code: "RDS.ui.Button(box, { text: '发送' });\nRDS.ui.Button(box, { text: '关注', variant: 'outline' });\nRDS.ui.Button(box, { text: '关注', variant: 'link' });" });
  s = section(pg, '状态', '输入框里没字时，发送是禁用状态。按下时缩小到 0.96。');
  ex(s, { layout: 'c', items: [['默认', function (b) { RDS.ui.Button(b, { text: '发送' }); }], ['禁用', function (b) { RDS.ui.Button(b, { text: '发送', disabled: true }); }]],
    code: "RDS.ui.Button(box, { text: '发送', disabled: true });" });
  propsTable(pg, [['text', 'string', '', '按钮文字'], ['variant', "'primary' | 'outline' | 'link'", 'primary', '类型'], ['disabled', 'boolean', 'false', '禁用'], ['onClick', 'function', '', '点击']]);
};
P.chip = function (pg) {
  head(pg, 'Chip / FilterChips / SortChips', '胶囊', '单选的小按钮。圆的用在「大家晒的」筛选，方的用在搜索结果排序。一组胶囊用 FilterChips 或 SortChips，点哪个哪个选中。');
  var s = section(pg, '形状与状态');
  ex(s, { layout: 'c', items: [['pill · 未选', function (b) { RDS.ui.Chip(b, { text: '晒了成品' }); }], ['pill · 选中', function (b) { RDS.ui.Chip(b, { text: '全部', selected: true }); }], ['square · 未选', function (b) { RDS.ui.Chip(b, { text: '最新', shape: 'square' }); }], ['square · 选中', function (b) { RDS.ui.Chip(b, { text: '最多人晒', shape: 'square', selected: true }); }]],
    code: "RDS.ui.Chip(box, { text: '全部', selected: true });\nRDS.ui.Chip(box, { text: '最多人晒', shape: 'square', selected: true });" });
  s = section(pg, '筛选组', '可以点，onChange 拿到选中的那一项。');
  ex(s, { items: [['', function (b) { b.className = 'rds'; b.style.cssText = 'width:auto;background:none'; RDS.ui.FilterChips(b, { items: ['全部', '晒了成品', '踩过的坑', '改了做法'] }); }]],
    code: "RDS.ui.FilterChips(box, {\n  items: ['全部', '晒了成品', '踩过的坑', '改了做法'],\n  onChange: v => console.log(v)\n});" });
  s = section(pg, '排序组');
  ex(s, { items: [['', function (b) { RDS.ui.SortChips(b, { items: ['综合', '最新', '最多人晒', '村驴版', '经典配方'], value: '最多人晒' }); }, 1]],
    code: "RDS.ui.SortChips(box, {\n  items: ['综合', '最新', '最多人晒', '村驴版', '经典配方'],\n  value: '最多人晒'\n});" });
  propsTable(pg, [['text', 'string', '', '单个胶囊的文字'], ['selected', 'boolean', 'false', '是否选中'], ['shape', "'pill' | 'square'", 'pill', '圆的筛选 / 方的排序'], ['items', 'string[]', '', '一组胶囊的选项（FilterChips / SortChips）'], ['value', 'string', '第一项', '默认选中'], ['onChange', 'function', '', '选中变化']]);
};
P.tag = function (pg) {
  head(pg, 'Tag', '标签', '挂在评论下面的小标签，说明这条评论的状态。');
  var s = section(pg, '类型');
  ex(s, { layout: 'c', items: [['squat · 有人在蹲', function (b) { RDS.ui.Tag(b, { text: '5 人在蹲' }); }], ['mine · 我也在蹲', function (b) { RDS.ui.Tag(b, { text: '6 人在蹲', kind: 'mine' }); }], ['plain · 作者赞过', function (b) { RDS.ui.Tag(b, { text: '作者赞过', kind: 'plain' }); }], ['author · 作者', function (b) { RDS.ui.Tag(b, { kind: 'author' }); }]],
    code: "RDS.ui.Tag(box, { text: '5 人在蹲' });\nRDS.ui.Tag(box, { text: '6 人在蹲', kind: 'mine' });\nRDS.ui.Tag(box, { text: '作者赞过', kind: 'plain' });\nRDS.ui.Tag(box, { kind: 'author' });" });
  s = section(pg, '在评论里', '用 Comment 的 tags 属性传进去。');
  ex(s, { items: [['', function (b) { RDS.ui.Comment(b, X(CMT, { tags: [{ text: '作者赞过', kind: 'plain' }, { text: '6 人在蹲', kind: 'mine' }] })); }, 1]],
    code: "RDS.ui.Comment(box, {\n  ...,\n  tags: [\n    { text: '作者赞过', kind: 'plain' },\n    { text: '6 人在蹲', kind: 'mine' }\n  ]\n});" });
  propsTable(pg, [['text', 'string', '', '标签文字；author 默认是「作者」'], ['onClick', 'function', '', '点标签'], ['kind', "'squat' | 'mine' | 'plain' | 'author'", 'squat', '类型']]);
};
P.like = function (pg) {
  head(pg, 'LikeButton', '点赞', '点一下赞，再点取消；长按 0.4 秒弹出 4 种反应。动画调用原型自己的 likeAnim 和 floatUp，时长和曲线一致。');
  var s = section(pg, '状态', '都可以点。');
  ex(s, { layout: 'c', items: [['未赞', function (b) { RDS.ui.LikeButton(b, { count: 12 }); }], ['已赞', function (b) { RDS.ui.LikeButton(b, { count: 13, liked: true }); }], ['没有数字', function (b) { RDS.ui.LikeButton(b, {}); }]].concat(RDS.reactions.map(function (r) { return ['反应 · ' + r.label, function (b) { RDS.ui.LikeButton(b, { count: 10, reaction: r.id }); }]; })),
    code: "RDS.ui.LikeButton(box, { count: 12 });\nRDS.ui.LikeButton(box, { count: 13, liked: true });\nRDS.ui.LikeButton(box, { count: 10, reaction: 'bulb' });" });
  s = section(pg, '长按选反应', '传 onReact 就打开。按住爱心，弹出反应后点一个：爱心换成这个反应，从原位飘起。');
  ex(s, { layout: 'c', items: [['按住试试', function (b) { b.style.marginTop = '40px'; var r = RDS.ui.LikeButton(b, { count: 9, onReact: function (k) { cap.textContent = '选了：' + KLABEL[k]; } }); }]],
    code: "RDS.ui.LikeButton(box, {\n  count: 9,\n  onReact: kind => console.log(kind)\n});" });
  var cap = el('p', 'note', ''); s.append(cap);
  propsTable(pg, [['liked', 'boolean', 'false', '是否已赞'], ['count', 'number', '0', '数字，0 不显示'], ['reaction', "'bulb' | 'heart' | 'book' | 'flower'", '', '已选的反应'], ['onChange', 'function', '', '点赞 / 取消后，拿到 { liked, likes }'], ['onReact', 'function', '', '传了才能长按选反应']]);
};
P.toast = function (pg) {
  head(pg, 'Toast', '轻提示', '黑色胶囊，告诉用户刚才的操作成功了。原型里有两档，字少用默认，字多用 l。');
  var s = section(pg, '尺寸');
  ex(s, { layout: 'c', items: [['默认', function (b) { RDS.ui.Toast(b, { text: '晒好啦' }); }], ['l', function (b) { RDS.ui.Toast(b, { text: '蹲上了，有人答了告诉你', size: 'l' }); }]],
    code: "RDS.ui.Toast(box, { text: '晒好啦' });\nRDS.ui.Toast(box, { text: '蹲上了，有人答了告诉你', size: 'l' });" });
  s = section(pg, '出现和消失', '要带动效时用 RDS.motion.toast：淡入，停 1.5 秒，淡出。');
  ex(s, { layout: 'col', build: function (pv) { var f = el('div', 'frame'); f.style.cssText += ';width:390px;height:110px'; var a = el('div', 'acts');
      [['晒好啦', '晒好啦'], ['蹲上了', '蹲上了，有人答了告诉你']].forEach(function (x) { var b = el('button', 'btn', x[0]); b.onclick = function () { RDS.motion.toast(f, x[1], 26); }; a.append(b); });
      pv.append(a, f); }, code: "RDS.motion.toast(box, '晒好啦');" });
  propsTable(pg, [['text', 'string', '', '提示文字'], ['size', "'l'", '', '字多时用']]);
};

/* ---------- 业务组件 ---------- */
P.comment = function (pg) {
  head(pg, 'Comment', '评论', '评论区的一条评论。由头像、用户名、课代表徽章、标签、点赞按钮组成；文字多长都会自己排好。');
  var s = section(pg, '默认');
  ex(s, { items: [['', function (b) { RDS.ui.Comment(b, CMT); }, 1]], code: "RDS.ui.Comment(box, {\n  avatar: 'i13', name: '🥔',\n  text: '炸洋葱的油，你放哪一步处理了？',\n  date: '10-17', place: '美国', likes: 1\n});" });
  s = section(pg, '晒图 · 课代表', 'photo 显示成品图，badge 显示课代表徽章。');
  ex(s, { items: [['', function (b) { RDS.ui.Comment(b, PHOTO); }, 1]], code: "RDS.ui.Comment(box, {\n  avatar: 'i19', name: '516', badge: true,\n  text: '交作业的来了', photo: 'i25',\n  date: '10-06', place: '福建', likes: 9\n});" });
  s = section(pg, '长文字 · 已赞');
  ex(s, { items: [['', function (b) { RDS.ui.Comment(b, { avatar: 'i14', name: 'zZ珍珍', text: '红葱酥那一步的油别倒，留着炒肉，特别香。我第一次做就是倒掉了，后来照着评论里说的留下来，第二天炒青菜也很香', date: '7天前', place: '青海', likes: 13, liked: true }); }, 1]], code: "RDS.ui.Comment(box, { ..., liked: true, likes: 13 });" });
  s = section(pg, '二级回复', 'reply 是缩进的小头像回复，author 显示「作者」；回复多时在下面接 ReplyToggle。');
  ex(s, { items: [['', function (b) { [function (d) { RDS.ui.Comment(d, CMT); }, function (d) { RDS.ui.Comment(d, { reply: true, author: true, avatar: 'i20', name: '阿紫在做饭', text: '炸完捞出来，油留着炒肉', date: '10-17', place: '广东' }); }, function (d) { RDS.ui.ReplyToggle(d, { count: 3 }); }].forEach(function (f) { var d = el('div'); b.append(d); f(d); }); }, 1]],
    code: "RDS.ui.Comment(box, {\n  reply: true, author: true,\n  avatar: 'i20', name: '阿紫在做饭',\n  text: '炸完捞出来，油留着炒肉',\n  date: '10-17', place: '广东'\n});\nRDS.ui.ReplyToggle(box2, { count: 3 });" });
  s = section(pg, '长按选反应', '传 onReact 打开。有课代表徽章的评论，选「有用」后用户名旁边出现「关注」，4 秒后淡出。');
  ex(s, { items: [['在爱心上按住', function (b) { b.style.marginTop = '30px'; RDS.ui.Comment(b, X(PHOTO, { onReact: function () {} })); }, 1]], code: "RDS.ui.Comment(box, {\n  ...,\n  onReact: kind => console.log(kind)\n});" });
  propsTable(pg, [['avatar', 'string', '', '头像'], ['name', 'string', '', '用户名'], ['text', 'string', '', '正文，自动换行'], ['photo', 'string', '', '晒的图'], ['date / place', 'string', '', '时间、地点'], ['likes', 'number', '0', '赞数'], ['liked', 'boolean', 'false', '已赞'], ['badge', 'boolean', 'false', '课代表徽章'], ['author', 'boolean', 'false', '「作者」标'], ['reply', 'boolean', 'false', '二级回复样式'], ['tags', '{ text, kind }[]', '', '评论下面的标签，见 Tag'], ['onReply', 'function', '', '点「回复」'], ['onTag', 'function', '', '点标签，比如点「5 人在蹲」一起蹲'], ['onLike', 'function', '', '点赞后'], ['onReact', 'function', '', '传了才能长按选反应']]);
};
P.composer = function (pg) {
  head(pg, 'CommentComposer', '评论输入', '真的输入框。没字时「发送」禁用；hint 是打字时在上方出现的原位提示。');
  var s = section(pg, '收起', '平时只占一行；点一下展开成完整的输入面板，发送后收回。跟做模式这类空间紧的页面用这个。');
  ex(s, { items: [['点一下试试', function (b) { RDS.ui.CommentComposer(b, { collapsed: true, avatar: 'i21', placeholder: '有话要说，快来评论' }); }, 1]], code: "RDS.ui.CommentComposer(box, {\n  collapsed: true, avatar: 'i21',\n  placeholder: '有话要说，快来评论',\n  onSend: text => {}\n});" });
  s = section(pg, '展开 · 空');
  ex(s, { items: [['', function (b) { RDS.ui.CommentComposer(b, { placeholder: '有话要说，快来评论' }); }, 1]], code: "RDS.ui.CommentComposer(box, {\n  placeholder: '有话要说，快来评论',\n  onSend: text => {}\n});" });
  s = section(pg, '打字时出现提示', '在下面这个输入框里打字试试：打两个字以上，上方出现「3 人问过」。');
  ex(s, { items: [['', function (b) { var c = RDS.ui.CommentComposer(b, { placeholder: '有话要说，快来评论', onInput: function (v) { c.setHint(v.length > 1 ? { avatars: ['i21', 'i13', 'i20'], text: HINT } : null); } }); }, 1]],
    code: "const c = RDS.ui.CommentComposer(box, {\n  onInput: v => c.setHint(v.length > 1 ? {\n    avatars: ['i21','i13','i20'],\n    text: '3 人问过你刚看的「炸红葱头」这一步，先看看 ›'\n  } : null)\n});" });
  s = section(pg, '有内容');
  ex(s, { items: [['', function (b) { RDS.ui.CommentComposer(b, { value: '没有红葱头，用洋葱代替可以吗', hint: { avatars: ['i21', 'i13', 'i20'], text: HINT } }); }, 1]], code: "RDS.ui.CommentComposer(box, {\n  value: '没有红葱头，用洋葱代替可以吗',\n  hint: { avatars: ['i21','i13','i20'], text: '…' }\n});" });
  propsTable(pg, [['collapsed', 'boolean', 'false', '先显示一行输入条，点了才展开'], ['avatar', 'string', '', '输入条左边自己的头像'], ['value', 'string', "''", '输入框里的内容'], ['placeholder', 'string', '说点什么...', '占位文字'], ['hint', '{ avatars, text }', '', '原位提示'], ['onInput', 'function', '', '打字时'], ['onSend', 'function', '', '点发送']]);
};
P.hint = function (pg) {
  head(pg, 'InlineHint', '原位提示', '打字时，在输入框上方告诉用户「已经有人问过」：头像组加一句话，点了能跳过去看。');
  var s = section(pg, '默认');
  ex(s, { layout: 'c', items: [['', function (b) { b.style.padding = '8px 10px'; RDS.ui.InlineHint(b, { avatars: ['i21', 'i13', 'i20'], text: HINT }); }, 1]], code: "RDS.ui.InlineHint(box, {\n  avatars: ['i21','i13','i20'],\n  text: '3 人问过你刚看的「炸红葱头」这一步，先看看 ›'\n});" });
  propsTable(pg, [['avatars', 'string[]', '[]', '最多 3 个'], ['text', 'string', '', '提示文字']]);
};
P.picker = function (pg) {
  head(pg, 'ReactionPicker', '反应选择', '有用、爱了、学到了、送花。长按爱心时自动弹出；也可以单独用。弹出动画与原型一致。');
  var s = section(pg, '默认', '点一个会重新播放弹出动画。');
  ex(s, { layout: 'c', items: [['', function (b) { var r = RDS.ui.ReactionPicker(b, { onChoose: function () { r.replay(); } }); }]], code: "RDS.ui.ReactionPicker(box, {\n  onChoose: kind => console.log(kind)\n});" });
  propsTable(pg, [['onChoose', 'function', '', "选中后拿到 'bulb' | 'heart' | 'book' | 'flower'"]]);
};
P.shared = function (pg) {
  head(pg, 'SharedEntry', '大家晒的', '评论区顶部的入口，把晒图集中在一起。最多显示 5 张，多出来的数量显示在最后一张上。');
  var s = section(pg, '数量');
  ex(s, { layout: 'col', items: [['5 张以上', function (b) { RDS.ui.SharedEntry(b, { count: 86, photos: ['i22', 'i8', 'i23', 'i10', 'i24'] }); }, 1], ['不到 5 张', function (b) { RDS.ui.SharedEntry(b, { count: 3, photos: ['i22', 'i8', 'i23'] }); }, 1]],
    code: "RDS.ui.SharedEntry(box, {\n  count: 86,\n  photos: ['i22','i8','i23','i10','i24'],\n  onOpen: () => {}\n});" });
  propsTable(pg, [['count', 'number', '0', '晒图总数'], ['photos', 'string[]', '[]', '显示的图，最多 5 张'], ['onOpen', 'function', '', '点「查看」']]);
};
P.sheet = function (pg) {
  head(pg, 'SheetHeader', '弹层标题', '点开「大家晒的」后，弹层顶部的标题、关闭和筛选。由 FilterChips 组成。');
  var s = section(pg, '默认', '筛选可以点。');
  ex(s, { items: [['', function (b) { RDS.ui.SheetHeader(b, { count: 86 }); }, 1]], code: "RDS.ui.SheetHeader(box, {\n  count: 86,\n  onChange: v => {},\n  onClose: () => {}\n});" });
  propsTable(pg, [['title', 'string', '大家晒的 N', '标题'], ['count', 'number', '0', '标题里的数量'], ['filters', 'string[]', '全部 / 晒了成品 / 踩过的坑 / 改了做法', '筛选项'], ['value', 'string', '第一项', '默认选中'], ['onChange', 'function', '', '切换筛选'], ['onClose', 'function', '', '关闭']]);
};
P.end = function (pg) {
  head(pg, 'EndOfList', '列表底部', '翻到底时，先给一个搜索建议，再说「到底了」。');
  var s = section(pg, '类型');
  ex(s, { layout: 'col', items: [['有搜索建议', function (b) { RDS.ui.EndOfList(b, { query: '卤肉饭焖多久' }); }, 1], ['只有到底了', function (b) { RDS.ui.EndOfList(b, {}); }, 1]], code: "RDS.ui.EndOfList(box, {\n  query: '卤肉饭焖多久',\n  onSearch: q => {}\n});" });
  propsTable(pg, [['query', 'string', '', '搜索建议；不传就只有「到底了」'], ['onSearch', 'function', '', '点搜索建议']]);
};
P.card = function (pg) {
  head(pg, 'NoteCard', '笔记卡', '搜索结果双列信息流里的一张笔记。有人晒过时，图片下面显示「N 人晒过」和他们的头像。');
  var s = section(pg, '类型');
  ex(s, { items: [['有人晒过', function (b) { RDS.ui.NoteCard(b, { image: 'i0', title: '台式卤肉饭', shared: 86, sharedAvatars: ['i12', 'i1', 'i11'], author: '瓜总食记', avatar: 'i1', date: '10-11', likes: '3.7万' }); }], ['没人晒过 · 方图 · 两行标题', function (b) { RDS.ui.NoteCard(b, { image: 'i4', ratio: 1, title: '超级下饭的台式卤肉饭！！一锅出，汤汁拌饭绝了', author: '吖嗯的食光机', avatar: 'i5', date: '09-19', likes: 1347 }); }]],
    code: "RDS.ui.NoteCard(box, {\n  image: 'i0', title: '台式卤肉饭',\n  shared: 86, sharedAvatars: ['i12','i1','i11'],\n  author: '瓜总食记', avatar: 'i1',\n  date: '10-11', likes: '3.7万'\n});" });
  propsTable(pg, [['image', 'string', '', '封面'], ['ratio', 'number', '1.282', '图片高 ÷ 宽'], ['title', 'string', '', '标题，最多两行'], ['shared', 'number', '0', '晒过的人数，0 不显示'], ['sharedAvatars', 'string[]', '[]', '晒过的人的头像'], ['author / avatar / date', 'string', '', '作者信息'], ['likes', 'number | string', '0', '赞数']]);
};
P.noti = function (pg) {
  head(pg, 'NotificationItem', '通知条目', '「收到的赞和收藏」里的一条：谁、做了什么、回应的是哪句话，右边是那条笔记的封面。');
  var s = section(pg, '类型');
  ex(s, { layout: 'col', items: [['带原话和反应', function (b) { RDS.ui.NotificationItem(b, { avatar: 'i1', name: '小鹿', action: '照着你晒的做成了', time: '刚刚', quote: '照着做好了，油留着炒肉真的香', chip: '🙌 击掌', thumb: 'i23' }); }, 1], ['带原话', function (b) { RDS.ui.NotificationItem(b, { avatar: 'i16', name: '喝不完一瓶可乐 等 6 人', action: '觉得你晒的有用', time: '今天', quote: '照着做好了，油留着炒肉真的香', thumb: 'i23' }); }, 1], ['只有动作', function (b) { RDS.ui.NotificationItem(b, { avatar: 'i17', name: '晴天宝贝 等 6 人', action: '赞了你的评论', time: '10-21', thumb: 'i23' }); }, 1]],
    code: "RDS.ui.NotificationItem(box, {\n  avatar: 'i1', name: '小鹿',\n  action: '照着你晒的做成了', time: '刚刚',\n  quote: '照着做好了，油留着炒肉真的香',\n  chip: '🙌 击掌', thumb: 'i23'\n});" });
  propsTable(pg, [['avatar / name', 'string', '', '谁'], ['action / time', 'string', '', '做了什么、什么时候'], ['quote', 'string', '', '被回应的那句话'], ['chip', 'string', '', '对方的反应'], ['thumb', 'string', '', '笔记封面']]);
};

P.motion = function (pg) {
  pg.append(el('h1', '', '交互动效'));
  pg.append(el('p', 'lead', '点赞和长按选反应已经在组件里（见「点赞」）。下面这些调用原型里的原函数，时长、曲线和先后顺序与原型一致。'));
  function stage(h) { var f = el('div', 'frame'); f.style.cssText += ';width:390px;height:' + h + 'px'; return f; }
  var s = section(pg, '反应飘起', '反应从发出的位置弹起、上升、淡出，后面跟着两个更小的。');
  ex(s, { layout: 'col', build: function (pv) { var f = stage(200), a = el('div', 'acts'); RDS.reactions.forEach(function (r) { var b = el('button', 'btn', r.label); b.onclick = function () { RDS.motion.float(f, r.id, 130, 110, 40); }; a.append(b); }); pv.append(a, f); }, code: "RDS.motion.float(box, 'bulb', x, y, 40);" });
  s = section(pg, '通知横幅', '有人回答了你蹲的问题、或照着你做了：顶部落下白色横幅。');
  ex(s, { layout: 'col', build: function (pv) { var f = stage(120), b = el('button', 'btn', '弹出通知'); f.style.background = '#F5F5F5'; b.onclick = function () { f.querySelectorAll('.banner').forEach(function (x) { x.remove(); }); RDS.motion.notify(f, {}); }; pv.append(b, f); },
    code: "RDS.motion.notify(box, {\n  name: '小鹿', action: '回答了你蹲的问题',\n  body: '冷水下锅焯一下'\n});" });
  s = section(pg, '加载', '切换筛选或检索回答时：浅灰小卡片 + 红色转圈。');
  ex(s, { layout: 'col', build: function (pv) { var f = stage(160), b = el('button', 'btn', '加载一次'); b.onclick = function () { RDS.motion.loading(f, 130, 53, 1400); }; pv.append(b, f); }, code: "RDS.motion.loading(box, x, y, 1400);" });
};

/* ---------- 目录与路由 ---------- */
var nav = $('#nav');
NAV.forEach(function (g) {
  nav.append(el('div', 'h', g[0]));
  g[1].forEach(function (it) { var a = el('a', '', it[1] + (it[2] ? '<small>' + it[2] + '</small>' : '')); a.href = '#/' + it[0]; a.dataset.id = it[0]; nav.append(a); });
});
function go() {
  var id = (location.hash.replace(/^#\/?/, '') || 'intro'); if (!P[id]) id = 'intro';
  var pg = $('#page'); pg.innerHTML = ''; P[id](pg);
  nav.querySelectorAll('a').forEach(function (a) { a.classList.toggle('on', a.dataset.id === id); });
  window.scrollTo(0, 0);
}
if (window.__H && window.__H !== location.hash) history.replaceState(null, '', window.__H);
window.addEventListener('hashchange', go); go();
})();
