<script lang="ts">
	import { isUrl } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Download } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { createClient } from '$lib/client';
	import { toast } from "svelte-sonner";

	const client = createClient({ fetcher: fetch });

	let indexUrl: string | undefined;

	$: indexDisabled = !isUrl(indexUrl ?? '');

	const handleSubmit = async () => {
		if (indexDisabled || !indexUrl) return;

		toast.loading(`Indexing ${indexUrl}...`)

		const res = await client.api.index.post({ url: indexUrl });

		if (res.error) {
			toast.error(`An error occurred: ${res.error.message}`);
			return
		}

		toast.success(`${indexUrl} indexed successfully!`);

		indexUrl = '';
	};
</script>

<form class="mt-2 flex w-full max-w-sm items-center justify-center gap-2" on:submit={handleSubmit}>
	<Input bind:value={indexUrl} placeholder="Enter a url..." />
	<Button class="gap-2 font-bold shadow-md" disabled={indexDisabled} type="submit"
		><Download />Index</Button
	>
</form>
