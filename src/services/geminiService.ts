import { GoogleGenAI } from "@google/genai";
import { ChatMessage, MindPalaceNote, Language, CelebrityGuest } from "../types";
import { buildRoundtableSystemInstruction } from "./roundtableService";

const systemInstruction = `You are a thoughtful, perceptive, and encouraging reading companion.
Your goal is to help the user deeply reflect on what they read today and build their "Mind Palace".
1. If this is a new conversation, ask what book and chapter they read, and what made the biggest impression.
2. Ask thought-provoking questions about concepts, character motives, real-world connections, or personal resonance.
3. Keep the conversation natural, friendly, and supportive.
4. Concluding Remarks & Explicit Trigger Detection:
   Pay close attention if the user utters concluding remarks or requests to finish or save, for example:
   - "今天就读到这里", "读完了", "看完这章了", "差不多了", "总结一下", "总结吧", "存入宫殿", "存入记忆宫殿", "保存笔记", "结束阅读", "结束", "先这样", "收工", "打卡", "拜拜", "再见"
   - "that's all for today", "done for today", "finished reading", "summarize", "save to palace", "save notes", "let's wrap up", "wrap up", "goodbye", "bye", "conclude", "that is all"
   Whenever the user says ANY concluding phrase or asks to summarize, or when instructed to wrap up:
   You MUST:
   a) Give a warm, encouraging closing reflection celebrating their reading effort today.
   b) Output a JSON block formatted EXACTLY like this:
\`\`\`json
{
  "action": "saveToMindPalace",
  "bookTitle": "Name of the book",
  "chapter": "Chapter or section",
  "summary": "A comprehensive summary of the reading and our discussion",
  "takeaways": ["Key insight 1", "Key insight 2"]
}
\`\`\`
   c) Tell the user that the notes have been safely stored into their Mind Palace.`;

export const isConcludingPhrase = (text: string): boolean => {
  const trimmed = text.trim().toLowerCase();
  const patterns = [
    /今天就(读|学|看)?到这(里)?/,
    /读完(了)?/,
    /看完(了)?/,
    /差不多(了)?/,
    /总结(一下|吧|入宫殿|成笔记)?/,
    /存入(记忆)?宫殿/,
    /保存(到)?笔记/,
    /结束(共读|阅读|对话|交流)?/,
    /先这样(吧)?/,
    /收工(了)?/,
    /打卡(了)?/,
    /拜拜/,
    /再见/,
    /that'?s all( for today)?/i,
    /done for today/i,
    /finished reading/i,
    /summarize/i,
    /save to (mind )?palace/i,
    /save notes?/i,
    /wrap up/i,
    /conclude/i,
    /goodbye/i
  ];
  return patterns.some(p => p.test(trimmed));
};

export const generateChatResponse = async (
  messages: ChatMessage[], 
  customApiKey?: string,
  roundtableGuests?: CelebrityGuest[],
  lang: Language = 'zh'
) => {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  // Convert our ChatMessage format to Gemini's format
  const contents = messages.filter(m => !m.isSystem).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const activeSystemInstruction = (roundtableGuests && roundtableGuests.length > 0)
    ? `${systemInstruction}\n\n${buildRoundtableSystemInstruction(roundtableGuests, lang)}`
    : systemInstruction;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      systemInstruction: activeSystemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
};

export const generateSummaryForSession = async (
  messages: ChatMessage[],
  triggerType: 'user_action' | 'timeout_2h',
  lang: Language,
  customApiKey?: string,
  roundtableGuests?: CelebrityGuest[]
) => {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const activeSystemInstruction = (roundtableGuests && roundtableGuests.length > 0)
    ? `${systemInstruction}\n\n${buildRoundtableSystemInstruction(roundtableGuests, lang)}`
    : systemInstruction;

  const directive = triggerType === 'timeout_2h'
    ? (lang === 'zh'
        ? `[系统指令：检测到距离用户上次发言已超过2小时。请自动结束并总结本次共读会话。请以亲切温馨的话语开场，说明由于超过2小时未继续对话，已贴心地将本次阅读心得提炼并整理入记忆宫殿，接着给出本次讨论的精彩总结与启示（若有圆桌嘉宾参与，请融合嘉宾独特的思想贡献），并务必输出带有 action: "saveToMindPalace" 的 JSON 代码块。]`
        : `[System directive: Over 2 hours have passed since the user's last message. Please conclude and summarize this reading session. Start with a warm greeting stating that because 2+ hours passed, you have automatically curated their discussion into the Mind Palace, then summarize the insights (including roundtable guest contributions if present) and output the JSON block with action: "saveToMindPalace".]`)
    : (lang === 'zh'
        ? `[系统指令：用户点击了“总结入宫殿”快捷按钮。请为今天的共读画上一个温馨圆满的句号，对今天的阅读讨论进行深刻提炼，给出精彩总结与核心启示（若有圆桌嘉宾参与，请融合嘉宾独特的思想贡献），并务必输出带有 action: "saveToMindPalace" 的 JSON 代码块。]`
        : `[System directive: The user clicked the "Summarize to Palace" button. Please wrap up today's reading session with a warm reflection, summarize the key concepts discussed (including insights from invited guests), and output the JSON block with action: "saveToMindPalace".]`);

  const contents = [
    ...messages.filter(m => !m.isSystem).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: directive }]
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      systemInstruction: activeSystemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
};

export const extractMindPalaceData = (text: string) => {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonRegex);
  if (match) {
    try {
      const data = JSON.parse(match[1]);
      if (data.action === "saveToMindPalace") {
        // Remove the JSON block from the text
        const cleanText = text.replace(jsonRegex, '').trim();
        return { data, cleanText };
      }
    } catch (e) {
      console.error("Failed to parse JSON from AI response", e);
    }
  }
  return { data: null, cleanText: text };
};

export const translateNote = async (note: MindPalaceNote, targetLang: Language, customApiKey?: string) => {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Translate the following book reflection into ${targetLang === 'en' ? 'English' : 'Chinese'}. 
  Return the result as a JSON object with "summary" (string) and "takeaways" (array of strings) fields.
  
  Book: ${note.bookTitle}
  Chapter: ${note.chapter}
  Summary: ${note.summary}
  Takeaways: ${note.takeaways.join('\n- ')}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{}');
};

