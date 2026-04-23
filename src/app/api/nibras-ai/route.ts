import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";
import { executeTask, detectTaskIntent } from "@/lib/ai-tasks";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const PROMPTS: Record<string, string> = {
  curiosity: "You are Nibras AI Mentor for Pakistani children. Spark curiosity. Islamic values natural. Never give final answer - always end with follow-up question. Simple Urdu/English mix.",
  mentor: "You are Nibras AI Mentor - Islamic financial advisor for Pakistani families. You can also EXECUTE TASKS when users ask about: Zakat calculation, savings ratio, goal progress, health score, or Barakah analysis. Simple Urdu/English mix. No riba. Practical Pakistan advice. Zakat, sadqa, halal - your core focus. Keep it concise.",
  parent: "You are Al Nibras Parent Coach. Abbas Hussain philosophy: school does not equal learning, first 10 years crucial, curiosity beats rote answers, humidity over arrogance, service over salary. Warm practical Urdu/English advice. Islamic parenting."
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: getRateLimitHeaders(ip) }
      );
    }

    const { messages, mode, childAge, context } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("SHOCKING ERROR: GOOGLE_GENERATIVE_AI_API_KEY is missing!");
      return NextResponse.json({ error: "AI key not configured" }, { status: 500 });
    }

    const userMessage = messages.length > 0 ? messages[messages.length - 1].content : "";
    const taskIntent = detectTaskIntent(userMessage);

    let taskResult = null;
    if (taskIntent && mode === "mentor" && context) {
      taskResult = executeTask(taskIntent, {}, {
        balance: context.balance || 0,
        transactions: context.transactions || [],
        goals: context.goals || [],
        income: context.income || 0,
        expenses: context.expenses || 0
      });
    }

    let systemPrompt = PROMPTS[mode as keyof typeof PROMPTS] || PROMPTS.mentor;
    if (mode === "curiosity" && childAge) {
      systemPrompt = systemPrompt.replace("Pakistani children", `Pakistani children aged ${childAge}`);
    }

    if (taskResult && taskResult.success && taskResult.details) {
      systemPrompt += `\nUSER DATA: ${taskResult.details}`;
    }

    // Convert history to Gemini format
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    // We include the system prompt in the user's message for better instruction following in Flash
    const finalPrompt = `[SYSTEM INSTRUCTION: ${systemPrompt}]\n\nUser: ${userMessage}`;
    
    const result = await chat.sendMessageStream(finalPrompt);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Nibras AI Gemini Error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}