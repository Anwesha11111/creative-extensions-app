import React, { useState } from 'react';
import { Sparkles, Plus, X, Palette, Type, Music, Image, Grid, Zap } from 'lucide-react';

// Available extensions registry
const EXTENSION_REGISTRY = {
  drawing: {
    id: 'drawing',
    name: 'Drawing Canvas',
    description: 'Freehand drawing tool with brush controls',
    icon: Palette,
    keywords: ['draw', 'sketch', 'paint', 'canvas', 'brush', 'art'],
    component: DrawingTool
  },
  textEditor: {
    id: 'textEditor',
    name: 'Rich Text Editor',
    description: 'Write and format text with markdown support',
    icon: Type,
    keywords: ['write', 'text', 'notes', 'document', 'edit', 'typing'],
    component: TextEditor
  },
  colorPalette: {
    id: 'colorPalette',
    name: 'Color Palette Generator',
    description: 'Generate and explore color schemes',
    icon: Palette,
    keywords: ['color', 'palette', 'scheme', 'theme', 'design'],
    component: ColorPalette
  },
  moodBoard: {
    id: 'moodBoard',
    name: 'Mood Board',
    description: 'Collect and arrange visual inspiration',
    icon: Grid,
    keywords: ['mood', 'board', 'inspiration', 'collage', 'ideas', 'visual'],
    component: MoodBoard
  }
};

// Extension Components
function DrawingTool() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const canvasRef = React.useRef(null);
  const [ctx, setCtx] = useState(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineWidth = 3;
      setCtx(context);
    }
  }, []);

  const startDrawing = (e) => {
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.strokeStyle = color;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer"
        />
        <button onClick={clearCanvas} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
          Clear
        </button>
      </div>
      <canvas 
        ref={canvasRef}
        width={400}
        height={300}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-gray-300 rounded cursor-crosshair bg-white"
      />
    </div>
  );
}

function TextEditor() {
  const [text, setText] = useState('');
  return (
    <textarea 
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Start writing your ideas..."
      className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none focus:border-blue-400 focus:outline-none"
    />
  );
}

function ColorPalette() {
  const [palette, setPalette] = useState(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']);
  
  const generatePalette = () => {
    const newPalette = Array(5).fill(0).map(() => 
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    );
    setPalette(newPalette);
  };

  return (
    <div className="flex flex-col gap-3">
      <button onClick={generatePalette} className="px-4 py-2 bg-purple-500 text-white rounded">
        Generate New Palette
      </button>
      <div className="flex gap-2">
        {palette.map((color, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full h-24 rounded shadow-lg"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-mono">{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodBoard() {
  const [items, setItems] = useState([]);
  
  const addItem = () => {
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200'];
    setItems([...items, { 
      id: Date.now(), 
      color: colors[Math.floor(Math.random() * colors.length)],
      text: 'Idea ' + (items.length + 1)
    }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <button onClick={addItem} className="px-4 py-2 bg-indigo-500 text-white rounded">
        Add Inspiration Card
      </button>
      <div className="grid grid-cols-3 gap-3">
        {items.map(item => (
          <div key={item.id} className={`${item.color} p-4 rounded shadow-md h-24 flex items-center justify-center`}>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main App
export default function CreativeExtensionApp() {
  const [taskInput, setTaskInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [installedExtensions, setInstalledExtensions] = useState([]);

  const analyzeTask = async () => {
    if (!taskInput.trim()) return;
    
    setIsAnalyzing(true);
    setSuggestion(null);

    // Simulate AI analysis by matching keywords
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const input = taskInput.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    Object.values(EXTENSION_REGISTRY).forEach(ext => {
      const score = ext.keywords.filter(kw => input.includes(kw)).length;
      if (score > maxScore && !installedExtensions.find(e => e.id === ext.id)) {
        maxScore = score;
        bestMatch = ext;
      }
    });

    // Default suggestions based on common patterns
    if (!bestMatch) {
      if (input.includes('visual') || input.includes('organize')) {
        bestMatch = EXTENSION_REGISTRY.moodBoard;
      } else if (input.includes('color') || input.includes('design')) {
        bestMatch = EXTENSION_REGISTRY.colorPalette;
      } else {
        bestMatch = Object.values(EXTENSION_REGISTRY).find(
          ext => !installedExtensions.find(e => e.id === ext.id)
        );
      }
    }

    setSuggestion(bestMatch);
    setIsAnalyzing(false);
  };

  const installExtension = (extension) => {
    setInstalledExtensions([...installedExtensions, extension]);
    setSuggestion(null);
    setTaskInput('');
  };

  const removeExtension = (extensionId) => {
    setInstalledExtensions(installedExtensions.filter(e => e.id !== extensionId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-purple-500" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Creative Studio</h1>
              <p className="text-gray-600">Tell me what you want to create, and I'll suggest the perfect tool</p>
            </div>
          </div>

          {/* AI Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeTask()}
              placeholder="E.g., 'I want to sketch some ideas' or 'I need to write down my thoughts'"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-400 focus:outline-none"
            />
            <button
              onClick={analyzeTask}
              disabled={isAnalyzing || !taskInput.trim()}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Suggest Extension
                </>
              )}
            </button>
          </div>

          {/* AI Suggestion */}
          {suggestion && (
            <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="bg-purple-500 text-white p-2 rounded-lg">
                    {React.createElement(suggestion.icon, { size: 24 })}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{suggestion.name}</h3>
                    <p className="text-gray-600 text-sm">{suggestion.description}</p>
                    <p className="text-purple-600 text-sm mt-1">✨ Perfect for: "{taskInput}"</p>
                  </div>
                </div>
                <button
                  onClick={() => installExtension(suggestion)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add to Studio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Installed Extensions */}
        {installedExtensions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Sparkles className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">Your Creative Studio is Empty</h2>
            <p className="text-gray-500">Tell me what you want to create above, and I'll suggest the right tools for you!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {installedExtensions.map(ext => (
              <div key={ext.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-400 to-blue-400 text-white p-2 rounded-lg">
                      {React.createElement(ext.icon, { size: 24 })}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{ext.name}</h3>
                  </div>
                  <button
                    onClick={() => removeExtension(ext.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="border-t pt-4">
                  {React.createElement(ext.component)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
