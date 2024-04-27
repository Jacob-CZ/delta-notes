"use client"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useState } from "react"
import { Input } from "./ui/input"
import { createClient } from "@/lib/supbase/client"
import path from "path"

export default function Insert(props: { className: string }) {
	const [insert, setInsert] = useState(false)
	const [name, setName] = useState("")
	const supabase = createClient()
	const create = async () => {
		const { data, error } = await supabase
			.from("folders")
			.insert({ name: name, path: window.location.pathname.slice(1) })
		if (error) {
			console.error("Error creating folder:", error.message)
			return
		}
		console.log("Folder created:", data)
		setInsert(false)
		window.location.reload()
	}
	return (
		<>
			<Button
				className={cn(
					props.className,
					"rounded-full hover:bg-green-400 "
				)}
				onClick={() => setInsert(true)}
			>
				+
			</Button>
			{insert && (
				<div className=" fixed w-screen h-screen backdrop-blur-md top-0 left-0 flex items-center justify-center">
					<div className="p-8 border-4 border-neutral-800 rounded-3xl flex flex-col gap-2">
						<Input
							placeholder="Name"
							type="text"
							className="mb-4"
							onChange={(e) => setName(e.target.value)}
						/>
						<Button onClick={create}>create</Button>
					</div>
				</div>
			)}
		</>
	)
}
