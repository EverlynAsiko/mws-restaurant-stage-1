"use strict";

//registers service worker if it is supported
if (navigator.serviceWorker) {
	navigator.serviceWorker.register('/sw.js').then(function(reg) {
		// body...
		console.log("Service worker registered successfully.");
	}).catch((e) => {
		console.log("Service worker not registered\n",e);
	});
}