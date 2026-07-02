import React from "react";
import { PersonalInfo, Experience, Education, DesignSettings } from "./types";

interface TemplateProps {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  settings: DesignSettings;
}

const getFontClass = (fontFamily: string) => {
  switch (fontFamily) {
    case "serif": return "font-serif";
    case "mono": return "font-mono";
    default: return "font-sans";
  }
};

export function ModernTemplate({ personal, experience, education, skills, settings }: TemplateProps) {
  const validExperience = experience.filter((e) => e.jobTitle || e.organization);
  const validEducation = education.filter((e) => e.degree || e.institution);
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`flex text-gray-800 ${fontClass}`} style={{ backgroundColor: settings.backgroundColor, minHeight: "297mm", width: "210mm", margin: "0 auto", boxSizing: "border-box" }}>
      <div className="w-1/3 text-white p-8" style={{ backgroundColor: settings.themeColor }}>
        {personal.photo && (
          <div className="mb-6 flex justify-center">
            <img src={personal.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white/30" />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2 leading-tight tracking-wide">{personal.name || "Your Name"}</h1>
        <p className="text-white/80 mb-8 font-medium tracking-wider uppercase text-sm">{personal.jobTitle}</p>
        
        <div className="mb-8">
          <h2 className="text-white font-bold border-b border-white/30 pb-2 mb-4 uppercase tracking-widest text-sm">Contact</h2>
          {personal.email && <p className="text-sm mb-2 break-all">{personal.email}</p>}
          {personal.phone && <p className="text-sm mb-2">{personal.phone}</p>}
          {personal.location && <p className="text-sm mb-2">{personal.location}</p>}
          {personal.fullAddress && <div className="text-sm mb-2 flex"><span className="whitespace-pre-line">{personal.fullAddress}</span></div>}
          {personal.linkedin && <p className="text-sm mb-2 break-all">{personal.linkedin}</p>}
        </div>

        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold border-b border-white/30 pb-2 mb-4 uppercase tracking-widest text-sm">Skills</h2>
            <div className="flex flex-col gap-2">
              {skills.map((s, i) => (
                <div key={i} className="text-sm bg-black/20 px-3 py-1 rounded">{s}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-2/3 p-10 relative">
        {personal.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-widest" style={{ color: settings.themeColor, borderColor: settings.themeColor }}>Profile</h2>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {validExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 pb-2 mb-4 uppercase tracking-widest" style={{ color: settings.themeColor, borderColor: settings.themeColor }}>Experience</h2>
            {validExperience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: `${settings.themeColor}20`, color: settings.themeColor }}>{exp.startDate} - {exp.endDate || "Present"}</span>
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-2">{exp.organization}</p>
                {exp.description && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {validEducation.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 pb-2 mb-4 uppercase tracking-widest" style={{ color: settings.themeColor, borderColor: settings.themeColor }}>Education</h2>
            {validEducation.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                  <span className="text-xs font-bold text-gray-500">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-gray-600 text-sm font-semibold">{edu.institution}</p>
                {edu.gpa && <p className="text-sm text-gray-600 mt-1">Grade: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {personal.signature && (
          <div className="absolute bottom-10 right-10 flex flex-col items-center">
            <img src={personal.signature} alt="Signature" className="h-16 object-contain mb-1" />
            <div className="border-t border-gray-400 w-full text-center pt-1 text-xs text-gray-500 uppercase tracking-widest">Signature</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClassicTemplate({ personal, experience, education, skills, settings }: TemplateProps) {
  const validExperience = experience.filter((e) => e.jobTitle || e.organization);
  const validEducation = education.filter((e) => e.degree || e.institution);
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`p-12 text-gray-900 ${fontClass}`} style={{ backgroundColor: settings.backgroundColor, width: "210mm", minHeight: "297mm", margin: "0 auto", boxSizing: "border-box" }}>
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wider" style={{ color: settings.themeColor }}>{personal.name || "Your Name"}</h1>
        <p className="text-lg text-gray-600 mb-4 italic">{personal.jobTitle}</p>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
        </div>
        {personal.fullAddress && <p className="text-sm text-gray-600 mt-1">{personal.fullAddress}</p>}
      </div>

      <hr className="border-t-2 mb-6" style={{ borderColor: settings.themeColor }} />

      {personal.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase border-b pb-1" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}50` }}>Professional Summary</h2>
          <p className="text-sm leading-relaxed text-justify">{personal.summary}</p>
        </div>
      )}

      {validExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase border-b pb-1" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}50` }}>Work Experience</h2>
          {validExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-md">{exp.jobTitle}</h3>
                <span className="text-sm font-semibold text-gray-600">{exp.startDate} – {exp.endDate || "Present"}</span>
              </div>
              <p className="text-gray-700 text-sm font-medium italic mb-2">{exp.organization}</p>
              {exp.description && <p className="text-sm leading-relaxed whitespace-pre-line text-justify pl-4 border-l-2" style={{ borderColor: settings.themeColor }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {validEducation.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase border-b pb-1" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}50` }}>Education</h2>
          {validEducation.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-md">{edu.degree}</h3>
                <span className="text-sm text-gray-600">{edu.startDate} – {edu.endDate}</span>
              </div>
              <p className="text-gray-700 text-sm">{edu.institution}</p>
              {edu.gpa && <p className="text-sm text-gray-600">GPA/Grade: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase border-b pb-1" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}50` }}>Skills & Competencies</h2>
          <p className="text-sm leading-relaxed">{skills.join(" • ")}</p>
        </div>
      )}
    </div>
  );
}

export function GovernmentTemplate({ personal, experience, education, skills, settings }: TemplateProps) {
  const validExperience = experience.filter((e) => e.jobTitle || e.organization);
  const validEducation = education.filter((e) => e.degree || e.institution);
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`p-12 text-black ${fontClass} relative`} style={{ backgroundColor: settings.backgroundColor, width: "210mm", minHeight: "297mm", margin: "0 auto", boxSizing: "border-box" }}>
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold uppercase underline mb-4 leading-snug">Curriculum Vitae / Bio-Data</h1>
          <table className="w-full text-sm mt-4">
            <tbody>
              <tr><td className="w-1/3 font-bold py-1 align-top">Name</td><td className="align-top py-1"><div className="flex"><span className="mr-2">:</span><span className="flex-1">{personal.name?.toUpperCase() || "YOUR NAME"}</span></div></td></tr>
              <tr><td className="w-1/3 font-bold py-1 align-top">Designation</td><td className="align-top py-1"><div className="flex"><span className="mr-2">:</span><span className="flex-1">{personal.jobTitle}</span></div></td></tr>
              <tr><td className="w-1/3 font-bold py-1 align-top">Contact No.</td><td className="align-top py-1"><div className="flex"><span className="mr-2">:</span><span className="flex-1">{personal.phone}</span></div></td></tr>
              <tr><td className="w-1/3 font-bold py-1 align-top">Email ID</td><td className="align-top py-1"><div className="flex"><span className="mr-2">:</span><span className="flex-1">{personal.email}</span></div></td></tr>
              <tr>
                <td className="w-1/3 font-bold py-1 align-top">Address</td>
                <td className="align-top py-1">
                  <div className="flex">
                    <span className="mr-2">:</span>
                    <span className="flex-1 whitespace-pre-line">{personal.fullAddress || personal.location}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {personal.photo ? (
          <div className="w-32 h-40 border-2 border-black ml-6 shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
            <img src={personal.photo} alt="Passport Photo" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-32 h-40 border-2 border-black ml-6 shrink-0 flex items-center justify-center text-xs text-center text-gray-500 bg-gray-50">
            Affix Recent<br/>Passport Size<br/>Photograph
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-base font-bold bg-gray-200 py-1 px-2 border border-black mb-3 uppercase">1. Objective / Summary</h2>
        <p className="text-sm px-2 text-justify">{personal.summary}</p>
      </div>

      {validEducation.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold bg-gray-200 py-1 px-2 border border-black mb-3 uppercase">2. Educational Qualifications</h2>
          <table className="w-full text-sm border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black py-2 px-2 text-left">Examination / Degree</th>
                <th className="border border-black py-2 px-2 text-left">Board / University</th>
                <th className="border border-black py-2 px-2 text-center">Passing Year</th>
                <th className="border border-black py-2 px-2 text-center">Division/Grade</th>
              </tr>
            </thead>
            <tbody>
              {validEducation.map((edu) => (
                <tr key={edu.id}>
                  <td className="border border-black py-2 px-2">{edu.degree}</td>
                  <td className="border border-black py-2 px-2">{edu.institution}</td>
                  <td className="border border-black py-2 px-2 text-center">{edu.endDate}</td>
                  <td className="border border-black py-2 px-2 text-center">{edu.gpa || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {validExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold bg-gray-200 py-1 px-2 border border-black mb-3 uppercase">3. Service Record / Work Experience</h2>
          {validExperience.map((exp, i) => (
            <div key={exp.id} className="px-2 mb-3">
              <p className="text-sm font-bold">{i + 1}. {exp.organization}</p>
              <table className="w-full text-sm mt-1 ml-4">
                <tbody>
                  <tr><td className="w-32 py-0.5 align-top">Designation</td><td className="align-top py-0.5"><div className="flex"><span className="mr-2">:</span><span className="flex-1">{exp.jobTitle}</span></div></td></tr>
                  <tr><td className="w-32 py-0.5 align-top">Period</td><td className="align-top py-0.5"><div className="flex"><span className="mr-2">:</span><span className="flex-1">{exp.startDate} to {exp.endDate || "Till Date"}</span></div></td></tr>
                  {exp.description && (
                    <tr>
                      <td className="w-32 py-0.5 align-top">Nature of Duties</td>
                      <td className="align-top py-0.5">
                        <div className="flex">
                          <span className="mr-2">:</span>
                          <span className="flex-1 whitespace-pre-line">{exp.description}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold bg-gray-200 py-1 px-2 border border-black mb-3 uppercase">4. Skills & Extra-Curricular</h2>
          <p className="text-sm px-2">{skills.join(", ")}</p>
        </div>
      )}

      <div className="mt-16 text-sm">
        <p className="mb-12">I hereby declare that the above particulars are true and correct to the best of my knowledge and belief.</p>
        <div className="flex justify-between items-end">
          <div>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Place: {personal.location?.split(',')[0] || "....................."}</p>
          </div>
          <div className="flex flex-col items-center">
            {personal.signature ? (
              <img src={personal.signature} alt="Signature" className="h-16 w-32 object-contain border-b border-black mb-1" />
            ) : (
              <div className="h-16 w-32 border-b border-black mb-1"></div>
            )}
            <p className="font-bold uppercase text-xs">( Signature )</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AtsTemplate({ personal, experience, education, skills, settings }: TemplateProps) {
  const validExperience = experience.filter((e) => e.jobTitle || e.organization);
  const validEducation = education.filter((e) => e.degree || e.institution);
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`p-12 text-black ${fontClass}`} style={{ backgroundColor: settings.backgroundColor, width: "210mm", minHeight: "297mm", margin: "0 auto", boxSizing: "border-box" }}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-1">{personal.name || "YOUR NAME"}</h1>
        <p className="text-sm mb-2">{[personal.phone, personal.email, personal.linkedin].filter(Boolean).join(" | ")}</p>
        <p className="text-sm">{personal.fullAddress || personal.location}</p>
      </div>

      {personal.summary && (
        <div className="mb-6">
          <h2 className="font-bold text-md uppercase border-b-2 border-black pb-1 mb-2">Summary</h2>
          <p className="text-sm">{personal.summary}</p>
        </div>
      )}

      {validExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-md uppercase border-b-2 border-black pb-1 mb-3">Experience</h2>
          {validExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between font-bold text-sm">
                <span>{exp.jobTitle}</span>
                <span>{exp.startDate} - {exp.endDate || "Present"}</span>
              </div>
              <div className="flex justify-between text-sm italic mb-2">
                <span>{exp.organization}</span>
              </div>
              {exp.description && <p className="text-sm pl-4 leading-tight whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {validEducation.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-md uppercase border-b-2 border-black pb-1 mb-3">Education</h2>
          {validEducation.map((edu) => (
            <div key={edu.id} className="mb-3 text-sm">
              <div className="flex justify-between font-bold">
                <span>{edu.degree}</span>
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span>{edu.institution}</span>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="font-bold text-md uppercase border-b-2 border-black pb-1 mb-2">Skills</h2>
          <p className="text-sm leading-relaxed">{skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export function FresherTemplate(props: TemplateProps) {
  const { personal, experience, education, skills, settings } = props;
  const validExperience = experience.filter((e) => e.jobTitle || e.organization);
  const validEducation = education.filter((e) => e.degree || e.institution);
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`p-12 text-gray-800 ${fontClass}`} style={{ backgroundColor: settings.backgroundColor, width: "210mm", minHeight: "297mm", margin: "0 auto", boxSizing: "border-box" }}>
      <div className="flex justify-between items-center mb-8 border-b-4 pb-6" style={{ borderColor: settings.themeColor }}>
        <div>
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: settings.themeColor }}>{personal.name || "Your Name"}</h1>
          <p className="text-xl text-gray-600 font-medium">{personal.jobTitle || "Fresh Graduate"}</p>
        </div>
        {personal.photo && (
          <img src={personal.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 shadow-sm" style={{ borderColor: settings.themeColor }} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color: settings.themeColor }}>Contact</h2>
            <div className="space-y-1 text-sm text-gray-600">
              {personal.phone && <p>{personal.phone}</p>}
              {personal.email && <p className="break-all">{personal.email}</p>}
              {personal.linkedin && <p className="break-all">{personal.linkedin}</p>}
              {personal.fullAddress && <p className="whitespace-pre-line mt-2">{personal.fullAddress}</p>}
            </div>
          </div>
          
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color: settings.themeColor }}>Skills</h2>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {skills.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="col-span-2 space-y-8">
          {personal.summary && (
            <div>
              <h2 className="text-xl font-bold border-b-2 pb-1 mb-3" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}30` }}>Objective</h2>
              <p className="text-sm text-gray-700 leading-relaxed text-justify">{personal.summary}</p>
            </div>
          )}

          {validEducation.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b-2 pb-1 mb-4" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}30` }}>Education</h2>
              {validEducation.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{edu.institution}</span>
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.gpa && <p className="text-sm font-semibold text-gray-700">Grade: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {validExperience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b-2 pb-1 mb-4" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}30` }}>Internships & Projects</h2>
              {validExperience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <span className="text-xs font-semibold text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{exp.organization}</p>
                  {exp.description && <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreativeTemplate(props: TemplateProps) {
  const { personal, experience, education, skills, settings } = props;
  const validExperience = experience.filter((e) => e.jobTitle || e.organization);
  const validEducation = education.filter((e) => e.degree || e.institution);
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`p-0 flex text-gray-800 ${fontClass}`} style={{ backgroundColor: settings.backgroundColor, minHeight: "297mm", width: "210mm", margin: "0 auto", boxSizing: "border-box" }}>
      <div className="w-[35%] p-10 text-white flex flex-col justify-between" style={{ backgroundColor: settings.themeColor }}>
        <div>
          {personal.photo ? (
            <img src={personal.photo} alt="Profile" className="w-32 h-32 rounded-lg object-cover mb-6 border-2 border-white/50 shadow-lg" />
          ) : (
            <div className="w-32 h-32 rounded-lg bg-white/20 mb-6"></div>
          )}
          <h1 className="text-4xl font-black mb-1 uppercase tracking-tight">{personal.name || "Your Name"}</h1>
          <p className="text-lg font-light tracking-widest uppercase mb-10 text-white/80">{personal.jobTitle}</p>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Contact</h2>
              {personal.phone && <p className="text-sm mb-1">{personal.phone}</p>}
              {personal.email && <p className="text-sm mb-1 break-all">{personal.email}</p>}
              {personal.fullAddress && <p className="text-sm whitespace-pre-line mt-2">{personal.fullAddress}</p>}
            </div>
            
            {skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="text-xs border border-white/40 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[65%] p-12 bg-white/50">
        {personal.summary && (
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-4 text-gray-900">About Me<span style={{ color: settings.themeColor }}>.</span></h2>
            <p className="text-sm text-gray-600 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {validExperience.length > 0 && (
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-6 text-gray-900">Experience<span style={{ color: settings.themeColor }}>.</span></h2>
            <div className="space-y-6">
              {validExperience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2" style={{ borderColor: `${settings.themeColor}50` }}>
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: settings.themeColor }}></div>
                  <h3 className="font-bold text-lg text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-sm font-semibold mb-2" style={{ color: settings.themeColor }}>{exp.organization} <span className="text-gray-400 font-normal">| {exp.startDate} - {exp.endDate || "Present"}</span></p>
                  {exp.description && <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {validEducation.length > 0 && (
          <div>
            <h2 className="text-3xl font-black mb-6 text-gray-900">Education<span style={{ color: settings.themeColor }}>.</span></h2>
            <div className="space-y-4">
              {validEducation.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-gray-700">{edu.institution}</p>
                  <p className="text-xs text-gray-500 mt-1">{edu.startDate} - {edu.endDate} {edu.gpa && `| Grade: ${edu.gpa}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Aliasing the rest to prevent duplication while providing structure.
export function AcademicTemplate(props: TemplateProps) { return <ClassicTemplate {...props} />; }
export function TeacherTemplate(props: TemplateProps) { return <ClassicTemplate {...props} />; }
export function CorporateTemplate(props: TemplateProps) { return <ClassicTemplate {...props} />; }
export function MinimalTemplate(props: TemplateProps) { return <AtsTemplate {...props} />; }
export function ExecutiveTemplate(props: TemplateProps) { return <ModernTemplate {...props} />; }
