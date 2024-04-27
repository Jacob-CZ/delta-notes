"use client"
import JSZip from 'jszip';
import { useEffect, useRef, useState } from 'react';

export default function PptViewer(props: { file: { id: string, name: string } }) {
	const [slides, setSlides] = useState<any[]>([])
	useEffect(() => {
		const handleFile = async () => {
			const data = await fetch(`https://bfrsylkdtzqnomqfneod.supabase.co/storage/v1/object/public/files/${props.file.id}`)
			const blob = await data.blob()
			const slides = await pptxToJSON(blob)
			setSlides(slides)
		}
		handleFile()
	}, [props.file])

	return (
		<div className="w-full h-[80vh]">
			{slides.length > 0 && (
				<div className="w-full h-full">
					{slides.map((slide, index) => (
						<div key={index} className="w-full h-full flex flex-col justify-center items-center">
							<h1 className="text-3xl font-bold">{slide.title}</h1>
							<p className="text-lg">{slide.content}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
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