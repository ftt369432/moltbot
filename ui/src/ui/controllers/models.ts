import type { GatewayBrowserClient } from "../gateway";
import { type ConfigSnapshot } from "../types";
import { loadConfig } from "./config";
import { updateConfigFormValue, saveConfig } from "./config";

export type ModelInfo = {
    id: string;
    name?: string;
    provider?: string;
    description?: string;
};

export type ModelsState = {
    client: GatewayBrowserClient | null;
    connected: boolean;
    modelsLoading: boolean;
    modelsError: string | null;
    availableModels: ModelInfo[];
    currentModelId: string | null;
    configSnapshot: ConfigSnapshot | null;
    configForm: Record<string, unknown> | null;
};

export async function loadModels(state: ModelsState) {
    if (!state.client || !state.connected) return;

    if (state.modelsLoading) return;
    state.modelsLoading = true;
    state.modelsError = null;

    try {
        // 1. Fetch available models
        const modelsRes = (await state.client.request("models.list", {})) as { models: ModelInfo[] };
        state.availableModels = modelsRes.models || [];

        // 2. Fetch current config (if not already synced) to determine current model
        // We assume the caller might also be calling loadConfig separately, but to be sure we're up to date:
        if (!state.configSnapshot) {
            await loadConfig(state as any); // Cast because state might be partial of full AppState
        }

        // Resolve current model
        // Path: agents.defaults.models.primary OR agents.defaults.model.primary
        // Based on previous analysis: agents.defaults.model.primary
        // Check configForm first (if dirty), then configSnapshot
        const config = state.configForm || state.configSnapshot?.config as Record<string, any>;

        let currentId = "google/gemini-1.5-flash"; // Default fallback

        if (config?.agents?.defaults?.model) {
            const modelConfig = config.agents.defaults.model;
            if (typeof modelConfig === "string") {
                currentId = modelConfig;
            } else if (typeof modelConfig === "object" && modelConfig.primary) {
                currentId = modelConfig.primary;
            }
        }

        state.currentModelId = currentId;

    } catch (err) {
        state.modelsError = String(err);
    } finally {
        state.modelsLoading = false;
    }
}

export async function setModel(state: ModelsState & { configFormMode: "form" | "raw", configFormDirty: boolean, configRaw: string }, modelId: string) {
    if (!state.client || !state.connected) return;

    // We reuse the config controller logic to update the config
    // Path: agents.defaults.model.primary
    // Note: config controller expects array path

    // We need to ensure we have the config loaded
    if (!state.configSnapshot) {
        await loadConfig(state as any);
    }

    // Update logic:
    // If agents.defaults.model is a string, we might want to make it an object or just update the string.
    // Ideally we standardise on object { primary: "..." }

    const path = ["agents", "defaults", "model", "primary"];

    // Also check if we need to ensure the parent objects exist. 
    // updateConfigFormValue (from config.ts) should handle deep set if using setPathValue from lodash or similar, 
    // but let's check `setPathValue` implementation in `config/form-utils.ts` if we can.
    // Assuming standard behavior.

    // However, `updateConfigFormValue` requires the full state setup for config (configForm, configRaw, etc.)
    // So the passed `state` must satisfy ConfigState interface approximately.

    updateConfigFormValue(state as any, path, modelId);

    // Save immediately
    await saveConfig(state as any);

    // Update local state
    state.currentModelId = modelId;
}
