export class URLParser {
    constructor(url) {
        this.rawUrl = url;
        this.parsed = this._parse();
    }

    _parse() {
        const customProtocolMatch = this.rawUrl.match(/^([a-zA-Z][a-zA-Z0-9+.-]+):\/\/([^?#]+)(\?[^#]*)?(#.*)?$/);

        if (customProtocolMatch) {
            const protocol = customProtocolMatch[1];
            const path = customProtocolMatch[2];
            const search = customProtocolMatch[3] || '';
            const hash = customProtocolMatch[4] || '';

            const params = this._parseSearchParams(search);

            return {
                protocol: protocol,
                pathname: path,
                search: search,
                hash: hash,
                params: params,
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
                params: params,
                pathId: pathId,
                isCustomProtocol: false
            };
        } catch (e) {
            throw new Error(`Invalid URL: ${this.rawUrl}`);
        }
    }

    _parseSearchParams(searchString) {
        const params = {};
        if (!searchString) return params;

        const searchParams = new URLSearchParams(searchString.replace(/^\?/, ''));
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }

    getParam(name) {
        return this.parsed.params[name];
    }

    getPathId() {
        return this.parsed.pathId;
    }

    isCustomProtocol() {
        return this.parsed.isCustomProtocol;
    }

    getProtocol() {
        return this.parsed.protocol;
    }

    getPathname() {
        return this.parsed.pathname;
    }

    toObject() {
        return { ...this.parsed };
    }
}
