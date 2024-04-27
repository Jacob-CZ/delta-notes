import Download from "@/components/download"
import Insert from "@/components/insert"
import InsertFile from "@/components/insertFile"
import PptViewer from "@/components/viewers/ppt"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supbase/server"
import Link from "next/link"
import DocxViewer from "@/components/viewers/docx"
import PdfViewer from "@/components/viewers/pdf"
import MdViewer from "@/components/viewers/md"
import TxtViewer from "@/components/viewers/txt"

export default async function Page({
	params,
	searchParams,
}: {
	params: { route: string[] }
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
	const supabase = createClient()
	let folders: any[] | null = null
	let files: any[] | null = null
	let file: any = null
	if (!searchParams?.file) {
		const folders1 = await supabase
			.from("folders")
			.select("*")
			.eq("path", params.route.join("/"))
		const files1 = await supabase
			.from("files")
			.select("*")
			.eq("path", params.route.join("/"))
		folders = folders1.data
		files = files1.data
	} else {
		const file1 = await supabase
			.from("files")
			.select("*")
			.eq("id", searchParams.file)
			.single()
		file = file1.data
	}
	console.log(searchParams)
	return (
		<div className="relative -z-10">
			{folders && (
				<div className="relative ">
					<p className="w-full text-center mt-4 ">folders</p>
					<Insert className=" absolute right-0 -top-4 m-2" />
					<div className="grid grid-cols-4 gap-6 p-4 text-center">
						{folders &&
							folders.map((file: any) => {
								return (
									<Link
										href={`/${params.route.join("/")}/${
											file.name
										}`}
										key={file.id}
									>
										<Button className="w-full h-24 bg-transparent border-2 text-neutral-700 hover:bg-neutral-600 hover:text-neutral-200">
											{file.name}
										</Button>
									</Link>
								)
							})}
					</div>
				</div>
			)}
			{files && (
				<div className="relative ">
					<p className="w-full text-center mt-4 ">files</p>
					<InsertFile className=" absolute right-0 -top-4 m-2" />
					<div className="grid grid-cols-4 gap-6 p-4 text-center">
						{files &&
							files.map((file: any) => {
								return (
									<Link
										href={`/${params.route.join(
											"/"
										)}?file=${file.id}`}
										key={file.id}
									>
										<Button className="w-full h-24 bg-transparent border-2 text-neutral-700 hover:bg-neutral-600 hover:text-neutral-200">
											{file.name}
										</Button>
									</Link>
								)
							})}
					</div>
				</div>
			)}
			{file && (
				<div className="relative w-full flex items-center justify-center flex-col gap-4 p-2">
					
					<Download file={{...file}}/>
					{file.name.includes(".pptx") && <PptViewer file={file}/>}
					{file.name.includes(".pdf") && <PdfViewer file={file} />}
					{file.name.includes(".docx") && <DocxViewer file={file} />}
					{file.name.includes(".md") && <MdViewer file={file} />}
					{file.name.includes(".txt") && <TxtViewer file={file} />}
				</div>
			)}
		</div>
	)
}
