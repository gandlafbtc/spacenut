import { browser } from "$app/environment";
import { writable } from "svelte/store";
const initialValueNutsSting: string = browser
	? window.localStorage.getItem('nuts') ?? '[]'
	: '[]';

const nuts = writable<string[]>(JSON.parse(initialValueNutsSting));

nuts.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('nuts', JSON.stringify(value));
	}
});
export {nuts}
