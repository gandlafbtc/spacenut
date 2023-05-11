<script lang="ts">
	import { CashuMint, CashuWallet, getDecodedToken, type Token } from "@cashu/cashu-ts";
	import Nut from "../../comp/Nut.svelte";

	import { nuts } from "../../stores/nuts";
	import { cleanToken, getEncodedToken } from "@cashu/cashu-ts/dist/lib/es5/utils";
    const mintUrl = 'https://legend.lnbits.com/cashu/api/v1/4gr9Xcmz3XEkUNwiBiQGoC'
    $: bignut = ''

    const createBigNut =async () => {
        const allProofs = []
        for (const nut of $nuts) {
            const decodedNut = getDecodedToken(nut)
            allProofs.push(...decodedNut.token.map(t=> t.proofs).flat())
        }
        const cashuWallet = new CashuWallet(new CashuMint(mintUrl))
        const spentProofs = await cashuWallet.checkProofsSpent(allProofs)
        console.log(spentProofs)
        const unredeemed = allProofs.filter(p => !spentProofs.includes(p))
        if (!unredeemed.length) {
            bignut = 'no redeemable tokens found'
            return
        }
        const assembled: Token = {token:[{proofs: unredeemed, mint: mintUrl}]} 
        bignut = getEncodedToken(assembled)
    }   
</script>

<div class="flex gap-3 justify-center flex-col items-center">
    <div class="flex gap-3 justify-center flex-col items-center max-w-xl">
        <a href="/game" class="link link-primary">go back to game</a>
        <h2 class="text-3xl text-transparent bg-clip-text bg-gradient-to-br from-secondary to-primary">stash</h2>
        
        <p>here you can find the nuts you've stashed while playing spacenut</p>
        
        <p>
            To redeem them, you can create a big nut that will scan all nuts that are still unredeemed and combine them into a single big nut
        </p>
        {#if !bignut}
        <button on:click={createBigNut} class="btn btn-primary bg-gradient-to-br from-secondary to-primary">
            create a big 🥜
        </button>
        {:else}
        <div class="text-2xl">
            <Nut nut={bignut}></Nut>
        </div>
        {/if}
            
        

        {#each $nuts as nut}
        <Nut {nut}></Nut>
        {/each}
    </div>
</div>
