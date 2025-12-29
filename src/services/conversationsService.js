// src/services/conversationsService.js
// Service simple "Repository" pour gérer les conversations dans localStorage.
// Tous les accès/écritures doivent passer par ici.

const STORAGE_KEY = "app_conversations_v1"; // clé localStorage

// Messages initiaux (identiques à ton MessageInput initial)

export const initialBotMessages = [
  {
    role: "bot",
    content: `Bonjour ! Bienvenue à l'Observatoire national du marché du travail.

📊 Quels sont les indicateurs socio-économiques marocains qui vous intéressent ?

**Taux de chômage Femmes en 2013**  
**Taux d’activité 45 ans et plus en 2014**  
**Nombre total de salariés déclarés à la CNSS en 2014**  
**Nombre total de salariés déclarés à la CNSS en 2024**  
**Création d'emplois salariés dans le secteur Transport, selon CNSS en 2016**  
**Part des chômeurs n'ayant jamais travaillé en 2024**  
**Salariés bénéficiaires du programme "Tahfiz" selon la taille de l'entreprise (51 - 100) en 2019**  
**Répartition des entreprises bénéficiaires du CI en 2022 selon la région Casablanca-Settat**`,
    createdAt: new Date().toISOString()
  }
];



function _loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("conversationsService load error", e);
    return [];
  }
}

function _saveRaw(convs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch (e) {
    console.error("conversationsService save error", e);
  }
}

// Retourne toutes les conversations (nouveau en premier)
export function loadConversations() {
  const convs = _loadRaw();
  // option : trier par updatedAt desc
  convs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return convs;
}

// Crée une conversation et la persiste.
// messages par défaut = initialBotMessages (accueil)
export function createConversation({ title = null, messages = initialBotMessages } = {}) {
  const now = new Date().toISOString();
  const conv = {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    title,
    messages,
    createdAt: now,
    updatedAt: now,
  };
  const convs = _loadRaw();
  convs.unshift(conv); // mettre en tête
  _saveRaw(convs);
  return conv;
}

// Met à jour les propriétés d'une conversation (partial update)
export function updateConversation(id, updates = {}) {
  const convs = _loadRaw();
  const idx = convs.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const merged = { ...convs[idx], ...updates, updatedAt: new Date().toISOString() };
  convs[idx] = merged;
  _saveRaw(convs);
  return merged;
}

// Remplace entièrement le tableau messages d'une conversation
export function replaceConversationMessages(id, messages) {
  return updateConversation(id, { messages });
}

// Ajoute un message (push) à la conversation
export function appendMessage(id, message) {
  const convs = _loadRaw();
  const idx = convs.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  convs[idx].messages = [...convs[idx].messages, message];
  convs[idx].updatedAt = new Date().toISOString();
  _saveRaw(convs);
  return convs[idx];
}

export function getConversationById(id) {
  const convs = _loadRaw();
  return convs.find((c) => c.id === id) || null;
}

export function deleteConversation(id) {
  const convs = _loadRaw();
  const next = convs.filter((c) => c.id !== id);
  _saveRaw(next);
  return next;
}
