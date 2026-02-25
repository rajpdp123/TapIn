// Hardcoded class schedule for MVP — replace with Mindbody API later

const SCHEDULE = {
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  1: [ // Monday
    { time: '07:00', name: 'Morning Flow' },
    { time: '09:30', name: 'Reformer Basics' },
    { time: '11:00', name: 'Reformer Intermediate' },
    { time: '16:00', name: 'Barre Sculpt' },
    { time: '17:30', name: 'Reformer All Levels' },
    { time: '19:00', name: 'Evening Flow' },
  ],
  2: [ // Tuesday
    { time: '07:00', name: 'Morning Flow' },
    { time: '09:30', name: 'Reformer Basics' },
    { time: '11:00', name: 'Reformer Intermediate' },
    { time: '16:00', name: 'Barre Sculpt' },
    { time: '17:30', name: 'Reformer All Levels' },
    { time: '19:00', name: 'Evening Flow' },
  ],
  3: [ // Wednesday
    { time: '07:00', name: 'Morning Flow' },
    { time: '09:30', name: 'Reformer Basics' },
    { time: '11:00', name: 'Reformer Intermediate' },
    { time: '16:00', name: 'Barre Sculpt' },
    { time: '17:30', name: 'Reformer All Levels' },
    { time: '19:00', name: 'Evening Flow' },
  ],
  4: [ // Thursday
    { time: '07:00', name: 'Morning Flow' },
    { time: '09:30', name: 'Reformer Basics' },
    { time: '11:00', name: 'Reformer Intermediate' },
    { time: '16:00', name: 'Barre Sculpt' },
    { time: '17:30', name: 'Reformer All Levels' },
    { time: '19:00', name: 'Evening Flow' },
  ],
  5: [ // Friday
    { time: '07:00', name: 'Morning Flow' },
    { time: '09:30', name: 'Reformer Basics' },
    { time: '11:00', name: 'Reformer Intermediate' },
    { time: '16:00', name: 'Barre Sculpt' },
    { time: '17:30', name: 'Reformer All Levels' },
    { time: '19:00', name: 'Evening Flow' },
  ],
  6: [ // Saturday
    { time: '09:00', name: 'Weekend Reformer' },
    { time: '10:30', name: 'Barre & Stretch' },
    { time: '12:00', name: 'Open Reformer' },
  ],
  0: [ // Sunday
    { time: '10:00', name: 'Slow Flow' },
    { time: '11:30', name: 'Reformer Basics' },
  ],
};

function getTodaySchedule() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  const day = now.getDay();
  return (SCHEDULE[day] || []).map(c => ({
    ...c,
    day_of_week: day,
  }));
}

function findClassForCheckin() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  const day = now.getDay();
  const classes = SCHEDULE[day] || [];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const matches = classes.filter(c => {
    const [h, m] = c.time.split(':').map(Number);
    const classMinutes = h * 60 + m;
    return Math.abs(nowMinutes - classMinutes) <= 30;
  });

  if (matches.length === 1) {
    return { class_name: matches[0].name, class_time: matches[0].time };
  }
  return { class_name: null, class_time: null };
}

module.exports = { getTodaySchedule, findClassForCheckin, SCHEDULE };
