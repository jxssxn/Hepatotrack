import { GoogleGenAI } from "@google/genai";
import { Patient, Consultation } from '../types';

export const analyzePatientEvolution = async (patient: Patient, consultations: Consultation[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key no configurada. Por favor configure process.env.API_KEY para usar IA.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format data for the model
  const consultationText = consultations.map((c, index) => {
    return `
    Consulta ${index + 1} (${c.date}):
    - Peso: ${c.weight}kg, IMC: ${c.bmi}
    - Hígado (AST/ALT): ${c.ast}/${c.alt} U/L
    - Plaquetas: ${c.platelets}
    - Elastografía (Rigidez): ${c.stiffness} kPa
    - CAP (Grasa): ${c.cap || 'N/A'} dB/m
    `;
  }).join('\n');

  const prompt = `
    Actúa como un médico especialista en hepatología experto e investigador clínico.
    Analiza la evolución del siguiente paciente:
    
    Paciente: ${patient.firstName} ${patient.lastName}
    Diagnóstico: ${patient.diagnosis}
    Edad: ${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} años approx.
    
    Historial de Consultas:
    ${consultationText}

    Por favor, genera un resumen clínico breve (máximo 2 párrafos) enfocado en:
    1. La tendencia de la fibrosis (Rigidez/Elastografía) y la función hepática (AST/ALT).
    2. La correlación con cambios antropométricos (Peso/IMC).
    3. Una conclusión sobre si el paciente está respondiendo al tratamiento o si hay signos de alarma (ej. hipertensión portal sugerida por plaquetas).
    
    Usa lenguaje médico profesional en Español.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Ocurrió un error al intentar conectar con el servicio de IA.";
  }
};