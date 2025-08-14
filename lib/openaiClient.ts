import OpenAI, { AzureOpenAI } from "openai";

export function getOpenAIClient(): OpenAI {
	const azEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
	const azKey = process.env.AZURE_OPENAI_API_KEY;
	const azDeployment = "gpt-35-turbo";
	if (azEndpoint && azKey && azDeployment) {
		const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";
		// Use AzureOpenAI client to hit /openai/deployments/{deployment}/chat/completions
		return new AzureOpenAI({
			endpoint: azEndpoint,
			apiKey: azKey,
			deployment: azDeployment,
			apiVersion,
		}) as unknown as OpenAI;
	}

	const key = process.env.OPENAI_API_KEY;
	if (!key) throw new Error("OPENAI_API_KEY is not set, or configure Azure OpenAI env vars");
	return new OpenAI({ apiKey: key });
}

export function getChatModel(): string {
	// For Azure, prefer explicit AZURE_OPENAI_MODEL if provided, otherwise fall back to base model id
	if (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_DEPLOYMENT) {
		return process.env.AZURE_OPENAI_MODEL || "gpt-35-turbo";
	}
	return process.env.OPENAI_MODEL || "gpt-3.5-turbo";
}


