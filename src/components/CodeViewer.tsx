import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeViewerProps {
  title: string;
  code: string;
  language: string;
}

export function CodeViewer({ title, code, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500"></div>
            <div className="size-3 rounded-full bg-amber-500"></div>
            <div className="size-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-300 text-sm ml-2">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-slate-300 hover:text-white hover:bg-slate-700 gap-2"
        >
          {copied ? (
            <>
              <Check className="size-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="bg-slate-900 p-4 overflow-x-auto">
        <pre className="text-slate-100 text-sm font-mono">
          <code className="language-{language}">
            {code.split('\n').map((line, index) => (
              <div key={index} className="table-row">
                <span className="table-cell text-right pr-4 text-slate-500 select-none">
                  {index + 1}
                </span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </Card>
  );
}
