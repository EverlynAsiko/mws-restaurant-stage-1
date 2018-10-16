"use strict";

const appName = "restaurant_review";
const staticCacheName = appName + "_v1.0";

const contentImgsCache = appName + "_images";

var allCaches = [staticCacheName,contentImgsCache];

self.addEventListener('install', function(event){
	event.waitUntil(caches.open(staticCacheName).then(function(cache) {
		return cache.addAll([
			'/',
			'/restaurant.html',
			'/css/styles.css',
			'/js/dbhelper.js',
			'/js/main.js',
			'/js/restaurant_info.js',
			'js/register_sw.js',
			'data/restaurants.json'
			]);
	}));
});

self.addEventListener('activate', function(event){
	event.waitUntil(caches.keys().then(function(cacheNames) {
		return Promise.all(cacheNames.filter(function(cacheName) {
			return cacheName.startsWith(appName) && !allCaches.includes(cacheName);
		}).map(function(cacheName) {
			return caches.delete(cacheName);
		}));
	}));
});

self.addEventListener('fetch',function(event) {
	const requestUrl = new URL(event.request.url);

	if(requestUrl.origin === location.origin) {
		if(requestUrl.pathname.startsWith('/restaurant.html')) {
			event.respondWith(cache.match('/restaurant.html'));
			return;
		}

		if(requestUrl.pathname.startsWith('/img')) {
			event.respondWith(serveImage(event.request));
			return;
		}
	}


	event.respondWith(caches.match(event.request).then(function(response) {
		return response || fetch(event.request);
	}));
});

function serveImage(request) {
	let imageStorageUrl = request.url;

	imageStorageUrl = imageStorageUrl.replace(/-small\.\w{3}|-medium\.\w{3}|-large\.\w{3}/i, '');

	return caches.open(contentImgsCache).then(function(cache) {
		return cache.match(imageStorageUrl).then(function(response) {
			return response || fetch(request).then(function(networkResponse) {
				cache.put(imageStorageUrl, networkResponse.clone());
				return networkResponse;
			});
		});
	});
}