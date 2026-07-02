export interface PersonalInfo {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  fullAddress: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  photo: string;
  signature: string;
}

export interface Experience {
  id: number;
  jobTitle: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: number;
  name: string;
  technology: string;
  description: string;
  link: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
  link: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
}

export interface Language {
  id: number;
  name: string;
  proficiency: string;
}

export interface CustomSectionItem {
  id: number;
  title: string;
  items: string[];
}

export interface DesignSettings {
  themeColor: string;
  fontFamily: string;
  backgroundColor: string;
}

export type TemplateType = "modern" | "classic" | "ats" | "government" | "teacher" | "corporate" | "minimal" | "executive" | "fresher" | "experienced" | "creative" | "academic";
