import { edenTreaty } from '@elysiajs/eden';
import type { App } from './app';

export const createClient = ({ fetcher }: { fetcher: typeof fetch }) =>
	edenTreaty<App>('', { fetcher });
