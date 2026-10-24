const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GoogleGenAI_API_KEY
});

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { type: Type.NUMBER, description: "Match score between 0 and 100" },
        technicalQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    severity: { type: Type.STRING, description: "Must be low, medium, or high" }
                },
                required: ["skill", "severity"]
            }
        },
        preprationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER },
                    focus: { type: Type.STRING },
                    tasks: { 
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preprationPlan"]
};

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
    const prompt = `You are an expert technical interviewer. Analyze the candidate details and generate an interview report.

Resume: ${resume}
Job Description: ${jobDescription}
Self Description: ${selfDescription}`;

    const maxRetries = 3;
    let delay = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 Generating AI Interview Report (Attempt ${attempt}/${maxRetries})...`);

            const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema
                }
            });

            const parsedData = JSON.parse(response.text);

            // ✅ Double-safety normalization for enums (forces low/medium/high lowercase)
            if (parsedData.skillGaps && Array.isArray(parsedData.skillGaps)) {
                parsedData.skillGaps = parsedData.skillGaps.map(gap => ({
                    ...gap,
                    severity: gap.severity ? gap.severity.toLowerCase() : 'medium'
                }));
            }

            console.log("✅ Report Generated & Sanitized Successfully!");
            return parsedData;

        } catch (error) {
            if (error.status === 503 && attempt < maxRetries) {
                console.warn(`⚠️ High demand (503). Retrying in ${delay / 1000}s...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
            } else {
                console.error("❌ ERROR INSIDE generateInterviewReport:", error);
                throw error;
            }
        }
    }
}

module.exports = generateInterviewReport;