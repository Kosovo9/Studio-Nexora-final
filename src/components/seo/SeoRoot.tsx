'use client';

import JsonLd from '@/components/seo/JsonLd';
import { jsonldWebsite, jsonldOrganization } from '@/lib/seo/jsonld';

export default function SeoRoot(){
  return (
    <>
      <JsonLd data={jsonldWebsite()} />
      <JsonLd data={jsonldOrganization()} />
    </>
  );
}

