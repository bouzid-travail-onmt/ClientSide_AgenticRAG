// src/services/DataPreprocessingService.js
import apiAdmin from "./apiAdmin";

const API_BASE_EXCELS = "/preprocessingexcels";
const API_BASE_REPORTS = "/preprocessingreports";

/**
 * Lance le preprocessing SSE pour les fichiers Excel
 * @returns {Promise<EventSource>} EventSource pour écouter les logs en temps réel
 */
export const startPreprocessingExcels = () => {
  return new Promise((resolve, reject) => {
    try {
      // On utilise la même base URL que apiAdmin
      const eventSource = new EventSource(apiAdmin.defaults.baseURL + API_BASE_EXCELS);

      eventSource.onopen = () => {
        console.log("🚀 SSE Excel connecté");
        resolve(eventSource);
      };

      eventSource.onerror = (err) => {
        console.error("❌ Erreur SSE Excel :", err);
        eventSource.close();
        reject(err);
      };
    } catch (err) {
      console.error("❌ Impossible de lancer SSE Excel :", err);
      reject(err);
    }
  });
};

/**
 * Lance le preprocessing SSE pour les rapports PDF
 * @returns {Promise<EventSource>} EventSource pour écouter les logs en temps réel
 */
export const startPreprocessingReports = () => {
  return new Promise((resolve, reject) => {
    try {
      const eventSource = new EventSource(apiAdmin.defaults.baseURL + API_BASE_REPORTS);

      eventSource.onopen = () => {
        console.log("🚀 SSE Reports connecté");
        resolve(eventSource);
      };

      eventSource.onerror = (err) => {
        console.error("❌ Erreur SSE Reports :", err);
        eventSource.close();
        reject(err);
      };
    } catch (err) {
      console.error("❌ Impossible de lancer SSE Reports :", err);
      reject(err);
    }
  });
};
