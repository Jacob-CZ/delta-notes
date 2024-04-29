import { NextRequest, NextResponse } from "next/server"
import { createVector } from "./utilty"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)
export async function POST(req: NextRequest) {
	const body = await req.json()
	const slides: any[] = body.slides
	const title = body.title
	const id = body.id
	console.log(slides)
	slides.forEach(async (slide) => {
		let line= slide.content as string
        line =line.replace("\n", "")
		if (!line || line.trim() === "") {
			return // Skip this iteration and move on to the next line
		}
		const vector = await createVector(line)
		const { data, error } = await supabase.from("documents").insert({
			content: slide.title || " " + ' ' +line,
			embedding: vector,
			title: slide.title || title,
			document_id: id,
		})
		if (error) {
			console.error("Error inserting document:", error.message)
			return NextResponse.json({ message: "error" }, { status: 500 })
		}
	})
	return NextResponse.json({ message: "success" }, { status: 200 })
}

export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams.get("text")
	if (!params) {
		return NextResponse.json(
			{ message: "No text provided" },
			{ status: 400 }
		)
	}
	const vector = await createVector(params!)
	console.log(vector)
	const { data: documents, error } = await supabase.rpc("hybrid_search", {
		query_text: params,
		query_embedding: vector, 
		match_count: 5
	})
	console.log(error)
	return NextResponse.json(
		{ message: "success", data: documents },
		{ status: 200 }
	)
}
