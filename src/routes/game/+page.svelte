<script lang="ts">
	import { browser } from '$app/environment';
	const init = async () => {
		const game = await import('../../game/main');
	};
	if (browser) {
		init();
	}
</script>

<div class="w-screen h-screen bg-black flex flex-col items-center gap-5">
	<div id="app" class="h-[500px]" />
	<a href="/stash" class="link link-primary">nutstash</a>
	<div class="p-2 border-white border-2 w-64 h-40 rounded-xl overflow-scroll scrollbar-hide">
		<ul id="coins-list" style="color: aliceblue;" />
	</div>
</div>

