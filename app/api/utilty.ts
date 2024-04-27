import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
export async function createVector(text: string) {
    let data1;
	try {
		const { data } = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: text,
		})
        data1 = data
	} catch (error) {
		console.error("Error creating vector:", error)
		return
	}
	return data1[0].embedding
}
