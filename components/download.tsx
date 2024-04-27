"use client"
import { Button } from "./ui/button";
import { saveAs } from 'file-saver';

export default function Download(props: { file: { id: string, name: string } }) {
    const downloadFile = async () => {
        const response = await fetch(
            "https://bfrsylkdtzqnomqfneod.supabase.co/storage/v1/object/public/files/" +
            props.file.id
        );
        if (!response.ok) {
            throw new Error("Download failed");
        }
        const blob = await response.blob();
        saveAs(blob, props.file.name);
    };

    return (
        <Button onClick={downloadFile}>Download</Button>
    )
}