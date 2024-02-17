<script>
	import '../app.pcss';
	import { Toaster } from "$lib/components/ui/sonner"
</script>

<Toaster richColors />

<div class="flex flex-col justify-center items-center min-h-screen gap-1">
	<slot />
</div> 
