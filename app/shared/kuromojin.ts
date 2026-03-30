export * from 'kuromojin';

// kuromojiの辞書をCDNから読み込めるようにパッチする
const xmlHttpRequestPrototype = XMLHttpRequest.prototype;
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalXMLHttpRequestOpen = xmlHttpRequestPrototype.open;
Object.assign(xmlHttpRequestPrototype, {
  open(method: string, url: string, async: boolean) {
    const fixedUrl = url.replace(/^(\w+:)\/+/, '$1//');
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return originalXMLHttpRequestOpen.call(this, method, fixedUrl, async);
  },
});
