import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { opportunity, kbEntries } = await req.json();

    if (!opportunity) {
      return new Response(
        JSON.stringify({ error: "Missing opportunity data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const kbContext =
      kbEntries && kbEntries.length > 0
        ? kbEntries
            .map((e) => `[${e.cat}] ${e.title}:\n${e.content}`)
            .join("\n\n---\n\n")
        : "No knowledge base entries provided.";

    const prompt = `You are an expert grant screening analyst for the Institute for Development (IfD). Evaluate the following grant opportunity against the organisation's knowledge base and capabilities.

## Grant Opportunity
- Funder: ${opportunity.funder || "N/A"}
- Programme: ${opportunity.prog || "N/A"}
- Theme: ${opportunity.theme || "N/A"}
- Geographic Focus: ${opportunity.geo || "N/A"}
- Amount: ${opportunity.amount || "N/A"}
- Deadline: ${opportunity.deadline || "N/A"}
- Notes: ${opportunity.notes || "N/A"}
${opportunity.callText ? `\n## Call Document Text\n${opportunity.callText}` : ""}

## Organisation Knowledge Base
${kbContext}

## Instructions
Evaluate the opportunity and respond with ONLY a valid JSON object (no markdown, no code fences) with these fields:

{
  "overall_score": <number 1-10>,
  "geographic_score": <number 1-10>,
  "geographic_rationale": "<brief rationale>",
  "thematic_score": <number 1-10>,
  "thematic_rationale": "<brief rationale>",
  "capacity_score": <number 1-10>,
  "capacity_rationale": "<brief rationale>",
  "partnership_score": <number 1-10>,
  "partnership_rationale": "<brief rationale>",
  "timeline_score": <number 1-10>,
  "timeline_rationale": "<brief rationale>",
  "summary": "<2-3 sentence overall assessment>",
  "eligibility": "<eligible / likely eligible / unclear / likely ineligible / ineligible>",
  "recommended_approach": "<brief recommended approach if pursuing>",
  "risks": "<key risks to flag>"
}

Score meaning: 1 = very poor fit, 10 = excellent fit. Be realistic and evidence-based.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("AI response was not valid JSON");
      }
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Screen function error:", err);
    return new Response(
      JSON.stringify({
        error: err.message,
        stack: err.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config = {
  path: "/api/screen",
};
