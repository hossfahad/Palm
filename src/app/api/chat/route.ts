import { PropublicaService } from "@/lib/services/propublica-service";
import { NextResponse } from "next/server";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = RequestSchema.parse(body);
    const lastMessage = messages[messages.length - 1];
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    // Check if the message contains an EIN
    const einMatch = lastMessage.content.match(/\b\d{9}\b/);
    let additionalContext = "";

    if (einMatch) {
      try {
        const nonprofitData = await PropublicaService.getOrganizationByEin(einMatch[0]);
        additionalContext = `
          Here's the information about the nonprofit:
          Name: ${nonprofitData.organization.name}
          EIN: ${nonprofitData.organization.ein}
          Location: ${nonprofitData.organization.city}, ${nonprofitData.organization.state}
          Latest Assets: $${nonprofitData.organization.asset_amount?.toLocaleString()}
          Latest Income: $${nonprofitData.organization.income_amount?.toLocaleString()}
          NTEE Code: ${nonprofitData.organization.ntee_code}
        `;
      } catch (error) {
        console.error("Error fetching nonprofit data:", error);
      }
    }

    // Search for nonprofits if the message contains a search query
    const searchMatch = lastMessage.content.toLowerCase().includes("search for");
    if (searchMatch) {
      try {
        const searchQuery = lastMessage.content.replace(/.*search for\s+/i, "").trim();
        const searchResults = await PropublicaService.searchOrganizations(searchQuery);
        if (searchResults.organizations?.length > 0) {
          additionalContext = `
            Here are some nonprofits matching your search:
            ${searchResults.organizations.slice(0, 3).map((org: any) => `
              - ${org.name} (EIN: ${org.ein})
              Location: ${org.city}, ${org.state}
            `).join("\n")}
          `;
        }
      } catch (error) {
        console.error("Error searching nonprofits:", error);
      }
    }

    const augmentedMessages = [
      ...messages,
      ...(additionalContext ? [{
        role: "assistant" as const,
        content: additionalContext,
      }] : []),
    ];

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: augmentedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from DeepSeek API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 