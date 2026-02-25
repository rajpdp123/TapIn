// Hardcoded class schedule for MVP — replace with Mindbody API later

const SCHEDULE = {
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  1: [ // Monday
    { time: '07:00', name: 'Morning Flow', teacher: 'Tara', spots: 3 },
    { time: '09:30', name: 'Reformer Basics', teacher: 'Elena', spots: 1 },
    { time: '11:00', name: 'Reformer Intermediate', teacher: 'Petra', spots: 4 },
    { time: '16:00', name: 'Barre Sculpt', teacher: 'Maia', spots: 2 },
    { time: '17:30', name: 'Reformer All Levels', teacher: 'Elena', spots: 5 },
    { time: '19:00', name: 'Evening Flow', teacher: 'Tara', spots: 6 },
  ],
  2: [ // Tuesday
    { time: '07:00', name: 'Morning Flow', teacher: 'Tara', spots: 4 },
    { time: '09:30', name: 'Reformer Basics', teacher: 'Elena', spots: 2 },
    { time: '11:00', name: 'Reformer Intermediate', teacher: 'Petra', spots: 3 },
    { time: '16:00', name: 'Barre Sculpt', teacher: 'Maia', spots: 5 },
    { time: '17:30', name: 'Reformer All Levels', teacher: 'Elena', spots: 3 },
    { time: '19:00', name: 'Evening Flow', teacher: 'Tara', spots: 4 },
  ],
  3: [ // Wednesday
    { time: '07:00', name: 'Morning Flow', teacher: 'Tara', spots: 2 },
    { time: '09:30', name: 'Reformer Basics', teacher: 'Petra', spots: 3 },
    { time: '11:00', name: 'Reformer Intermediate', teacher: 'Elena', spots: 5 },
    { time: '16:00', name: 'Barre Sculpt', teacher: 'Maia', spots: 1 },
    { time: '17:30', name: 'Reformer All Levels', teacher: 'Petra', spots: 4 },
    { time: '19:00', name: 'Evening Flow', teacher: 'Tara', spots: 6 },
  ],
  4: [ // Thursday
    { time: '07:00', name: 'Morning Flow', teacher: 'Tara', spots: 5 },
    { time: '09:30', name: 'Reformer Basics', teacher: 'Elena', spots: 2 },
    { time: '11:00', name: 'Reformer Intermediate', teacher: 'Petra', spots: 3 },
    { time: '16:00', name: 'Barre Sculpt', teacher: 'Maia', spots: 4 },
    { time: '17:30', name: 'Reformer All Levels', teacher: 'Elena', spots: 2 },
    { time: '19:00', name: 'Evening Flow', teacher: 'Tara', spots: 5 },
  ],
  5: [ // Friday
    { time: '07:00', name: 'Morning Flow', teacher: 'Tara', spots: 6 },
    { time: '09:30', name: 'Reformer Basics', teacher: 'Elena', spots: 3 },
    { time: '11:00', name: 'Reformer Intermediate', teacher: 'Petra', spots: 4 },
    { time: '16:00', name: 'Barre Sculpt', teacher: 'Maia', spots: 2 },
    { time: '17:30', name: 'Reformer All Levels', teacher: 'Elena', spots: 5 },
    { time: '19:00', name: 'Evening Flow', teacher: 'Tara', spots: 3 },
  ],
  6: [ // Saturday
    { time: '09:00', name: 'Weekend Reformer', teacher: 'Petra', spots: 2 },
    { time: '10:30', name: 'Barre & Stretch', teacher: 'Maia', spots: 4 },
    { time: '12:00', name: 'Open Reformer', teacher: 'Elena', spots: 6 },
  ],
  0: [ // Sunday
    { time: '10:00', name: 'Slow Flow', teacher: 'Tara', spots: 5 },
    { time: '11:30', name: 'Reformer Basics', teacher: 'Elena', spots: 3 },
  ],
};

const DEALS = [
  {
    title: 'Early Bird Perk',
    description: '5 morning classes = 1 free coffee',
    tag: 'Popular',
    icon: '☕',
  },
  {
    title: 'Bring a Friend',
    description: "Your friend's first class is free",
    tag: 'New',
    icon: '👯',
  },
];

function getTodaySchedule() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  const day = now.getDay();
  return (SCHEDULE[day] || []).map(c => ({
    ...c,
    day_of_week: day,
    bookable: true,
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

module.exports = { getTodaySchedule, findClassForCheckin, SCHEDULE, DEALS };
