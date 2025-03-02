class ApiLogin {
    constructor() {
      this.BAIDUID = '';
      this.token = '';
      this.pplogid = '';
      this.passi_ubi = '';
      this.sign = '';
      this.bdussd = '';
      this.h = '';
      this.msg = '';
      this.scanTimer = null;
      this.isScanning = false;
    }
  
    async get_token() {
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
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
        console.error("get_token error:", error);
        return null;
      }
    }
  
    async get_pass_id() {
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
        const response = await axios.get(url, { headers });
        const src = response.headers['set-cookie'];
        return src;
      } catch (error) {
        console.error("get_pass_id error:", error);
        return null;
      }
    }
  
    async get_qr_code() {
      const url = "https://passport.baidu.com/v2/api/getqrcode?lp=pc&qrloginfrom=p";
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error("get_qr_code error:", error);
        return null;
      }
    }
  
    async get_auth_cookie() {
      try {
        const response = await axios.get("https://passport.baidu.com");
        this.BAIDUID = response.headers['set-cookie'];
        const qrResult = await this.get_qr_code();
        if (!qrResult) throw new Error("Failed to get QR code");
        document.getElementById('qrCodeImg').src = `https://${qrResult.imgurl}`;
        this.token = await this.get_token();
        const tokenJson = JSON.parse(this.token.replace(/'/g, '"'));
        this.token = tokenJson.data.token;
        const passiUbi = await this.get_pass_id();
        this.passi_ubi = passiUbi;
        this.sign = qrResult.sign;
      } catch (error) {
        console.error("get_auth_cookie error:", error);
      }
    }
  
    async get_scan_status() {
      const timestamp = Math.floor(Date.now() / 1000);
      const url = `https://passport.baidu.com/channel/unicast?channel_id=${this.sign}&tpl=mn&gid=9E0F7FB-E8A6-45AE-B0AB-095DDDB59C42&callback=tangram_guid_1561776159383&apiver=v3&tt=${timestamp}&_= ${timestamp}`;
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
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
        console.error("get_scan_status error:", error);
        return null;
      }
    }
  
    async login_with_bduss() {
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
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
        console.error("login_with_bduss error:", error);
        return null;
      }
    }
  
    async login() {
      if (this.isScanning) return;
      this.isScanning = true;
      let i = 0;
      this.scanTimer = setInterval(async () => {
        i++;
        if (i === 120) {
          this.isScanning = false;
          clearInterval(this.scanTimer);
          this.refreshQRCode();
          return;
        }
        try {
          const status = await this.get_scan_status();
          document.getElementById('qrStatus').textContent = '心跳检测中...';
          if (status.includes('"status":1')) {
            document.getElementById('qrStatus').textContent = '扫描成功！请在手机上确认！';
          }
          if (status.includes('"status":0,"v":')) {
            this.isScanning = false;
            clearInterval(this.scanTimer);
            const re = /"v\\":\\"(.*?)\\"/;
            this.bdussd = re.exec(status)[1];
            const response = await this.login_with_bduss();
            const reDisplayName = /displayName":"(.*?)"/;
            const rePortrait = /portraitUrl":"(.*?)"/;
            const displayName = reDisplayName.exec(response);
            const portrait = rePortrait.exec(response);
            document.getElementById('loginResult').style.display = 'block';
            document.getElementById('loginMsg').textContent = `${displayName[1]} 登录成功！`;
            document.getElementById('userAvatar').src = portrait[1];
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      }, 5000);
    }
  
    refreshQRCode() {
      clearInterval(this.scanTimer);
      this.isScanning = false;
      this.BAIDUID = '';
      this.token = '';
      this.pplogid = '';
      this.passi_ubi = '';
      this.sign = '';
      this.bdussd = '';
      this.h = '';
      this.msg = '';
      this.get_auth_cookie();
      this.login();
    }
  }
  
const apiLogin = new ApiLogin();

async function main() {
    await apiLogin.get_auth_cookie();
    apiLogin.login();
}

main();
    document.getElementById('refreshQrBtn').addEventListener('click', () => {
    apiLogin.refreshQRCode();
});