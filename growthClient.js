// growthClient.js
// Single drop-in client for llm-proxy-growth (paste this file and import its functions)

// Project config (your project + keys)
const SUPABASE_URL = 'https://iiolvvdnzrfcffudwocp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpb2x2dmRuenJmY2ZmdWR3b2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjE4MDAsImV4cCI6MjA3MzA5NzgwMH0.2-e8Scn26fqsR11h-g4avH8MWybwLTtcf3fCN9qAgVw';

const FN_URL = `${SUPABASE_URL}/functions/v1/llm-proxy-growth`;
const HDRS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

// Helpers
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// 1) Leaderboard (rank = index+1). Fields: username, best_grade, portfolio_url?
export async function getLeaderboard(limit = 50) {
  const res = await fetch(`${FN_URL}/leaderboard?limit=${limit}`, { headers: HDRS });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 2) Rate a design (send image + optional context/model/prompt)
export async function rateDesign({ file, imageDataUrl, context, model, prompt }) {
  const image = imageDataUrl || (file ? await fileToDataUrl(file) : null);
  if (!image) throw new Error('imageDataUrl or file is required');
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: HDRS,
    body: JSON.stringify({
      context: context || '',
      image,
      model_override: model || undefined,
      prompt_override: prompt || undefined,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { grade, rating_id, request_id, ... }
}

// 3) Claim (username, email, optional portfolioUrl) to reveal full analysis
export async function claimReview({ username, email, portfolioUrl, requestId, ratingId }) {
  const res = await fetch(`${FN_URL}/claim`, {
    method: 'POST',
    headers: HDRS,
    body: JSON.stringify({
      username,
      email,
      request_id: requestId,
      rating_id: ratingId,
      portfolio_url: portfolioUrl || null,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { success: true }
}

// 4) Fetch full analysis after claim
export async function getRating(ratingId) {
  const res = await fetch(`${FN_URL}/rating/${ratingId}`, { headers: HDRS });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { grade, justification, improvements[], model, latency_ms, ... }
}

// 5) End-to-end helper flow you can call from UI
export async function runGrowthFlow({ file, context, username, email, portfolioUrl }) {
  // Rate
  const rated = await rateDesign({ file, context });
  // Claim
  await claimReview({
    username,
    email,
    portfolioUrl,
    requestId: rated.request_id,
    ratingId: rated.rating_id,
  });
  // Rank (simple: re-fetch leaderboard and find user)
  const top = await getLeaderboard(200);
  const idx = top.findIndex(r => (r.username || '').toLowerCase() === String(username).toLowerCase());
  const userRank = idx >= 0 ? (idx + 1) : null;
  // Full analysis
  const full = await getRating(rated.rating_id);
  return { initial: rated, userRank, full };
}

// Error handling utility
export function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 68, 68, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Success message utility
export function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 255, 136, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Add CSS for animations if not already present
if (!document.querySelector('#growthClientStyles')) {
  const style = document.createElement('style');
  style.id = 'growthClientStyles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
