import { embeddingsTable } from '../../hooks.server';
import { getEmbeddings } from './embed';

export const search = async ({ query }: { query: string }) => {
  const embeddings = await getEmbeddings({ content: query });
  const results: { vector: number[], url: string, _distance: number }[] = await embeddingsTable.search(Array.from(embeddings.data)).limit(5).execute();
  return results.filter((r) => r._distance <= 1.5).map((r) => r.url);
};
