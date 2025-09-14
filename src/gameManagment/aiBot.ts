import dotenv from 'dotenv';
import OpenAI from 'openai';
import aiBotPersonalities from './aiBotPersonalities.json' with {type: "json"};
dotenv.config();

export type aiMsgFormat = OpenAI.Chat.Completions.ChatCompletionMessageParam;
export const chatContext = new Map<string, aiMsgFormat[]>();


const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.AI_API_KEY
});

export const chat = async (roomId: string, msg: string) => {
    
    let history: aiMsgFormat[] = [];
    if(chatContext.has(roomId)){
        history = chatContext.get(roomId) ?? [];
    }else{
        const randomNum = Math.floor(Math.random() * 8);
        history.push({role: "system", content: aiBotPersonalities[randomNum].personality})
    }

    history.push({role: "user", content: msg})
    const response =  await openai.chat.completions.create({
        messages: history,
        model: "deepseek-chat",
    }); 
    
    history.push(response.choices[0].message)
    chatContext.set(roomId, history);
    
    return response.choices[0].message.content;
    
}
