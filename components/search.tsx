"use client"
import { useState } from "react"
import { Input } from "./ui/input"
import Link from "next/link"
import AISwitch from "./ai_switch"
import { Content } from "next/font/google"

export default function Search() {
	const [text, setText] = useState("")
	const [results, setResults] = useState([])
	const [blur, setBblur] = useState(true)
	const [ai, setAi] = useState(true)
	const setBlur = (value: boolean) => {
		if (value) {
			setTimeout(() => {
				setBblur(value)
			}, 200)
		} else {
			setBblur(value)
		}
	}
	const search = async () => {
		if (text === "") {
			return
		}
		switch (ai) {
			case true:
				searchAI()
				break
			case false:
				searchNormal()
				break
		}
	}
	const searchAI = async () => {
		const res = await fetch(`/api/ai?text=${text}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const data = await res.json()
		console.log(data)
		setResults(data)
	}
	const searchNormal = async () => {
		const res = await fetch(`/api?text=${text}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const data = await res.json()
		setResults(data.data)
	}
	return (
		<div
			className="relative z-50 flex items-center gap-2 -mr-12"
			onBlur={() => setBlur(true)}
			onFocus={() => setBlur(false)}
		>
			<Input
				className="w-96"
				type="text"
				placeholder="Search"
				onChange={(e) => {
					setText(e.target.value)
					if (!ai) {
						setTimeout(() => {
							search()
						}, 200)
					}
				}}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						search()
					}
				}}
			/>
			<AISwitch
				onToggle={(value) => setAi(value)}
				className="self-center"
			/>

			<div className="absolute top-14 left-40"></div>
			{!blur && (
				<div className="absolute w-96 h-96 bg-black rounded-3xl border-4 top-full m-4 flex flex-col p-2 overflow-auto">
					{results.map((result: any) => (
						<a
							key={result.id}
							href={"/file?file=" + result.document_id || ""}
						>
							<div className="flex flex-col gap-2">
								<h1 className="text-xl">
									{result.title || ""}
								</h1>
								<p>{result.content}</p>
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	)
}
