import TestEmbed from "@/components/testEmbed"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
	const ButtonClassName = "w-full h-24 bg-transparent border-2 border-stone-600 text-stone-600 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
	const LinkClassName = "flex-grow"
	return (
		<div className="w-screen flex justify-between gap-6 p-4">
			<Link href="/1" className={LinkClassName}>
				<Button className={ButtonClassName + "bg"}>1.Rocnik</Button>
			</Link>
			<Link href="/2" className={LinkClassName}>
				<Button className={ButtonClassName}>2.Rocnik</Button>
			</Link>
			<Link href="/3" className={LinkClassName}>
				<Button className={ButtonClassName}>3.Rocnik</Button>
			</Link>
			<Link href="/4" className={LinkClassName}>
				<Button className={ButtonClassName}>4.Rocnik</Button>
			</Link>
			
		</div>
	)
}
