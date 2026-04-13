import { useMemo, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { useGraphStore } from '../../store/graphStore';
import JobNode from '../../components/job-node/JobNode';
import AiReportPanel from '../ai-report-panel/AiReportPanel';

const nodeTypes = {
  customJob: JobNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 70;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {...node};

        newNode.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
        newNode.type = 'customJob';
        return newNode;
    });

    return { nodes: layoutedNodes, edges };
};

const GraphVisualizer = () => {
  const { nodes, edges, setSelectedNode } = useGraphStore();

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(nodes, edges, 'LR'),
    [nodes, edges]
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="h-full w-full bg-light-bg">
      <AiReportPanel />
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        attributionPosition="bottom-right"

        nodesDraggable={false}
        nodesConnectable={false}
        edgesUpdatable={false}
        elementsSelectable={true}
      >
        <Background color="#ccc" gap={16} />
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable nodeColor="#8b5cf6" />
      </ReactFlow>
    </div>
  );
};

export default GraphVisualizer;