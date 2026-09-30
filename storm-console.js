(() => {
  'use strict';
  const slider = document.getElementById('timeSlider');
  const label = document.getElementById('timeLabel');
  const cycle = document.getElementById('cycleTime');
  const storm = document.getElementById('stormObject');
  const play = document.getElementById('playBtn');
  const ticks = [...document.querySelectorAll('#ticks button')];
  const route = window.VAYU_REPLAY;
  let timer = null;
  const localKey = 'vayu-demo-session-log-v1';
  const timeLabel = value => value < 0 ? `${Math.abs(value)} min before replay anchor` : value === 0 ? 'Replay anchor' : `${value} min forecast lead`;
  function setStep(index) {
    const item = route[index];
    localStorage.setItem('devlokReplayStep', String(index));
    slider.value = String(index);
    label.innerHTML = `${item.label} <span>· ${item.clock} IST</span>`;
    cycle.textContent = `${item.clock} IST`;
    ticks.forEach((button, i) => {button.classList.toggle('selected', i === index);button.setAttribute('aria-pressed',String(i===index));});
    document.getElementById('timelinePosition').textContent=`STEP ${String(index+1).padStart(2,'0')} / ${route.length} · ${index<4?'REPLAY':index===4?'REPLAY ANCHOR':'FORECAST SCENARIO'}`;
    slider.setAttribute('aria-valuetext',`${item.label}, ${item.clock} IST, ${item.trend}, ${item.dbz} dBZ, simulated scenario`);
    slider.style.setProperty('--timeline-progress',`${index / (route.length - 1) * 100}%`);
    storm.setAttribute('transform', `translate(${item.x} ${item.y})`);
    storm.setAttribute('aria-label', `Storm STORM-042, ${item.intensity.toLowerCase()} at ${item.label}, ${item.lat.toFixed(2)} degrees north, ${item.lon.toFixed(2)} degrees east`);
    const deltaX = item.x, deltaY = item.y;
    const line = document.getElementById('trackLine');
    const base = `M410 292Q490 320 555 382T674 446`;
    line.setAttribute('d', index < 4 ? `M${410 + deltaX} ${292 + deltaY}Q490 320 555 382T674 446` : `M${410 + deltaX} ${292 + deltaY}Q${490 + deltaX} ${320 + deltaY} ${555 + deltaX / 2} ${382 + deltaY / 2}T${674} 446`);
    document.getElementById('stormIntensity').innerHTML = `${item.dbz} <small>dBZ*</small>`;
    document.getElementById('stormSeverity').textContent = item.intensity;
    const selectedStormSeverity = document.querySelector('.triage-item.selected .triage-copy .severity-text');
    if (selectedStormSeverity) selectedStormSeverity.textContent = `· ${item.intensity} / ${item.trend.toUpperCase()}`;
    document.getElementById('stormTrend').textContent = item.trend;
    document.getElementById('stormAge').innerHTML=`${item.age} <small>min*</small>`;
    document.querySelector('.storm-foot>span').textContent = `${item.label === 'NOW' ? 'NOW' : item.label} · ${index > 4 ? 'FORECAST SCENARIO' : 'REPLAY OBJECT'}`;
    const initScore = item.initScore.toFixed(2);
    document.getElementById('initScoreLabel').textContent = initScore;
    document.getElementById('initPathScore').textContent = initScore;
    document.getElementById('initiationLayer').style.opacity = item.initiationVisible ? String(0.45 + item.initScore * 0.75) : '0';
    document.getElementById('initiationLayer').classList.toggle('candidate-active',item.initiationVisible);
    document.getElementById('initiationState').textContent=item.initiationVisible?'CANDIDATE VISIBLE · ILLUSTRATIVE':'CANDIDATE OUTSIDE DISPLAYED WINDOW';
    document.getElementById('evidenceTime').textContent = `${item.clock} IST`;
    document.getElementById('evidenceDbz').textContent = String(item.dbz);
    // A replay/forecast position is an illustrative scenario state, never an observation.
    document.querySelector('.storm-location>span:first-child').textContent = `${item.lat.toFixed(2)}°N, ${item.lon.toFixed(2)}°E*`;
    document.getElementById('stormMap').setAttribute('aria-label', `Schematic simulated map. STORM-042 is ${item.intensity.toLowerCase()} at ${item.label}, ${item.lat.toFixed(2)} degrees north, ${item.lon.toFixed(2)} degrees east. Not geographically calibrated.`);
    document.querySelector('.map-stamp').textContent=`SCHEMATIC · REPLAY ${item.label} · NOT GEOGRAPHICALLY CALIBRATED`;
    document.querySelector('.triage-item.selected .triage-copy>span').textContent=`Existing cell · ${item.trend.toLowerCase()} · scenario position ${item.lat.toFixed(2)}°N ${item.lon.toFixed(2)}°E*`;
    document.querySelector('.triage-item.selected .confidence small').textContent='illustrative · unvalidated';
    document.querySelector('.triage-feedback').textContent=`${item.label} · ${item.trend} · ${item.dbz} dBZ* · ${item.intensity}. Replay fixture only; not a live observation or validated forecast.`;
    document.getElementById('stormObject').setAttribute('aria-pressed','true');
    const inspector=document.getElementById('mapObjectDetail');
    if(inspector){inspector.textContent=`STORM-042 · ${item.label} · ${item.dbz} dBZ* · ${item.lat.toFixed(2)}°N ${item.lon.toFixed(2)}°E* · ${item.trend} · simulated scenario.`;inspector.classList.remove('evidence-refresh');void inspector.offsetWidth;inspector.classList.add('evidence-refresh');}
    document.getElementById('stormObject').classList.add('is-selected');
  }
  slider.addEventListener('input', () => setStep(Number(slider.value)));
  ticks.forEach(button => button.addEventListener('click', () => setStep(Number(button.dataset.step))));
  play.addEventListener('click', () => {
    if (timer) { clearInterval(timer); timer = null; document.body.classList.remove('replay-playing'); play.innerHTML = '<span aria-hidden="true">▶</span> PLAY REPLAY';play.setAttribute('aria-pressed','false'); return; }
    if (Number(slider.value) >= route.length - 1) setStep(0);
    document.body.classList.add('replay-playing'); play.innerHTML = '<span aria-hidden="true">Ⅱ</span> PAUSE REPLAY';play.setAttribute('aria-pressed','true');
    timer = setInterval(() => {
      const next = Number(slider.value) + 1;
      if (next >= route.length) { clearInterval(timer); timer = null; document.body.classList.remove('replay-playing'); play.innerHTML = '<span aria-hidden="true">▶</span> PLAY REPLAY';play.setAttribute('aria-pressed','false'); return; }
      setStep(next);
    }, 1200);
  });
  document.querySelectorAll('.map-tool').forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('active');
    button.setAttribute('aria-pressed',String(button.classList.contains('active')));
    const layer = button.dataset.layer;
    if (layer === 'reflectivity') document.body.classList.toggle('map-layer-off', !button.classList.contains('active'));
    if (layer === 'tracks') document.body.classList.toggle('track-off', !button.classList.contains('active'));
    if (layer === 'initiation') document.body.classList.toggle('init-off', !button.classList.contains('active'));
    if (layer === 'lightning') document.body.classList.toggle('lightning-on', button.classList.contains('active'));
  }));
  const stormObject=document.getElementById('stormObject');
  const inspectStorm=()=>{const open=!stormObject.classList.contains('inspection-open');stormObject.classList.toggle('inspection-open',open);document.getElementById('mapObjectDetail').hidden=!open;stormObject.setAttribute('aria-expanded',String(open));};
  stormObject.addEventListener('click',inspectStorm);
  stormObject.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();inspectStorm();}});
  document.querySelectorAll('[data-disposition]').forEach(button => button.addEventListener('click', () => {
    const entry = { target: button.dataset.target, disposition: button.dataset.disposition, at: new Date().toLocaleString() };
    const records = JSON.parse(localStorage.getItem(localKey) || '[]');
    records.push(entry);
    localStorage.setItem(localKey, JSON.stringify(records));
    document.getElementById('triageFeedback').textContent = `${entry.target} marked ${entry.disposition}. Disposition recorded in this browser session log; a human forecaster remains responsible for action.`;
    document.getElementById('dispositionState').textContent = `${entry.target} · ${entry.disposition}`;
    renderLog();
  }));
  const evidenceDialog = document.getElementById('evidenceDialog');
  const auditDialog = document.getElementById('auditDialog');
  document.getElementById('evidenceOpen').addEventListener('click', () => evidenceDialog.showModal());
  document.getElementById('auditOpen').addEventListener('click', () => { renderLog(); auditDialog.showModal(); });
  function renderLog() {
    const entries = JSON.parse(localStorage.getItem(localKey) || '[]');
    const output = document.getElementById('auditEntries');
    output.innerHTML = entries.length ? entries.map(item => `<div class="log-entry"><time>${escapeHtml(item.at)}</time><strong>${escapeHtml(item.target)} → ${escapeHtml(item.disposition)}</strong></div>`).join('') : '<div class="log-entry"><time>NO ACTIONS</time><strong>Choose WARN, WATCH, or INSUFFICIENT DATA to record a local disposition.</strong></div>';
  }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
  const mapWrap = document.getElementById('mapWrap');
  const fullBtn = document.getElementById('mapExpand');
  fullBtn.addEventListener('click', () => { mapWrap.classList.toggle('map-fullscreen'); fullBtn.textContent = mapWrap.classList.contains('map-fullscreen') ? '×' : '⛶'; });
  document.getElementById('presentationBtn').addEventListener('click', () => document.body.classList.toggle('presentation'));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') mapWrap.classList.remove('map-fullscreen'); });
  const savedValue = localStorage.getItem('devlokReplayStep');
  const savedStep = savedValue === null ? 4 : Number(savedValue);
  setStep(Number.isInteger(savedStep) && savedStep >= 0 && savedStep < route.length ? savedStep : 4);
  renderLog();
})();
