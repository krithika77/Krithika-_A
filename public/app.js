const urlEl = document.getElementById('url');
const runBtn = document.getElementById('run');
const exportBtn = document.getElementById('export');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

let lastReport = null;

function card(title, innerHtml) {
  const d = document.createElement('div');
  d.className = 'card';
  d.innerHTML = `<div class="title">${title}</div>${innerHtml}`;
  return d;
}

function render(report) {
  resultsEl.innerHTML = '';
  resultsEl.append(
    card('Overall Score', `<div class="score">${report.overallScore}/100</div><div>${report.target}</div><div>${new Date(report.timestamp).toLocaleString()}</div>`),
    card('Lighthouse Scores', `<div>Performance: <b>${report.lighthouse.performance}</b></div>
      <div>SEO: <b>${report.lighthouse.seo}</b></div>
      <div>Accessibility: <b>${report.lighthouse.accessibility}</b></div>
      <div>Best Practices: <b>${report.lighthouse.bestPractices}</b></div>
      <div style="margin-top:6px;opacity:.8">Key metrics: LCP ${report.lighthouse.audits.lcp || '-'}, FCP ${report.lighthouse.audits.fcp || '-'}, TBT ${report.lighthouse.audits.tbt || '-'}, CLS ${report.lighthouse.audits.cls || '-'}</div>`),
    card('Security', `<div>Score: <b>${report.security.score}</b></div>
      <div style="margin-top:6px">Findings:</div>
      <ul class="list">${report.security.findings.map(f => `<li>[${f.type||'issue'}] ${f.issue} – <i>${f.recommendation}</i></li>`).join('') || '<li>No issues found</li>'}</ul>`),
    card('SEO', `<div>Score: <b>${report.seo.score}</b></div>
      <div style="margin-top:6px">Findings:</div>
      <ul class="list">${report.seo.findings.map(f => `<li>${f.issue} – <i>${f.recommendation}</i></li>`).join('') || '<li>No issues found</li>'}</ul>
      <div style="margin-top:6px;opacity:.8">Title: ${report.seo.details.title || '-'}<br>Meta description: ${report.seo.details.metaDesc || '-'}<br>H1 count: ${report.seo.details.h1Count}<br>Images without alt: ${report.seo.details.imgWithoutAlt}<br>Canonical: ${report.seo.details.canonical || '-'}<br>robots.txt: ${report.seo.details.robotsExists?'Yes':'No'} · sitemap.xml: ${report.seo.details.sitemapExists?'Yes':'No'}</div>`)
  );
}

runBtn.addEventListener('click', async () => {
  const url = urlEl.value.trim();
  if (!/^https?:\/\/.+/i.test(url)) {
    statusEl.textContent = 'Please enter a valid URL starting with http(s)://';
    return;
  }
  statusEl.textContent = 'Running audit… this can take ~30–60s for Lighthouse.';
  runBtn.disabled = true;
  exportBtn.disabled = true;
  resultsEl.innerHTML = '';
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    lastReport = data;
    render(data);
    statusEl.textContent = 'Done ✔';
    exportBtn.disabled = false;
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Audit failed: ' + e.message;
  } finally {
    runBtn.disabled = false;
  }
});

exportBtn.addEventListener('click', () => {
  if (!lastReport) return;
  const blob = new Blob([JSON.stringify(lastReport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safe = (lastReport.target || 'report').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
  a.download = `${safe}_audit.json`;
  a.click();
  URL.revokeObjectURL(url);
});
