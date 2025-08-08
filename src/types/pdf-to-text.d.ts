declare module 'pdf-to-text' {
  const pdfToText: (path: string, callback: (err: any, data: string) => void) => void;
  export = pdfToText;
} 