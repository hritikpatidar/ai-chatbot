import ai from "../config/gemini.js";

export const getGeminiModelsService = async () => {
  const models = [];
  const modelPager = await ai.models.list({
    config: {
      pageSize: 100,
      queryBase: true,
    },
  });

  for await (const model of modelPager) {
    if (
      !model.name?.startsWith("models/gemini-") ||
      !model.supportedActions?.includes("generateContent")
    ) {
      continue;
    }

    models.push({
      id: model.name.replace(/^models\//, ""),
      displayName: model.displayName || model.name.replace(/^models\//, ""),
      description: model.description || "",
    });
  }

  return models;
};
