// Live product moments. Each .mviz[data-moment] is filled and looped while it is on screen.
// With reduced motion, each panel shows its finished state once.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const moments = {
    job(el) {
      el.innerHTML = '<div class="m-hd"><span>J-1042 &middot; Boiler swap</span><span>M20</span></div>' +
        '<div style="display:grid;gap:6px;margin-top:8px"><span style="font-size:15px">Sarah Kent, Didsbury</span><span class="m-big">&pound;1,840</span><span class="m-mono"></span></div>' +
        '<ol class="m-steps"><li>Booked</li><li>Road</li><li>Site</li><li>Done</li><li>Paid</li></ol>';
      const steps = [...el.querySelectorAll('.m-steps li')], amt = el.querySelector('.m-big'), foot = el.querySelector('.m-mono');
      const say = ['Booked for Thursday 08:00', 'Dan is on the road, 12 min away', 'On site, CP12 started', 'Done, certificate signed', 'Paid by card on site'];
      return { ms: 1600, last: 4, step(n) {
        const i = n % 6 === 5 ? 4 : n % 6;
        steps.forEach((s, k) => { s.className = k < i ? 'on' : k === i ? 'now' : ''; });
        foot.textContent = say[i];
        amt.textContent = i === 4 ? '£1,840 paid' : '£1,840';
        amt.classList.toggle('is-ember', i === 4);
      } };
    },
    servicing(el) {
      el.innerHTML = '<div class="m-hd"><span>Servicing due</span><span class="m-count"></span></div>' +
        '<div class="m-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="m-ppm">' + '<i></i>'.repeat(28) + '</div>';
      const cells = [...el.querySelectorAll('.m-ppm i')], count = el.querySelector('.m-count'), due = [9, 17, 24];
      return { ms: 260, last: 33, step(n) {
        const i = n % 34, late = due.filter(d => d < i).length;
        cells.forEach((c, k) => { c.className = k < i ? (due.includes(k) ? 'due' : 'done') : ''; });
        count.textContent = (Math.min(i, 28) - late) + ' done · ' + late + ' due';
      } };
    },
    draft(el) {
      el.innerHTML = '<div class="m-bubble in">Hi, the boiler is banging again. Can someone come Thursday?</div>' +
        '<div class="m-bubble out"><b>ARDENT DRAFT</b><span class="m-text"></span><span class="m-caret"></span></div><span class="m-chip">Waiting for your yes</span>';
      const text = el.querySelector('.m-text'), chip = el.querySelector('.m-chip');
      const reply = 'Thanks Sarah. We can be there Thursday between 8 and 10am. Reply YES to book.';
      return { ms: 110, last: reply.length + 39, step(n) {
        const i = n % (reply.length + 40), done = i >= reply.length + 18;
        text.textContent = reply.slice(0, i);
        chip.textContent = done ? 'Approved by Jo · sent' : 'Waiting for your yes';
        chip.classList.toggle('ok', done);
      } };
    },
    quote(el) {
      el.innerHTML = '<div class="m-hd"><span>Quote Q-318</span><span>Draft</span></div><ol class="m-lines">' +
        '<li><span>Combi boiler, fitted</span><span>&pound;1,650</span></li><li><span>Magnetic filter</span><span>&pound;190</span></li><li><span>Old boiler taken away</span><span>&pound;0</span></li></ol>' +
        '<div class="m-total"><span class="m-mono">Total</span><b>&pound;0</b></div>';
      const lines = [...el.querySelectorAll('.m-lines li')], total = el.querySelector('.m-total b'), v = [1650, 190, 0];
      return { ms: 900, last: 4, step(n) {
        const i = n % 6;
        lines.forEach((l, k) => l.classList.toggle('in', k < i));
        total.textContent = '£' + v.slice(0, Math.min(i, 3)).reduce((a, b) => a + b, 0).toLocaleString('en-GB');
      } };
    },
    approve(el) {
      el.innerHTML = '<div class="m-hd"><span>Refund &middot; INV-2198</span><span>&pound;180</span></div><span>Customer asked for a part refund after a late arrival.</span>' +
        '<div class="m-hold"><i></i><span>Hold to approve</span></div>';
      const bar = el.querySelector('.m-hold i'), label = el.querySelector('.m-hold span');
      return { ms: 120, last: 39, step(n) {
        const p = Math.min((n % 40) / 22, 1);
        bar.style.width = (p * 100) + '%';
        label.textContent = p < 1 ? 'Hold to approve' : 'Approved · Jo 09:14';
        label.style.color = p >= 0.5 ? '#070707' : '';
      } };
    },
    invoice(el) {
      el.innerHTML = '<div class="m-hd"><span>INV-2211</span><span>&pound;2,270</span></div><div><span class="m-big">Day 0</span> <span class="m-mono">since sent</span></div>' +
        '<ol class="m-inv"><li>Sent</li><li>Reminder</li><li>Viewed</li><li>Paid</li></ol>';
      const steps = [...el.querySelectorAll('.m-inv li')], day = el.querySelector('.m-big'), days = [0, 7, 8, 9];
      return { ms: 1200, last: 3, step(n) {
        const i = Math.min(n % 6, 3);
        steps.forEach((s, k) => { s.className = k <= i ? (k === 3 ? 'on paid' : 'on') : ''; });
        day.textContent = 'Day ' + days[i];
      } };
    },
    offline(el) {
      el.innerHTML = '<div class="m-hd"><span>Field &middot; J-1057</span><span class="m-sig">No signal</span></div><span class="m-say"></span>' +
        '<div class="m-queue">' + ['IMG', 'IMG', 'READ', 'IMG', 'SIGN'].map(t => '<i>' + t + '</i>').join('') + '</div>';
      const tiles = [...el.querySelectorAll('.m-queue i')], sig = el.querySelector('.m-sig'), say = el.querySelector('.m-say');
      return { ms: 800, last: 9, step(n) {
        const i = n % 10, online = i >= 6;
        tiles.forEach((t, k) => { t.style.visibility = k < Math.min(i, 5) ? 'visible' : 'hidden'; t.classList.toggle('sent', online && k < i - 4); });
        sig.textContent = online ? 'Back online' : 'No signal';
        sig.classList.toggle('off', !online);
        say.textContent = i >= 9 ? 'All 5 items sent to the office.' : online ? 'Sending to the office.' : 'Photos and readings saved on the phone.';
      } };
    }
  };

  const run = new Map();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
    const m = run.get(e.target);
    if (e.isIntersecting && !m.timer) m.timer = setInterval(() => m.step(m.n++), m.ms);
    if (!e.isIntersecting && m.timer) { clearInterval(m.timer); m.timer = null; }
  })) : null;

  document.querySelectorAll('.mviz[data-moment]').forEach(el => {
    const make = moments[el.dataset.moment];
    if (!make) return;
    const m = make(el);
    if (still || !io) { m.step(m.last); return; }
    m.n = 0; m.step(m.n++); run.set(el, m); io.observe(el);
  });
})();
