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
			'/js/secret.js',
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