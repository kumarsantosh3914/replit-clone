import React from 'react';

interface EditorTabProps {
    filename: string;
    isActive: boolean;
    onClick: () => void;
    onClose: (e: React.MouseEvent) => void;
}

export const EditorTab = ({ filename, isActive, onClick, onClose }: EditorTabProps) => {
    return (
        <div
            onClick={onClick}
            className={`
        group flex items-center justify-between gap-2 px-3 h-[38px] min-w-[120px] max-w-[200px] 
        cursor-pointer text-sm select-none border-t-2 transition-colors
        ${isActive
                    ? 'bg-[#1e1e1e] text-white border-pink-300'
                    : 'bg-[#2d2d2d] text-zinc-400 border-transparent hover:bg-[#363636] hover:text-zinc-300'
                }
      `}
        >
            <span className="truncate flex-1 font-mono text-[13px]">{filename}</span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(e);
                }}
                className={`
          flex items-center justify-center p-0.5 rounded-md transition-colors
          ${isActive
                        ? 'opacity-100 hover:bg-[#363636]'
                        : 'opacity-0 group-hover:opacity-100 hover:bg-[#4a4a4a]'
                    }
        `}
            >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
