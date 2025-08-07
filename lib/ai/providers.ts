import { LanguageModel } from 'ai';
import type { ModelId } from './model-id';
import { gateway } from '@ai-sdk/gateway';


export function getLanguageModel(modelId: ModelId): LanguageModel {
    return gateway(modelId)
}