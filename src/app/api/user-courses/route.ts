import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { Courses } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { and, eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. GET:
export async function GET() {
    try {
        const user = await currentUser();
        if (!user)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        const userEmail = user?.primaryEmailAddress?.emailAddress as string;

        const result = await db
            .select()
            .from(Courses)
            .where(eq(Courses.userId, userEmail))
            .orderBy(desc(Courses.id));

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("GET /api/user-courses error:", error);
        const message =
            error?.message || "Failed to fetch courses";
        if (message.includes("DATABASE_URL") || message.includes("connect")) {
            return NextResponse.json(
                { error: "Database not configured — set DATABASE_URL in Settings → Environment" },
                { status: 500 }
            );
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// 2. POST:
export async function POST(req: Request) {
    try {
        const { prompt, type, regen } = await req.json();
        const user = await currentUser();
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!user)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        const userEmail = user?.primaryEmailAddress?.emailAddress as string;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing GOOGLE_API_KEY — add it in Settings → Environment" },
                { status: 500 }
            );
        }

        // Duplicate Check (skip if regen requested)
        // Match on prompt + userId + type so Quick and Deep produce separate entries
        if (!regen) {
            const existingCourse = await db
                .select()
                .from(Courses)
                .where(
                    and(
                        eq(Courses.prompt, prompt),
                        eq(Courses.userId, userEmail),
                        eq(Courses.type, type || "quick")
                    )
                );

            if (existingCourse.length > 0) {
                return NextResponse.json(existingCourse[0]);
            }
        }

        // AI Call — Google Gemini (100% free)
        const slideCount = type === "long" ? 12 : 5;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash",
            systemInstruction: `You are an expert course content generator and educator. Your job is to create detailed, educational slide content.

You MUST respond with ONLY valid JSON. No markdown, no code fences, no extra text.

The JSON must follow this exact structure:
{"slides": [{"title": "string", "content": {"text": "string", "bulletPoints": ["string"]}}]}

CRITICAL RULES:
- Generate EXACTLY the number of slides requested — do NOT generate fewer
- The "text" field MUST be 3-4 detailed sentences explaining the concept thoroughly
- The "bulletPoints" array MUST contain exactly 5 key points, each being a full sentence (15-25 words each)
- Every slide must teach something new and build on the previous one
- Use real examples, analogies, and practical applications
- Write in a clear, engaging, educational tone
- Make content suitable for someone trying to deeply understand the topic
- Never output anything except the raw JSON object`,
        });

        const result = await model.generateContent(
            `Create exactly ${slideCount} detailed educational slides about: ${prompt}

IMPORTANT: You MUST generate EXACTLY ${slideCount} slides — not fewer, not more.

For ${type === "long" ? "Deep mode (12 slides)" : "Quick mode (5 slides)"}:
${type === "long"
    ? "- Cover the topic comprehensively with 12 distinct subtopics"
    : "- Cover the topic concisely with 5 key subtopics"
}

Each slide MUST have:
1. A descriptive title
2. A detailed text explanation (3-4 sentences)
3. 5 bullet points (15-25 words each)

Make the content rich, educational, and easy to understand. Output ONLY valid JSON, no markdown.`
        );

        const responseText = result.response.text();

        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = responseText;
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", responseText.slice(0, 500));
            return NextResponse.json(
                { error: "AI returned invalid JSON. Try again." },
                { status: 502 }
            );
        }

        // Normalize slides to ensure consistent structure regardless of Gemini's output format
        const rawSlides = parsedData.slides || parsedData;
        const normalizedSlides = (Array.isArray(rawSlides) ? rawSlides : []).map((slide: any) => {
            let text = "";
            let bulletPoints: string[] = [];

            // Handle nested content object: { content: { text: "...", bulletPoints: [...] } }
            if (slide.content && typeof slide.content === "object" && !Array.isArray(slide.content)) {
                text = slide.content.text || slide.content.description || "";
                bulletPoints = Array.isArray(slide.content.bulletPoints) ? slide.content.bulletPoints
                    : Array.isArray(slide.content.points) ? slide.content.points
                    : Array.isArray(slide.content.bullets) ? slide.content.bullets
                    : [];
            }
            // Handle flat string content: { content: "..." }
            else if (typeof slide.content === "string") {
                text = slide.content;
            }

            // Fallback: text/bullets directly on the slide object
            if (!text) {
                text = slide.text || slide.description || slide.body || "";
            }
            if (bulletPoints.length === 0) {
                bulletPoints = Array.isArray(slide.bulletPoints) ? slide.bulletPoints
                    : Array.isArray(slide.points) ? slide.points
                    : Array.isArray(slide.bullets) ? slide.bullets
                    : [];
            }

            return {
                title: slide.title || slide.heading || "Untitled",
                content: {
                    text: text,
                    bulletPoints: bulletPoints,
                },
            };
        });

        const insertResult = await db
            .insert(Courses)
            .values({
                courseId: uuidv4(),
                userId: userEmail,
                prompt: prompt,
                type: type || "quick",
                content: normalizedSlides,
            })
            .returning();

        return NextResponse.json(insertResult[0]);
    } catch (error: any) {
        console.error("POST /api/user-courses error:", error);
        const message = error?.message || "Failed to generate course";
        if (message.includes("DATABASE_URL") || message.includes("connect")) {
            return NextResponse.json(
                { error: "Database not configured — set DATABASE_URL in Settings → Environment" },
                { status: 500 }
            );
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// 3. DELETE:
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const user = await currentUser();

        if (!user || !courseId) {
            return NextResponse.json(
                { error: "Unauthorized or Missing ID" },
                { status: 400 }
            );
        }

        const result = await db
            .delete(Courses)
            .where(
                and(
                    eq(Courses.courseId, courseId),
                    eq(
                        Courses.userId,
                        user?.primaryEmailAddress?.emailAddress as string
                    )
                )
            )
            .returning();

        return NextResponse.json({ success: true, deleted: result });
    } catch (error: any) {
        console.error("DELETE /api/user-courses error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
