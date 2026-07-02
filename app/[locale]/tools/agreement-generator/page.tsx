"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { useToastError } from "@/lib/toast";

export default function AgreementGeneratorPage() {
  const [agreementType, setAgreementType] = useState("rental");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [terms, setTerms] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const onError = useToastError();

  const agreementTemplates: Record<string, { title: string; template: string }> = {
    rental: {
      title: "RENTAL AGREEMENT",
      template: `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is made and entered into on {{date}} by and between:

LANDLORD: {{partyA}}
TENANT: {{partyB}}

1. PROPERTY: The Landlord rents to the Tenant the property located at {{additionalInfo}}

2. TERM: The lease term shall commence on the date of signing.

3. RENT: The monthly rent amount and payment terms shall be as agreed upon by both parties.

4. DEPOSIT: Security deposit terms are specified in the agreement.

5. UTILITIES: Tenant shall be responsible for utilities unless otherwise specified.

6. MAINTENANCE: Tenant shall maintain the property in good condition.

7. TERMINATION: Either party may terminate with {{terms}} days notice.

IN WITNESS WHEREOF, the parties have executed this Agreement.

_________________________          ___________________
LANDLORD: {{partyA}}               DATE: {{date}}

_________________________          ___________________
TENANT: {{partyB}}                 DATE: {{date}}
`
    },
    ndas: {
      title: "NON-DISCLOSURE AGREEMENT",
      template: `NON-DISCLOSURE AGREEMENT (NDA)

This Non-Disclosure Agreement ("Agreement") is made on {{date}} between:

DISCLOSING PARTY: {{partyA}}
RECEIVING PARTY: {{partyB}}

1. CONFIDENTIAL INFORMATION: Includes proprietary data, trade secrets, and business information.

2. PURPOSE: Information is disclosed for {{additionalInfo}}.

3. OBLIGATIONS: Receiving Party shall not disclose or use confidential information for {{terms}} years.

4. EXCEPTIONS: Information already public or independently developed is not confidential.

5. RETURN: All confidential materials shall be returned upon request.

6. GOVERNING LAW: This Agreement shall be governed by applicable laws.

This Agreement constitutes the entire understanding between the parties.

_________________________          ___________________
{{partyA}}                        DATE

_________________________          ___________________
{{partyB}}                        DATE
`
    },
    partnership: {
      title: "PARTNERSHIP AGREEMENT",
      template: `PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is made on {{date}} between:

PARTNER A: {{partyA}}
PARTNER B: {{partyB}}

1. BUSINESS PURPOSE: The partnership is formed for {{additionalInfo}}.

2. CAPITAL CONTRIBUTIONS: Each partner shall contribute capital as agreed.

3. PROFIT SHARING: Profits and losses shall be shared as follows: {{terms}}

4. MANAGEMENT: Partners shall have equal management rights unless specified otherwise.

5. DECISIONS: Major decisions require {{terms}} partner consent.

6. DISSOLUTION: Partnership may be dissolved with {{terms}} days notice.

7. TRANSFER: No partner may transfer interest without consent.

IN WITNESS WHEREOF, the parties agree:

_________________________          ___________________
PARTNER A: {{partyA}}               DATE: {{date}}

_________________________          ___________________
PARTNER B: {{partyB}}               DATE: {{date}}
`
    },
    employment: {
      title: "EMPLOYMENT AGREEMENT",
      template: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made on {{date}} between:

EMPLOYER: {{partyA}}
EMPLOYEE: {{partyB}}

1. POSITION: Employee shall serve as {{additionalInfo}}.

2. TERM: Employment commences immediately with {{terms}} probation period.

3. COMPENSATION: Salary and benefits as per company policy.

4. HOURS: Standard working hours as applicable.

5. CONFIDENTIALITY: Employee must maintain confidentiality during and after employment.

6. TERMINATION: Either party may terminate with 30 days notice.

7. GOVERNING LAW: This Agreement is governed by applicable employment laws.

ACCEPTED AND AGREED:

EMPLOYER: _________________________    DATE: {{date}}

EMPLOYEE: _________________________    DATE: {{date}}
`
    }
  };

  const generateAgreement = () => {
    if (!partyA || !partyB) {
      onError("Please enter both party names");
      return;
    }

    const template = agreementTemplates[agreementType].template;
    const text = template
      .replace(/{{partyA}}/g, partyA)
      .replace(/{{partyB}}/g, partyB)
      .replace(/{{date}}/g, date)
      .replace(/{{additionalInfo}}/g, additionalInfo || "[specify details]")
      .replace(/{{terms}}/g, terms || "[specify terms]");

    setGeneratedText(text);
  };

  const copyText = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Agreement Generator</h1>
        <p className="text-gray-600">Generate legal agreements and contracts quickly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Agreement Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Type</label>
              <select
                value={agreementType}
                onChange={(e) => setAgreementType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="rental">Rental Agreement (Lease)</option>
                <option value="ndas">NDA (Non-Disclosure)</option>
                <option value="partnership">Partnership Agreement</option>
                <option value="employment">Employment Agreement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party A (First Party) *</label>
              <input
                type="text"
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Full legal name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party B (Second Party) *</label>
              <input
                type="text"
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Full legal name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Property address / Business purpose / Position, etc."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30 days notice, profit sharing ratio, etc."
                rows={2}
              />
            </div>

            <button
              onClick={generateAgreement}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
            >
              <FileText className="h-5 w-5" /> Generate Agreement
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Generated Agreement</h2>
            {generatedText && (
              <button
                onClick={copyText}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-y-auto max-h-96">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {generatedText || "Fill in the details on the left to generate an agreement."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}