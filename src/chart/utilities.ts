export const hexToRgbA = (hex: string, apha = 0.4) => {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      'rgba(' +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
      ',' +
      apha +
      ')'
    );
  }

  return hex;
};

export const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltip = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);
  const mode = chart.config._config.options.interaction.mode;

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b: any) => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach((title: any) => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = '0';
      tr.style.textAlign = 'left';

      const th = document.createElement('th');
      th.style.borderWidth = '0';
      th.style.fontFamily = 'Inter';
      th.style.fontSize = '11px';
      th.style.lineHeight = '16px';
      th.style.fontWeight = '600';
      th.style.letterSpacing = '0.5px';
      th.style.textTransform = 'uppercase';
      th.setAttribute('colspan', '3');
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body: any, i: any) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.borderColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.borderRadius = '2px';
      span.style.marginRight = '4px';
      span.style.height = '8px';
      span.style.width = '8px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = '0';
      tr.style.fontSize = '12px';
      tr.style.lineHeight = '16px';
      tr.style.letterSpacing = '0px';

      const td = document.createElement('td');
      const td0 = document.createElement('td');
      const td1 = document.createElement('td');

      td.style.borderWidth = '0';

      td0.style.borderWidth = '0';
      td0.style.paddingRight = '10px';
      td0.style.textAlign = 'left';

      td1.style.borderWidth = '0';
      td1.style.textAlign = 'right';

      let label = '';
      let value = '';
      const lines = body[0].split(':');
      if (lines && lines.length > 0) {
        label = lines[0];
        value = lines[1];
      }

      const text = document.createTextNode(label);
      const text1 = document.createTextNode(value);

      td.appendChild(span);
      tr.appendChild(td);

      td0.appendChild(text);
      tr.appendChild(td0);

      td1.appendChild(text1);
      tr.appendChild(td1);

      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const {
    offsetLeft: positionX,
    offsetTop: positionY,
    offsetWidth: canvasWidth,
  } = chart.canvas;
  const { indexAxis } = chart.config.options;
  const { height, top: osTop } = chart.chartArea;
  const totalCol =
    chart.data.datasets.length > 0 ? chart.data.datasets[0].data.length : 0;

  const left =
    indexAxis === 'x'
      ? positionX + tooltip.caretX + 'px'
      : positionX + canvasWidth / 2 + 'px';
  const top =
    indexAxis === 'x'
      ? osTop - 4 - tooltipEl.offsetHeight + 'px'
      : positionY +
        10 +
        tooltip.caretY -
        tooltipEl.offsetHeight -
        height / totalCol +
        'px';

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  // tooltipEl.style.left =
  //   mode === 'index' ? left : positionX + tooltip.caretX + 'px';
  // tooltipEl.style.top =
  //   mode === 'index' ? top : positionY + tooltip.caretY + 'px';
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.padding = '8px 8px';
  tooltipEl.style.color = '#494957';
  tooltipEl.style.backgroundColor = '#FFFFFF';
  tooltipEl.style.borderRadius = '8px';
  tooltipEl.style.boxShadow =
    '0 0.5px 5px 0 rgb(0 0 0 / 6%), 0 0.5px 5px 0 rgb(0 0 0 / 7%), 0 4px 12px 0 rgb(0 0 0 / 9%), 0 4px 12px 0 rgb(0 0 0 / 12%)';
};

export const externalTooltipPie = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const bodyLines = tooltip.body.map((b: any) => b.lines);

    const tableHead = document.createElement('thead');

    const tr = document.createElement('tr');
    tr.style.borderWidth = '0';
    tr.style.textAlign = 'left';

    const th = document.createElement('th');
    th.style.borderWidth = '0';
    th.style.fontFamily = 'Inter';
    th.style.fontSize = '14px';
    th.style.lineHeight = '16px';
    th.style.fontWeight = '600';
    th.setAttribute('colspan', '3');
    const text = document.createTextNode(chart.data.datasets[0].label || '');

    th.appendChild(text);
    tr.appendChild(th);
    tableHead.appendChild(tr);

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body: any, i: any) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.borderRadius = '2px';
      span.style.marginRight = '4px';
      span.style.height = '8px';
      span.style.width = '8px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = '0';
      tr.style.font = '12px';

      const td = document.createElement('td');
      const td0 = document.createElement('td');
      const td1 = document.createElement('td');

      td.style.borderWidth = '0';

      td0.style.borderWidth = '0';
      td0.style.paddingRight = '10px';
      td0.style.textAlign = 'left';

      td1.style.borderWidth = '0';
      td1.style.textAlign = 'right';

      let label = '';
      let value = '';
      const lines = body[0].split(':');
      if (lines && lines.length > 0) {
        label = lines[0];
        value = lines[1];
      }

      const text = document.createTextNode(label);
      const text1 = document.createTextNode(value);

      td.appendChild(span);
      tr.appendChild(td);

      td0.appendChild(text);
      tr.appendChild(td0);

      td1.appendChild(text1);
      tr.appendChild(td1);

      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.padding = '8px 8px';
  tooltipEl.style.color = '#494957';
  tooltipEl.style.backgroundColor = '#FFFFFF';
  tooltipEl.style.borderRadius = '8px';
  tooltipEl.style.boxShadow =
    '0 0.5px 5px 0 rgb(0 0 0 / 6%), 0 0.5px 5px 0 rgb(0 0 0 / 7%), 0 4px 12px 0 rgb(0 0 0 / 9%), 0 4px 12px 0 rgb(0 0 0 / 12%)';
};
