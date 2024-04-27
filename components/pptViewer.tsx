"use client"
import { useEffect, useRef } from 'react';

export default function PptViewer(props: { className: string, document: string}) {
    const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		let instance, PSPDFKit: { unload?: any; load?: any; Action?: any; Annotation?: any; AnnotationsWillChangeReason?: any; Bookmark?: any; ButtonFormField?: any; CheckBoxFormField?: any; ChoiceFormField?: any; Color?: any; ComboBoxFormField?: any; Comment?: any; CommentMarkerAnnotation?: any; Conformance?: any; CustomOverlayItem?: any; DrawingPoint?: any; EllipseAnnotation?: any; Font?: any; FormField?: any; FormFieldValue?: any; FormOption?: any; GoToAction?: any; GoToEmbeddedAction?: any; GoToRemoteAction?: any; HideAction?: any; HighlightAnnotation?: any; ImageAnnotation?: any; InkAnnotation?: any; Inset?: any; Instance?: any; InstantClient?: any; Interfaces?: any; JavaScriptAction?: any; LaunchAction?: any; LineAnnotation?: any; LinkAnnotation?: any; List?: any; ListBoxFormField?: any; NamedAction?: any; NoteAnnotation?: any; OutlineElement?: any; PageInfo?: any; Point?: any; PolygonAnnotation?: any; PolylineAnnotation?: any; RadioButtonFormField?: any; Rect?: any; RectangleAnnotation?: any; RedactionAnnotation?: any; ResetFormAction?: any; SearchResult?: any; SearchState?: any; ShapeAnnotation?: any; SignatureFormField?: any; Size?: any; SquiggleAnnotation?: any; StampAnnotation?: any; StrikeOutAnnotation?: any; SubmitFormAction?: any; TextAnnotation?: any; TextFormField?: any; TextLine?: any; TextMarkupAnnotation?: any; TextSelection?: any; URIAction?: any; UnderlineAnnotation?: any; UnknownAnnotation?: any; ViewState?: any; WidgetAnnotation?: any; default?: any; };
		(async function () {
			PSPDFKit = await import('pspdfkit');
			PSPDFKit.unload(container);

			instance = await PSPDFKit.load({
				// Container where PSPDFKit should be mounted.
				container,
				// The document to open.
				document: props.document,
				// Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
				baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
			});
		})();

		return () => PSPDFKit && PSPDFKit.unload(container);
	}, []);

	return (
		<div
			ref={containerRef}
			style={{ width: '100%', height: '100vh' }}
		/>
	);
}