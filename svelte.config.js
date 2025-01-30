import adapter from '@sveltejs/adapter-cloudflare-workers';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			handlers: "./src/handlers.ts", // NEEDS TO BE EXPLICITLY SET - NO DEFAULT?
			config: "wrangler-local-sveltekit.toml",
			platformProxy: {
				configPath: "wrangler-local-sveltekit.toml"
			}
		})
	}
};

export default config;
