import Link from "next/link";
import { Button } from "./ui/button";
import Search from "./search";
import Logout from "./logout";

export default function Nav() {
    return(
        <div className="fixed top-0 left-0 w-screen backdrop-blur-xl h-16 flex items-center justify-between border-b-2">
            <Link href="/"><Button className="m-4">Home</Button></Link>
            <Search/>
            <Logout/>
        </div>
    )
}