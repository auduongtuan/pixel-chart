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

const externalTooltip = (context: any) => {
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
    if (chart.config.type == 'pie' || chart.config.type == 'doughnut') {
      if (chart.data.datasets[0].label)
        titleLines.push(chart.data.datasets[0].label);
    }
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
      const legendColor = colors.borderColor
        ? colors.borderColor
        : colors.backgroundColor;
      span.style.background = legendColor;
      span.style.borderColor = legendColor;
      span.style.borderWidth = '2px';
      span.style.borderRadius = '2px';
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
      td.style.width = '8px';
      td.style.paddingRight = '4px';

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

export default externalTooltip;
