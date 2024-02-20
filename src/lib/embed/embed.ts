import { chromium } from 'playwright';
import { Tensor, pipeline } from '@xenova/transformers';
import { embeddingsTable } from '../../hooks.server';

export async function getHtml({ url }: { url: URL }) {
	const browser = await chromium.launch();
	const page = await browser.newPage({ userAgent: 'meegle' });
	// Visit the URL and wait for the page to load, then get the html content
	await page.goto(url.toString());
	await page.waitForLoadState();
	const html = await page.content();
	await browser.close();
	return html;
}

export async function getEmbeddings({ content }: { content: string }) {
	// Create embeddings from the content content
	const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
	const embeddings = await extractor(content, { pooling: 'mean', normalize: true });
	return embeddings;
}

// export async function getSummary({ content }: { content: string }) {
//   // Create a summary from the content
//   const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
//   const summary = await generator(content, { max_new_tokens: 10 });
//   return summary;
// }

export async function storeEmbeddings({ url, embeddings }: { url: URL; embeddings: Tensor }) {
	// Save the embeddings to the database
  await embeddingsTable.delete(`url = "${url.toString()}"`);
	await embeddingsTable.add([{ vector: Array.from(embeddings.data), url: url.toString() }]);
}
