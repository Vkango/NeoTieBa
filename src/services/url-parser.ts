interface ParsedURL {
    protocol: string;
    hostname?: string;
    pathname: string;
    search: string;
    hash: string;
    params: Record<string, string>;
    pathId?: string | null;
    isCustomProtocol: boolean;
}

export class URLParser {
    private rawUrl: string;
    private parsed: ParsedURL;

    constructor(url: string) {
        this.rawUrl = url;
        this.parsed = this._parse();
    }

    private _parse(): ParsedURL {
        const customProtocolMatch = this.rawUrl.match(/^([a-zA-Z][a-zA-Z0-9+.-]+):\/\/([^?#]+)(\?[^#]*)?(#.*)?$/);

        if (customProtocolMatch) {
            const protocol = customProtocolMatch[1];
            const path = customProtocolMatch[2];
            const search = customProtocolMatch[3] || '';
            const hash = customProtocolMatch[4] || '';
            const params = this._parseSearchParams(search);

            return {
                protocol,
                pathname: path,
                search,
                hash,
                params,
                isCustomProtocol: true
            };
        }

        try {
            const urlObj = new URL(this.rawUrl);
            const params = this._parseSearchParams(urlObj.search);
            const pathIdMatch = urlObj.pathname.match(/\/[^/]+\/(\d+)/);
            const pathId = pathIdMatch ? pathIdMatch[1] : null;

            return {
                protocol: urlObj.protocol.replace(':', ''),
                hostname: urlObj.hostname,
                pathname: urlObj.pathname,
                search: urlObj.search,
                hash: urlObj.hash,
                params,
                pathId,
                isCustomProtocol: false
            };
        } catch (e) {
            throw new Error(`Invalid URL: ${this.rawUrl}`);
        }
    }

    private _parseSearchParams(searchString: string): Record<string, string> {
        const params: Record<string, string> = {};
        if (!searchString) return params;

        const searchParams = new URLSearchParams(searchString.replace(/^\?/, ''));
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }

    getParam(name: string): string | undefined {
        return this.parsed.params[name];
    }

    getPathId(): string | null | undefined {
        return this.parsed.pathId;
    }

    isCustomProtocol(): boolean {
        return this.parsed.isCustomProtocol;
    }

    getProtocol(): string {
        return this.parsed.protocol;
    }

    getPathname(): string {
        return this.parsed.pathname;
    }

    toObject(): ParsedURL {
        return { ...this.parsed };
    }
}
