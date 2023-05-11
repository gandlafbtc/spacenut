<script lang="ts">
	import { getDecodedToken } from '@cashu/cashu-ts';

	export let nut: string;

	const decodedNut = getDecodedToken(nut);
</script>
<a href="https://wallet.nutstash.app/#{nut}" class="link link-primary">

    <div class="flex w-72 overflow-clip gap-2">
        <p>
            {decodedNut.token
			.map((t) => t.proofs)
			.flat()
			.reduce((acc, curr) => acc + curr.amount, 0)}
	</p>
	<p>🥜</p>
	<p class="truncate">
        {nut}
	</p>
</div>
</a>
