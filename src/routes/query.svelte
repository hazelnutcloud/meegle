<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import { onMount } from 'svelte';
	import UAParser from 'ua-parser-js';
	import { createClient } from '$lib/client';
	import { ExternalLink } from 'lucide-svelte';
	import { debounce } from '$lib/utils';
	import { toast } from 'svelte-sonner';

	const client = createClient({ fetcher: fetch });

	let open = false;
	let querying = false;
	let results: string[] = [];
	let query: string | undefined;

	$: ua = browser ? UAParser() : undefined;
	$: commandPrefix = ua?.os.name === 'Mac OS' ? '⌘' : 'Ctrl';
	$: if (query) {
		querying = true;
		debounce(async () => {
			if (!query) {
				querying = false;
				results = [];
				return;
			}

			const searchResults = await client.api.search.get({ $query: { query } });
			if (searchResults.error) {
				toast.error(`An error occurred: ${searchResults.error.message}`);
				querying = false;
				return;
			}
			results = searchResults.data;
			// results = searchResults;
			// await new Promise<void>((resolve) => {
			// 	setTimeout(() => {
			// 		results = ['https://google.com', 'https://bing.com', 'https://duckduckgo.com'];
			// 		resolve();
			// 	}, 500);
			// });
			querying = false;
		}, 500);
	}

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const handleSelect = async (result: string) => {
		open = false;

		window.open(result, '_blank', 'noopener noreferrer');
	};
</script>

<div class="flex items-center justify-center gap-2">
	<Button
		variant="link"
		class="p-0 text-sm text-muted-foreground"
		on:click={() => {
			open = true;
		}}>Search</Button
	>
	<kbd
		class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground opacity-100"
	>
		<span class="">{commandPrefix}</span>+ K
	</kbd>
</div>

<Command.Dialog bind:open loop shouldFilter={false}>
	<Command.Input placeholder="Enter a query..." bind:value={query} />
	<Command.List>
		{#if querying}
			<Command.Loading class="flex items-center justify-center p-4">Searching...</Command.Loading>
		{:else}
			{#if query}
				<Command.Empty>No results found.</Command.Empty>
			{/if}

			{#each results as result}
				<Command.Item onSelect={handleSelect}
					><div class="flex w-full items-center justify-between">
						<Button variant="link" size="sm">{result}</Button>
						<ExternalLink />
					</div></Command.Item
				>
			{/each}
		{/if}
	</Command.List>
</Command.Dialog>
