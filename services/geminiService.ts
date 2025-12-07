import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SystemSnapshot } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSystemHealth = async (snapshot: SystemSnapshot): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Construct a focused prompt with the data
    const prompt = `
      You are an expert Computer Systems Engineer AI. Analyze the following system telemetry snapshot and provide a concise health report.
      
      System Data:
      - CPU: ${snapshot.cpu.usage.toFixed(1)}% Usage @ ${snapshot.cpu.temperature.toFixed(1)}°C (${snapshot.cpu.frequency.toFixed(2)} GHz)
      - GPU: ${snapshot.gpu.name} - ${snapshot.gpu.usage.toFixed(1)}% Usage @ ${snapshot.gpu.temperature.toFixed(1)}°C. VRAM: ${(snapshot.gpu.memoryUsed / 1024).toFixed(1)}GB / ${(snapshot.gpu.memoryTotal / 1024).toFixed(1)}GB
      - Memory: ${snapshot.memory.used.toFixed(1)}GB / ${snapshot.memory.total}GB Used
      - Top Processes (by CPU): ${snapshot.processes.slice(0, 5).map(p => `${p.name} (${p.cpu.toFixed(1)}%)`).join(', ')}

      Please provide:
      1. A status summary (Healthy, Warning, Critical).
      2. Potential bottlenecks identified.
      3. Specific optimization tips based on the active processes and resource usage.
      
      Keep the tone technical, futuristic, and concise. Format with Markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are SysMon AI, a specialized hardware monitoring assistant.",
      }
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error: Unable to connect to AI subsystem. Please check your API key.";
  }
};

export const chatWithSystemAdvisor = async (history: {role: 'user' | 'model', text: string}[], currentContext: SystemSnapshot) => {
    try {
        const ai = getAiClient();
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: `You are SysMon AI. You have access to real-time system metrics. 
                Current System State:
                CPU: ${currentContext.cpu.usage.toFixed(0)}%, Temp: ${currentContext.cpu.temperature.toFixed(0)}C
                GPU: ${currentContext.gpu.usage.toFixed(0)}%, Temp: ${currentContext.gpu.temperature.toFixed(0)}C
                RAM: ${currentContext.memory.used.toFixed(1)}/${currentContext.memory.total} GB
                
                Answer the user's questions about their system performance, hardware, or specific processes. Be helpful and technical.`
            }
        });

        // Replay history
        // Note: In a real app we'd maintain the chat session object, but here we recreate for simplicity or append to history.
        // For this demo, we'll just send the last message with context injected in system instruction.
        
        const lastMsg = history[history.length - 1];
        const result = await chat.sendMessage({ message: lastMsg.text });
        return result.text;

    } catch (error) {
        console.error("Chat Error:", error);
        return "I'm having trouble analyzing your request right now.";
    }
}
