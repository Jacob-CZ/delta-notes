"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import JSZip from "jszip"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Page() {
	const [pptx, setPptx] = useState<Blob>()
	const [slides, setSlides] = useState<any[]>([])
	useEffect(() => {
		if (pptx) {
			pptxToJSON(pptx)
				.then((slides) => {
                    setTimeout(() => {
					    setSlides(slides)
                    }, 500);

				})
				.catch((error) => {
					console.error(error)
				})
		}
	}, [pptx])

	return (
		<div>
			<Link href="/1">
				<Button className="m-4">1.Rocnik</Button>
			</Link>
			<Link href="/2">
				<Button className="m-4">2.Rocnik</Button>
			</Link>
			<Link href="/3">
				<Button className="m-4">3.Rocnik</Button>
			</Link>
			<Link href="/4">
				<Button className="m-4">4.Rocnik</Button>
			</Link>
			<Input
                className="m-4 w-fit"
				type="file"
				accept=".pptx, application/vnd.openxmlformats-officedocument.presentationml.presentation"
				onChange={(e) => {
					if (e.target.files) setPptx(e.target.files[0])
				}}
			/>
            
            {slides &&
                slides.map((slide, index) => (
                    <div key={index} className=" w-1/2 border-4 rounded-3xl p-8 m-4 min-w-[600px]">
                        <h1 className="text-3xl mb-8">{slide.title}</h1>
                        <p className="text-left max-w-full overflow-clip">{slide.content}</p>
                    </div>
                ))
            }
		</div>
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
					resolve(slides)
				})
				.catch(function (error) {
					reject(error)
				})
		}

		reader.readAsArrayBuffer(blob)
	})
}
