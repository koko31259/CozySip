function showReserveModal() {
  if (document.getElementById('cs-rv-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'cs-rv-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;z-index:10000;';
  modal.innerHTML = `
    <div style="background:#fff8f0;padding:40px;border-radius:16px;width:340px;
      box-shadow:0 20px 60px rgba(0,0,0,0.4);font-family:'Segoe UI',sans-serif;">
      <h2 style="color:#2b1509;margin:0 0 20px;text-align:center;font-family:'Playfair Display',serif;">Reserve a Table ☕</h2>
      <label style="font-size:.82rem;color:#666;display:block;margin-bottom:4px;">Full Name *</label>
      <input id="rv-name" type="text" placeholder="Amritpal Singh"
        style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:8px;box-sizing:border-box;margin-bottom:12px;font-size:.95rem;">
      <label style="font-size:.82rem;color:#666;display:block;margin-bottom:4px;">Mobile Number *</label>
      <input id="rv-mobile" type="text" placeholder="9876543210" maxlength="10"
        style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:8px;box-sizing:border-box;margin-bottom:12px;font-size:.95rem;">
      <label style="font-size:.82rem;color:#666;display:block;margin-bottom:4px;">Date *</label>
      <input id="rv-date" type="date"
        style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:8px;box-sizing:border-box;margin-bottom:12px;font-size:.95rem;">
      <label style="font-size:.82rem;color:#666;display:block;margin-bottom:4px;">No. of Guests *</label>
      <input id="rv-guests" type="number" min="1" max="12" placeholder="2"
        style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:8px;box-sizing:border-box;margin-bottom:18px;font-size:.95rem;">
      <div id="rv-error" style="color:#c0392b;font-size:.83rem;margin-bottom:10px;display:none;"></div>
      <div style="display:flex;gap:10px;">
        <button id="rv-cancel" style="flex:1;padding:12px;background:#eee;border:none;border-radius:8px;cursor:pointer;">Cancel</button>
        <button id="rv-submit" style="flex:2;padding:12px;background:#2b1509;color:#f5e6d3;border:none;
          border-radius:8px;cursor:pointer;font-weight:600;">Confirm Reservation</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const lastUser = localStorage.getItem('cozy_last_user');
  if (lastUser) document.getElementById('rv-name').value = lastUser;

  document.getElementById('rv-cancel').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  document.getElementById('rv-submit').addEventListener('click', () => {
    const name   = document.getElementById('rv-name').value.trim();
    const mobile = document.getElementById('rv-mobile').value.trim();
    const date   = document.getElementById('rv-date').value;
    const guests = document.getElementById('rv-guests').value;
    const errEl  = document.getElementById('rv-error');

    if (!name) { errEl.textContent='Enter your full name.'; errEl.style.display='block'; return; }
    if (!/^\d{10}$/.test(mobile)) { errEl.textContent='Mobile must be 10 digits.'; errEl.style.display='block'; return; }
    if (!date) { errEl.textContent='Select a date.'; errEl.style.display='block'; return; }
    const sel = new Date(date), today = new Date(); today.setHours(0,0,0,0);
    if (sel < today) { errEl.textContent='Date cannot be in the past.'; errEl.style.display='block'; return; }
    if (!guests || guests<1 || guests>12) { errEl.textContent='Guests must be 1–12.'; errEl.style.display='block'; return; }

    const rec = { name, mobile, date, guests: Number(guests), bookedAt: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem('cozy_reservations') || '[]');
    all.push(rec);
    localStorage.setItem('cozy_reservations', JSON.stringify(all));

    modal.remove();
    showToast('Table reserved for ' + name + ' on ' + date + '! ☕');
  });
}

function showToast(msg) {
  const old = document.getElementById('cozy-toast'); if (old) old.remove();
  const t = document.createElement('div'); t.id = 'cozy-toast'; t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:28px;right:28px;background:#2b1509;color:#f5e6d3;padding:14px 24px;border-radius:12px;font-size:.9rem;box-shadow:0 8px 30px rgba(0,0,0,.35);z-index:99999;animation:fadeUpT .4s ease;max-width:300px;line-height:1.4;';
  document.body.appendChild(t);
  setTimeout(() => { if (t.isConnected) t.remove(); }, 3500);
}