import { httpRequest, type RequestSchema } from '@/core/request';
import { assessRelease, releaseMetadata, type Release } from '@/utils/settings-policy';
export async function checkForUpdates(request: (schema: RequestSchema) => ReturnType<typeof httpRequest> = httpRequest, builtAt = __BUILD_TIME__, commit = __BUILD_COMMIT__) {
 const response = await request({ url: 'https://api.github.com/repos/Vkango/NeoTieBa/releases?per_page=100', headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'NeoTieBa' } });
 const data: unknown = JSON.parse(response.text);
 if (!Array.isArray(data)) throw new Error('GitHub 返回了无效发布数据');
 const releases = (data as Release[]).filter(r => !r.draft && r.published_at && /^https:\/\/github.com\/Vkango\/NeoTieBa\/releases\//.test(r.html_url));
 releases.sort((a, b) => Date.parse(releaseMetadata(b)?.builtAt ?? b.published_at) - Date.parse(releaseMetadata(a)?.builtAt ?? a.published_at));
 const latest = releases[0];
 if (!latest) return { message: '暂无发布版本', url: '' };
 const status = assessRelease(latest, builtAt, commit);
 const date = new Date(releaseMetadata(latest)?.builtAt ?? latest.published_at).toLocaleString('zh-CN');
 return { message: `${status === 'new' ? '发现更新' : status === 'current' ? '当前构建已是最新' : '无法自动判断，请查看发布页'}：${latest.name}（${date}）`, url: latest.html_url };
}
