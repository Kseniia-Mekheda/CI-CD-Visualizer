import { Handle, Position } from 'reactflow';
import {Box, Server} from 'lucide-react';

type TJobNodeProps = {
    data: any,
    selected: boolean,
};

const JobNode = ({ data, selected }: TJobNodeProps) => {
    const runsOn = data.details?.['runs-on'] || 'unknown';

    return (
        <div
            className={`relative min-w-[180px] rounded-xl bg-white p-3 shadow-sm transition-all duration-200 ${
                selected 
                ? 'border-2 border-accent shadow-md ring-4 ring-accent-light/50 scale-105' 
                : 'border border-light-border hover:border-accent hover:shadow-md'
            }`}
        >
            <Handle type="target" position={Position.Left} className="h-3 w-3 border-2 border-white bg-slate-400" />
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-accent text-white' : 'bg-accent-light text-accent'}`}>
                <Box size={18} />
                </div>
                
                <div className="flex flex-col">
                <span className="font-bold text-light-text text-sm">{data.label}</span>
                
                <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-light-text-muted uppercase tracking-wider">
                    <Server size={10} />
                    <span>{runsOn}</span>
                </div>
                </div>
            </div>
            <Handle type="source" position={Position.Right} className="h-3 w-3 border-2 border-white bg-slate-400" />
        </div>
    )
};

export default JobNode;