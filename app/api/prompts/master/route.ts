import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCurrentUserAccess } from "@/lib/user-access";
import { getOpenAIClient, isOpenAIConfigured } from "@/lib/openai";
import {
  buildMasterPromptFromIdea,
  MASTER_BUILDER_SYSTEM_PROMPT,
  type MasterDepth,
} from "@/lib/prompt-master-template";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { isAuthJsEnabled } from "@/auth";

export const runtime = "nodejs";

interface MasterPromptRequest {
  idea: string;
  category?: string;
  tone?: string;
  outputFormat?: string;
  depth?: MasterDepth;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
    }
    const access = await getCurrentUserAccess();
    if (!access.paid) {
      return NextResponse.json(
        { error: "An active membership is required." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as MasterPromptRequest;
    const idea = body.idea?.trim();
    if (!idea || idea.length < 10) {
      return NextResponse.json(
        { error: "Please describe your situation in at least a few words." },
        { status: 400 },
      );
    }

    const input = {
      idea,
      category: body.category,
      tone: body.tone,
      outputFormat: body.outputFormat,
      depth: body.depth ?? "balanced",
    };

    async function saveHistory(prompt: string, source: string) {
      if (!isDatabaseConfigured() || !isAuthJsEnabled) return;
      await prisma.promptBuilderHistory.create({
        data: {
          userId: session!.user.id,
          idea,
          prompt,
          source,
        },
      });
    }

    if (!isOpenAIConfigured()) {
      const prompt = buildMasterPromptFromIdea(input);
      await saveHistory(prompt, "template");
      return NextResponse.json({
        prompt,
        source: "template" as const,
      });
    }

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({
        prompt: buildMasterPromptFromIdea(input),
        source: "template" as const,
      });
    }

    const userMessage = `Rough idea:
${idea}

Life area: ${body.category ?? "general"}
Tone: ${body.tone ?? "warm and respectful"}
Output format: ${body.outputFormat ?? "clear sections with bullet points"}
Depth: ${body.depth ?? "balanced"}

Write the complete master prompt.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 900,
      messages: [
        { role: "system", content: MASTER_BUILDER_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const aiPrompt = completion.choices[0]?.message?.content?.trim();
    if (!aiPrompt) {
      const prompt = buildMasterPromptFromIdea(input);
      await saveHistory(prompt, "template");
      return NextResponse.json({
        prompt,
        source: "template" as const,
        message: "AI response was empty; using template instead.",
      });
    }

    await saveHistory(aiPrompt, "openai");
    return NextResponse.json({
      prompt: aiPrompt,
      source: "openai" as const,
    });
  } catch (err) {
    console.error("[master-prompt]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 },
    );
  }
}
