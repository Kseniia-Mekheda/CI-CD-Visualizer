import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import { api } from '../api/axios';
import { ROUTES } from '../constants/routes';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  // rawYaml: string | null;
  currentConfigId: number | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  aiReport: any | null;
  selectedNode: Node | null;
  history: any[];

  setGraph: (nodes: Node[], edges: Edge[], configId?: number | null) => void;
  setLoading: (loading: boolean) => void;
  setSelectedNode: (node: Node | null) => void;
  clearGraph: () => void;
  fetchHistory: () => Promise<void>;
  analyzePipeline: () => Promise<void>;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  // rawYaml: null,
  currentConfigId: null,
  isAnalyzing: false,
  aiReport: null,
  isLoading: false,
  selectedNode: null,
  history: [],

  setGraph: (nodes, edges, configId = null) =>
    set({
      nodes,
      edges,
      currentConfigId: configId,
      selectedNode: null,
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
}));
