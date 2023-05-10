import { browser } from "$app/environment";
import { writable } from "svelte/store";
const initialValuePubKeySting: string = browser
	? window.localStorage.getItem('npub') ?? ''
	: '';

const nostrPubKey = writable<string>(initialValuePubKeySting);

nostrPubKey.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('npub', value);
	}
});
export {nostrPubKey}
