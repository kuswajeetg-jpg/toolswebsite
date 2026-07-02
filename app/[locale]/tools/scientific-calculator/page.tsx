"use client";

import { useState, useEffect } from "react";
import { Calculator, Delete } from "lucide-react";

export default function ScientificCalculatorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isRad, setIsRad] = useState(true);

  // Use a safe math evaluation for the calculator
  const calculate = (expression: string) => {
    try {
      if (!expression) return "";
      
      let exp = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/\^/g, "**");

      // Handle trigonometric functions
      const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
      trigFunctions.forEach(func => {
        const regex = new RegExp(`${func}\\(([^)]+)\\)`, 'g');
        exp = exp.replace(regex, (match, p1) => {
          if (!isRad && !func.startsWith('a')) {
            return `Math.${func}((${p1}) * Math.PI / 180)`;
          } else if (!isRad && func.startsWith('a')) {
             return `(Math.${func}(${p1}) * 180 / Math.PI)`;
          }
          return `Math.${func}(${p1})`;
        });
      });

      // Handle log and ln
      exp = exp.replace(/log\(/g, "Math.log10(");
      exp = exp.replace(/ln\(/g, "Math.log(");
      exp = exp.replace(/√\(/g, "Math.sqrt(");

      // eslint-disable-next-line no-eval
      const res = eval(exp);
      
      if (res === undefined || isNaN(res) || !isFinite(res)) throw new Error("Invalid");
      
      // Format the result to avoid long floating point issues
      return parseFloat(res.toFixed(10)).toString();
    } catch {
      return "Error";
    }
  };

  const handleEqual = () => {
    const res = calculate(input);
    setResult(res);
  };

  const handleClick = (value: string) => {
    if (result === "Error") {
        setInput(value);
        setResult("");
        return;
    }
    if (result && !["+", "-", "×", "÷", "^"].includes(value)) {
        setInput(value);
        setResult("");
    } else if (result) {
        setInput(result + value);
        setResult("");
    } else {
        setInput(prev => prev + value);
    }
  };

  const handleFunction = (funcName: string) => {
     if (result && result !== "Error") {
         setInput(`${funcName}(${result})`);
         setResult("");
     } else {
         setInput(prev => prev + `${funcName}(`);
     }
  };

  const clear = () => {
    setInput("");
    setResult("");
  };

  const backspace = () => {
    if (result) {
      setResult("");
    } else {
      setInput(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Scientific Calculator</h1>
        <p className="text-gray-600 text-lg">Advanced calculator with scientific and trigonometric functions</p>
      </div>
      
      <div className="bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-800 max-w-sm mx-auto overflow-hidden">
        
        {/* Display */}
        <div className="bg-gray-800 p-4 rounded-2xl mb-6 shadow-inner border border-gray-700 h-28 flex flex-col justify-between">
          <div className="text-gray-400 text-right text-sm font-mono overflow-x-auto whitespace-nowrap scrollbar-hide h-6">
            {input || "0"}
          </div>
          <div className="text-white text-right text-4xl font-bold tracking-tight overflow-x-auto whitespace-nowrap scrollbar-hide">
            {result ? (result === "Error" ? <span className="text-red-400">Error</span> : result) : "0"}
          </div>
        </div>
        
        {/* Rad/Deg toggle */}
        <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setIsRad(true)} 
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${isRad ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  RAD
                </button>
                <button 
                  onClick={() => setIsRad(false)} 
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${!isRad ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  DEG
                </button>
            </div>
            <button onClick={backspace} className="text-gray-400 hover:text-white transition-colors p-2">
                <Delete className="w-5 h-5" />
            </button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          
          {/* Row 1 */}
          <button onClick={() => handleFunction("sin")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">sin</button>
          <button onClick={() => handleFunction("cos")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">cos</button>
          <button onClick={() => handleFunction("tan")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">tan</button>
          <button onClick={clear} className="py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold text-sm transition-colors shadow-sm border border-red-500/20">AC</button>
          
          {/* Row 2 */}
          <button onClick={() => handleClick("π")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">π</button>
          <button onClick={() => handleFunction("log")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">log</button>
          <button onClick={() => handleFunction("ln")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">ln</button>
          <button onClick={() => handleClick("÷")} className="py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-colors shadow-sm">÷</button>
          
          {/* Row 3 */}
          <button onClick={() => handleClick("e")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">e</button>
          <button onClick={() => handleClick("^")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">xʸ</button>
          <button onClick={() => handleFunction("√")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">√</button>
          <button onClick={() => handleClick("×")} className="py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-colors shadow-sm">×</button>
          
          {/* Row 4 */}
          <button onClick={() => handleClick("(")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">(</button>
          <button onClick={() => handleClick(")")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">)</button>
          <button onClick={() => handleClick("%")} className="py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors shadow-sm">%</button>
          <button onClick={() => handleClick("-")} className="py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-colors shadow-sm">-</button>
          
          {/* Number Pad */}
          <button onClick={() => handleClick("7")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">7</button>
          <button onClick={() => handleClick("8")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">8</button>
          <button onClick={() => handleClick("9")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">9</button>
          <button onClick={() => handleClick("+")} className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-colors shadow-sm">+</button>
          
          <button onClick={() => handleClick("4")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">4</button>
          <button onClick={() => handleClick("5")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">5</button>
          <button onClick={() => handleClick("6")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">6</button>
          <button onClick={handleEqual} className="py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-xl transition-colors shadow-sm row-span-2">=</button>
          
          <button onClick={() => handleClick("1")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">1</button>
          <button onClick={() => handleClick("2")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">2</button>
          <button onClick={() => handleClick("3")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm">3</button>
          
          <button onClick={() => handleClick("0")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl transition-colors shadow-sm col-span-2">0</button>
          <button onClick={() => handleClick(".")} className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-xl transition-colors shadow-sm">.</button>
          
        </div>
      </div>
    </div>
  );
}