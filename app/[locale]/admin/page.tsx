"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  Copy,
  FileCode,
  LogOut,
  Edit,
  Key,
  X,
  Check,
  ExternalLink,
  AlertCircle,
  Lock as LockIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Tool {
  id: string;
  name: string;
  path: string;
  icon: string;
  desc: string;
  category: string;
  enabled: boolean;
  featured?: boolean;
  componentPath?: string;
}

type EditingTool = Tool & { isEditing: boolean };

import toolConfig from "@/config/tool-config.json";

const availableIcons = [
  "FileUp", "FileImage", "Calculator", "PenTool", "Scissors", "Merge",
  "Zap", "Calendar", "Type", "Image", "FileText", "Shield", "Settings",
  "UploadCloud", "Download", "Loader2", "Globe", "Clock", "Ruler", "DollarSign",
  "CreditCard", "Lock", "Key", "Crop", "Filter", "RefreshCw"
];

const categories = ["PDF Tools", "Image Tools", "Calculators", "Document Generators", "AI Tools", "Developer Tools"];

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, logout, changePassword } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [editingTools, setEditingTools] = useState<Record<string, EditingTool>>({});
  const [newTool, setNewTool] = useState<Omit<Tool, "id">>({
    name: "",
    path: "",
    icon: "FileUp",
    desc: "",
    category: "PDF Tools",
    enabled: true,
    featured: false,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    const savedTools = localStorage.getItem("toolRegistry");
    const jsonTools = toolConfig.tools as Tool[];

    if (savedTools) {
      const parsed = JSON.parse(savedTools) as Tool[];
      const missingTools = jsonTools.filter(jt => !parsed.some(pt => pt.id === jt.id));
      if (missingTools.length > 0) {
        const merged = [...parsed, ...missingTools];
        setTools(merged);
        localStorage.setItem("toolRegistry", JSON.stringify(merged));
      } else {
        setTools(parsed);
      }
    } else {
      setTools(jsonTools);
    }
  }, [isAuthenticated, router]);

  const saveTools = (updatedTools: Tool[]) => {
    setTools(updatedTools);
    localStorage.setItem("toolRegistry", JSON.stringify(updatedTools));
  };

  const toggleVisibility = (id: string) => {
    const updated = tools.map((t) =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    );
    saveTools(updated);
  };

  const removeTool = (id: string) => {
    if (confirm("Are you sure you want to remove this tool?")) {
      const updated = tools.filter((t) => t.id !== id);
      saveTools(updated);
      setEditingTools((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const startEdit = (tool: Tool) => {
    setEditingTools((prev) => ({
      ...prev,
      [tool.id]: { ...tool, isEditing: true },
    }));
  };

  const cancelEdit = (id: string) => {
    setEditingTools((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const saveEdit = (id: string) => {
    const editingTool = editingTools[id];
    if (!editingTool) return;

    const updated = tools.map((t) =>
      t.id === id ? { ...editingTool, isEditing: false } : t
    );
    saveTools(updated);
    cancelEdit(id);
  };

  const updateEditingTool = (id: string, updates: Partial<Tool>) => {
    setEditingTools((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  };

  const addTool = () => {
    if (!newTool.name || !newTool.path || !newTool.desc) return;
    const id = newTool.name.toLowerCase().replace(/\s+/g, "-");
    const exists = tools.some((t) => t.id === id);
    if (exists) {
      alert("Tool already exists!");
      return;
    }
    const updated = [...tools, { ...newTool, id }];
    saveTools(updated);
    setNewTool({
      name: "",
      path: "",
      icon: "FileUp",
      desc: "",
      category: "PDF Tools",
      enabled: true,
      featured: false,
    });
    setShowAddForm(false);
  };

  const resetToDefault = () => {
    if (confirm("Reset to default tools? This will remove all custom tools.")) {
      saveTools(toolConfig.tools as Tool[]);
      setEditingTools({});
    }
  };

  const generateToolConfig = () => {
    return JSON.stringify(
      {
        tools: tools.map((t) => ({
          id: t.id,
          name: t.name,
          path: t.path,
          icon: t.icon,
          desc: t.desc,
          category: t.category,
          enabled: t.enabled,
          featured: t.featured || false,
        })),
      },
      null,
      2
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateToolConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangePassword = () => {
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (changePassword(passwordForm.currentPassword, passwordForm.newPassword)) {
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } else {
      setPasswordError("Current password is incorrect");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-start mb-10">
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard - Tool Manager
            </h1>
          </div>
          <p className="text-gray-600">
            Manage tools: add, edit, remove, hide/unhide from the registry
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            title="Change Password"
          >
            <Key className="h-4 w-4" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Existing Tools ({tools.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <RefreshCw className="h-4 w-4" /> Reset Default
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Add New Tool
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <FileCode className="h-4 w-4" />{" "}
              {showConfig ? "Hide Config" : "Export Config"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Path
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => {
                const isEditing = editingTools[tool.id]?.isEditing;
                const editTool = editingTools[tool.id];

                return (
                  <tr
                    key={tool.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2">
                      {isEditing && editTool ? (
                        <input
                          type="text"
                          value={editTool.name}
                          onChange={(e) =>
                            updateEditingTool(tool.id, { name: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900">
                            {tool.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {tool.desc}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-mono text-sm">
                      {isEditing && editTool ? (
                        <input
                          type="text"
                          value={editTool.path}
                          onChange={(e) =>
                            updateEditingTool(tool.id, { path: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded font-mono text-sm"
                          placeholder="e.g. /tools/new-tool"
                        />
                      ) : (
                        tool.path
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {isEditing && editTool ? (
                        <select
                          value={editTool.category}
                          onChange={(e) =>
                            updateEditingTool(tool.id, { category: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {tool.category}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tool.enabled
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tool.enabled ? "Enabled" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(tool.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => cancelEdit(tool.id)}
                              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(tool)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleVisibility(tool.id)}
                              className={`p-2 rounded-lg transition ${
                                tool.enabled
                                  ? "text-gray-600 hover:bg-gray-200"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={tool.enabled ? "Hide" : "Unhide"}
                            >
                              {tool.enabled ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <a
                              href={tool.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Preview Tool"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => removeTool(tool.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showConfig && (
        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Tool Configuration JSON</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white"
            >
              {copied ? "Copied!" : <> <Copy className="h-4 w-4" /> Copy Config</>}
            </button>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 overflow-x-auto max-h-96">
            <pre className="text-sm text-green-400">
              <code>{generateToolConfig()}</code>
            </pre>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Copy this config and save to{" "}
            <code className="bg-gray-700 px-1 rounded">config/tool-config.json</code>{" "}
            for persistence.
          </p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tool Name *
              </label>
              <input
                type="text"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. PDF to Word"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tool Path *
              </label>
              <input
                type="text"
                value={newTool.path}
                onChange={(e) => setNewTool({ ...newTool, path: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. /tools/pdf-to-word"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={newTool.icon}
                onChange={(e) => setNewTool({ ...newTool, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {availableIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newTool.category}
                onChange={(e) =>
                  setNewTool({ ...newTool, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                value={newTool.desc}
                onChange={(e) => setNewTool({ ...newTool, desc: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the tool"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newTool.featured}
                  onChange={(e) =>
                    setNewTool({ ...newTool, featured: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Featured on Home Page
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={addTool}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Save className="h-4 w-4" /> Save Tool
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter new password (min 6 chars)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{passwordError}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Change Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}