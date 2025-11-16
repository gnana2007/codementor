import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Upload, Code, Play, Download, AlertCircle, CheckCircle2, Split } from 'lucide-react';
import { analyzeCode } from '../utils/api';
import { ErrorList } from './ErrorList';
import { CodeViewer } from './CodeViewer';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

// TypeScript interface for analysis result
interface AnalysisResult {
  id?: string;
  summary: string;
  errors: Array<{
    line: number;
    issue: string;
    explanation: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  fixed_code: string;
}

export function CodeDebugger() {
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload'>('paste');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'errors' | 'fixed'>('errors');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        // Validate that result is a string before setting
        if (typeof result === 'string') {
          setCode(result);
        } else {
          console.error('Failed to read file as text');
          alert('Failed to read file. Please try again.');
        }
      };
      reader.onerror = () => {
        console.error('FileReader error');
        alert('Error reading file. Please try again.');
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    // Validate input before proceeding
    if (!code.trim()) {
      alert('Please enter some code to analyze.');
      return;
    }
    
    if (!language) {
      alert('Please select a programming language.');
      return;
    }
    
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeCode(code, language, fileName, controller.signal);
      
      // Only update state if request wasn't aborted
      if (!controller.signal.aborted) {
        // Validate result structure
        if (!result) {
          throw new Error('Received empty result from server');
        }
        
        setAnalysisResult(result);
        setViewMode('errors');
      }
    } catch (error) {
      // Handle abort errors gracefully (don't show error for cancelled requests)
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Analysis request was cancelled');
        return;
      }
      
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to analyze code. Please try again.';
      alert(errorMessage);
      
      // Reset state on error
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  };

  const handleDownload = () => {
    if (!analysisResult?.fixed_code) return;
    
    const blob = new Blob([analysisResult.fixed_code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixed_${fileName || 'code'}.${getFileExtension(language)}`;
    
    // Append to DOM temporarily to ensure download works
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Revoke URL after a short delay to ensure download started
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const getFileExtension = (lang: string) => {
    const extensions: Record<string, string> = {
      python: 'py',
      javascript: 'js',
      java: 'java',
      cpp: 'cpp',
      c: 'c'
    };
    return extensions[lang] || 'txt';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-900">Code Debugging System</h2>
              <p className="text-slate-600 text-sm mt-1">
                Upload or paste your code for intelligent analysis
              </p>
            </div>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
              AI Powered
            </Badge>
          </div>

          {/* Input Method Tabs */}
          <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste" className="gap-2">
                <Code className="size-4" />
                Paste Code
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="size-4" />
                Upload File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Your Code</Label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Upload Code File</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept=".py,.cpp,.js,.java,.c"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="size-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      .py, .cpp, .js, .java, .c files supported
                    </p>
                    {fileName && (
                      <p className="text-indigo-600 mt-2">
                        Selected: {fileName}
                      </p>
                    )}
                  </label>
                </div>
              </div>
              {code && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label>Programming Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python (.py)</SelectItem>
                <SelectItem value="cpp">C++ (.cpp)</SelectItem>
                <SelectItem value="javascript">JavaScript (.js)</SelectItem>
                <SelectItem value="java">Java (.java)</SelectItem>
                <SelectItem value="c">C (.c)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!code.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            size="lg"
          >
            <Play className="size-5 mr-2" />
            {isAnalyzing ? 'Analyzing Code...' : 'Analyze Code'}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary Alert */}
          <Alert className={analysisResult.errors.length === 0 ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
            {analysisResult.errors.length === 0 ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : (
              <AlertCircle className="size-5 text-amber-600" />
            )}
            <AlertDescription className={analysisResult.errors.length === 0 ? 'text-green-900' : 'text-amber-900'}>
              <span>{analysisResult.summary}</span>
            </AlertDescription>
          </Alert>

          {/* View Mode Selector */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewMode === 'errors' ? 'default' : 'outline'}
              onClick={() => setViewMode('errors')}
              className="gap-2"
            >
              <AlertCircle className="size-4" />
              Errors & Explanations
              {analysisResult.errors.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {analysisResult.errors.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={viewMode === 'fixed' ? 'default' : 'outline'}
              onClick={() => setViewMode('fixed')}
              className="gap-2"
            >
              <Code className="size-4" />
              Fixed Code
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              onClick={() => setViewMode('split')}
              className="gap-2"
            >
              <Split className="size-4" />
              Split View
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="gap-2 ml-auto"
            >
              <Download className="size-4" />
              Download Fixed File
            </Button>
          </div>

          {/* Content Based on View Mode */}
          {viewMode === 'errors' && (
            <ErrorList errors={analysisResult.errors} />
          )}

          {viewMode === 'fixed' && (
            <CodeViewer
              title="Fixed Code"
              code={analysisResult.fixed_code}
              language={language}
            />
          )}

          {viewMode === 'split' && (
            <div className="grid md:grid-cols-2 gap-6">
              <CodeViewer
                title="Original Code"
                code={code}
                language={language}
              />
              <CodeViewer
                title="Fixed Code"
                code={analysisResult.fixed_code}
                language={language}
              />
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      {!analysisResult && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <h3 className="text-slate-900 mb-3">How It Works</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex gap-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full size-6 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <p>Upload or paste your code</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full size-6 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <p>AI detects syntax & logical errors</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full size-6 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <p>Get beginner-friendly explanations</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full size-6 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <p>Download corrected code instantly</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
