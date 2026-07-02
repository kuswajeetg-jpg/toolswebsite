"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Download, Loader2, Plus, Trash2, Printer, Image as ImageIcon } from "lucide-react";
import { useToastError } from "@/lib/toast";
import { PersonalInfo, Experience, Education, DesignSettings, TemplateType } from "./types";
import { ModernTemplate, ClassicTemplate, GovernmentTemplate, AtsTemplate, TeacherTemplate, CorporateTemplate, MinimalTemplate, ExecutiveTemplate, FresherTemplate, CreativeTemplate, AcademicTemplate } from "./Templates";
import ImageCropper from "./ImageCropper";

export default function ResumeBuilderPage() {
  const [personal, setPersonal] = useState<PersonalInfo>({
    name: "", jobTitle: "", email: "", phone: "", location: "", fullAddress: "", website: "", linkedin: "", github: "", summary: "", photo: "", signature: ""
  });

  const [experience, setExperience] = useState<Experience[]>([
    { id: 1, jobTitle: "", organization: "", location: "", startDate: "", endDate: "", currentlyWorking: false, description: "" }
  ]);

  const [education, setEducation] = useState<Education[]>([
    { id: 1, degree: "", institution: "", location: "", startDate: "", endDate: "", gpa: "" }
  ]);

  const [skills, setSkills] = useState("");
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    themeColor: "#1e293b", // Slate 800
    fontFamily: "sans",
    backgroundColor: "#ffffff",
  });

  const [cropModal, setCropModal] = useState<{ isOpen: boolean, imageSrc: string, field: "photo" | "signature", aspect?: number }>({
    isOpen: false, imageSrc: "", field: "photo"
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const onError = useToastError();

  useEffect(() => {
    const saved = localStorage.getItem("resume-builder-data-v2");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.personal) setPersonal({ ...personal, ...data.personal });
        if (data.experience) setExperience(data.experience);
        if (data.education) setEducation(data.education);
        if (data.skills) setSkills(data.skills);
        if (data.template) setTemplate(data.template);
        if (data.designSettings) setDesignSettings(data.designSettings);
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    const data = { personal, experience, education, skills, template, designSettings };
    localStorage.setItem("resume-builder-data-v2", JSON.stringify(data));
  }, [personal, experience, education, skills, template, designSettings]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetWidth = 794;
        const newScale = Math.min((containerWidth - 40) / targetWidth, 1);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "photo" | "signature") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onError("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropModal({
          isOpen: true,
          imageSrc: reader.result as string,
          field,
          aspect: field === "photo" ? 1 : 2.5 // Photo is 1:1, signature is wide
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input value so same file can be selected again if canceled
    e.target.value = "";
  };

  const handleCropComplete = (croppedBase64: string) => {
    setPersonal(prev => ({ ...prev, [cropModal.field]: croppedBase64 }));
    setCropModal({ isOpen: false, imageSrc: "", field: "photo" });
  };

  const loadSampleData = () => {
    setPersonal({
      name: "Kuswajeet Kumar Gupta", jobTitle: "Computer Operator Grade B", email: "kuswajeet@gmail.com", phone: "+918887633137", location: "Mainpuri, UP", fullAddress: "Police Office\nMainpuri, Uttar Pradesh, 205001", website: "www.kkginfotech.com", linkedin: "", github: "", summary: "Dedicated computer operator with over 10 years of experience in managing official records and processing data for the Uttar Pradesh Police.", photo: "", signature: ""
    });
    setExperience([{
      id: 1, jobTitle: "Computer Operator Grade B", organization: "Uttar Pradesh Police", location: "Mainpuri", startDate: "14-10-2014", endDate: "Present", currentlyWorking: true, description: "Managing office correspondence, data entry, and official reports.\nCoordinating with senior officials for daily briefings."
    }]);
    setEducation([{
      id: 1, degree: "B.Tech Computer Science", institution: "Integral University Lucknow", location: "", startDate: "2008", endDate: "2012", gpa: "78%"
    }]);
    setSkills("Java, .NET, Python, Data Entry, MS Office");
  };

  const generatePdf = async () => {
    if (!personal.name) {
      onError("Please enter your name");
      return;
    }
    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const element = previewRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: designSettings.backgroundColor });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${personal.name.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (error) {
      onError("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPng = async () => {
    if (!personal.name) {
      onError("Please enter your name");
      return;
    }
    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = previewRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: designSettings.backgroundColor });
      const link = document.createElement("a");
      link.download = `${personal.name.replace(/\s+/g, "_")}_Resume.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      onError("Failed to generate PNG");
    } finally {
      setIsGenerating(false);
    }
  };

  const printResume = () => {
    const printContent = previewRef.current;
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html><html><head><title>Print Resume</title>
        <style>
          body { margin: 0; padding: 0; }
          @media print { @page { size: A4; margin: 0; } }
        </style>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head><body>${printContent.outerHTML}
        <script>window.onload = function() { window.print(); window.close(); }</script></body></html>
      `);
      printWindow.document.close();
    }
  };

  const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);
  const commonProps = { personal, experience, education, skills: skillList, settings: designSettings };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      {cropModal.isOpen && (
        <ImageCropper 
          imageSrc={cropModal.imageSrc} 
          aspectRatio={cropModal.aspect} 
          onClose={() => setCropModal({ isOpen: false, imageSrc: "", field: "photo" })} 
          onCropComplete={handleCropComplete} 
        />
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
        <p className="text-gray-600">Create professional resumes tailored for modern, corporate, or government jobs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM PANEL */}
        <div className="lg:col-span-5 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Template Style</h2>
              <button onClick={loadSampleData} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition font-medium">Load Sample Data</button>
            </div>
            <select value={template} onChange={(e) => setTemplate(e.target.value as TemplateType)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="modern">Modern Professional</option>
              <option value="classic">Classic Corporate</option>
              <option value="ats">Minimal ATS Friendly</option>
              <option value="government">Government Official (Bio-Data)</option>
              <option value="executive">Executive Impact</option>
              <option value="fresher">Fresher / Graduate</option>
              <option value="creative">Creative / Design</option>
              <option value="academic">Academic / Teacher</option>
            </select>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Design Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Theme Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={designSettings.themeColor} onChange={(e) => setDesignSettings({ ...designSettings, themeColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm text-gray-600 uppercase font-mono">{designSettings.themeColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={designSettings.backgroundColor} onChange={(e) => setDesignSettings({ ...designSettings, backgroundColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  <span className="text-sm text-gray-600 uppercase font-mono">{designSettings.backgroundColor}</span>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
                <select value={designSettings.fontFamily} onChange={(e) => setDesignSettings({ ...designSettings, fontFamily: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="sans">Modern (Sans-Serif)</option>
                  <option value="serif">Classic (Serif)</option>
                  <option value="mono">Technical (Monospace)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Upload Photo</label>
                <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                  {personal.photo ? <img src={personal.photo} className="h-full object-contain" /> : <span className="flex items-center space-x-2 text-gray-500"><ImageIcon className="w-6 h-6"/><span>Select Photo</span></span>}
                  <input type="file" name="photo" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "photo")} />
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Upload Signature</label>
                <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                  {personal.signature ? <img src={personal.signature} className="h-full object-contain" /> : <span className="flex items-center space-x-2 text-gray-500"><FileText className="w-6 h-6"/><span>Select Signature</span></span>}
                  <input type="file" name="signature" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "signature")} />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <input type="text" placeholder="Full Name *" value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Job Title / Designation" value={personal.jobTitle} onChange={(e) => setPersonal({ ...personal, jobTitle: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <input type="email" placeholder="Email Address *" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                <input type="tel" placeholder="Phone Number" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <textarea placeholder="Full Postal Address" value={personal.fullAddress} onChange={(e) => setPersonal({ ...personal, fullAddress: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows={2} />
              <textarea placeholder="Professional Summary" value={personal.summary} onChange={(e) => setPersonal({ ...personal, summary: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows={3} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
              <button onClick={() => setExperience([...experience, { id: Date.now(), jobTitle: "", organization: "", location: "", startDate: "", endDate: "", currentlyWorking: false, description: "" }])} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Plus className="h-5 w-5" /></button>
            </div>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50 relative group">
                {experience.length > 1 && <button onClick={() => setExperience(experience.filter(e => e.id !== exp.id))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover:block"><Trash2 className="h-4 w-4" /></button>}
                <input type="text" placeholder="Job Title" value={exp.jobTitle} onChange={(e) => setExperience(experience.map(x => x.id === exp.id ? { ...x, jobTitle: e.target.value } : x))} className="w-full mb-2 px-3 py-1.5 text-sm border border-gray-300 rounded" />
                <input type="text" placeholder="Organization" value={exp.organization} onChange={(e) => setExperience(experience.map(x => x.id === exp.id ? { ...x, organization: e.target.value } : x))} className="w-full mb-2 px-3 py-1.5 text-sm border border-gray-300 rounded" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="text" placeholder="Start (e.g., Jan 2020)" value={exp.startDate} onChange={(e) => setExperience(experience.map(x => x.id === exp.id ? { ...x, startDate: e.target.value } : x))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
                  <input type="text" placeholder="End (e.g., Present)" value={exp.endDate} onChange={(e) => setExperience(experience.map(x => x.id === exp.id ? { ...x, endDate: e.target.value } : x))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
                </div>
                <textarea placeholder="Responsibilities & Achievements (use new lines for bullets)" value={exp.description} onChange={(e) => setExperience(experience.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" rows={3} />
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              <button onClick={() => setEducation([...education, { id: Date.now(), degree: "", institution: "", location: "", startDate: "", endDate: "", gpa: "" }])} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Plus className="h-5 w-5" /></button>
            </div>
            {education.map((edu, idx) => (
              <div key={edu.id} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50 relative group">
                {education.length > 1 && <button onClick={() => setEducation(education.filter(e => e.id !== edu.id))} className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover:block"><Trash2 className="h-4 w-4" /></button>}
                <input type="text" placeholder="Degree (e.g., B.Tech Computer Science)" value={edu.degree} onChange={(e) => setEducation(education.map(x => x.id === edu.id ? { ...x, degree: e.target.value } : x))} className="w-full mb-2 px-3 py-1.5 text-sm border border-gray-300 rounded" />
                <input type="text" placeholder="Institution / University" value={edu.institution} onChange={(e) => setEducation(education.map(x => x.id === edu.id ? { ...x, institution: e.target.value } : x))} className="w-full mb-2 px-3 py-1.5 text-sm border border-gray-300 rounded" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="text" placeholder="Start Year" value={edu.startDate} onChange={(e) => setEducation(education.map(x => x.id === edu.id ? { ...x, startDate: e.target.value } : x))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
                  <input type="text" placeholder="Passing Year" value={edu.endDate} onChange={(e) => setEducation(education.map(x => x.id === edu.id ? { ...x, endDate: e.target.value } : x))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
                </div>
                <input type="text" placeholder="Grade / CGPA" value={edu.gpa} onChange={(e) => setEducation(education.map(x => x.id === edu.id ? { ...x, gpa: e.target.value } : x))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
            <textarea placeholder="Java, Python, Project Management (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows={2} spellCheck={false} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={generatePdf} disabled={isGenerating} className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 text-sm shadow-md">
              {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />} PDF
            </button>
            <button onClick={downloadPng} disabled={isGenerating} className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex justify-center items-center gap-2 text-sm shadow-md">
              {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />} PNG
            </button>
            <button onClick={printResume} className="bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition flex justify-center items-center gap-2 text-sm shadow-md">
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="lg:col-span-7 bg-gray-200 rounded-2xl shadow-inner flex justify-center overflow-hidden py-10 relative" ref={containerRef}>
          <div 
            className="origin-top transition-transform duration-200 ease-in-out shadow-2xl bg-white"
            style={{ 
              transform: `scale(${scale})`, 
              width: "794px",
              height: "1123px",
              backgroundColor: designSettings.backgroundColor
            }}
          >
            {/* The exact container we will capture with html2canvas */}
            <div ref={previewRef} className="w-full h-full overflow-hidden" style={{ width: "210mm", height: "297mm", backgroundColor: designSettings.backgroundColor }}>
              {template === "modern" && <ModernTemplate {...commonProps} />}
              {template === "classic" && <ClassicTemplate {...commonProps} />}
              {template === "ats" && <AtsTemplate {...commonProps} />}
              {template === "government" && <GovernmentTemplate {...commonProps} />}
              {template === "executive" && <ExecutiveTemplate {...commonProps} />}
              {template === "fresher" && <FresherTemplate {...commonProps} />}
              {template === "creative" && <CreativeTemplate {...commonProps} />}
              {template === "academic" && <AcademicTemplate {...commonProps} />}
              {template === "corporate" && <CorporateTemplate {...commonProps} />}
              {template === "teacher" && <TeacherTemplate {...commonProps} />}
              {template === "minimal" && <MinimalTemplate {...commonProps} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}