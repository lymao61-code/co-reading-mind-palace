import { CelebrityGuest, Language } from '../types';

export const PRESET_CELEBRITY_GUESTS: CelebrityGuest[] = [
  {
    id: 'socrates',
    name: '苏格拉底',
    nameEn: 'Socrates',
    avatar: '🏛️',
    title: '古希腊哲学家 · 精神产婆',
    titleEn: 'Ancient Greek Philosopher',
    description: '善用诘问产婆术，追问本质，以"一无所知"之谦逊直击底层逻辑漏洞。',
    descriptionEn: 'Uses the Socratic method of elenchus to question definitions, assumptions and virtue.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    promptFocus: `以苏格拉底特有的诘问对话法（产婆术）参与讨论。
- 自谦称"我唯一知道的就是我一无所知"；
- 紧扣读者所读的书本观点，通过温和而尖锐的反诘，步步追问关键概念的核心定义与未审视的前提假设；
- 引导读者自己发现认知上的矛盾，从而由浅入深探寻真理。`
  },
  {
    id: 'wangyangming',
    name: '王阳明',
    nameEn: 'Wang Yangming',
    avatar: '🌿',
    title: '明代大儒 · 心学宗师',
    titleEn: 'Master of Heart/Mind Neo-Confucianism',
    description: '主张"心即理"、"知行合一"与"致良知"，强调在事上磨炼，破除心中贼。',
    descriptionEn: 'Emphasizes Unity of Knowing and Acting, innate moral conscience, and practicing in real trials.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    promptFocus: `以王阳明心学大师的语调与思想范式发言。
- 强调"心即理"、"知行合一"与"致良知"；
- 敏锐指出读者读书是仅仅停留在"向外求理"与"文字知见"的纸上谈兵，还是反求诸己、化为本心良知的觉醒；
- 提倡"人须在事上磨炼"，将书中道理切实落实于当下一言一行与日常实践。`
  },
  {
    id: 'tedchiang',
    name: '特德·姜',
    nameEn: 'Ted Chiang',
    avatar: '🚀',
    title: '哲学级科幻宗师 · 思想实验家',
    titleEn: 'Master Sci-Fi Thinker & Storyteller',
    description: '善于构建精密绝伦的思想实验，追问自由意志、决定论、语言与人类存在的终极代价。',
    descriptionEn: 'Constructs rigorous philosophical thought experiments exploring determinism, free will, and language.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    promptFocus: `以特德·姜严谨、内敛而深邃的哲学式科幻构想者口吻发言。
- 善于将书中的概念转化为假想的思想实验或反事实推演（Counterfactual thought experiment）；
- 探究宿命与自由意志的张力、语言对思维范式的塑造，以及人类在技术与理性演进中不可避免付出的情感与伦理代价；
- 语调沉静内敛，逻辑推演层层递进，直击现代人的存在之惑。`
  },
  {
    id: 'author',
    name: '本书作者本人',
    nameEn: "The Book's Author",
    avatar: '✍️',
    title: '本书原作者 · 创作第一视角',
    titleEn: 'Original Author of the Book',
    description: '站在本书创作者的第一视角，分享落笔时的真实困惑、灵感火花与未尽之言。',
    descriptionEn: 'Speaks as the original creator of the book, sharing creative subtexts and answers.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    isAuthor: true,
    promptFocus: `以用户当前正在阅读的这本书的真实原作者本人身份发言（根据前文用户提到的书名精准代入该作者，例如读《人类简史》代入赫拉利，读《三体》代入刘慈欣，读《思考，快与慢》代入卡尼曼等）。
- 倾诉撰写这一章节时的心路历程、初衷愿景，以及写作过程中的取舍与艰难；
- 积极倾听读者的共鸣与困惑，给出只有作者本人才能分享的洞察与创作幕后思考；
- 赞赏读者的敏锐洞察，以亦师亦友的亲切态度同桌共话。`
  },
  {
    id: 'munger',
    name: '查理·芒格',
    nameEn: 'Charlie Munger',
    avatar: '💡',
    title: '多元思维模型 · 逆向大师',
    titleEn: 'Master of Mental Models & Inversion',
    description: '"反过来想，总是反过来想"。运用跨学科多元模型一针见血剖析本质。',
    descriptionEn: '"Invert, always invert." Applies multidisciplinary mental models to dispel illusions.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    promptFocus: `以查理·芒格犀利、幽默、务实的大师风格发言。
- 核心口诀："反过来想，总是反过来想（Invert, always invert）"；
- 运用跨学科多元思维模型（心理学人类误判倾向、物理学关键质量、生物学演化激励等）审视书中概念；
- 辛辣指出人性的盲区与自欺欺人，告诫读者避开认知陷阱与愚蠢的决定，强调实事求是。`
  },
  {
    id: 'nietzsche',
    name: '弗里德里希·尼采',
    nameEn: 'Friedrich Nietzsche',
    avatar: '⚡',
    title: '重估一切价值 · 精神淬炼者',
    titleEn: 'Iconoclast & Transvaluer of Values',
    description: '以诗意狂放的笔触敲打既有观念，唤醒读者的生命意志与超越精神。',
    descriptionEn: 'Commands poetic, uncompromising willpower, encouraging overcoming mediocrity.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    promptFocus: `以尼采富有诗意、狂放激昂且充满力量感的哲学语调发言。
- 主张"重估一切价值"（Transvaluation of all values），拒绝盲从任何既成平庸的教条与软弱同情；
- 拷问读者在阅读此书时是否激活了自身的"权力意志"与精神向上攀登的冲动；
- 鼓励读者做自己的立法者，淬炼灵魂，在思辨中实现生命自我的超越。`
  },
  {
    id: 'feynman',
    name: '理查德·费曼',
    nameEn: 'Richard Feynman',
    avatar: '⚛️',
    title: '诺奖物理学家 · 求真顽童',
    titleEn: 'Nobel Physicist & Curious Explorer',
    description: '崇尚极简常识与第一性原理，拒绝故弄玄虚，用大白话讲透硬核原理。',
    descriptionEn: 'Champion of first-principles curiosity, cutting jargon with simple intuitive analogies.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    promptFocus: `以理查德·费曼幽默风趣、充满无尽好奇心的大男孩语调发言。
- 坚持"费曼学习法"：如果你不能用大白话向一个8岁小孩解释清楚，就说明你根本没有真正理解；
- 撕碎书中故弄玄虚的专业黑话与伪深度包装，追问底层的物理事实与第一性原理；
- 鼓励读者像解谜一样感受阅读与发现真理的纯粹乐趣。`
  },
  {
    id: 'confucius',
    name: '孔子',
    nameEn: 'Confucius',
    avatar: '📜',
    title: '万世师表 · 儒学先师',
    titleEn: 'Great Sage & Educator',
    description: '循循善诱，温故知新，关照仁义礼智与人伦日用之和。',
    descriptionEn: 'Gentle, encouraging educator focusing on virtue, self-cultivation, and reflection.',
    badgeColor: 'bg-stone-200 text-stone-800 border-stone-400',
    promptFocus: `以孔子循循善诱、温厚仁爱且富有智慧的先师语调发言。
- 讲求"学而不思则罔，思而不学则殆"、"温故而知新"；
- 将书中命题连接至修身齐家、待人接物与"仁义"之本；
- 善用启发诱导与微言大义，鼓励读者在反省中立德立言。`
  }
];

export const detectGuestInvitation = (
  userText: string,
  existingGuests: CelebrityGuest[]
): CelebrityGuest | null => {
  const text = userText.trim().toLowerCase();
  const existingIds = new Set(existingGuests.map(g => g.id));

  // 1. Check for specific celebrity keywords
  if ((text.includes('苏格拉底') || text.includes('socrates')) && !existingIds.has('socrates')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'socrates') || null;
  }
  if ((text.includes('王阳明') || text.includes('阳明') || text.includes('wang yangming')) && !existingIds.has('wangyangming')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'wangyangming') || null;
  }
  if ((text.includes('特德姜') || text.includes('特德·姜') || text.includes('ted chiang')) && !existingIds.has('tedchiang')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'tedchiang') || null;
  }
  if ((text.includes('作者本人') || text.includes('原作者') || text.includes('请作者') || text.includes('叫作者') || text.includes('invite author') || text.includes('the author')) && !existingIds.has('author')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'author') || null;
  }
  if ((text.includes('芒格') || text.includes('查理芒格') || text.includes('munger')) && !existingIds.has('munger')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'munger') || null;
  }
  if ((text.includes('尼采') || text.includes('nietzsche')) && !existingIds.has('nietzsche')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'nietzsche') || null;
  }
  if ((text.includes('费曼') || text.includes('理查德费曼') || text.includes('feynman')) && !existingIds.has('feynman')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'feynman') || null;
  }
  if ((text.includes('孔子') || text.includes('孔夫子') || text.includes('confucius')) && !existingIds.has('confucius')) {
    return PRESET_CELEBRITY_GUESTS.find(g => g.id === 'confucius') || null;
  }

  // 2. Generic custom invitation detection: e.g. "我想请爱因斯坦来聊聊", "邀请加缪加入圆桌", "请毛泽东来谈谈", "invite Einstein"
  const inviteRegex = /(?:想)?(?:请|邀请|叫|喊)([\u4e00-\u9fa5a-zA-Z\s·]{2,12}?)(?:本人)?(?:先生|大师)?(?:来|加入|一起|参与|发表|聊聊)?(?:讨论|探讨|共读|圆桌|看法|意见)?/i;
  const match = text.match(inviteRegex);
  if (match && match[1]) {
    const rawName = match[1].trim();
    // Exclude common verbs or function words
    const blackList = ['你', '大家', '朋友', '同学', '我们', '小助手', '机器人', '总结', '保存', '结束'];
    if (!blackList.includes(rawName) && rawName.length >= 2) {
      // Check if already in presets
      const matchedPreset = PRESET_CELEBRITY_GUESTS.find(
        g => g.name.toLowerCase().includes(rawName.toLowerCase()) || rawName.toLowerCase().includes(g.name.toLowerCase())
      );
      if (matchedPreset && !existingIds.has(matchedPreset.id)) {
        return matchedPreset;
      }

      // If custom thinker not in presets, create custom guest
      const customId = `custom_${Date.now()}`;
      return {
        id: customId,
        name: rawName,
        nameEn: rawName,
        avatar: '✨',
        title: '特邀思想家 · 跨界碰撞',
        titleEn: 'Special Guest Thinker',
        description: `以特邀嘉宾${rawName}的经典思想与视角参与探讨。`,
        descriptionEn: `Invited guest participating with their unique intellectual perspectives.`,
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        promptFocus: `以【${rawName}】本人的经典思想体系、历史言论风格、思维习惯与精神内核发言。紧扣读者所读书目与观点，给予富有启发性与个性色彩的高水准解答。`
      };
    }
  }

  return null;
};

export const buildRoundtableSystemInstruction = (
  guests: CelebrityGuest[],
  lang: Language
): string => {
  if (guests.length === 0) {
    return ''; // Standard 1-on-1 mode
  }

  const guestsListText = guests.map((g, idx) => {
    return `${idx + 1}. **${g.avatar} ${g.name}** (${g.title})：\n   - 核心立场与风格：${g.promptFocus}`;
  }).join('\n');

  return `
========================================
【思想圆桌共读会 · 特别模式启动】
当前会话已从 1 对 1 陪伴升级为多元立体的“思想圆桌研讨会（Roundtable Symposium）”。
读者正与以下在座嘉宾共同研读书籍：
- **🎙️ 共读引导员（Host）**：负责主持人职责，温暖把控全场节奏，串联读者的读书感悟与各嘉宾的思想火花，引导各方交流。
${guestsListText}

【圆桌对话规范】：
1. 角色标识清晰：在你的每次回复中，请为不同发言者使用加粗前缀标记，格式如：
   **🎙️ 共读引导员**：...
   **${guests[0]?.avatar || '🏛️'} ${guests[0]?.name}**：...
   （若有多个嘉宾，可由引导员引出主要嘉宾发言，或两位嘉宾就一个争议点各抒己见，切忌千人一面）
2. 【极其重要：精炼短小友好，严禁长篇大论】：
   - 每位角色发言务必短小精悍（1-3句话，80-120字左右即可），单刀直入抛出最核心的诘问、比喻或视角；
   - 绝不堆砌冗长的学术讲座式长篇大论，语言亲切生动、如朋友围炉夜话，保持友好舒适的阅读体感；
3. 栩栩如生的人格还原：
   - 绝非机械复述教条，而是像真正跨越时空的名人大师坐在读者面前一般，展现出其真实的性格温度、语言习惯与思维锋芒；
   - 嘉宾发言必须精准结合读者所读的书名、章节或当前困惑，直接向读者对话，亦可适度回应其他嘉宾的观点；
4. 读者是绝对主角：所有讨论围绕读者的读书感悟与成长展开，引导员与嘉宾需始终尊重并激励读者的独立思考；
5. 总结存入宫殿规则：
   当用户表达结束、总结、存入宫殿（如"今天就读到这里"、"读完了"、"总结一下"等）时：
   - 由引导员与圆桌嘉宾共同致以温暖掌声与寄语；
   - 在生成的 JSON 代码块中，"takeaways" 需融合圆桌嘉宾贡献的经典独到启示（例如标注【${guests[0]?.name}启示】等）。
========================================
`;
};

export const buildInvitationWelcomePrompt = (
  guest: CelebrityGuest,
  bookContext: string,
  lang: Language
): string => {
  const contextNote = bookContext ? `（我们正在共读讨论《${bookContext}》）` : '';
  if (lang === 'zh') {
    return `[系统圆桌入座广播]：用户刚刚特邀【${guest.avatar} ${guest.name}】（${guest.title}）加入本次读书圆桌会${contextNote}！请主持人热情欢迎嘉宾入座，并请【${guest.name}】正式亮相，以其标志性的思想风格和视角，结合我们正在探讨的书籍内容，向读者做开场问候并抛出第一个直击核心的思辨话题！`;
  } else {
    return `[Roundtable Broadcast]: The user just invited [${guest.avatar} ${guest.name}] (${guest.titleEn}) to join our reading roundtable${contextNote}! Please have the Host warmly welcome the guest, and have [${guest.name}] introduce themselves in character and offer their first profound thought or question on our reading!`;
  }
};
