"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Download, Plus, Trash2, Building2, User, FileDigit, Calendar as CalendarIcon, FilePenLine } from "lucide-react";
import { useToastError } from "@/lib/toast";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  const [invoiceData, setInvoiceData] = useState({
    from: "",
    to: "",
    invoiceNumber: "INV-" + Date.now().toString().slice(-6),
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    notes: "",
    taxRate: 10,
    currency: "$"
  });
  const [items, setItems] = useState<LineItem[]>([{ id: 1, description: "", quantity: 1, rate: 0 }]);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onError = useToastError();

  useEffect(() => {
    return () => {
      if (invoiceUrl) URL.revokeObjectURL(invoiceUrl);
    };
  }, [invoiceUrl]);
  
  // Auto-generate invoice when data changes, if we have enough data
  useEffect(() => {
      if (invoiceData.from && invoiceData.to) {
          generateInvoice();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData, items]);

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + tax;

  const generateInvoice = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High resolution canvas for sharp rendering
    const scale = 2;
    canvas.width = 800 * scale;
    canvas.height = 1130 * scale; // A4 aspect ratio

    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 1130);
    
    // Header Banner
    ctx.fillStyle = "#1e3a8a"; // Deep blue
    ctx.fillRect(0, 0, 800, 160);

    // Invoice Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px 'Inter', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("INVOICE", 60, 90);
    
    ctx.font = "16px 'Inter', Arial, sans-serif";
    ctx.fillStyle = "#bfdbfe";
    ctx.fillText(`#${invoiceData.invoiceNumber}`, 60, 120);

    // Date Info
    ctx.textAlign = "right";
    ctx.font = "14px 'Inter', Arial, sans-serif";
    ctx.fillStyle = "#bfdbfe";
    ctx.fillText("Date of Issue", 740, 70);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Inter', Arial, sans-serif";
    ctx.fillText(invoiceData.date, 740, 90);
    
    if (invoiceData.dueDate) {
        ctx.font = "14px 'Inter', Arial, sans-serif";
        ctx.fillStyle = "#bfdbfe";
        ctx.fillText("Due Date", 740, 120);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px 'Inter', Arial, sans-serif";
        ctx.fillText(invoiceData.dueDate, 740, 140);
    }

    // From / To Section
    ctx.textAlign = "left";
    
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px 'Inter', Arial, sans-serif";
    ctx.fillText("BILLED FROM:", 60, 220);
    
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px 'Inter', Arial, sans-serif";
    const fromLines = invoiceData.from ? invoiceData.from.split('\n') : ["Your Company Name"];
    ctx.fillText(fromLines[0], 60, 245);
    ctx.font = "14px 'Inter', Arial, sans-serif";
    ctx.fillStyle = "#475569";
    fromLines.slice(1).forEach((line, i) => {
        ctx.fillText(line, 60, 265 + (i * 20));
    });

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px 'Inter', Arial, sans-serif";
    ctx.fillText("BILLED TO:", 450, 220);
    
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px 'Inter', Arial, sans-serif";
    const toLines = invoiceData.to ? invoiceData.to.split('\n') : ["Client Name"];
    ctx.fillText(toLines[0], 450, 245);
    ctx.font = "14px 'Inter', Arial, sans-serif";
    ctx.fillStyle = "#475569";
    toLines.slice(1).forEach((line, i) => {
        ctx.fillText(line, 450, 265 + (i * 20));
    });

    // Table Header
    const tableStartY = Math.max(
        265 + (fromLines.length * 20),
        265 + (toLines.length * 20)
    ) + 40;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(60, tableStartY, 680, 45);
    
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px 'Inter', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ITEM DESCRIPTION", 80, tableStartY + 28);
    ctx.textAlign = "center";
    ctx.fillText("QTY", 520, tableStartY + 28);
    ctx.textAlign = "right";
    ctx.fillText("RATE", 620, tableStartY + 28);
    ctx.fillText("AMOUNT", 720, tableStartY + 28);

    // Table Items
    let yPos = tableStartY + 70;
    ctx.font = "14px 'Inter', Arial, sans-serif";
    
    items.forEach(item => {
      // Background for alternate rows can be added here
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "left";
      ctx.fillText(item.description || "Item description", 80, yPos);
      ctx.textAlign = "center";
      ctx.fillStyle = "#475569";
      ctx.fillText(item.quantity.toString(), 520, yPos);
      ctx.textAlign = "right";
      ctx.fillText(`${invoiceData.currency}${item.rate.toFixed(2)}`, 620, yPos);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px 'Inter', Arial, sans-serif";
      ctx.fillText(`${invoiceData.currency}${(item.quantity * item.rate).toFixed(2)}`, 720, yPos);
      
      // Line under row
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, yPos + 20);
      ctx.lineTo(740, yPos + 20);
      ctx.stroke();
      
      yPos += 45;
      ctx.font = "14px 'Inter', Arial, sans-serif";
    });

    // Summary Section
    yPos += 20;
    
    // Notes block on the left
    if (invoiceData.notes) {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(60, yPos, 350, 100);
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 12px 'Inter', Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("NOTES / TERMS:", 80, yPos + 25);
      
      ctx.fillStyle = "#475569";
      ctx.font = "12px 'Inter', Arial, sans-serif";
      const notesLines = invoiceData.notes.split('\n');
      notesLines.forEach((line, i) => {
          if (i < 4) { // limit to 4 lines
            ctx.fillText(line, 80, yPos + 45 + (i * 15));
          }
      });
    }

    // Totals block on the right
    ctx.textAlign = "right";
    ctx.fillStyle = "#475569";
    ctx.font = "14px 'Inter', Arial, sans-serif";
    ctx.fillText("Subtotal", 620, yPos + 20);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`${invoiceData.currency}${subtotal.toFixed(2)}`, 720, yPos + 20);
    
    ctx.fillStyle = "#475569";
    ctx.fillText(`Tax (${invoiceData.taxRate}%)`, 620, yPos + 45);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`${invoiceData.currency}${tax.toFixed(2)}`, 720, yPos + 45);
    
    ctx.fillStyle = "#eff6ff";
    ctx.fillRect(480, yPos + 60, 260, 50);
    
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 18px 'Inter', Arial, sans-serif";
    ctx.fillText("TOTAL", 620, yPos + 92);
    ctx.font = "bold 22px 'Inter', Arial, sans-serif";
    ctx.fillText(`${invoiceData.currency}${total.toFixed(2)}`, 720, yPos + 92);

    // Footer
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px 'Inter', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Thank you for your business!", 400, 1080);

    setInvoiceUrl(canvas.toDataURL("image/png"));
  };

  const downloadInvoice = () => {
    if (!invoiceUrl) {
        if (!invoiceData.from || !invoiceData.to) {
            onError("Please fill in 'From' and 'To' fields before downloading");
            return;
        }
        generateInvoice(); // Try to generate if not already there
        setTimeout(() => {
            const a = document.createElement("a");
            a.href = canvasRef.current!.toDataURL("image/png");
            a.download = `${invoiceData.invoiceNumber}_invoice.png`;
            a.click();
        }, 100);
        return;
    }
    const a = document.createElement("a");
    a.href = invoiceUrl;
    a.download = `${invoiceData.invoiceNumber}_invoice.png`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" /> Invoice Generator
        </h1>
        <p className="text-gray-600 text-lg">Create, preview, and download professional invoices instantly.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FilePenLine className="h-5 w-5 text-blue-500" /> Invoice Details
            </h2>
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" /> From (Your Business) *
                  </label>
                  <textarea
                    value={invoiceData.from}
                    onChange={(e) => setInvoiceData({ ...invoiceData, from: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                    placeholder="Your Name / Company&#10;123 Main St&#10;City, Country"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" /> To (Client) *
                  </label>
                  <textarea
                    value={invoiceData.to}
                    onChange={(e) => setInvoiceData({ ...invoiceData, to: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                    placeholder="Client Name / Company&#10;456 Client St&#10;City, Country"
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FileDigit className="w-4 h-4 text-gray-400" /> Invoice #
                  </label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" /> Date
                  </label>
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes / Terms</label>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                    placeholder="Payment terms, bank details, or thank you note."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                    <input
                      type="text"
                      value={invoiceData.currency}
                      onChange={(e) => setInvoiceData({ ...invoiceData, currency: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Line Items</h2>
            <div className="space-y-4">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-2 pb-2 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
              </div>
              
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 p-4 md:p-2 md:bg-transparent rounded-xl border border-gray-100 md:border-none">
                  <div className="md:col-span-6">
                    <label className="md:hidden text-xs font-semibold text-gray-500 uppercase block mb-1">Description</label>
                    <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="md:hidden text-xs font-semibold text-gray-500 uppercase block mb-1">Qty</label>
                    <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="md:hidden text-xs font-semibold text-gray-500 uppercase block mb-1">Rate</label>
                    <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:text-right"
                    />
                  </div>
                  <div className="md:col-span-1 text-left md:text-right font-bold text-gray-700">
                    <label className="md:hidden text-xs font-semibold text-gray-500 uppercase block mb-1">Amount</label>
                    {invoiceData.currency}{(item.quantity * item.rate).toFixed(2)}
                  </div>
                  <div className="md:col-span-1 text-right">
                    <button
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={addItem}
                className="w-full mt-4 py-4 text-blue-600 bg-blue-50 border border-dashed border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 font-bold transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add New Item
              </button>
            </div>
            
            {/* Totals Preview */}
            <div className="mt-8 flex justify-end">
                <div className="w-full md:w-64 space-y-3 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between text-gray-600 font-medium">
                        <span>Subtotal:</span>
                        <span>{invoiceData.currency}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-medium">
                        <span>Tax ({invoiceData.taxRate}%):</span>
                        <span>{invoiceData.currency}{tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between text-xl font-bold text-gray-900">
                        <span>Total:</span>
                        <span>{invoiceData.currency}{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Preview & Download Section */}
        <div className="xl:col-span-5 bg-gray-50 p-8 rounded-3xl shadow-inner border border-gray-200 flex flex-col h-full sticky top-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex justify-between items-center">
            Live Preview
            <button
                onClick={downloadInvoice}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
            >
                <Download className="w-4 h-4" /> Download PDF
            </button>
          </h2>
          
          <div className="flex-1 w-full bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden relative">
            <canvas ref={canvasRef} className="hidden" />
            {invoiceUrl ? (
                <div className="w-full h-full flex justify-center items-center overflow-auto p-4 bg-gray-200">
                    <img src={invoiceUrl} alt="Invoice Preview" className="max-w-full h-auto object-contain shadow-lg" style={{ maxHeight: '80vh' }} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Ready to Generate</h3>
                    <p className="text-gray-500 max-w-xs">Fill in your business and client details on the left to see the live preview here.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}