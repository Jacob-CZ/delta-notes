"use client"
import { createClient } from "@/lib/supbase/client"
import { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { setRequestMeta } from "next/dist/server/request-meta"

export default function InsertFile(props: { className: string }) {
    const [insert, setInsert] = useState(false)
    const [name, setName] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")
    const supabase = createClient()
    const create = async () => {
        if (!file) {
            console.error("No file selected")
            setError("No file selected")
            return
        }
        const { data, error } = await supabase
            .from("files")
            .insert({ name: file?.name, path: window.location.pathname.slice(1), type: file?.type})
            .select()
        if (error) {
            console.error("Error creating file:", error.message)
            setError(error.message)
            return
        }
        if (!data){
            console.error("No data")
            setError("No data")
            return
        }
        const { data: data1, error: error1 } = await supabase.storage.from("files").upload(data[0].id, file)
        console.log("File created:", data)
        if (error1) {
            console.error("Error uploading file:", error1.message)
            setError(error1.message)
            return
        }
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
                            placeholder="File"
                            type="file"
                            className="mb-4"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <Button onClick={create}>upload</Button>
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </>
    )
}   