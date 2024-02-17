import { swagger } from '@elysiajs/swagger';
import { Elysia, t } from 'elysia';
import { getEmbeddings, getHtml, storeEmbeddings } from './embed/embed';
import { search } from './embed/search';
import { isUrl } from './utils';

export const app = new Elysia({ prefix: '/api' })
	.use(swagger({ path: '/docs', exclude: /^\/api\/docs/ }))
	.get(
		'/search',
		async ({ query }) => {
			const res = await search(query);
			return res as string[];
		},
		{
			query: t.Object({
				query: t.String({ minLength: 1 })
			})
		}
	)
	.post(
		'/index',
		async ({ body }) => {
			if (!isUrl(body.url)) throw new Error('Invalid URL');
			const html = await getHtml(body);
			const embeddings = await getEmbeddings({ content: html });
			await storeEmbeddings({ url: body.url, embeddings });
			return "Embeddings stored!"
		},
		{
			body: t.Object({
				url: t.String()
			})
		}
	);

export type App = typeof app;
