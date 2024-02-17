import { chromium } from 'playwright';
import { Tensor, pipeline } from '@xenova/transformers';
import { embeddingsTable } from '../../hooks.server';

export async function getHtml({ url }: { url: string }) {
	const browser = await chromium.launch();
	const page = await browser.newPage();
	// Visit the URL and wait for the page to load, then get the html content
	await page.goto(url);
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

export async function storeEmbeddings({ url, embeddings }: { url: string; embeddings: Tensor }) {
	// Save the embeddings to the database
	await embeddingsTable.add([{ vector: embeddings.data, url }]);
}
