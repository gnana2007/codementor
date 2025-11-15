import { Card } from './ui/card';
import { AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface Error {
  line: number;
  issue: string;
  explanation: string;
  severity?: 'error' | 'warning' | 'info';
}

interface ErrorListProps {
  errors: Error[];
}

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CheckCircle2 className="size-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-green-900 mb-2">No Issues Found!</h3>
        <p className="text-green-700">
          Your code looks great. No syntax or logical errors detected.
        </p>
      </Card>
    );
  }

  const getSeverityColor = (severity: string = 'error') => {
    switch (severity) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getSeverityBadge = (severity: string = 'error') => {
    switch (severity) {
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-900">Issues Found ({errors.length})</h3>
      </div>

      <div className="space-y-4">
        {errors.map((error, index) => (
          <Card
            key={index}
            className={`p-5 ${getSeverityColor(error.severity)} transition-all hover:shadow-md`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-white rounded-full p-2 shadow-sm">
                  <AlertCircle className="size-5 text-red-500" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {error.line > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Line {error.line}
                        </Badge>
                      )}
                      {getSeverityBadge(error.severity)}
                    </div>
                    <h4 className="text-slate-900">{error.issue}</h4>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex gap-2 mb-2">
                    <Lightbulb className="size-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">
                      {error.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
