export default function TxtViewer(props: { file: { id: string, name: string } }) {
    return (
        <div>
            <iframe src={`https://bfrsylkdtzqnomqfneod.supabase.co/storage/v1/object/public/files/${props.file.id}`} className="w-full h-screen"></iframe>
        </div>
    )
}