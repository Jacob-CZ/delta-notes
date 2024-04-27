"use client"
import { createClient } from "@/lib/supbase/client"
import { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { setRequestMeta } from "next/dist/server/request-meta"
import JSZip from "jszip"

export default function InsertFile(props: { className: string }) {
    const [insert, setInsert] = useState(false)
    const [name, setName] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")
    const supabase = createClient()
    const create = async () => {
        // if (!file) {
        //     console.error("No file selected")
        //     setError("No file selected")
        //     return
        // }
        // const { data, error } = await supabase
        //     .from("files")
        //     .insert({ name: file?.name, path: window.location.pathname.slice(1), type: file?.type})
        //     .select()
        // if (error) {
        //     console.error("Error creating file:", error.message)
        //     setError(error.message)
        //     return
        // }
        // if (!data){
        //     console.error("No data")
        //     setError("No data")
        //     return
        // }
        // const { data: data1, error: error1 } = await supabase.storage.from("files").upload(data[0].id, file)
        // console.log("File created:", data)
        // if (error1) {
        //     console.error("Error uploading file:", error1.message)
        //     setError(error1.message)
        //     return
        // }
        // setInsert(false)
        
        // window.location.reload()
    }
    const vecotrize = async () => {
        if (!file) {
            console.error("No file selected")
            setError("No file selected")
            return
        }
        const slides = await pptxToJSON(file)
        console.log(slides)
        const res = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({slides, title: name, id: "76160b55-78b5-43ad-ab51-86ab37b47671"}),
            headers: {
                "Content-Type": "application/json"
            }
        })
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
                        <p className="w-full text-center">accepts .pdf, .pptx, .docx, .md, .txt</p>
                        <Input
                            placeholder="File"
                            type="file"
                            className="mb-4"
                            accept=".pdf, .pptx, .docx, .md, .txt"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <Button onClick={vecotrize}>upload</Button>
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </>
    )
}   
async function pptxToJSON(blob: Blob): Promise<any> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = function (event: ProgressEvent<FileReader>) {
			const pptxData = event.target?.result as ArrayBuffer
			JSZip.loadAsync(pptxData)
				.then(function (zip) {
					const slides: any[] = []
					let slidesProcessed = 0
					zip.folder("ppt/slides")?.forEach(function (
						relativePath,
						file
					) {
						if (relativePath.includes("slide")) {
							file.async("text").then(function (xml) {
								const parser = new DOMParser()
								const xmlDoc = parser.parseFromString(
									xml,
									"text/xml"
								)
								const titleElements =
									xmlDoc.getElementsByTagName("p:title")
								const contentElements =
									xmlDoc.getElementsByTagName("a:t")

								let title = ""
								let content = ""

								if (titleElements.length > 0) {
                                    for(let i = 0; i < titleElements.length; i++){
                                        title += titleElements[i].textContent + " "
                                    }
								}

								for (
									let i = 0;
									i < contentElements.length;
									i++
								) {
									if (i === 0 && title === "") {
										title += contentElements[i].textContent
									}else{
									content +=
										contentElements[i].textContent + "\n "
                                    }
								}
								if (title !== "" || content !== "") {
									slides.push({
										title: title.trim(),
										content: content.trim(),
									})
								}
							})
						}
					})
                    setTimeout(() => {
					    resolve(slides)
                    }, 500);
				})
				.catch(function (error) {
					reject(error)
				})
		}

		reader.readAsArrayBuffer(blob)
	})
}
