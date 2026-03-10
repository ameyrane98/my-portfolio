export async function fetchLeetCode(username) {
  const label = document.getElementById('leetcodeLabel');

  try {
    const res = await fetch(`/api/leetcode/${username}`);
    if (!res.ok) throw new Error('API error');
    const stats = await res.json();

    const easy   = stats.find(s => s.difficulty === 'Easy')?.count   || 0;
    const medium = stats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hard   = stats.find(s => s.difficulty === 'Hard')?.count   || 0;
    const all    = stats.find(s => s.difficulty === 'All')?.count    || 0;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const ctx = document.getElementById('leetcodeProgress').getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
          data: [easy, medium, hard],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        cutout: '72%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: isDark ? '#94a3b8' : '#64748b',
              padding: 14,
              font: { family: 'Inter, system-ui, sans-serif', size: 12 },
              boxWidth: 10,
              boxHeight: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw}`,
            },
          },
        },
        animation: { animateScale: true },
      },
    });

    if (label) {
      label.innerHTML = `<span>LeetCode</span><strong>${all}</strong><small>solved</small>`;
    }
  } catch {
    if (label) {
      label.innerHTML = `<span>LeetCode</span><small>unavailable</small>`;
    }
  }
}
