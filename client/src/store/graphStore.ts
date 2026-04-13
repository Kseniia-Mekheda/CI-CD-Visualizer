import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import { api } from '../api/axios';
import { ROUTES } from '../constants/routes';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  rawYaml: string | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  aiReport: any | null;
  selectedNode: Node | null;
  history: any[];
  
  setGraph: (nodes: Node[], edges: Edge[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedNode: (node: Node | null) => void;
  clearGraph: () => void;
  fetchHistory: () => Promise<void>;
  analyzePipeline: () => Promise<void>;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  rawYaml: null,
  isAnalyzing: false,
  aiReport: null,
  isLoading: false,
  selectedNode: null,
  history: [],

  setGraph: (nodes, edges) => set({ nodes, edges, selectedNode: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  clearGraph: () => set({ nodes: [], edges: [], selectedNode: null }),

  fetchHistory: async () => {
    try {
      const { data } = await api.get(ROUTES.HISTORY);
      set({ history: data });
    } catch (error) {
      console.error("Помилка завантаження історії", error);
    }
  },

  analyzePipeline: async () => {
    const { rawYaml } = get();
    if (!rawYaml) return;

    set({ isAnalyzing: true });
    try {
      const { data } = await api.post(ROUTES.AI_ANALYZE, { yaml_content: rawYaml });
      set({ aiReport: data });
    } catch (error) {
      console.error("AI Analysis error", error);
    } finally {
      set({ isAnalyzing: false });
    }
  }
}));