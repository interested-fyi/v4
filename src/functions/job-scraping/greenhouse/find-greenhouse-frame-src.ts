import { JSDOM } from 'jsdom';

export function findGreenhouseFrameSrc(html: string): string | null {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const iframes = document.querySelectorAll('iframe');
    let src: string | null = null;
    iframes.forEach((frame) => {
        if(frame.src.startsWith('https://boards.greenhouse.io/embed/')) {
            src = frame.src
        }
    })

    return src;
}