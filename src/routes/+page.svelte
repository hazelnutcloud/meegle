<script lang="ts">
	import { Bookmark } from 'lucide-svelte';
	import Query from './query.svelte';
	import Index from './index.svelte';
</script>

<h1 class="flex items-center gap-2 text-5xl font-bold">
	<Bookmark strokeWidth={3} size={32} />Meegle
</h1>
<p class="text-muted-foreground">Your personal search engine.</p>

<Index />

<Query />
