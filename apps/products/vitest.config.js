import { mergeConfig, defineConfig } from 'vitest/config';
import base from '@repo/vitest-config/base' 

export default mergeConfig(
		base,
		defineConfig({ 
				test: {
						exclude: ["/node_modules/"],
						root: './tests',
						include: [
								'./tests',
								'./**/*.{test,spec}.?(c|m)[jt]s?(x)'
						]
				}
}))
