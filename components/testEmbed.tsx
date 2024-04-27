"use client"
import { Button } from "./ui/button";

export default function TestEmbed() {
    const send = async () => {
        const res = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({text: "Hello World"}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(await res.json())
    }   
    return (
        <Button onClick={send}>
            test
        </Button>
    )
}