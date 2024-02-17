import { embeddingsTable } from '../../hooks.server';
import { getEmbeddings } from './embed';

export const search = async ({ query }: { query: string }) => {
	const embeddings = await getEmbeddings({ content: query });
	// const results = await embeddingsTable.search([...embeddings.data]).limit(5).execute(); // this is currently broken https://github.com/lancedb/lancedb/issues/882
	const results = await embeddingsTable.search([0]).limit(5).execute();
	return results.map((r) => r.url);
};
