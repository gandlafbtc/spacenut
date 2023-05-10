<script>
    import "../app.css";
    $: isPulse = true 
    setTimeout(() => {
        isPulse=false
    }, 5000);
  </script>
  <a href="https://geyser.fund/project/spacenutcashuvideogame" class="w-full flex bg-[#20ecc7] text-[#2f423e] text-center justify-center {isPulse?'animate-pulse':''}">
Help this game win the geyser.fund gaming grant
</a>
  <div class="items-center justify-center text-center flex flex-col gap-3 bg-slate-950 h-40 bg-gradient-to-b from-slate-950 to-black">

      <h1 class="bg-black text-7xl text-transparent bg-clip-text bg-gradient-to-br from-secondary to-primary"> 
          Spacenut
        </h1>
    </div>
    <div class="h-screen bg-black">
        <slot />
    </div>