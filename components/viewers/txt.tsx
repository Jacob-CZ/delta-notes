export default function TxtViewer(props: { file: { id: string, name: string } }) {
    return (
        <div className="w-full">
            <iframe src={`https://bfrsylkdtzqnomqfneod.supabase.co/storage/v1/object/public/files/${props.file.id}`} className="w-full h-[80vh]"></iframe>
        </div>
    )
}