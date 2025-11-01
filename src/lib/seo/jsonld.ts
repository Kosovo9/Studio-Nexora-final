import { SITE } from './site';

export function jsonldWebsite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/search?q={query}`,
      'query-input': 'required name=query'
    }
  };
}

export function jsonldOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    sameAs: []
  };
}

export function jsonldBreadcrumb(items: {name:string,url:string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it,idx)=>({
      '@type':'ListItem', position: idx+1, name: it.name, item: it.url
    }))
  };
}

export function jsonldProduct(name:string, description:string, url:string, price:number, currency='USD') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name, description, url,
    offers: { '@type':'Offer', priceCurrency: currency, price, availability:'https://schema.org/InStock' }
  };
}

export function jsonldFAQ(qas:{q:string,a:string}[]) {
  return {
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity: qas.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))
  };
}

export function jsonldHowTo(name:string, steps:string[]) {
  return {
    '@context':'https://schema.org','@type':'HowTo',name,
    step: steps.map((s,i)=>({'@type':'HowToStep',position:i+1,name:s}))
  };
}

export function jsonldArticle(name:string, description:string, url:string) {
  return {'@context':'https://schema.org','@type':'Article',headline:name,description,url,mainEntityOfPage:url};
}

export function jsonldVideo(name:string, description:string, url:string, thumbnail:string) {
  return {'@context':'https://schema.org','@type':'VideoObject',name,description,contentUrl:url,thumbnailUrl:thumbnail,uploadDate:new Date().toISOString()};
}

