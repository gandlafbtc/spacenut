<script>
	import { goto } from '$app/navigation';
	import { nostrPubKey } from '../stores/nostr';
    //delete after implementing
	let npub = '';
	const navigate = () => {
        npub = npub?npub:'@anon'
		nostrPubKey.set(npub);
		goto('/game');
	};
</script>
<div class="bg-black text-center">

    <h4>
        hello @anon... find nuts and get rich
        <!-- hello pleb... add your npub to be included in the leaderboard, or press "go!" to play as @anon -->
    </h4>
    <div class="flex gap-2 w-screen items-center justify-center mt-5">
        <!-- <input type="text" class="input input-primary" placeholder="npub..." bind:value={npub} /> -->
        <button class="btn btn-primary" on:click={navigate} > go! </button>
    </div>
    
</div>