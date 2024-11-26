// lib/types/formidable.d.ts

declare module 'formidable' {
    import { IncomingMessage } from 'http';
    import * as fs from 'fs';

    interface Files {
        [fieldname: string]: fs.ReadStream[];
    }

    interface Fields {
        [key: string]: string | string[];
    }

    export class IncomingForm {
        uploadDir: string;
        keepExtensions: boolean;
        parse(req: IncomingMessage, callback: (err: any, fields: Fields, files: Files) => void): void;
    }
}
