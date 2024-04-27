"use client"
import { useState } from "react"
import { Input } from "./ui/input"

export default function Search() {
	const [text, setText] = useState("")
    const [results, setResults] = useState([])
    const [blur, setBlur] = useState(true)
	const search = async () => {
		if (!text || text.length < 5) return
		const res = await fetch(`/api?text=${text}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
        const data = await res.json()
        console.log(data.data)
		setResults(data.data)
	}
    return (
        <div className="relative">
            <Input
                className="m-4 w-96"
                type="text"
                placeholder="Search"
                onChange={(e) => {
                    setText(e.target.value)
                    setTimeout(() => {
                        search()
                    }, 200)
                }}
                onBlur={() => setBlur(true)}
                onFocus={() => setBlur(false)}
            />
            {!blur && (
            <div className="absolute w-96 h-96 bg-black rounded-3xl border-4 top-full m-4 flex flex-col p-2">
                {results.map((result:any) => (
                    <div key={result.id} className="flex flex-col gap-2">
                        <h1 className="text-xl">{result.title}</h1>
                        <p>{result.content}</p>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}
