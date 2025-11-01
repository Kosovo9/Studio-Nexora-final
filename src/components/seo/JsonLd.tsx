export default function JsonLd({data}:{data:any}) {
  const json = JSON.stringify(data);
  return (
    <script type='application/ld+json' dangerouslySetInnerHTML={{__html: json}} />
  );
}

