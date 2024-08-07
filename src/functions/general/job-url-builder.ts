

export default function jobUrlBuilder(url: string, newSource: string = 'interestedfyi'): string {
    const urlObj = new URL(url);

    if (url.includes('greenhouse.io')) {
        urlObj.searchParams.set('gh_src', newSource);
    }

    if (url.includes('lever.co')) {
        urlObj.searchParams.set('lever-source', newSource);
    }

    if (urlObj.searchParams.has('source')) {
        urlObj.searchParams.set('source', newSource);
    }

    if (urlObj.searchParams.has('ref')) {
        urlObj.searchParams.set('ref', newSource);
    }

    urlObj.searchParams.set('utm_source', newSource);
    urlObj.searchParams.set('utm_medium', 'referral')

    return urlObj.toString();
}