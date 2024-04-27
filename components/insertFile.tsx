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
    const [errorMessage, setErrormessage] = useState("")
    const supabase = createClient()
    const create = async () => {
        if (!file) {
            console.error("No file selected")
            setErrormessage("No file selected")
            return
        }
        const extension = file.name.split('.').pop();
        const { data, error } = await supabase
            .from("files")
            .insert({ name: file?.name, path: window.location.pathname.slice(1), type: extension})
            .select()
        if (error) {
            console.error("Error creating file:", error.message)
            setErrormessage(error.message)
            return
        }
        if (!data){
            console.error("No data")
            setErrormessage("No data")
            return
        }
        const { data: data1, error: error1 } = await supabase.storage.from("files").upload(data[0].id, file)
        console.log("File created:", data)
        if (error1) {
            console.error("Error uploading file:", error1.message)
            setErrormessage(error1.message)
            return
        }
        await vecotrize(data[0].id)
        if (error) {
            console.error("Error inserting document:", error)
            setErrormessage(error)
            return
        }
        setInsert(false)
        
        window.location.reload()
    }
    const vecotrize = async (id:string) => {
        if (!file) {
            console.error("No file selected")
            setErrormessage("No file selected")
            return
        }
        if (!file.name) {
            console.error("No name")
            setErrormessage("No name")
            return
        }   
        if(!id){
            console.error("No id")
            setErrormessage("No id")
            return
        }
        const extension = file.name.split('.').pop();
        let slides = []
        if(extension === "pptx"){
            slides = await pptxToJSON(file)
        }
        if(extension === "pdf"){
            slides = await pdfToJSON(file)
        }
        if(extension === "docx"){
            slides = await docxToJSON(file)
        }
        if(extension === "md"){
            slides = await mdToJSON(file)
        }
        if(extension === "txt"){
            slides = await txtToJSON(file)
        }
        console.log(slides)
        const res = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({slides, title: file.name, id: id}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(await res.json())
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
                        <Button onClick={create}>upload</Button>
                        <p>{errorMessage}</p>
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

async function pdfToJSON(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function (event: ProgressEvent<FileReader>) {
            const pdfData = event.target?.result as ArrayBuffer
            const pdfjsLib = require("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`
            pdfjsLib.getDocument(new Uint8Array(pdfData)).promise.then(
                function (pdf:any) {
                    const slides: any[] = []
                    const numPages = pdf.numPages
                    let slidesProcessed = 0
                    for (let i = 1; i <= numPages; i++) {
                        pdf.getPage(i).then(function (page:any) {
                            page.getTextContent().then(function (content:any) {
                                const text = content.items
                                    .map((item:any) => item.str)
                                    .join(" ")
                                slides.push({
                                    title: "",
                                    content: text,
                                })
                                slidesProcessed++
                                if (slidesProcessed === numPages) {
                                    resolve(slides)
                                }
                            })
                        })
                    }
                }
            )
        }
        reader.readAsArrayBuffer(blob)
    })
}

async function docxToJSON(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function (event: ProgressEvent<FileReader>) {
            const docxData = event.target?.result as ArrayBuffer
            const JSZip = require("jszip")
            const zip = new JSZip()
            zip.loadAsync(docxData).then(function (doc :any) {
                const slides: any[] = []
                let slidesProcessed = 0
                doc.folder("word").forEach(function (relativePath : string , file :any) {
                    if (relativePath.includes("document")) {
                        file.async("string").then(function (xml : string) {
                            const parser = new DOMParser()
                            const xmlDoc = parser.parseFromString(xml, "text/xml")
                            const titleElements = xmlDoc.getElementsByTagName(
                                "w:t"
                            )
                            const contentElements = xmlDoc.getElementsByTagName(
                                "w:t"
                            )
                            let title = ""
                            let content = ""
                            for (let i = 0; i < titleElements.length; i++) {
                                title += titleElements[i].textContent + " "
                            }
                            for (let i = 0; i < contentElements.length; i++) {
                                content += contentElements[i].textContent + "\n "
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
                }
                , 500)
            })
        }
        reader.readAsArrayBuffer(blob)
    })
}


async function mdToJSON(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function (event: ProgressEvent<FileReader>) {
            const mdData = event.target?.result as ArrayBuffer
            const text = new TextDecoder("utf-8").decode(mdData)
            const slides = text.split("\n").map((line) => {
                return {
                    title: "",
                    content: line,
                }
            })
            resolve(slides)
        }
        reader.readAsArrayBuffer(blob)
    })
}

async function txtToJSON(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function (event: ProgressEvent<FileReader>) {
            const txtData = event.target?.result as ArrayBuffer
            const text = new TextDecoder("utf-8").decode(txtData)
            const slides = text.split("\n").map((line) => {
                return {
                    title: "",
                    content: line,
                }
            })
            resolve(slides)
        }
        reader.readAsArrayBuffer(blob)
    })
}