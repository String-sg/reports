// assets/app.js

// Configuration and data will be loaded dynamically
let quarters = [];
let metrics = {};
let teamConfig = {};

// Configuration paths
const CONFIG_PATHS = {
  metrics: 'data/metrics.json',
  teamConfig: 'data/team-config.json',
  teamPhotosDir: 'team/'
};

// Load configuration data
async function loadConfig() {
  try {
    const [metricsResponse, teamResponse] = await Promise.all([
      fetch(CONFIG_PATHS.metrics),
      fetch(CONFIG_PATHS.teamConfig)
    ]);
    
    const metricsData = await metricsResponse.json();
    const teamData = await teamResponse.json();
    
    quarters = metricsData.quarters;
    metrics = metricsData.metrics;
    teamConfig = {
      default: teamData.defaultTeam,
      overrides: teamData.quarterOverrides
    };
    
    return true;
  } catch (error) {
    console.error('Error loading configuration:', error);
    return false;
  }
}

// helper to pull nested props
function get(obj,path){
  return path.split('.').reduce((o,p)=>o&&o[p], obj);
}
// strip non-numeric chars
function parseNumber(str){
  return parseFloat(str.toString().replace(/[^0-9\.]/g,''))||0;
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const configLoaded = await loadConfig();
  if (!configLoaded) {
    console.error('Failed to load configuration. Using fallback data.');
    return;
  }
  
  const sel = document.getElementById('quarter');
  // build dropdown
  quarters.forEach(q=> sel.add(new Option(q,q)));
  sel.addEventListener('change', ()=> render(sel.value));
  sel.value = quarters[0];
  render(sel.value);
});

function render(q){
  const idx  = quarters.indexOf(q),
        prev = quarters[idx+1],
        d    = metrics[q],
        p    = metrics[prev]||{};

  // ---- fill basic metrics ----
  document.querySelectorAll('[data-metric]').forEach(el=>{
    el.textContent = get(d, el.dataset.metric);
  });

  // ---- fill %-changes ----
  document.querySelectorAll('[data-change]').forEach(el=>{
    const key   = el.dataset.change,
          curr  = parseNumber(get(d,key)),
          prevv = parseNumber(get(p,key)),
          pct   = prevv ? ((curr-prevv)/prevv*100).toFixed(1) : 0;
    el.textContent = (pct>=0?'+':'')+pct+'%';
    el.classList.remove('positive','negative');
    el.classList.add(pct>=0?'positive':'negative');
  });

  // ---- team members & avatars ----
  const conf = teamConfig.overrides[q] || teamConfig.default;

  // update the count
  document.querySelector('[data-metric="teamMembers"]').textContent = conf.count;
  // update the breakdown line (make sure you have an element with class="breakdown")
  const bd = document.querySelector('.breakdown');
  if (bd) bd.textContent = conf.breakdown;

  // rebuild avatars
  const avatarGroup = document.querySelector('.avatar-group');
  avatarGroup.innerHTML = '';
  conf.avatars.forEach(file => {
    const img = document.createElement('img');
    img.src       = `${CONFIG_PATHS.teamPhotosDir}${file}`;
    img.className = 'avatar';
    avatarGroup.appendChild(img);
  });
}
