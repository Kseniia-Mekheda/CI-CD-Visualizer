import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import { api } from '../api/axios';
import { ROUTES } from '../constants/routes';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  rawYaml: string | null;
  currentConfigId: number | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  aiReport: any | null;
  selectedNode: Node | null;
  history: any[];

  setGraph: (nodes: Node[], edges: Edge[], configId?: number | null, rawYaml?: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSelectedNode: (node: Node | null) => void;
  clearGraph: () => void;
  fetchHistory: () => Promise<void>;
  analyzePipeline: () => Promise<void>;
  updateYamlContent: (newYaml: string) => Promise<void>;
  downloadYaml: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  rawYaml: null,
  currentConfigId: null,
  isAnalyzing: false,
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
    }),

  fetchHistory: async () => {
    try {
      const { data } = await api.get(ROUTES.HISTORY);
      set({ history: data });
    } catch (error) {
      console.error('Помилка завантаження історії', error);
    }
  },

  analyzePipeline: async () => {
    const { currentConfigId } = get();
    if (!currentConfigId) return;

    set({ isAnalyzing: true });
    try {
      const { data } = await api.post(ROUTES.AI_ANALYZE, {
        config_id: currentConfigId,
      });
      set({ aiReport: data });
    } catch (error) {
      console.error('AI Analysis error', error);
    } finally {
      set({ isAnalyzing: false });
    }
  },

  updateYamlContent: async (newYaml: string) => {
    const { currentConfigId } = get();
    if (!currentConfigId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.put(ROUTES.UPDATE_YAML, {
        config_id: currentConfigId,
        yaml_content: newYaml
      });

      set({
        rawYaml: newYaml,
        nodes: data.graph_data.nodes,
        edges: data.graph_data.edges,
        aiReport: null,
        isLoading: false
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.detail || "Помилка оновлення файлу");
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
