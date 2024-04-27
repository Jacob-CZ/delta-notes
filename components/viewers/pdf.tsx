export default function PdfViewer(props: { file: { id: string, name: string } }) {
    return (
        <div className="w-full h-[80vh]">
            <iframe src={`https://bfrsylkdtzqnomqfneod.supabase.co/storage/v1/object/public/files/${props.file.id}`} className="w-full h-full"></iframe>
        </div>
    )
}