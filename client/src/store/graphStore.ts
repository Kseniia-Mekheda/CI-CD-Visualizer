import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import { api } from '../api/axios';
import { ROUTES } from '../constants/routes';
import i18n from '../i18n/config';
import { getErrorDetail, translateBackendErrorSync } from '../utils/backendError';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  rawYaml: string | null;
  currentConfigId: string | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  aiAnalysisError: string | null;
  aiReport: any | null;
  selectedNode: Node | null;
  history: Array<{ id: string; name: string; created_at: string }>;

  setGraph: (nodes: Node[], edges: Edge[], configId?: string | null, rawYaml?: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSelectedNode: (node: Node | null) => void;
  clearGraph: () => void;
  fetchHistory: () => Promise<void>;
  loadHistoryItem: (configId: string) => Promise<void>;
  deleteHistoryItem: (configId: string) => Promise<void>;
  analyzePipeline: () => Promise<void>;
  clearAiAnalysisError: () => void;
  updateYamlContent: (newYaml: string) => Promise<void>;
  downloadYaml: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  rawYaml: null,
  currentConfigId: null,
  isAnalyzing: false,
  aiAnalysisError: null,
  aiReport: null,
  isLoading: false,
  selectedNode: null,
  history: [],

  setGraph: (nodes, edges, configId = null, rawYaml = null) =>
    set({
      nodes,
      edges,
      currentConfigId: configId,
      selectedNode: null,
      rawYaml,
      aiReport: null,
      aiAnalysisError: null,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  clearGraph: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      currentConfigId: null,
      rawYaml: null,
      aiReport: null,
      aiAnalysisError: null,
    }),

  fetchHistory: async () => {
    try {
      const { data } = await api.get(ROUTES.HISTORY);
      set({ history: data });
    } catch (error) {
      console.error('Помилка завантаження історії', error);
    }
  },

  loadHistoryItem: async (configId: string) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(ROUTES.HISTORY_BY_ID(configId));
      const graph = JSON.parse(data.analysis_result || '{}');
      set({
        nodes: graph.nodes || [],
        edges: graph.edges || [],
        currentConfigId: data.id ?? null,
        selectedNode: null,
        rawYaml: data.raw_yaml ?? null,
        aiReport: null,
        aiAnalysisError: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Помилка завантаження конфігурації', error);
      set({ isLoading: false });
    }
  },

  deleteHistoryItem: async (configId: string) => {
    try {
      await api.delete(ROUTES.HISTORY_BY_ID(configId));
      const { currentConfigId, history } = get();
      const nextHistory = history.filter((h) => h.id !== configId);
      if (currentConfigId === configId) {
        set({
          history: nextHistory,
          nodes: [],
          edges: [],
          selectedNode: null,
          currentConfigId: null,
          rawYaml: null,
          aiReport: null,
        });
      } else {
        set({ history: nextHistory });
      }
    } catch (error) {
      console.error('Помилка видалення з історії', error);
      throw error;
    }
  },

  clearAiAnalysisError: () => set({ aiAnalysisError: null }),

  analyzePipeline: async () => {
    const { currentConfigId } = get();
    if (!currentConfigId) return;

    const locale = i18n.language.startsWith('en') ? 'en' : 'uk';

    set({ isAnalyzing: true, aiAnalysisError: null });
    try {
      const { data } = await api.post(ROUTES.AI_ANALYZE, {
        config_id: currentConfigId,
        locale,
      });
      set({ aiReport: data, aiAnalysisError: null });
    } catch (error) {
      console.error('AI Analysis error', error);
      set({
        aiAnalysisError: translateBackendErrorSync(
          getErrorDetail(error),
          'backErrors.AI_ANALYSIS_ERROR'
        ),
      });
    } finally {
      set({ isAnalyzing: false });
    }
  },

  updateYamlContent: async (newYaml: string) => {
    const { currentConfigId } = get();
    if (!currentConfigId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.put(ROUTES.HISTORY_BY_ID(currentConfigId), {
        yaml_content: newYaml
      });

      set({
        rawYaml: newYaml,
        nodes: data.graph_data.nodes,
        edges: data.graph_data.edges,
        aiReport: null,
        isLoading: false
      });
    } catch (error: unknown) {
      set({ isLoading: false });
      throw new Error(
        translateBackendErrorSync(
          getErrorDetail(error),
          'backErrors.INTERNAL_ERROR'
        )
      );
    }
  },

  downloadYaml: () => {
    const { rawYaml, history, currentConfigId } = get();
    if (!rawYaml) return;

    const config = history.find(h => h.id === currentConfigId);
    const filename = config ? config.name : 'pipeline.yml';

    const safeFilename =
      filename.endsWith('.yml') || filename.endsWith('.yaml')
      ? filename
      : `${filename}.yml`;

    const blob = new Blob([rawYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}));

i18n.on('languageChanged', () => {
  const { aiReport, aiAnalysisError } = useGraphStore.getState();
  if (aiReport === null && aiAnalysisError === null) return;
  useGraphStore.setState({ aiReport: null, aiAnalysisError: null });
});
