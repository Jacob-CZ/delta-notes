"use client"
import { useEffect, useState } from "react"

export default function DocxViewer(props: {
	file: { id: string; name: string }
}) {
	const [slides, setSlides] = useState<any[]>([])
	useEffect(() => {
		const handleFile = async () => {
			const data = await fetch(
				`https://bfrsylkdtzqnomqfneod.supabase.co/storage/v1/object/public/files/${props.file.id}`
			)
			const blob = await data.blob()
			const slides = await docxToJSON(blob)
			setSlides(slides)
		}
		handleFile()
	}, [props.file])
	return (
		<div>
			{slides.length > 0 && (
				<div>
					{slides.map((slide, index) => (
						<div key={index}>
							<p>
								{slide.content.split("\n").map((line:string, i:number) => (
									<span key={i}>
										{line}
										<br />
									</span>
								))}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

async function docxToJSON(blob: Blob): Promise<any> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = function (event: ProgressEvent<FileReader>) {
			const docxData = event.target?.result as ArrayBuffer
			const JSZip = require("jszip")
			const zip = new JSZip()
			zip.loadAsync(docxData).then(function (doc: any) {
				const slides: any[] = []
				let slidesProcessed = 0
				doc.folder("word").forEach(function (
					relativePath: string,
					file: any
				) {
					if (relativePath.includes("document")) {
						file.async("string").then(function (xml: string) {
							const parser = new DOMParser()
							const xmlDoc = parser.parseFromString(
								xml,
								"text/xml"
							)
							const titleElements =
								xmlDoc.getElementsByTagName("w:t")
							const contentElements =
								xmlDoc.getElementsByTagName("w:t")
							let title = ""
							let content = ""
							for (let i = 0; i < titleElements.length; i++) {
								title += titleElements[i].textContent + " "
							}
							for (let i = 0; i < contentElements.length; i++) {
                                if (contentElements[i].textContent !== "" && contentElements[i].textContent !== " " ) {
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
				}, 500)
			})
		}
		reader.readAsArrayBuffer(blob)
	})
}
