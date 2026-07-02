"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightLeft, MapPin } from "lucide-react";
import { STATE_LAND_DATA, STANDARD_UNITS, getUnitsForLocation } from "@/lib/data/land-units";

export default function LandConverterPage() {
  const t = useTranslations("LandConverter");
  const [selectedState, setSelectedState] = useState<string>("Bihar");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("Bigha");
  const [toUnit, setToUnit] = useState<string>("Square Feet (sq ft)");

  // Get available states
  const states = Object.keys(STATE_LAND_DATA).sort();

  // Get available districts for the selected state
  const districts = useMemo(() => {
    if (!selectedState || !STATE_LAND_DATA[selectedState]?.districts) return [];
    return Object.keys(STATE_LAND_DATA[selectedState].districts).sort();
  }, [selectedState]);

  // Get available units for the selected location
  const availableUnits = useMemo(() => {
    return getUnitsForLocation(selectedState, selectedDistrict);
  }, [selectedState, selectedDistrict]);

  const unitNames = Object.keys(availableUnits);

  // Auto-select valid units if current selection becomes invalid
  useMemo(() => {
    if (!unitNames.includes(fromUnit)) setFromUnit(unitNames[0] || "");
    if (!unitNames.includes(toUnit)) setToUnit(unitNames[1] || unitNames[0] || "");
  }, [availableUnits, fromUnit, toUnit, unitNames]);

  // Handle conversion
  const conversionResult = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || !fromUnit || !toUnit || !availableUnits[fromUnit] || !availableUnits[toUnit]) return null;

    // Convert fromUnit to SqFt, then from SqFt to toUnit
    const fromSqFt = availableUnits[fromUnit];
    const toSqFt = availableUnits[toUnit];
    const result = (val * fromSqFt) / toSqFt;

    return {
      value: result,
      fromSqFt,
      toSqFt
    };
  }, [inputValue, fromUnit, toUnit, availableUnits]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <MapPin className="text-blue-600 h-5 w-5" />
          <h2 className="text-lg font-semibold text-gray-800">{t("select_location")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("state")}</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict(""); // Reset district
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("district")}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50"
              disabled={districts.length === 0}
            >
              <option value="">{t("general_state_average")}</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <ArrowRightLeft className="text-blue-600 h-5 w-5" />
          <h2 className="text-lg font-semibold text-gray-800">{t("convert_units")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("from")}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="any"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {unitNames.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-center pb-2">
            <button 
              onClick={handleSwap}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              title={t("swap_units") || "Swap units"}
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("to")}</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {unitNames.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {conversionResult && (
          <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-2">{t("result")}</p>
            <div className="text-3xl font-bold text-gray-900 break-all">
              {inputValue} {fromUnit} = <span className="text-blue-600">{conversionResult.value.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span> {toUnit}
            </div>
            <p className="text-sm text-gray-500 mt-4 border-t border-blue-200 pt-3">
              {t("calculation")}: 1 {fromUnit} = {conversionResult.fromSqFt.toLocaleString()} sq ft.<br/>
              Therefore, {inputValue} {fromUnit} × ({conversionResult.fromSqFt} / {conversionResult.toSqFt}) = {conversionResult.value.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toUnit}.
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
        <h3 className="font-semibold text-orange-800 mb-2">{t("disclaimer_title")}</h3>
        <p className="text-orange-700 text-sm">
          {t("disclaimer_text")}
        </p>
      </div>
    </div>
  );
}
