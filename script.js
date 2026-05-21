// =============================================================
// GREAT SALT LAKE SITE, SCRIPT
// Small, dependency-free interactions:
//   1. Copy-letter button on the Take Action section
//   2. Reveal-on-scroll for bar chart fills
//   3. Lake elevation chart (SVG line chart, 1900 to 2026)
// =============================================================

(function () {
  // -----------------------------------------------------------
  // 1. Copy-letter button
  // -----------------------------------------------------------
  const copyBtn = document.getElementById('copyLetterBtn');
  const letterBody = document.getElementById('letterBody');

  if (copyBtn && letterBody) {
    copyBtn.addEventListener('click', function () {
      const text = letterBody.textContent || '';
      const fallback = function () {
        const range = document.createRange();
        range.selectNodeContents(letterBody);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try {
          document.execCommand('copy');
        } catch (_) {}
        sel.removeAllRanges();
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          () => flash(copyBtn, 'Copied!'),
          () => { fallback(); flash(copyBtn, 'Copied!'); }
        );
      } else {
        fallback();
        flash(copyBtn, 'Copied!');
      }
    });
  }

  function flash(btn, msg) {
    const original = btn.textContent;
    btn.textContent = msg;
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = original;
      btn.disabled = false;
    }, 1600);
  }

  // -----------------------------------------------------------
  // 2. Animate bar chart fills when scrolled into view.
  // -----------------------------------------------------------
  const fills = document.querySelectorAll('.bar-row__fill');
  if (fills.length && 'IntersectionObserver' in window) {
    fills.forEach(function (el) {
      el.dataset.targetWidth = el.style.width || '0';
      el.style.width = '0%';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = Array.from(fills).indexOf(el);
          setTimeout(function () {
            el.style.width = el.dataset.targetWidth;
          }, idx * 120);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(function (el) { observer.observe(el); });
  }

  // -----------------------------------------------------------
  // 3. Lake elevation chart
  // Yearly average elevation in feet, USGS Saltair gauge (10010000)
  // -----------------------------------------------------------
  const LAKE_DATA = [[1900,4200.27],[1901,4199.2],[1902,4197.25],[1903,4196.93],[1904,4197.32],[1905,4196.82],[1906,4197.15],[1907,4199.37],[1908,4200.42],[1909,4201.77],[1910,4202.91],[1911,4202.42],[1912,4202.14],[1913,4202.29],[1914,4202.75],[1915,4202.43],[1916,4201.98],[1917,4202.48],[1918,4202.78],[1919,4201.82],[1920,4201.27],[1921,4202.24],[1922,4203.33],[1923,4204.11],[1924,4204.09],[1925,4203.73],[1926,4203.42],[1927,4202.67],[1928,4201.76],[1929,4201.13],[1930,4200.53],[1931,4199.42],[1932,4198.52],[1933,4197.86],[1934,4196.18],[1935,4195.07],[1936,4194.88],[1937,4195.47],[1938,4195.61],[1939,4195.55],[1940,4194.73],[1941,4194.8],[1942,4195.48],[1943,4195.43],[1944,4195.55],[1945,4195.62],[1946,4196.23],[1947,4196.68],[1948,4196.95],[1949,4197.28],[1950,4197.97],[1951,4198.93],[1952,4199.87],[1953,4199.79],[1954,4198.45],[1955,4197.3],[1956,4196.96],[1957,4196.55],[1958,4196.36],[1959,4195.35],[1960,4194.13],[1961,4192.78],[1962,4192.74],[1963,4192.11],[1964,4192.76],[1965,4193.81],[1966,4194.46],[1967,4194.12],[1968,4194.81],[1969,4195.98],[1970,4195.79],[1971,4197.14],[1972,4198.61],[1973,4199.57],[1974,4200.12],[1975,4200.45],[1976,4201.12],[1977,4199.89],[1978,4199.22],[1979,4198.7],[1980,4199.23],[1981,4199.31],[1982,4199.99],[1983,4203.79],[1984,4207.75],[1985,4208.88],[1986,4210.42],[1987,4210.34],[1988,4207.82],[1989,4204.01],[1990,4202.89],[1991,4201.4],[1992,4200.04],[1993,4199.95],[1994,4198.99],[1995,4199.02],[1996,4199.31],[1997,4200.37],[1998,4202.09],[1999,4203.03],[2000,4202.19],[2001,4200.34],[2002,4198.56],[2003,4196.61],[2004,4195.17],[2005,4195.97],[2006,4196.93],[2007,4196.36],[2008,4195.08],[2009,4194.98],[2010,4194.69],[2011,4197.01],[2012,4197.47],[2013,4195.63],[2014,4194.25],[2015,4193.42],[2016,4193.16],[2017,4193.99],[2018,4193.53],[2019,4193.68],[2020,4193.56],[2021,4191.66],[2022,4190.05],[2023,4192.1],[2024,4193.43],[2025,4192.32],[2026,4192.02]];

  function renderLakeChart() {
    const wrap = document.getElementById('lakeChart');
    if (!wrap) return;

    // viewBox: scalable. We render at logical 800 x 320, the SVG will scale to container.
    const VB_W = 800;
    const VB_H = 320;
    const PAD = { top: 24, right: 24, bottom: 36, left: 56 };
    const W = VB_W - PAD.left - PAD.right;
    const H = VB_H - PAD.top - PAD.bottom;

    const data = LAKE_DATA;
    const xMin = data[0][0];
    const xMax = data[data.length - 1][0];
    const yMin = 4188;
    const yMax = 4212;
    const HEALTHY = 4198;

    const xScale = (x) => PAD.left + ((x - xMin) / (xMax - xMin)) * W;
    const yScale = (y) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * H;

    // Build the line path
    let path = '';
    data.forEach(function (d, i) {
      const x = xScale(d[0]);
      const y = yScale(d[1]);
      path += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    });

    // Build a closed area path under the line for the fill
    let area = path + 'L' + xScale(xMax).toFixed(1) + ',' + yScale(yMin).toFixed(1) + ' ';
    area += 'L' + xScale(xMin).toFixed(1) + ',' + yScale(yMin).toFixed(1) + ' Z';

    // Build an area for the "below healthy" danger zone (4188 to 4198)
    const dangerTop = yScale(HEALTHY);
    const dangerBot = yScale(yMin);

    // Year tick labels
    const yearTicks = [1900, 1925, 1950, 1975, 2000, 2026];
    const elevTicks = [4190, 4195, 4200, 4205, 4210];

    // Highlight points: 1986 high, 2022 low, latest
    const highRec = data.find(d => d[0] === 1986);
    const lowRec = data.find(d => d[0] === 2022);
    const latest = data[data.length - 1];

    function pt(d) { return [xScale(d[0]), yScale(d[1])]; }

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" preserveAspectRatio="xMidYMid meet" class="lake-chart__svg">
  <defs>
    <linearGradient id="lakeFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5a98a8" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#5a98a8" stop-opacity="0.05" />
    </linearGradient>
  </defs>

  <!-- danger zone (below healthy threshold) -->
  <rect x="${PAD.left}" y="${dangerTop}" width="${W}" height="${dangerBot - dangerTop}"
        fill="#c45a3a" fill-opacity="0.07" />

  <!-- horizontal grid + elev labels -->
  ${elevTicks.map(function(e){
    const y = yScale(e);
    return `<line x1="${PAD.left}" y1="${y}" x2="${PAD.left+W}" y2="${y}" stroke="#0c2a3a" stroke-opacity="0.07" />
            <text x="${PAD.left-8}" y="${y+4}" text-anchor="end" font-size="11" fill="#6b7a82" font-family="Georgia, serif">${e}</text>`;
  }).join('')}

  <!-- healthy line -->
  <line x1="${PAD.left}" y1="${yScale(HEALTHY)}" x2="${PAD.left+W}" y2="${yScale(HEALTHY)}"
        stroke="#5a7a3a" stroke-width="1.5" stroke-dasharray="5,4" />
  <text x="${PAD.left+W-8}" y="${yScale(HEALTHY)-6}" text-anchor="end" font-size="11" fill="#3a5520" font-weight="700" font-family="Georgia, serif">
    Minimum healthy: 4,198 ft
  </text>

  <!-- year tick labels + ticks -->
  ${yearTicks.map(function(yr){
    const x = xScale(yr);
    return `<line x1="${x}" y1="${PAD.top+H}" x2="${x}" y2="${PAD.top+H+5}" stroke="#0c2a3a" stroke-opacity="0.25" />
            <text x="${x}" y="${PAD.top+H+18}" text-anchor="middle" font-size="11" fill="#6b7a82" font-family="Georgia, serif">${yr}</text>`;
  }).join('')}

  <!-- area fill -->
  <path d="${area}" fill="url(#lakeFill)" />

  <!-- elevation line -->
  <path d="${path}" fill="none" stroke="#14536a" stroke-width="2" stroke-linejoin="round" />

  <!-- highlight points -->
  <g>
    <circle cx="${pt(highRec)[0]}" cy="${pt(highRec)[1]}" r="5" fill="#14536a" stroke="#faf6ef" stroke-width="2" />
    <text x="${pt(highRec)[0]}" y="${pt(highRec)[1]-12}" text-anchor="middle" font-size="11" font-weight="700" fill="#14536a" font-family="Georgia, serif">
      1986 high: 4,210 ft
    </text>
  </g>
  <g>
    <circle cx="${pt(lowRec)[0]}" cy="${pt(lowRec)[1]}" r="5" fill="#c45a3a" stroke="#faf6ef" stroke-width="2" />
    <text x="${pt(lowRec)[0]-10}" y="${pt(lowRec)[1]+20}" text-anchor="end" font-size="11" font-weight="700" fill="#c45a3a" font-family="Georgia, serif">
      2022 record low: 4,190 ft
    </text>
  </g>
  <g>
    <circle cx="${pt(latest)[0]}" cy="${pt(latest)[1]}" r="5" fill="#c79a4a" stroke="#faf6ef" stroke-width="2" />
    <text x="${pt(latest)[0]+1}" y="${pt(latest)[1]-12}" text-anchor="end" font-size="11" font-weight="700" fill="#8a3a22" font-family="Georgia, serif">
      Today: ${Math.round(latest[1] * 10) / 10} ft
    </text>
  </g>
</svg>
`;
    wrap.innerHTML = svg;
  }

  if (document.getElementById('lakeChart')) {
    renderLakeChart();
  }
})();
