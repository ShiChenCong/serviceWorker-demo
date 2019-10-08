const cacheFiles = [
  './index.css',
  './index.js'
];
const version = 'cache1'

// 添加缓存
self.addEventListener('install', function (event) {
  // self.skipWaiting();
  const addToCache = async () => {
    const cachesPool = await caches.open(version);
    console.log('添加缓存:', cacheFiles);
    cachesPool.addAll(cacheFiles);
  }
  event.waitUntil(addToCache());
});

// 删除之前的缓存
self.addEventListener('activate', function (event) {
  const deleteCache = async () => {
    const cacheNames = await caches.keys();
    cacheNames.map(async (cacheName) => {
      if (cacheName !== version) {
        console.log('删除缓存：', cacheName);
        await caches.delete(cacheName);
      }
    })
  }
  event.waitUntil(deleteCache())
})

// 捕捉请求 操作缓存
self.addEventListener('fetch', function (event) {
  const returnCache = async () => {
    const cache = await caches.match(event.request)
    // 如果有缓存就直接使用
    if (cache) return cache;
    // 如果没有 则请求 然后保存
    const cachesPool = await caches.open(version);
    const request = event.request.clone();
    const response = await fetch(request);
    const responseClone = response.clone();
    cachesPool.put(request, responseClone)
  }
  event.respondWith(returnCache());
})