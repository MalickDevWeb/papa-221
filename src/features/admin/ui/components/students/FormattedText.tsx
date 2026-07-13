import React from 'react';

interface Props {
  text: string;
}

export function FormattedText({ text }: Props) {
  if (!text) return null;
  return (
    <>
      {text.split('\n').map((line, i) => {
        let cleanLine = line;
        let isBullet = false;
        if (line.trim().startsWith('- ')) {
          cleanLine = line.trim().substring(2);
          isBullet = true;
        } else if (line.trim().startsWith('* ')) {
          cleanLine = line.trim().substring(2);
          isBullet = true;
        }

        const parts = cleanLine.split(/\*\*([^*]+)\*\*/g);
        const content = parts.map((part, index) => {
          if (index % 2 === 1) {
            return (
              <strong key={index} className="font-extrabold text-[#B3181C]">
                {part}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <li key={i} className="list-disc ml-5 my-1 pl-1 text-[11px] leading-relaxed text-neutral-700">
              {content}
            </li>
          );
        }

        if (line.trim().startsWith('### ') || line.trim().startsWith('## ')) {
          const titleText = line.trim().replace(/^#{2,3}\s+/, '');
          return (
            <h4 key={i} className="font-black text-[#1E293B] text-[11px] uppercase tracking-wider mt-4 mb-2 border-b border-neutral-100 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#B3181C] rounded-full" />
              {titleText}
            </h4>
          );
        }

        if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
          return (
            <p key={i} className="font-bold text-[#1E293B] text-[11px] mt-3 mb-1">
              {content}
            </p>
          );
        }

        if (!line.trim()) return <div key={i} className="h-2" />;

        return (
          <p key={i} className="my-1.5 leading-relaxed text-[11px] text-neutral-600 font-medium">
            {content}
          </p>
        );
      })}
    </>
  );
}
