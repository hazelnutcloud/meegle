import * as lancedb from 'vectordb';

export const handle = ({ event, resolve }) =>
  resolve(event, {
    filterSerializedResponseHeaders: (header) =>
      header === 'content-type' || header === 'Content-Type'
  });

const db = await lancedb.connect('data/embeddings');

export const embeddingsTable = await db.openTable('site_embeddings').catch(async () => {
  const tbl = await db.createTable({
    name: 'site_embeddings',
    data: [{ vector: new Array(384).fill(0), url: 'dummy' }],
  });
  await tbl.delete('url = "dummy"');
  return tbl;
});
