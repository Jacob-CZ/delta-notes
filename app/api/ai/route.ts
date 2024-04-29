import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createVector } from "../utilty";
import { createClient } from "@supabase/supabase-js";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!)
export async function GET(req:NextRequest){
    console.log(req.nextUrl.searchParams.get("text"))
    const text = req.nextUrl.searchParams.get("text")
    if(!text){
        return NextResponse.json({message:"No text provided"},{status:400})
    }
    const vector = await createVector(text)
    const docs = await supabase.rpc("hybrid_search",{
        query_text:text,
        query_embedding:vector,
        match_count:5
    })
    console.log(vector)
    console.log(docs.data)
    console.log(docs.error)
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a school docs assitant only answering questions related to school docs. use the docs provided next and your knowledge to answer. -------- \n ",
            },
            {
                role: "user",
                content: text,
            },
        ],
        max_tokens: 150,
    });
    console.log(response.choices[0].message)
    return NextResponse.json([{content: response.choices[0].message.content, id:Math.random() * 10000}],{status:200})
}