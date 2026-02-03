import { fetch_data_with_headers_command, fetchData } from '@/core/request';

export class ApiLogin {
    private BAIDUID = '';
    private token = '';
    private sign = '';
    public bdussd = '';
    public scanTimer: number | null = null;
    public isScanning = false;
    private isCanceled = false;

    get isCancelled(): boolean {
        return this.isCanceled;
    }

    set isCancelled(value: boolean) {
        this.isCanceled = value;
    }

    async get_token(): Promise<string | null> {
        if (this.isCancelled) return null;
        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://passport.baidu.com/v2/api/?getapi&token=&tpl=tb&subpro=&apiver=v3&tt=${timestamp}&class=login&gid=9E0F7FB-E8A6-45AE-B0AB-095DDDB59C42&loginversion=v4&logintype=dialogLogin&traceid=&time=${timestamp}&alg=v3`;
        const headers = {
            "Host": "passport.baidu.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Connection": "keep-alive",
            "Referer": "https://tieba.baidu.com/",
            "Cookie": this.BAIDUID
        };
        try {
            const response = await fetch_data_with_headers_command(url, headers);
            return response.text;
        } catch (error) {
            console.error("get_token error:", error);
            return null;
        }
    }

    async get_pass_id(): Promise<string | null> {
        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://passport.baidu.com/v2/api/?loginhistory&token=${this.token}&tpl=mn&apiver=v3&tt=${timestamp}&loginverison=v4&gid=9E0F7FB-E8A6-45AE-B0AB-095DDDB59C42&traceid=&callback=bd__cbs__um4fp5`;
        const headers = {
            "Host": "passport.baidu.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Connection": "keep-alive",
            "Referer": "https://tieba.baidu.com/",
            "Cookie": this.BAIDUID
        };
        try {
            const response = await fetch_data_with_headers_command(url, headers);
            return response.headers?.['set-cookie'] || null;
        } catch (error) {
            console.error("get_pass_id error:", error);
            return null;
        }
    }

    async get_qr_code(): Promise<any> {
        const url = "https://passport.baidu.com/v2/api/getqrcode?lp=pc&qrloginfrom=p";
        try {
            const response = JSON.parse(await fetchData(url));
            return response;
        } catch (error) {
            console.error("get_qr_code error:", error);
            return null;
        }
    }

    async get_auth_cookie(): Promise<void> {
        if (this.isCancelled) return;
        try {
            const response = await fetch_data_with_headers_command("https://passport.baidu.com", {});
            this.BAIDUID = response.headers?.['set-cookie'] || '';
            const qrResult = await this.get_qr_code();
            if (!qrResult) throw new Error("Failed to get QR code");

            const qrCodeImg = document.getElementById('qrCodeImg') as HTMLImageElement;
            if (qrCodeImg) {
                qrCodeImg.src = `https://${qrResult.imgurl}`;
            }

            const tokenResponse = await this.get_token();
            if (tokenResponse) {
                const tokenJson = JSON.parse(tokenResponse.replace(/'/g, '"'));
                this.token = tokenJson.data.token;
            }

            this.sign = qrResult.sign;
        } catch (error) {
            console.error("get_auth_cookie error:", error);
        }
    }

    async get_scan_status(): Promise<string | null> {
        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://passport.baidu.com/channel/unicast?channel_id=${this.sign}&tpl=mn&gid=9E0F7FB-E8A6-45AE-B0AB-095DDDB59C42&callback=tangram_guid_1561776159383&apiver=v3&tt=${timestamp}&_=${timestamp}`;
        const headers = {
            "Host": "passport.baidu.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Connection": "keep-alive",
            "Referer": "https://tieba.baidu.com/",
            "Cookie": this.BAIDUID
        };
        try {
            const response = await fetch_data_with_headers_command(url, headers);
            return response.text;
        } catch (error) {
            console.error("get_scan_status error:", error);
            return null;
        }
    }

    async login_with_bduss(): Promise<string | null> {
        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://passport.baidu.com/v3/login/main/qrbdusslogin?v=${timestamp}&bduss=${this.bdussd}&qrcode=1&pl=mn&apiver=v3&tt=${timestamp}&traceid=`;
        const headers = {
            "Host": "passport.baidu.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Connection": "keep-alive",
            "Referer": "https://tieba.baidu.com/",
            "Cookie": this.BAIDUID
        };
        try {
            const response = await fetch_data_with_headers_command(url, headers);
            return response.text;
        } catch (error) {
            console.error("login_with_bduss error:", error);
            return null;
        }
    }

    refreshQRCode(): void {
        if (this.scanTimer) {
            clearInterval(this.scanTimer);
        }
        this.isScanning = false;
        this.BAIDUID = '';
        this.token = '';
        this.sign = '';
        this.bdussd = '';
        this.get_auth_cookie();
    }
}
