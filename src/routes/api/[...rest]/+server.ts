import { app } from '$lib/app';

export const fallback = ({ request }) => app.handle(request);
