/* Operational Hub demo — fictional company, sample data, no network.
   Offline queue: wrap closeJob(). On a phone with no connection, the close
   payload (readings, parts, photos, signature, signoff name) would be written
   to IndexedDB and flushed when the connection returns. This demo keeps that
   call in memory. See README.md. */
(function () {
  'use strict';

  var TODAY = startOfDay(new Date());
  var LABOR_RATE = 125;
  var PHOTOS = [
    { url: 'images/operational-hub/photo-valve.svg', caption: 'Valve and surrounding piping' },
    { url: 'images/operational-hub/photo-gauge.svg', caption: 'Test kit on the assembly' },
    { url: 'images/operational-hub/photo-tag.svg', caption: 'Test tag on the device' }
  ];

  function startOfDay(d) {
    var x = new Date(d.getTime());
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function isoDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function parseISO(iso) {
    var p = iso.slice(0, 10).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function addDays(iso, n) {
    var d = parseISO(iso);
    d.setDate(d.getDate() + n);
    return isoDate(d);
  }

  function todayISO() {
    return isoDate(TODAY);
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function money(n) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  function uid(prefix, n) {
    return prefix + String(n);
  }

  function buildDb() {
    var rand = mulberry32(20261025);
    var today = todayISO();
    var customers = [
      ['Harbor & Pine Property Group', 'property_manager', 'Riley Ames'],
      ['Northwharf Dining', 'restaurant', 'Casey Ng'],
      ['Linden Street School', 'school', 'Robin Hale'],
      ['Marrow Bakery', 'restaurant', 'Jules Ortega'],
      ['Cedar Annex Offices', 'property_manager', 'Samir Holt'],
      ['Brightkettle Coffee', 'restaurant', 'Noor Ellis'],
      ['Oakmere Apartments', 'property_manager', 'Casey Brennan'],
      ['Sable Ridge Inn', 'property_manager', 'Harper Quinn'],
      ['Westcourt Clinical Suites', 'property_manager', 'Amina Shah'],
      ['Pennywhistle Day School', 'school', 'Logan Ivers'],
      ['Ironwood Fabrication', 'industrial', 'Reese Dalton'],
      ['Lantern Court Condos', 'property_manager', 'Rowan Peck'],
      ['Kettlehouse Diner', 'restaurant', 'Micah Solano'],
      ['Summit Annex Workshops', 'industrial', 'Eden Cho'],
      ['Goldfinch Apartments', 'property_manager', 'Sasha Nguyen'],
      ['Redclay Elementary', 'school', 'Parker Gleason'],
      ['Moss & Timber Offices', 'property_manager', 'Quinn Adler'],
      ['Hearthline Cafe', 'restaurant', 'Lane Ortega'],
      ['Pallor Street Lofts', 'property_manager', 'Remy Walsh'],
      ['Kindling Bakery', 'restaurant', 'Tatum Brooks'],
      ['Northline Dental Suites', 'property_manager', 'Jordan Hale'],
      ['Vesper Hall', 'property_manager', 'Alex Okonkwo'],
      ['Quarry Lane Studios', 'industrial', 'Drew Salinas'],
      ['Bramble Court Housing', 'property_manager', 'Emery Costa'],
      ['Stillwater Community Kitchen', 'restaurant', 'Skyler Benton']
    ].map(function (row, i) {
      return {
        id: uid('c', i + 1),
        name: row[0],
        type: row[1],
        billing_contact: row[2]
      };
    });

    var streets = [
      'Copper Lane', 'Orchard Street', 'Millrace Road', 'Cinder Court',
      'Lark Avenue', 'Quarry Street', 'Hemlock Way', 'Fable Drive',
      'Northbend Road', 'Tallow Street', 'Briar Court', 'Lantern Way',
      'Redclay Road', 'Kindling Street', 'Moss Lane', 'Hearth Avenue',
      'Pallor Street', 'Vesper Road', 'Bramble Court', 'Stillwater Lane'
    ];
    var accessPool = [
      'Call the property manager on arrival.',
      'Park in the service alley and check in at the desk.',
      'Gate code is in the lockbox by the side door.',
      'Use the service entrance on the north side.',
      'Ask the front desk for the mechanical-room key.'
    ];
    var sites = [];
    var sitePlan = [];
    customers.forEach(function (customer, i) {
      var count = i < 15 ? 2 : 1;
      for (var n = 0; n < count; n += 1) sitePlan.push(customer.id);
    });
    sitePlan.forEach(function (customerId, i) {
      sites.push({
        id: uid('s', i + 1),
        customer_id: customerId,
        address: (120 + i * 17) + ' ' + streets[i % streets.length] + ', Pember Vale',
        access_notes: accessPool[i % accessPool.length]
      });
    });

    var deviceTypes = ['RPZ', 'DCVA', 'PVB'];
    var sizes = ['3/4 in', '1 in', '1-1/2 in', '2 in'];
    var locations = ['Mechanical room', 'Kitchen line', 'Irrigation', 'Boiler feed', 'Dock sink', 'Staff restroom'];
    var devices = [];
    var serial = 44000;
    sites.forEach(function (site) {
      var count = 1 + Math.floor(rand() * 6);
      for (var n = 0; n < count; n += 1) {
        serial += 1;
        var last = addDays(today, -(40 + Math.floor(rand() * 320)));
        devices.push({
          id: uid('d', devices.length + 1),
          site_id: site.id,
          type: deviceTypes[(devices.length + n) % deviceTypes.length],
          serial: 'RL-' + serial,
          size: sizes[(devices.length + n) % sizes.length],
          location_on_site: locations[(devices.length + n) % locations.length],
          last_test_date: last,
          next_test_due: addDays(last, 365)
        });
      }
    });

    var kettle = customers.find(function (c) { return c.name.indexOf('Kettlehouse') === 0; });
    var demoSite = sites.find(function (s) { return s.customer_id === kettle.id; });
    demoSite.address = '88 Orchard Street, Pember Vale';
    demoSite.access_notes = 'Gate code is in the lockbox by the alley door.';
    devices = devices.filter(function (d) { return d.site_id !== demoSite.id; });
    devices.push(
      {
        id: 'd-demo-1',
        site_id: demoSite.id,
        type: 'RPZ',
        serial: 'RL-44102',
        size: '3/4 in',
        location_on_site: 'Kitchen line',
        last_test_date: addDays(today, -120),
        next_test_due: addDays(today, 245)
      },
      {
        id: 'd-demo-2',
        site_id: demoSite.id,
        type: 'DCVA',
        serial: 'RL-44188',
        size: '1 in',
        location_on_site: 'Irrigation',
        last_test_date: addDays(today, -120),
        next_test_due: addDays(today, 245)
      }
    );

    var duePool = devices.filter(function (d) { return d.site_id !== demoSite.id; });
    duePool.slice(0, 4).forEach(function (d) { d.next_test_due = addDays(today, 3); });
    duePool.slice(4, 9).forEach(function (d) { d.next_test_due = addDays(today, 18); });
    duePool.slice(9, 16).forEach(function (d) { d.next_test_due = addDays(today, 46); });

    var technicians = [
      ['t1', 'Mara Ellison', 'foreman'],
      ['t2', 'Jonah Peck', 'foreman'],
      ['t3', 'Theo Marsh', 'foreman'],
      ['t4', 'Mateo Lang', 'tech'],
      ['t5', 'Adele Voss', 'tech'],
      ['t6', 'Priya Solano', 'tech'],
      ['t7', 'Ellis Grant', 'tech'],
      ['t8', 'Naomi Berg', 'tech']
    ].map(function (row) {
      return { id: row[0], name: row[1], role: row[2] };
    });

    var partNames = [
      'Ball valve 1/2 in', 'Ball valve 3/4 in', 'Ball valve 1 in', 'RPZ repair kit',
      'Check valve kit', 'Relief valve diaphragm', 'Rubber gasket assortment', 'Thread seal tape',
      'Pipe dope', 'Copper coupling 1/2 in', 'Copper coupling 3/4 in', 'Copper coupling 1 in',
      'Copper elbow 1/2 in', 'Copper elbow 3/4 in', 'Wax ring', 'Braided supply line 12 in',
      'Braided supply line 20 in', 'Angle stop', 'P-trap 1-1/2 in', 'Closet bolt set',
      'Flush valve', 'Fill valve', 'Flapper', 'Single-handle cartridge',
      'Two-handle cartridge', 'Aerator', 'Hose bib', 'Vacuum breaker cap',
      'Test cock cap', 'Shutoff valve 3/4 in', 'Pressure gauge', 'Dielectric union',
      'PVC primer', 'PVC cement', 'Flexible coupling 2 in', 'Flexible coupling 3 in',
      'Cleanout plug', 'Escutcheon', 'Solder', 'Flux',
      'Strainer basket', 'Disposal flange', 'Tailpiece', 'Slip nut',
      'Wax-free seal', 'Backflow cover', 'Expansion tank', 'Water heater flex connector',
      'Brass nipple 1/2 x 4', 'Brass nipple 3/4 x 6', 'Union 1/2 in', 'Union 3/4 in',
      'Ball valve with drain', 'Test adapter', 'Test-kit hose', 'Identification tag',
      'Silicone sealant', 'Quarter-turn stop', 'Gate valve 1 in', 'RPZ assembly 3/4 in'
    ];
    var parts = partNames.map(function (name, i) {
      var price = Math.round((8 + ((i * 17) % 72) + (i % 4) * 3.25) * 100) / 100;
      if (name.indexOf('RPZ assembly') === 0) price = 286;
      if (name.indexOf('RPZ repair') === 0) price = 86;
      if (name.indexOf('Expansion tank') === 0) price = 74.5;
      return { id: uid('p', i + 1), sku: 'RLP-' + String(1001 + i), name: name, unit_price: price };
    });

    var types = ['service', 'service', 'install', 'backflow_test', 'backflow_test'];
    var windows = ['8:00-12:00', '12:00-4:00', '4:00-6:00'];
    var jobs = [];
    for (var i = 0; i < 120; i += 1) {
      var site = sites[i % sites.length];
      var tech = technicians[i % technicians.length];
      var type = types[i % types.length];
      var dayOffset;
      var status;
      if (i < 10) {
        dayOffset = 0;
        status = i % 4 === 0 ? 'in_progress' : 'scheduled';
      } else if (i < 30) {
        dayOffset = 1 + (i % 14);
        status = 'scheduled';
      } else {
        dayOffset = -(1 + (i % 42));
        var bucket = i % 10;
        if (bucket < 6) status = 'exported';
        else if (bucket < 8) status = 'ready_to_invoice';
        else if (bucket === 8) status = 'completed';
        else status = 'approved';
      }
      var day = addDays(today, dayOffset);
      var job = {
        id: uid('j', 1001 + i),
        site_id: site.id,
        type: type,
        scheduled_start: day,
        window: windows[i % windows.length],
        assigned_tech_id: tech.id,
        status: status,
        notes: '',
        labor_minutes: null,
        customer_signoff_name: '',
        signature_image: '',
        created_at: day + 'T07:30:00',
        closed_at: null,
        approved_at: null,
        exported_at: null,
        device_ids: [],
        checklist: {}
      };
      stampClosed(job, i);
      jobs.push(job);
    }

    var oak = customers.find(function (c) { return c.name.indexOf('Oakmere') === 0; });
    var oakSite = sites.find(function (s) { return s.customer_id === oak.id; });
    jobs[0] = {
      id: 'j-demo',
      site_id: demoSite.id,
      type: 'backflow_test',
      scheduled_start: today,
      window: '8:00-12:00',
      assigned_tech_id: 't4',
      status: 'scheduled',
      notes: '',
      labor_minutes: null,
      customer_signoff_name: '',
      signature_image: '',
      created_at: today + 'T07:00:00',
      closed_at: null,
      approved_at: null,
      exported_at: null,
      device_ids: ['d-demo-1', 'd-demo-2'],
      checklist: {}
    };
    jobs[1] = {
      id: 'j-live',
      site_id: oakSite.id,
      type: 'service',
      scheduled_start: today,
      window: '12:00-4:00',
      assigned_tech_id: 't4',
      status: 'in_progress',
      notes: 'Slow drain at the bar well. Customer says it started yesterday.',
      labor_minutes: null,
      customer_signoff_name: '',
      signature_image: '',
      created_at: today + 'T07:05:00',
      closed_at: null,
      approved_at: null,
      exported_at: null,
      device_ids: [],
      checklist: {}
    };

    jobs.forEach(function (job) {
      if (job.scheduled_start === today && job.assigned_tech_id === 't4' && job.id !== 'j-demo' && job.id !== 'j-live') {
        job.assigned_tech_id = 't6';
      }
    });

    var historyNotes = [
      ['service', 'Replaced the angle stop under the prep sink. No leak on retest.', -40],
      ['backflow_test', 'Annual test. Both devices passed and tags were hung.', -120],
      ['service', 'Cleared a grease-line backup at the pot sink. Advised the kitchen on the trap.', -200]
    ];
    var historyIdx = {};
    [40, 55, 70].forEach(function (idx, n) {
      historyIdx[idx] = true;
      var job = jobs[idx];
      var when = addDays(today, historyNotes[n][2]);
      job.site_id = demoSite.id;
      job.type = historyNotes[n][0];
      job.notes = historyNotes[n][1];
      job.status = 'exported';
      job.assigned_tech_id = n === 2 ? 't5' : 't4';
      job.scheduled_start = when;
      job.customer_signoff_name = 'Micah Solano';
      stampClosed(job, n + 3);
    });
    var otherSite = sites.find(function (s) { return s.id !== demoSite.id; });
    jobs.forEach(function (job, idx) {
      if (job.site_id === demoSite.id && !historyIdx[idx] && job.id !== 'j-demo') {
        job.site_id = otherSite.id;
      }
    });

    var failCandidates = jobs.filter(function (job) {
      return job.type === 'backflow_test' &&
        job.status !== 'scheduled' &&
        job.status !== 'in_progress' &&
        job.site_id !== demoSite.id;
    });
    failCandidates.forEach(function (job, index) {
      if (index % 7 === 0) {
        job.status = 'needs_follow_up';
        job.approved_at = null;
        job.exported_at = null;
        job.notes = 'Device failed the field test. Return visit required.';
      }
    });

    var signoffs = ['Jordan Hale', 'Alex Okonkwo', 'Riley Ames', 'Samir Holt', 'Noor Ellis'];
    var testResults = [];
    var partUsed = [];
    var photos = [];
    jobs.forEach(function (job, index) {
      if (job.status === 'scheduled' || job.status === 'in_progress') return;
      if (!job.customer_signoff_name) job.customer_signoff_name = signoffs[index % signoffs.length];
      job.labor_minutes = 45 + (index % 8) * 15;
      var count = index % 4;
      for (var k = 0; k < count; k += 1) {
        var part = parts[(index + k * 5) % parts.length];
        partUsed.push({
          id: 'pu-' + job.id + '-' + k,
          job_id: job.id,
          part_id: part.id,
          qty: 1 + (k % 3),
          unit_price: part.unit_price
        });
      }
      if (index % 5 === 0) {
        photos.push({
          id: 'ph-' + job.id,
          job_id: job.id,
          url: PHOTOS[index % PHOTOS.length].url,
          caption: PHOTOS[index % PHOTOS.length].caption
        });
      }
      if (job.type !== 'backflow_test') return;
      var siteDevices = devices.filter(function (d) { return d.site_id === job.site_id; }).slice(0, 2);
      var failJob = job.status === 'needs_follow_up';
      siteDevices.forEach(function (device, n) {
        var failed = failJob && n === 0;
        testResults.push(sampleResult(job.id, device, failed, testResults.length + 1));
      });
    });

    var feedback = [
      fb('f1', 'foreman', 'Scrolling the parts list on my phone takes longer than the repair.', 'refinement', 'high', 'low', 2),
      fb('f2', 'tech', 'I need the last three visits before I touch the device. Gate codes and what failed last time.', 'new need', 'high', 'low', 3),
      fb('f3', 'office', 'I still call every truck to find out who is done. A board would replace the whiteboard.', 'new need', 'high', 'medium', 2),
      fb('f4', 'owner', 'Annual retests live in a spreadsheet and we miss them.', 'new need', 'high', 'medium', 3),
      fb('f5', 'tech', 'The signature box was easy to miss. I almost closed without it.', 'bug', 'medium', 'low', 1),
      fb('f6', 'bookkeeper', 'The export left out part quantities, so I retyped them.', 'bug', 'high', 'low', 1),
      fb('f7', 'foreman', 'A failed test only turned red. On a sunny phone I could not tell.', 'bug', 'high', 'low', 1),
      fb('f8', 'office', 'We need one certificate per device, not one file for the whole site.', 'refinement', 'medium', 'low', 1),
      fb('f9', 'tech', 'Access notes were blank on the first build. The gate code has to be on the job.', 'bug', 'high', 'low', 1),
      fb('f10', 'owner', 'Show unbilled work before Friday, not at month end.', 'new need', 'high', 'medium', 1),
      fb('f11', 'office', 'Scheduled and in progress looked the same in the list.', 'refinement', 'medium', 'low', 2),
      fb('f12', 'bookkeeper', 'Show the unit price before the tech adds a part, so we stop under-billing.', 'refinement', 'medium', 'low', 2)
    ];

    var releases = [
      {
        id: 'r1',
        cycle_number: 1,
        lane: 'A',
        title: 'Digital ticket through invoice-ready',
        description: 'Digital ticket, test readings, customer signature, review queue, certificate PDF, and CSV export.',
        uat_signed_off: true,
        related_feedback_ids: ['f5', 'f6', 'f7', 'f8', 'f9', 'f10']
      },
      {
        id: 'r2',
        cycle_number: 2,
        lane: 'A',
        title: 'Live dispatch board',
        description: 'Office sees who is where and what is finished, without the whiteboard and the phone calls.',
        uat_signed_off: true,
        related_feedback_ids: ['f3', 'f11']
      },
      {
        id: 'r3',
        cycle_number: 2,
        lane: 'B',
        title: 'Faster parts search',
        description: 'Foremen said scrolling took too long. A search box was added. Sample foreman feedback: "Scrolling the parts list on my phone takes longer than the repair."',
        uat_signed_off: true,
        related_feedback_ids: ['f1', 'f12']
      },
      {
        id: 'r4',
        cycle_number: 3,
        lane: 'A',
        title: 'Retest reminders',
        description: 'A 60, 30, and 7 day list, with a schedule-retest action.',
        uat_signed_off: true,
        related_feedback_ids: ['f4']
      },
      {
        id: 'r5',
        cycle_number: 3,
        lane: 'B',
        title: 'Site history on the job',
        description: 'Techs asked for previous visits. The job now shows the last three, with access notes.',
        uat_signed_off: true,
        related_feedback_ids: ['f2']
      }
    ];

    return {
      customers: customers,
      sites: sites,
      devices: devices,
      technicians: technicians,
      parts: parts,
      jobs: jobs,
      testResults: testResults,
      partUsed: partUsed,
      photos: photos,
      feedback: feedback,
      releases: releases,
      demoSiteId: demoSite.id
    };
  }

  function fb(id, role, text, tag, impact, effort, cycle) {
    return {
      id: id,
      author_role: role,
      text: text,
      tag: tag,
      impact: impact,
      effort: effort,
      status: 'addressed',
      cycle_addressed: cycle
    };
  }

  function stampClosed(job, salt) {
    if (job.status === 'scheduled' || job.status === 'in_progress') return;
    var hours = 4 + (salt % 5);
    job.closed_at = job.scheduled_start + 'T' + String(12 + (salt % 3)).padStart(2, '0') + ':20:00';
    if (job.status === 'approved' || job.status === 'ready_to_invoice' || job.status === 'exported') {
      job.approved_at = job.scheduled_start + 'T' + String(12 + (salt % 3)).padStart(2, '0') + ':' + String(20 + hours).padStart(2, '0') + ':00';
    }
    if (job.status === 'exported') job.exported_at = addDays(job.scheduled_start, 1) + 'T09:15:00';
  }

  function sampleResult(jobId, device, failed, n) {
    var reading = passingReading(device.type);
    if (failed) reading = failingReading(device.type);
    return {
      id: 'tr' + n,
      job_id: jobId,
      device_id: device.id,
      check1_psi: reading.check1,
      check2_psi: reading.check2,
      relief_opening_psi: reading.relief,
      outcome: failed ? 'fail' : 'pass',
      notes: failed ? 'Below the minimum. Needs a repair and a retest.' : ''
    };
  }

  function passingReading(type) {
    if (type === 'DCVA') return { check1: 2.2, check2: 1.8, relief: null };
    if (type === 'PVB') return { check1: 1.8, check2: null, relief: 1.4 };
    return { check1: 7.4, check2: 1.6, relief: 2.8 };
  }

  function failingReading(type) {
    if (type === 'DCVA') return { check1: 0.4, check2: 1.2, relief: null };
    if (type === 'PVB') return { check1: 0.6, check2: null, relief: 0.4 };
    return { check1: 3.2, check2: 1.4, relief: 2.2 };
  }

  function needsThird(type) {
    return type === 'RPZ' || type === 'PVB';
  }

  function thirdLabel(type) {
    return type === 'PVB' ? 'Air inlet opening (psi)' : 'Relief valve opening (psi)';
  }

  function judge(type, reading) {
    var reasons = [];
    var c1 = Number(reading.check1);
    var c2 = Number(reading.check2);
    var rv = Number(reading.relief);
    if (type === 'DCVA') {
      if (!(c1 >= 1)) reasons.push('Check valve 1 is below 1.0 psi.');
      if (!(c2 >= 1)) reasons.push('Check valve 2 is below 1.0 psi.');
    } else if (type === 'PVB') {
      if (!(c1 >= 1)) reasons.push('Check valve is below 1.0 psi.');
      if (!(rv >= 1)) reasons.push('Air inlet opening is below 1.0 psi.');
    } else {
      if (!(c1 >= 5)) reasons.push('Check valve 1 is below 5.0 psi.');
      if (!(c2 >= 1)) reasons.push('Check valve 2 is below 1.0 psi.');
      if (!(rv >= 2)) reasons.push('Relief valve opening is below 2.0 psi.');
      if (!(rv < c1)) reasons.push('Relief valve opening is not below check valve 1.');
    }
    return { outcome: reasons.length ? 'fail' : 'pass', reasons: reasons };
  }

  function ruleText(type) {
    if (type === 'DCVA') return 'Pass if both check valves are at least 1.0 psi.';
    if (type === 'PVB') return 'Pass if the check valve and the air inlet opening are each at least 1.0 psi.';
    return 'Pass if check valve 1 is at least 5.0 psi, check valve 2 is at least 1.0 psi, and the relief valve opens at 2.0 psi or more and below check valve 1.';
  }

  var db = buildDb();

  function customer(id) {
    return db.customers.find(function (c) { return c.id === id; });
  }
  function site(id) {
    return db.sites.find(function (s) { return s.id === id; });
  }
  function tech(id) {
    return db.technicians.find(function (t) { return t.id === id; });
  }
  function part(id) {
    return db.parts.find(function (p) { return p.id === id; });
  }
  function getJob(id) {
    return db.jobs.find(function (j) { return j.id === id; });
  }
  function sitesFor(customerId) {
    return db.sites.filter(function (s) { return s.customer_id === customerId; });
  }
  function devicesForSite(siteId) {
    return db.devices.filter(function (d) { return d.site_id === siteId; });
  }
  function jobDevices(job) {
    var all = devicesForSite(job.site_id);
    if (job.device_ids && job.device_ids.length) {
      return all.filter(function (d) { return job.device_ids.indexOf(d.id) !== -1; });
    }
    return all;
  }
  function resultsFor(jobId) {
    return db.testResults.filter(function (t) { return t.job_id === jobId; });
  }
  function partsFor(jobId) {
    return db.partUsed.filter(function (p) { return p.job_id === jobId; });
  }
  function photosFor(jobId) {
    return db.photos.filter(function (p) { return p.job_id === jobId; });
  }
  function jobCustomer(job) {
    return customer(site(job.site_id).customer_id);
  }
  function typeLabel(type) {
    if (type === 'backflow_test') return 'Backflow test';
    if (type === 'install') return 'Small install';
    return 'Service call';
  }
  function statusLabel(status) {
    var map = {
      scheduled: 'Scheduled',
      in_progress: 'In progress',
      completed: 'Completed, awaiting review',
      needs_follow_up: 'Needs follow-up',
      approved: 'Approved',
      ready_to_invoice: 'Ready to invoice',
      exported: 'Exported'
    };
    return map[status] || status;
  }
  function isClosed(job) {
    return job.status !== 'scheduled' && job.status !== 'in_progress';
  }

  function selfCheck() {
    var backflowDone = db.jobs.filter(function (j) {
      return j.type === 'backflow_test' && j.status !== 'scheduled' && j.status !== 'in_progress';
    });
    var failed = backflowDone.filter(function (j) { return j.status === 'needs_follow_up'; });
    var rate = failed.length / backflowDone.length;
    var demo = getJob('j-demo');
    var problems = [];
    if (db.customers.length !== 25) problems.push('customers ' + db.customers.length);
    if (db.sites.length !== 40) problems.push('sites ' + db.sites.length);
    if (db.technicians.length !== 8) problems.push('techs');
    if (db.jobs.length !== 120) problems.push('jobs ' + db.jobs.length);
    if (db.parts.length !== 60) problems.push('parts ' + db.parts.length);
    if (db.feedback.length !== 12) problems.push('feedback');
    if (rate < 0.1 || rate > 0.2) problems.push('fail rate ' + rate);
    if (!demo || demo.scheduled_start !== todayISO() || jobDevices(demo).length !== 2) problems.push('demo job');
    if (problems.length) throw new Error(problems.join('; '));
  }
  selfCheck();

  if (typeof document === 'undefined') {
    var done = db.jobs.filter(function (j) {
      return j.type === 'backflow_test' && j.status !== 'scheduled' && j.status !== 'in_progress';
    });
    var fails = done.filter(function (j) { return j.status === 'needs_follow_up'; }).length;
    console.log(JSON.stringify({
      customers: db.customers.length,
      sites: db.sites.length,
      devices: db.devices.length,
      techs: db.technicians.length,
      jobs: db.jobs.length,
      parts: db.parts.length,
      feedback: db.feedback.length,
      backflowDone: done.length,
      failed: fails,
      failRate: Math.round((fails / done.length) * 1000) / 10
    }));
    return;
  }

  var CHECKLISTS = {
    service: ['Arrive and check in', 'Diagnose the issue', 'Complete the repair', 'Test the fixture', 'Clean the work area', 'Walk the customer through what was done'],
    install: ['Stage materials', 'Complete the install', 'Pressure test', 'Clean the work area', 'Walk the customer through what was installed'],
    backflow_test: ['Identify each device', 'Record readings', 'Mark pass or fail', 'Hang the test tag', 'Capture the customer signature']
  };

  var PAINS = [
    ['P1', 'Job tickets get lost or come back illegible; work goes unbilled', 'Office, owner', 'Several times a week', 6400, 'Paper tickets travel in trucks for days'],
    ['P2', 'Invoices go out 1–3 weeks after the job', 'Bookkeeper, owner', 'Every billing cycle', 2100, 'Tickets are re-typed into accounting by hand'],
    ['P3', 'Backflow test certificates are late or missing; compliance risk', 'Office, customers', 'Weekly', 3800, 'Results are written on paper, then typed into PDFs'],
    ['P4', 'Dispatch cannot see who is where or what is finished', 'Dispatch', 'Daily', 1600, 'Whiteboard plus phone calls'],
    ['P5', 'Parts used on site are not recorded, so materials are under-billed', 'Bookkeeper', 'Several times a week', 4900, 'No parts field on the ticket'],
    ['P6', 'Repeat visits miss history (previous issues, device locations, gate codes)', 'Technicians', 'Daily', 1200, 'History lives in people’s heads'],
    ['P7', 'Annual retests are tracked in a spreadsheet and get missed', 'Office, owner', 'Monthly', 2400, 'No reminder system']
  ];

  var state = {
    role: 'tech',
    cycle: 1,
    section: 'method',
    methodTab: 'discovery',
    techId: 't4',
    jobId: null,
    officeTab: 'assign',
    notice: '',
    noticeTone: 'ok',
    preferReview: false,
    lastClosedId: '',
    scrollTo: '',
    certs: [],
    form: {
      customerId: db.customers[0].id,
      siteId: sitesFor(db.customers[0].id)[0].id,
      type: 'service',
      techId: 't4',
      date: todayISO(),
      timeWindow: '8:00-12:00',
      deviceIds: [],
      partId: '',
      qty: '1',
      partQuery: ''
    },
    drafts: {}
  };
  state.form.deviceIds = devicesForSite(state.form.siteId).map(function (d) { return d.id; });

  function ensureDraft(job) {
    if (!state.drafts[job.id]) {
      var readings = {};
      jobDevices(job).forEach(function (device) {
        readings[device.id] = { check1: '', check2: '', relief: '', notes: '' };
      });
      state.drafts[job.id] = {
        laborHours: '1.5',
        signoffName: '',
        notes: job.notes || '',
        partId: db.parts[0].id,
        qty: '1',
        checklist: {},
        readings: readings
      };
    }
    return state.drafts[job.id];
  }

  function readBinds() {
    var root = document.getElementById('hub-app');
    if (!root) return;
    var job = state.jobId ? getJob(state.jobId) : null;
    var draft = job ? ensureDraft(job) : null;
    root.querySelectorAll('[data-bind]').forEach(function (el) {
      var key = el.getAttribute('data-bind');
      var value = el.type === 'checkbox' ? el.checked : el.value;
      if (key.indexOf('form.') === 0) state.form[key.slice(5)] = value;
      if (draft && key.indexOf('draft.') === 0) draft[key.slice(6)] = value;
    });
    if (draft) {
      root.querySelectorAll('[data-check]').forEach(function (el) {
        draft.checklist[el.getAttribute('data-check')] = el.checked;
      });
      root.querySelectorAll('[data-reading]').forEach(function (el) {
        var deviceId = el.getAttribute('data-device');
        var field = el.getAttribute('data-reading');
        if (!draft.readings[deviceId]) draft.readings[deviceId] = { check1: '', check2: '', relief: '', notes: '' };
        draft.readings[deviceId][field] = el.value;
      });
    }
    var picks = root.querySelectorAll('[data-device-pick]');
    if (picks.length) {
      state.form.deviceIds = Array.prototype.map.call(
        Array.prototype.filter.call(picks, function (el) { return el.checked; }),
        function (el) { return el.getAttribute('data-device-pick'); }
      );
    }
    snapshotSignature();
  }

  function snapshotSignature() {
    var canvas = document.getElementById('sig-pad');
    var job = state.jobId ? getJob(state.jobId) : null;
    if (!canvas || !job) return;
    if (canvas.dataset.inked === '1') {
      job.signature_image = canvas.toDataURL('image/png');
      canvas.dataset.inked = '0';
    }
  }

  function setNotice(text, tone) {
    state.notice = text;
    state.noticeTone = tone || 'ok';
  }

  function closeJob() {
    var job = getJob(state.jobId);
    if (!job || isClosed(job)) return;
    var draft = ensureDraft(job);
    var errors = [];
    if (!String(draft.signoffName).trim()) errors.push('Enter the customer name.');
    if (!job.signature_image) errors.push('Capture the customer signature.');
    var hours = Number(draft.laborHours);
    if (!(hours > 0)) errors.push('Enter labor hours.');
    var devices = jobDevices(job);
    var results = [];
    if (job.type === 'backflow_test') {
      devices.forEach(function (device) {
        var reading = draft.readings[device.id] || {};
        var missing = reading.check1 === '' || (device.type !== 'PVB' && reading.check2 === '') || (needsThird(device.type) && reading.relief === '');
        if (missing) {
          errors.push('Enter the readings for ' + device.serial + '.');
          return;
        }
        var judged = judge(device.type, reading);
        results.push({
          id: 'tr-live-' + job.id + '-' + device.id,
          job_id: job.id,
          device_id: device.id,
          check1_psi: Number(reading.check1),
          check2_psi: reading.check2 === '' ? null : Number(reading.check2),
          relief_opening_psi: reading.relief === '' ? null : Number(reading.relief),
          outcome: judged.outcome,
          notes: judged.reasons.join(' ')
        });
      });
    }
    if (errors.length) {
      setNotice(errors.join(' '), 'bad');
      return;
    }
    job.labor_minutes = Math.round(hours * 60);
    job.customer_signoff_name = String(draft.signoffName).trim();
    job.notes = draft.notes;
    job.checklist = draft.checklist;
    job.closed_at = new Date().toISOString();
    db.testResults = db.testResults.filter(function (t) { return t.job_id !== job.id; }).concat(results);
    var failed = results.some(function (r) { return r.outcome === 'fail'; });
    if (failed) {
      job.status = 'needs_follow_up';
      var failedSerials = results.filter(function (r) { return r.outcome === 'fail'; }).map(function (r) {
        var device = db.devices.find(function (d) { return d.id === r.device_id; });
        return device ? device.serial : r.device_id;
      });
      setNotice('Fail. ' + failedSerials.join(', ') + ' did not pass. Status is Needs follow-up. This job will not be invoiced until the return visit. Switch to Office to review it.', 'bad');
    } else {
      job.status = 'completed';
      setNotice('Job closed. Status is Completed, awaiting review. Switch to Office to approve it and generate the certificate.', 'ok');
    }
    state.preferReview = true;
    state.officeTab = 'review';
    state.lastClosedId = job.id;
  }

  function approveJob(id) {
    var job = getJob(id);
    if (!job || job.status !== 'completed') return;
    job.status = 'ready_to_invoice';
    job.approved_at = new Date().toISOString();
    state.certs = [];
    if (job.type === 'backflow_test') {
      state.certs = jobDevices(job).map(function (device) {
        return { jobId: job.id, deviceId: device.id, label: device.type + ' ' + device.serial };
      });
    }
    setNotice(
      state.certs.length
        ? 'Approved. Status is Ready to invoice. Download a certificate for each device, then switch to Bookkeeper.'
        : 'Approved. Status is Ready to invoice. Switch to Bookkeeper to export.',
      'ok'
    );
  }

  function scheduleReturn(id) {
    var job = getJob(id);
    if (!job) return;
    var created = {
      id: 'j-return-' + db.jobs.length,
      site_id: job.site_id,
      type: 'service',
      scheduled_start: addDays(todayISO(), 1),
      window: '8:00-12:00',
      assigned_tech_id: job.assigned_tech_id,
      status: 'scheduled',
      notes: 'Return visit after a failed test on ' + job.id + '.',
      labor_minutes: null,
      customer_signoff_name: '',
      signature_image: '',
      created_at: new Date().toISOString(),
      closed_at: null,
      approved_at: null,
      exported_at: null,
      device_ids: job.device_ids.slice(),
      checklist: {}
    };
    db.jobs.push(created);
    setNotice('Return visit scheduled for tomorrow. It is on the technician’s list and, from Cycle 2, on the dispatch board.', 'ok');
  }

  function scheduleRetest(deviceId) {
    var device = db.devices.find(function (d) { return d.id === deviceId; });
    if (!device) return;
    var created = {
      id: 'j-retest-' + db.jobs.length,
      site_id: device.site_id,
      type: 'backflow_test',
      scheduled_start: addDays(todayISO(), 7),
      window: '8:00-12:00',
      assigned_tech_id: 't4',
      status: 'scheduled',
      notes: 'Retest scheduled from the reminder list for ' + device.serial + '.',
      labor_minutes: null,
      customer_signoff_name: '',
      signature_image: '',
      created_at: new Date().toISOString(),
      closed_at: null,
      approved_at: null,
      exported_at: null,
      device_ids: [device.id],
      checklist: {}
    };
    db.jobs.push(created);
    var place = site(device.site_id);
    setNotice('Retest scheduled in 7 days at ' + place.address + ' for ' + device.serial + '.', 'ok');
  }

  function createJob() {
    var form = state.form;
    if (!form.siteId || !form.techId || !form.date) {
      setNotice('Choose a site, a technician, and a date.', 'bad');
      return;
    }
    if (form.type === 'backflow_test' && !form.deviceIds.length) {
      setNotice('Choose at least one device to test.', 'bad');
      return;
    }
    var created = {
      id: 'j-new-' + db.jobs.length,
      site_id: form.siteId,
      type: form.type,
      scheduled_start: form.date,
      window: form.timeWindow,
      assigned_tech_id: form.techId,
      status: 'scheduled',
      notes: '',
      labor_minutes: null,
      customer_signoff_name: '',
      signature_image: '',
      created_at: new Date().toISOString(),
      closed_at: null,
      approved_at: null,
      exported_at: null,
      device_ids: form.type === 'backflow_test' ? form.deviceIds.slice() : [],
      checklist: {}
    };
    db.jobs.push(created);
    var who = tech(form.techId);
    setNotice('Job ' + created.id + ' is scheduled with ' + who.name + ' on ' + form.date + '. It is on that technician’s list for that day.', 'ok');
  }

  function addPart(partId) {
    var job = getJob(state.jobId);
    if (!job || isClosed(job)) return;
    var draft = ensureDraft(job);
    var id = partId || draft.partId;
    var item = part(id);
    if (!item) {
      setNotice('Choose a part.', 'bad');
      return;
    }
    var qty = Number(draft.qty);
    if (!(qty > 0)) {
      setNotice('Enter a quantity greater than zero.', 'bad');
      return;
    }
    db.partUsed.push({
      id: 'pu-live-' + db.partUsed.length,
      job_id: job.id,
      part_id: item.id,
      qty: qty,
      unit_price: item.unit_price
    });
    setNotice(item.name + ' added. ' + money(item.unit_price) + ' each.', 'ok');
  }

  function removePart(id) {
    db.partUsed = db.partUsed.filter(function (p) { return p.id !== id; });
  }

  function addPhoto() {
    var job = getJob(state.jobId);
    if (!job || isClosed(job)) return;
    var existing = photosFor(job.id);
    var next = PHOTOS[existing.length % PHOTOS.length];
    db.photos.push({
      id: 'ph-live-' + db.photos.length,
      job_id: job.id,
      url: next.url,
      caption: next.caption
    });
  }

  function removePhoto(id) {
    db.photos = db.photos.filter(function (p) { return p.id !== id; });
  }

  function fillReadings(mode) {
    var job = getJob(state.jobId);
    if (!job) return;
    var draft = ensureDraft(job);
    jobDevices(job).forEach(function (device, index) {
      var sample = mode === 'fail' && index === 0 ? failingReading(device.type) : passingReading(device.type);
      draft.readings[device.id] = {
        check1: sample.check1 == null ? '' : String(sample.check1),
        check2: sample.check2 == null ? '' : String(sample.check2),
        relief: sample.relief == null ? '' : String(sample.relief),
        notes: ''
      };
    });
    setNotice(mode === 'fail'
      ? 'Sample failing readings are in the first device. The outcome below is labeled Fail. Close the job to move it to Needs follow-up.'
      : 'Sample passing readings are filled. Close the job when the signature is captured.', 'ok');
  }

  function lineItems(job) {
    var lines = [];
    if (job.labor_minutes) {
      var hours = job.labor_minutes / 60;
      lines.push({
        description: 'Labor — ' + typeLabel(job.type) + ' (' + hours + ' hrs)',
        qty: hours,
        amount: Math.round(hours * LABOR_RATE * 100) / 100
      });
    }
    partsFor(job.id).forEach(function (used) {
      var item = part(used.part_id);
      lines.push({
        description: item ? item.name : used.part_id,
        qty: used.qty,
        amount: Math.round(used.qty * used.unit_price * 100) / 100
      });
    });
    return lines;
  }

  function exportCsv() {
    var ready = db.jobs.filter(function (j) {
      return j.status === 'ready_to_invoice' || j.status === 'approved';
    });
    if (!ready.length) {
      setNotice('Nothing is waiting in Ready to invoice.', 'bad');
      return;
    }
    var rows = ['date,customer,line_item,quantity,amount'];
    ready.forEach(function (job) {
      var name = jobCustomer(job).name;
      var date = (job.approved_at || job.closed_at || job.scheduled_start).slice(0, 10);
      lineItems(job).forEach(function (line) {
        rows.push([date, csv(name), csv(line.description), line.qty, line.amount.toFixed(2)].join(','));
      });
      job.status = 'exported';
      job.exported_at = new Date().toISOString();
    });
    download(new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' }), 'ridgeline-accounting-export.csv');
    setNotice('Exported ' + ready.length + ' job' + (ready.length === 1 ? '' : 's') + '. The file is a CSV for the accounting system they already use. There is no live connection. Status is Exported.', 'ok');
  }

  function csv(value) {
    var text = String(value).replace(/"/g, '""');
    return '"' + text + '"';
  }

  function download(blob, filename) {
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1500);
  }

  function downloadCert(jobId, deviceId) {
    var job = getJob(jobId);
    var device = db.devices.find(function (d) { return d.id === deviceId; });
    var result = resultsFor(jobId).find(function (r) { return r.device_id === deviceId; });
    if (!job || !device || !result) return;
    var place = site(job.site_id);
    var cust = customer(place.customer_id);
    var who = tech(job.assigned_tech_id);
    var lines = [
      'SAMPLE DATA',
      'Fictional demonstration certificate. Not a filed test.',
      '',
      'Ridgeline Plumbing & Backflow',
      'Backflow prevention test certificate',
      '',
      'Customer: ' + cust.name,
      'Billing contact: ' + cust.billing_contact,
      'Site: ' + place.address,
      'Device: ' + device.type + '  ' + device.size,
      'Serial: ' + device.serial,
      'Location on site: ' + device.location_on_site,
      'Test date: ' + (job.closed_at || job.scheduled_start).slice(0, 10),
      'Technician: ' + (who ? who.name : ''),
      '',
      'Check valve 1: ' + formatPsi(result.check1_psi),
      'Check valve 2: ' + formatPsi(result.check2_psi),
      (device.type === 'PVB' ? 'Air inlet opening: ' : 'Relief valve opening: ') + formatPsi(result.relief_opening_psi),
      'Result: ' + (result.outcome === 'fail' ? 'Fail' : 'Pass'),
      result.notes ? 'Notes: ' + result.notes : '',
      '',
      'Customer sign-off: ' + (job.customer_signoff_name || ''),
      job.signature_image ? 'Signature: captured on the job ticket' : 'Signature: not captured',
      '',
      'One certificate is produced per device.',
      'Sample data. Ridgeline Plumbing & Backflow is fictional.'
    ].filter(function (line) { return line !== ''; });
    download(buildPdf(lines), 'ridgeline-certificate-' + device.serial + '.pdf');
  }

  function formatPsi(value) {
    if (value == null || value === '') return 'n/a';
    return value + ' psi';
  }

  function buildPdf(lines) {
    var wrapped = [];
    lines.forEach(function (line) {
      var safe = String(line).replace(/[^\x20-\x7E]/g, '-');
      if (safe.length <= 90) wrapped.push(safe);
      else {
        for (var i = 0; i < safe.length; i += 90) wrapped.push(safe.slice(i, i + 90));
      }
    });
    var y = 760;
    var commands = wrapped.map(function (line) {
      var cmd = 'BT /F1 11 Tf 48 ' + y + ' Td (' + pdfEscape(line) + ') Tj ET';
      y -= 16;
      return cmd;
    }).join('\n');
    var objects = [];
    objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n');
    objects.push('2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n');
    objects.push('3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n');
    objects.push('4 0 obj << /Length ' + commands.length + ' >> stream\n' + commands + '\nendstream endobj\n');
    objects.push('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n');
    var body = '%PDF-1.4\n';
    var offsets = [0];
    objects.forEach(function (obj) {
      offsets.push(body.length);
      body += obj;
    });
    var xref = body.length;
    var out = body + 'xref\n0 ' + (objects.length + 1) + '\n';
    out += '0000000000 65535 f \n';
    for (var i = 1; i < offsets.length; i += 1) {
      out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }
    out += 'trailer << /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
    return new Blob([out], { type: 'application/pdf' });
  }

  function pdfEscape(text) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  function daysBetween(a, b) {
    var ms = parseISO(b.slice(0, 10)) - parseISO(a.slice(0, 10));
    return ms / 86400000;
  }

  function metrics() {
    var today = todayISO();
    var weekStart = addDays(today, -6);
    var closedWeek = db.jobs.filter(function (j) {
      return j.closed_at && j.closed_at.slice(0, 10) >= weekStart && j.closed_at.slice(0, 10) <= today;
    });
    var timed = db.jobs.filter(function (j) { return j.closed_at && j.approved_at; });
    var after = timed.length
      ? timed.reduce(function (sum, j) { return sum + Math.max(0, daysBetween(j.closed_at, j.approved_at)); }, 0) / timed.length
      : 0;
    var unbilled = db.jobs.filter(function (j) {
      return j.status === 'completed' || j.status === 'approved' || j.status === 'ready_to_invoice' || j.status === 'needs_follow_up';
    });
    var withClose = db.jobs.filter(function (j) { return j.closed_at; });
    var partCount = withClose.reduce(function (sum, j) { return sum + partsFor(j.id).length; }, 0);
    var due = db.devices.filter(function (d) {
      return d.next_test_due >= today && d.next_test_due <= addDays(today, 60);
    }).sort(function (a, b) { return a.next_test_due < b.next_test_due ? -1 : 1; });
    return {
      closedWeek: closedWeek.length,
      after: Math.round(after * 10) / 10,
      unbilled: unbilled,
      partsPerJob: withClose.length ? Math.round((partCount / withClose.length) * 10) / 10 : 0,
      due: due
    };
  }

  function sampleChip() {
    return '<span class="hub-sample">Sample data</span>';
  }

  function statusChip(status) {
    return '<span class="hub-chip hub-chip--' + status + '">' + esc(statusLabel(status)) + '</span>';
  }

  function outcomeChip(outcome) {
    if (outcome === 'fail') return '<span class="hub-chip hub-chip--fail">Fail</span>';
    if (outcome === 'pass') return '<span class="hub-chip hub-chip--pass">Pass</span>';
    return '';
  }

  var rootEl = null;
  var focusRestore = null;

  function render() {
    var active = document.activeElement;
    if (active && active.id && rootEl.contains(active)) {
      focusRestore = { id: active.id, pos: active.selectionStart };
    } else {
      focusRestore = null;
    }
    rootEl.innerHTML = shell();
    setupSignature();
    if (state.scrollTo) {
      var target = document.getElementById(state.scrollTo);
      state.scrollTo = '';
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (focusRestore) {
      var el = document.getElementById(focusRestore.id);
      if (el) {
        el.focus();
        if (typeof focusRestore.pos === 'number' && el.setSelectionRange) {
          try { el.setSelectionRange(focusRestore.pos, focusRestore.pos); } catch (err) { /* number inputs */ }
        }
      }
    }
  }

  function shell() {
    return '<div class="hub-bar">' +
      '<div class="hub-bar__brand">' +
        '<span class="hub-logo" aria-hidden="true"><svg width="28" height="18" viewBox="0 0 28 18"><path d="M2 4 L2 14 L10 9 Z" fill="#1A47B8"/><path d="M26 4 L26 14 L18 9 Z" fill="#1A47B8"/></svg> replikte</span>' +
        '<span class="hub-badge">Demo · fictional company and sample data</span>' +
      '</div>' +
      '<p class="hub-company">Ridgeline Plumbing &amp; Backflow</p>' +
      '<div class="hub-controls">' +
        '<div class="hub-switch" role="group" aria-label="Section">' +
          button('section', 'method', 'How we got here', state.section === 'method') +
          button('section', 'work', 'The work', state.section === 'work') +
        '</div>' +
        '<div class="hub-switch" role="group" aria-label="Demo mode, product as of this cycle">' +
          button('cycle', '1', 'Cycle 1', state.cycle === 1) +
          button('cycle', '2', 'Cycle 2', state.cycle === 2) +
          button('cycle', '3', 'Cycle 3', state.cycle === 3) +
        '</div>' +
        '<div class="hub-switch" role="group" aria-label="Role">' +
          button('role', 'tech', 'Technician', state.role === 'tech') +
          button('role', 'office', 'Office', state.role === 'office') +
          button('role', 'bookkeeper', 'Bookkeeper', state.role === 'bookkeeper') +
          button('role', 'owner', 'Owner', state.role === 'owner') +
        '</div>' +
      '</div>' +
      '<p class="hub-cycle-note">' + esc(cycleNote()) + '</p>' +
      releaseStrip() +
      '<div class="hub-notice hub-notice--' + state.noticeTone + '" role="status" aria-live="polite">' +
        (state.notice ? esc(state.notice) : '') +
        certButtons() +
      '</div>' +
    '</div>' +
    '<div class="hub-body">' + (state.section === 'method' ? methodView() : workView()) + '</div>';
  }

  function button(action, value, label, pressed) {
    return '<button type="button" class="hub-switch__btn' + (pressed ? ' is-on' : '') + '" data-action="' + action + '" data-value="' + value + '" aria-pressed="' + (pressed ? 'true' : 'false') + '">' + esc(label) + '</button>';
  }

  function cycleNote() {
    if (state.cycle === 1) return 'Demo mode: as of Cycle 1. Digital ticket, readings, signature, review, certificate, and export.';
    if (state.cycle === 2) return 'Demo mode: as of Cycle 2. The dispatch board and parts search are in. Cycle 1 is still here.';
    return 'Demo mode: as of Cycle 3. Retest reminders and site history are in. Earlier cycles stay.';
  }

  function releaseStrip() {
    if (state.cycle < 2) return '';
    var items = state.cycle === 2
      ? [['goto-board', 'Open the dispatch board'], ['goto-parts', 'Open parts search on the job']]
      : [['goto-retests', 'Open retest reminders'], ['goto-history', 'Open site history on the job']];
    return '<div class="hub-release">' + items.map(function (item) {
      return '<button type="button" data-action="' + item[0] + '">' + esc(item[1]) + '</button>';
    }).join('') + '</div>';
  }

  function certButtons() {
    if (!state.certs.length) return '';
    return '<div class="hub-cert-row">' + state.certs.map(function (cert) {
      return '<button type="button" data-action="download-cert" data-job-id="' + esc(cert.jobId) + '" data-device-id="' + esc(cert.deviceId) + '">Download certificate · ' + esc(cert.label) + '</button>';
    }).join('') + '<span class="hub-sample">Sample certificate</span></div>';
  }

  function workView() {
    if (state.role === 'tech') return techView();
    if (state.role === 'office') return officeView();
    if (state.role === 'bookkeeper') return bookView();
    return ownerView();
  }

  function techView() {
    if (state.jobId && getJob(state.jobId)) return jobView(getJob(state.jobId));
    var mine = db.jobs.filter(function (j) {
      return j.assigned_tech_id === state.techId && j.scheduled_start === todayISO();
    }).sort(function (a, b) {
      if (a.id === 'j-demo') return -1;
      if (b.id === 'j-demo') return 1;
      return a.window < b.window ? -1 : 1;
    });
    var options = db.technicians.map(function (t) {
      return '<option value="' + t.id + '"' + (t.id === state.techId ? ' selected' : '') + '>' + esc(t.name) + (t.role === 'foreman' ? ' · foreman' : '') + '</option>';
    }).join('');
    return '<div class="hub-tech">' +
      '<label for="tech-select">Technician</label>' +
      '<select id="tech-select" data-bind="techId" data-rerender="1">' + options + '</select>' +
      '<h2>Today</h2>' +
      '<p class="hub-muted">Jobs for ' + esc(todayISO()) + '. ' + sampleChip() + '</p>' +
      (mine.some(function (j) { return j.id === 'j-demo'; }) ? '<p>Start with Kettlehouse Diner, the backflow test.</p>' : '') +
      (mine.length ? mine.map(jobCard).join('') : '<p>No jobs on this phone today.</p>') +
    '</div>';
  }

  function jobCard(job) {
    var place = site(job.site_id);
    var cust = customer(place.customer_id);
    return '<article class="hub-card">' +
      '<h3>' + esc(cust.name) + '</h3>' +
      '<p>' + esc(typeLabel(job.type)) + ' · ' + esc(job.window) + '</p>' +
      '<p class="hub-muted">' + esc(place.address) + '</p>' +
      statusChip(job.status) +
      '<button type="button" data-action="open-job" data-job-id="' + job.id + '">Open job</button>' +
    '</article>';
  }

  function jobView(job) {
    var place = site(job.site_id);
    var cust = customer(place.customer_id);
    var closed = isClosed(job);
    var draft = ensureDraft(job);
    var history = '';
    if (state.cycle >= 3) {
      var visits = db.jobs.filter(function (j) {
        return j.site_id === job.site_id && j.id !== job.id && j.closed_at;
      }).sort(function (a, b) { return a.scheduled_start < b.scheduled_start ? 1 : -1; }).slice(0, 3);
      history = '<section id="history"><h3>Site history</h3><p class="hub-muted">Last visits at this site.</p>' +
        (visits.length ? '<ul class="hub-list">' + visits.map(function (v) {
          return '<li><strong>' + esc(v.scheduled_start) + '</strong> · ' + esc(typeLabel(v.type)) + '<br>' + esc(v.notes || 'No notes on that visit.') + '</li>';
        }).join('') + '</ul>' : '<p>No earlier visits in this sample.</p>') +
      '</section>';
    }
    return '<div class="hub-tech"><form id="close-form">' +
      '<button type="button" data-action="back-today">Today</button>' +
      '<h2>' + esc(cust.name) + '</h2>' +
      '<p>' + esc(typeLabel(job.type)) + ' · ' + esc(job.window) + '</p>' +
      statusChip(job.status) +
      trail(job) +
      '<section><h3>Site</h3><p>' + esc(place.address) + '</p>' +
        '<p><span class="hub-k">Access notes</span> ' + esc(place.access_notes) + '</p>' +
        '<p class="hub-muted">Billing contact: ' + esc(cust.billing_contact) + '</p></section>' +
      history +
      '<section><h3>Devices on site</h3><ul class="hub-list">' + jobDevices(job).map(function (d) {
        return '<li>' + esc(d.type) + ' · ' + esc(d.size) + ' · ' + esc(d.serial) + '<br><span class="hub-muted">' + esc(d.location_on_site) + ' · next test ' + esc(d.next_test_due) + '</span></li>';
      }).join('') + '</ul></section>' +
      checklistBlock(job, draft, closed) +
      (job.type === 'backflow_test' ? readingsBlock(job, draft, closed) : '') +
      partsBlock(job, draft, closed) +
      photosBlock(job, closed) +
      '<section><h3>Labor</h3><label for="labor-hours">Labor hours</label>' +
        '<input id="labor-hours" type="number" min="0.25" step="0.25" inputmode="decimal" data-bind="draft.laborHours" value="' + esc(draft.laborHours) + '"' + (closed ? ' disabled' : '') + '>' +
        '<p class="hub-muted">Illustrative rate used on the invoice: ' + money(LABOR_RATE) + ' per hour. ' + sampleChip() + '</p></section>' +
      '<section><label for="job-notes">Job notes</label>' +
        '<textarea id="job-notes" data-bind="draft.notes"' + (closed ? ' disabled' : '') + '>' + esc(draft.notes) + '</textarea></section>' +
      signatureBlock(job, draft, closed) +
      (!closed && job.status === 'scheduled' ? '<button type="button" data-action="start-job">Start job</button>' : '') +
      (!closed ? '<button type="button" class="hub-primary" data-action="close-job">Close job</button>' : '') +
      (closed ? '<p class="hub-muted">This job is closed. Office reviews it from the Review queue.</p>' : '') +
    '</form></div>';
  }

  function trail(job) {
    if (job.status === 'needs_follow_up') {
      return '<ol class="hub-trail"><li class="is-done">Scheduled</li><li class="is-done">In progress</li><li class="is-now">Needs follow-up</li></ol>';
    }
    var steps = ['scheduled', 'in_progress', 'completed', 'approved', 'ready_to_invoice', 'exported'];
    var index = steps.indexOf(job.status);
    if (job.status === 'ready_to_invoice') index = steps.indexOf('ready_to_invoice');
    return '<ol class="hub-trail">' + steps.map(function (step, i) {
      var cls = i < index ? 'is-done' : i === index ? 'is-now' : '';
      return '<li class="' + cls + '">' + esc(statusLabel(step)) + '</li>';
    }).join('') + '</ol>';
  }

  function checklistBlock(job, draft, closed) {
    var items = CHECKLISTS[job.type] || CHECKLISTS.service;
    return '<section><h3>Checklist</h3>' + items.map(function (item, i) {
      var id = 'check-' + i;
      var on = draft.checklist[item] ? ' checked' : '';
      return '<label class="hub-check" for="' + id + '"><input id="' + id + '" type="checkbox" data-check="' + esc(item) + '"' + on + (closed ? ' disabled' : '') + '> ' + esc(item) + '</label>';
    }).join('') + '</section>';
  }

  function readingsBlock(job, draft, closed) {
    var devices = jobDevices(job);
    var saved = resultsFor(job.id);
    var body = devices.map(function (device) {
      var existing = saved.find(function (r) { return r.device_id === device.id; });
      if (closed && existing) {
        return '<article class="hub-card"><h3>' + esc(device.type) + ' · ' + esc(device.serial) + '</h3>' +
          '<p>Check valve 1: ' + esc(formatPsi(existing.check1_psi)) + '</p>' +
          '<p>Check valve 2: ' + esc(formatPsi(existing.check2_psi)) + '</p>' +
          '<p>' + esc(device.type === 'PVB' ? 'Air inlet opening' : 'Relief valve opening') + ': ' + esc(formatPsi(existing.relief_opening_psi)) + '</p>' +
          '<p>' + outcomeChip(existing.outcome) + '</p>' +
          (existing.outcome === 'fail' ? '<p>' + esc(existing.notes) + '</p>' : '') +
        '</article>';
      }
      var reading = draft.readings[device.id] || { check1: '', check2: '', relief: '', notes: '' };
      var preview = previewOutcome(device, reading);
      return '<article class="hub-card"><h3>' + esc(device.type) + ' · ' + esc(device.serial) + '</h3>' +
        '<p class="hub-muted">' + esc(device.location_on_site) + ' · ' + esc(device.size) + '</p>' +
        '<p class="hub-muted">' + esc(ruleText(device.type)) + '</p>' +
        numField(device, 'check1', device.type === 'PVB' ? 'Check valve (psi)' : 'Check valve 1 (psi)', reading.check1) +
        (device.type === 'PVB' ? '' : numField(device, 'check2', 'Check valve 2 (psi)', reading.check2)) +
        (needsThird(device.type) ? numField(device, 'relief', thirdLabel(device.type), reading.relief) : '') +
        '<label for="note-' + device.id + '">Reading notes</label>' +
        '<input id="note-' + device.id + '" type="text" data-reading="notes" data-device="' + device.id + '" value="' + esc(reading.notes) + '">' +
        (preview ? '<p>' + outcomeChip(preview.outcome) + (preview.outcome === 'fail' ? ' ' + esc(preview.reasons.join(' ')) : ' Readings are inside the passing range.') + '</p>' : '') +
      '</article>';
    }).join('');
    var fills = closed ? '' : '<div class="hub-row">' +
      '<button type="button" data-action="fill-pass">Fill sample passing readings</button>' +
      '<button type="button" data-action="fill-fail">Fill sample failing readings</button></div>';
    return '<section><h3>Test readings</h3>' + fills + body + '</section>';
  }

  function numField(device, field, label, value) {
    var id = 'r-' + device.id + '-' + field;
    return '<label for="' + id + '">' + esc(label) + '</label>' +
      '<input id="' + id + '" type="number" inputmode="decimal" min="0" step="0.1" data-live="1" data-reading="' + field + '" data-device="' + device.id + '" value="' + esc(value) + '">';
  }

  function previewOutcome(device, reading) {
    if (reading.check1 === '' || (device.type !== 'PVB' && reading.check2 === '') || (needsThird(device.type) && reading.relief === '')) return null;
    return judge(device.type, reading);
  }

  function partsBlock(job, draft, closed) {
    var lines = partsFor(job.id).map(function (used) {
      var item = part(used.part_id);
      return '<li>' + esc(item.name) + ' · qty ' + used.qty + ' · ' + money(used.unit_price) +
        (closed ? '' : ' <button type="button" data-action="remove-part" data-part-used="' + used.id + '">Remove</button>') +
        '</li>';
    }).join('');
    var picker = '';
    if (!closed && state.cycle < 2) {
      var options = db.parts.map(function (p) {
        return '<option value="' + p.id + '"' + (p.id === draft.partId ? ' selected' : '') + '>' + esc(p.name) + ' — ' + money(p.unit_price) + '</option>';
      }).join('');
      picker = '<label for="part-select">Part</label><select id="part-select" data-bind="draft.partId">' + options + '</select>' +
        '<label for="part-qty">Quantity</label><input id="part-qty" type="number" min="1" step="1" data-bind="draft.qty" value="' + esc(draft.qty) + '">' +
        '<button type="button" data-action="add-part">Add part</button>';
    }
    if (!closed && state.cycle >= 2) {
      var q = (state.form.partQuery || '').trim().toLowerCase();
      var matches = !q ? [] : db.parts.filter(function (p) {
        return (p.name + ' ' + p.sku).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);
      picker = '<div id="parts"><label for="part-search">Search parts</label>' +
        '<input id="part-search" type="search" data-bind="form.partQuery" data-live="1" value="' + esc(state.form.partQuery) + '" placeholder="Name or SKU">' +
        '<label for="part-qty-2">Quantity</label><input id="part-qty-2" type="number" min="1" step="1" data-bind="draft.qty" value="' + esc(draft.qty) + '">' +
        (q ? (matches.length ? '<ul class="hub-list">' + matches.map(function (p) {
          return '<li><button type="button" data-action="pick-part" data-part-id="' + p.id + '">' + esc(p.name) + ' · ' + esc(p.sku) + ' · ' + money(p.unit_price) + '</button></li>';
        }).join('') + '</ul>' : '<p>No parts match that search.</p>') : '<p class="hub-muted">Type to search the price list. Prices show before you add a part.</p>') +
      '</div>';
    }
    return '<section><h3>Parts used</h3>' + picker +
      (lines ? '<ul class="hub-list">' + lines + '</ul>' : '<p class="hub-muted">No parts on this job yet.</p>') +
      '<p class="hub-muted">' + sampleChip() + '</p></section>';
  }

  function photosBlock(job, closed) {
    var shots = photosFor(job.id);
    return '<section><h3>Photos</h3>' +
      (closed ? '' : '<button type="button" data-action="add-photo">Attach a photo</button>') +
      '<div class="hub-photos">' + shots.map(function (shot) {
        return '<figure><img src="' + esc(shot.url) + '" alt="' + esc(shot.caption) + '"><figcaption>' + esc(shot.caption) + '</figcaption>' +
          (closed ? '' : '<button type="button" data-action="remove-photo" data-photo-id="' + shot.id + '">Remove photo</button>') +
        '</figure>';
      }).join('') + '</div>' +
      '<p class="hub-muted">Placeholder images stored with the demo. ' + sampleChip() + '</p></section>';
  }

  function signatureBlock(job, draft, closed) {
    if (closed) {
      return '<section><h3>Customer signature</h3><p>' + esc(job.customer_signoff_name || 'No name') + '</p>' +
        (job.signature_image ? '<img class="hub-sig-img" alt="Captured customer signature" src="' + job.signature_image + '">' : '<p>No signature stored.</p>') +
      '</section>';
    }
    return '<section><label for="signoff-name">Customer name</label>' +
      '<input id="signoff-name" type="text" autocomplete="off" data-bind="draft.signoffName" value="' + esc(draft.signoffName) + '">' +
      '<p id="sig-label">Customer signature</p>' +
      '<canvas id="sig-pad" aria-labelledby="sig-label"></canvas>' +
      '<button type="button" data-action="clear-sig">Clear signature</button></section>';
  }

  function officeView() {
    var tabs = '<div class="hub-switch" role="group" aria-label="Office sections">' +
      button('office-tab', 'assign', 'Assign', state.officeTab === 'assign') +
      button('office-tab', 'review', 'Review', state.officeTab === 'review') +
      (state.cycle >= 3 ? button('office-tab', 'retests', 'Retests', state.officeTab === 'retests') : '') +
    '</div>';
    var body = state.officeTab === 'review' ? reviewView() : state.officeTab === 'retests' ? retestView() : assignView();
    return '<div class="hub-wide">' + tabs + body + '</div>';
  }

  function assignView() {
    var custOptions = db.customers.map(function (c) {
      return '<option value="' + c.id + '"' + (c.id === state.form.customerId ? ' selected' : '') + '>' + esc(c.name) + '</option>';
    }).join('');
    var siteOptions = sitesFor(state.form.customerId).map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === state.form.siteId ? ' selected' : '') + '>' + esc(s.address) + '</option>';
    }).join('');
    var techOptions = db.technicians.map(function (t) {
      return '<option value="' + t.id + '"' + (t.id === state.form.techId ? ' selected' : '') + '>' + esc(t.name) + '</option>';
    }).join('');
    var devices = state.form.type === 'backflow_test' ? devicesForSite(state.form.siteId).map(function (d) {
      var on = state.form.deviceIds.indexOf(d.id) !== -1;
      return '<label class="hub-check"><input type="checkbox" data-device-pick="' + d.id + '"' + (on ? ' checked' : '') + '> ' + esc(d.type) + ' ' + esc(d.serial) + ' · ' + esc(d.location_on_site) + '</label>';
    }).join('') : '';
    var form = '<form class="hub-card" id="create-form"><h2>Assign a job</h2>' +
      '<label for="job-customer">Customer</label><select id="job-customer" data-bind="form.customerId" data-rerender="1">' + custOptions + '</select>' +
      '<label for="job-site">Site</label><select id="job-site" data-bind="form.siteId" data-rerender="1">' + siteOptions + '</select>' +
      '<label for="job-type">Job type</label><select id="job-type" data-bind="form.type" data-rerender="1">' +
        '<option value="service"' + (state.form.type === 'service' ? ' selected' : '') + '>Service call</option>' +
        '<option value="install"' + (state.form.type === 'install' ? ' selected' : '') + '>Small install</option>' +
        '<option value="backflow_test"' + (state.form.type === 'backflow_test' ? ' selected' : '') + '>Backflow test</option></select>' +
      devices +
      '<label for="job-tech">Technician</label><select id="job-tech" data-bind="form.techId">' + techOptions + '</select>' +
      '<label for="job-date">Date</label><input id="job-date" type="date" data-bind="form.date" value="' + esc(state.form.date) + '">' +
      '<label for="job-window">Time window</label><select id="job-window" data-bind="form.timeWindow">' +
        ['8:00-12:00', '12:00-4:00', '4:00-6:00'].map(function (w) {
          return '<option' + (state.form.timeWindow === w ? ' selected' : '') + '>' + w + '</option>';
        }).join('') + '</select>' +
      '<button type="button" class="hub-primary" data-action="create-job">Assign job</button></form>';
    if (state.cycle < 2) {
      var upcoming = db.jobs.filter(function (j) {
        return j.status === 'scheduled' && j.scheduled_start >= todayISO() && j.scheduled_start <= addDays(todayISO(), 7);
      }).slice(0, 12);
      return form + '<h2>Scheduled this week</h2><div class="hub-table-wrap"><table class="hub-table"><thead><tr><th scope="col">Date</th><th scope="col">Customer</th><th scope="col">Type</th><th scope="col">Technician</th><th scope="col">Status</th></tr></thead><tbody>' +
        upcoming.map(function (j) {
          return '<tr><td>' + esc(j.scheduled_start) + '</td><td>' + esc(jobCustomer(j).name) + '</td><td>' + esc(typeLabel(j.type)) + '</td><td>' + esc(tech(j.assigned_tech_id).name) + '</td><td>' + statusChip(j.status) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    return form + boardView();
  }

  function boardView() {
    var columns = [
      ['scheduled', 'Scheduled'],
      ['in_progress', 'In progress'],
      ['completed', 'Awaiting review'],
      ['needs_follow_up', 'Needs follow-up'],
      ['ready_to_invoice', 'Ready to invoice']
    ];
    var horizonStart = addDays(todayISO(), -3);
    var horizonEnd = addDays(todayISO(), 14);
    return '<section id="board"><h2>Dispatch board</h2><p class="hub-muted">Live status for jobs from the last three days through the next two weeks. ' + sampleChip() + '</p><div class="hub-board">' +
      columns.map(function (col) {
        var cards = db.jobs.filter(function (j) {
          return j.status === col[0] && j.scheduled_start >= horizonStart && j.scheduled_start <= horizonEnd;
        }).slice(0, 6);
        return '<div class="hub-col"><h3>' + esc(col[1]) + '</h3>' + cards.map(function (j) {
          return '<article class="hub-card"><p><strong>' + esc(jobCustomer(j).name) + '</strong></p><p>' + esc(typeLabel(j.type)) + '</p><p class="hub-muted">' + esc(tech(j.assigned_tech_id).name) + ' · ' + esc(j.scheduled_start) + ' · ' + esc(j.window) + '</p>' + statusChip(j.status) + '</article>';
        }).join('') + (cards.length ? '' : '<p class="hub-muted">None in this window.</p>') + '</div>';
      }).join('') + '</div></section>';
  }

  function reviewView() {
    var queue = db.jobs.filter(function (j) {
      return j.status === 'completed' || j.status === 'needs_follow_up';
    }).sort(function (a, b) {
      return (a.closed_at || '') < (b.closed_at || '') ? 1 : -1;
    });
    if (!queue.length) return '<h2>Review</h2><p>No jobs are waiting. Close one from the technician view.</p>';
    return '<h2>Review</h2><p class="hub-muted">Closed jobs waiting on the office. ' + sampleChip() + '</p>' +
      queue.map(function (job) {
        var place = site(job.site_id);
        var results = resultsFor(job.id);
        return '<article class="hub-card' + (job.id === state.lastClosedId ? ' hub-card--focus' : '') + '"><h3>' + esc(jobCustomer(job).name) + '</h3>' +
          '<p>' + esc(place.address) + '</p><p>' + esc(typeLabel(job.type)) + ' · ' + esc(tech(job.assigned_tech_id).name) + '</p>' +
          statusChip(job.status) +
          (job.notes ? '<p>' + esc(job.notes) + '</p>' : '') +
          '<p>Labor ' + (job.labor_minutes ? (job.labor_minutes / 60) + ' hrs' : 'not recorded') + ' · Sign-off ' + esc(job.customer_signoff_name || 'missing') + '</p>' +
          (results.length ? '<ul class="hub-list">' + results.map(function (r) {
            var device = db.devices.find(function (d) { return d.id === r.device_id; });
            return '<li>' + esc(device ? device.serial : '') + ' ' + outcomeChip(r.outcome) + (r.outcome === 'fail' ? ' ' + esc(r.notes) : '') + '</li>';
          }).join('') + '</ul>' : '') +
          (job.status === 'completed' ? '<button type="button" class="hub-primary" data-action="approve" data-job-id="' + job.id + '">Approve</button>' : '') +
          (job.status === 'needs_follow_up' ? '<p>Fail. Needs follow-up before this can be invoiced.</p><button type="button" data-action="schedule-return" data-job-id="' + job.id + '">Schedule return visit</button>' : '') +
        '</article>';
      }).join('');
  }

  function retestView() {
    return '<section id="retests"><h2>Retest reminders</h2><p class="hub-muted">Devices due soon. ' + sampleChip() + '</p>' +
      retestGroup('Due in 7 days', 0, 7) +
      retestGroup('Due in 30 days', 8, 30) +
      retestGroup('Due in 60 days', 31, 60) +
    '</section>';
  }

  function retestGroup(title, from, to) {
    var start = addDays(todayISO(), from);
    var end = addDays(todayISO(), to);
    var rows = db.devices.filter(function (d) {
      return d.next_test_due >= start && d.next_test_due <= end;
    });
    return '<h3>' + esc(title) + '</h3>' + (rows.length ? '<div class="hub-table-wrap"><table class="hub-table"><thead><tr><th scope="col">Due</th><th scope="col">Customer</th><th scope="col">Device</th><th scope="col">Serial</th><th scope="col">Action</th></tr></thead><tbody>' +
      rows.map(function (d) {
        var place = site(d.site_id);
        return '<tr><td>' + esc(d.next_test_due) + '</td><td>' + esc(customer(place.customer_id).name) + '</td><td>' + esc(d.type) + ' ' + esc(d.location_on_site) + '</td><td>' + esc(d.serial) + '</td><td><button type="button" data-action="schedule-retest" data-device-id="' + d.id + '">Schedule retest</button></td></tr>';
      }).join('') + '</tbody></table></div>' : '<p class="hub-muted">None in this window.</p>');
  }

  function bookView() {
    var ready = db.jobs.filter(function (j) {
      return j.status === 'ready_to_invoice' || j.status === 'approved';
    }).sort(function (a, b) { return (a.approved_at || '') < (b.approved_at || '') ? 1 : -1; });
    var cards = ready.map(function (job) {
      var lines = lineItems(job);
      var total = lines.reduce(function (sum, line) { return sum + line.amount; }, 0);
      return '<article class="hub-card"><h3>' + esc(jobCustomer(job).name) + '</h3>' + statusChip(job.status) +
        '<ul class="hub-list">' + lines.map(function (line) {
          return '<li>' + esc(line.description) + ' · qty ' + line.qty + ' · ' + money(line.amount) + '</li>';
        }).join('') + '</ul><p><strong>Total ' + money(total) + '</strong> ' + sampleChip() + '</p></article>';
    }).join('');
    return '<div class="hub-wide"><h2>Ready to invoice</h2>' +
      '<p class="hub-muted">Labor, parts, and totals from approved jobs. Illustrative labor rate ' + money(LABOR_RATE) + ' per hour. ' + sampleChip() + '</p>' +
      '<button type="button" class="hub-primary" data-action="export-csv">Export for your accounting system</button>' +
      '<p class="hub-muted">Downloads a CSV. There is no live accounting connection.</p>' +
      (cards || '<p>The queue is clear.</p>') + '</div>';
  }

  function ownerView() {
    var m = metrics();
    var weeks = [];
    for (var w = 5; w >= 0; w -= 1) {
      var start = addDays(todayISO(), -(7 * (w + 1)) + 1);
      var end = addDays(todayISO(), -7 * w);
      var jobs = db.jobs.filter(function (j) {
        return j.closed_at && j.closed_at.slice(0, 10) >= start && j.closed_at.slice(0, 10) <= end;
      });
      var parts = jobs.reduce(function (sum, j) { return sum + partsFor(j.id).length; }, 0);
      weeks.push({ label: end.slice(5), avg: jobs.length ? Math.round((parts / jobs.length) * 10) / 10 : 0 });
    }
    var maxAvg = Math.max.apply(null, weeks.map(function (week) { return week.avg; }).concat([1]));
    return '<div class="hub-wide"><h2>Owner</h2><p class="hub-muted">Everything on this screen is ' + sampleChip() + '</p>' +
      '<div class="hub-stats">' +
        stat('Jobs closed this week', String(m.closedWeek)) +
        stat('Unbilled jobs', String(m.unbilled.length)) +
        stat('Parts captured per job', String(m.partsPerJob)) +
        stat('Retests due in 60 days', String(m.due.length)) +
      '</div>' +
      '<section class="hub-card"><h3>Days from job to invoice-ready</h3>' +
        '<svg class="hub-chart" viewBox="0 0 640 220" role="img" aria-label="Bar chart. Before, 16 days, illustrative. After, ' + (m.after === 0 ? 'same day' : m.after + ' days') + ' in this sample.">' +
          '<text x="20" y="28" fill="#4A4A47" font-size="14">Sample data</text>' +
          bar(80, 16, 18, 'Before', '16 days') +
          bar(280, Math.max(m.after, 0.4), 18, 'After', m.after === 0 ? 'Same day' : m.after + ' days') +
        '</svg>' +
        '<p class="hub-muted">Before is illustrative, from the paper process (about one to three weeks). After is computed from this sample, using closed date to approved date.</p></section>' +
      '<section class="hub-card"><h3>Parts captured per closed job</h3>' +
        '<svg class="hub-chart" viewBox="0 0 640 220" role="img" aria-label="Parts captured per job over six weeks. Sample data.">' +
          '<text x="20" y="28" fill="#4A4A47" font-size="14">Sample data</text>' +
          weeks.map(function (week, i) {
            var h = 120 * (week.avg / maxAvg);
            var x = 40 + i * 100;
            return '<rect x="' + x + '" y="' + (170 - h) + '" width="48" height="' + h + '" fill="#1A47B8"></rect>' +
              '<text x="' + (x + 24) + '" y="' + (164 - h) + '" text-anchor="middle" fill="#0F1115" font-size="13">' + week.avg + '</text>' +
              '<text x="' + (x + 24) + '" y="196" text-anchor="middle" fill="#4A4A47" font-size="13">' + week.label + '</text>';
          }).join('') +
        '</svg></section>' +
      '<section class="hub-card"><h3>Unbilled</h3><ul class="hub-list">' + m.unbilled.slice(0, 6).map(function (j) {
        return '<li>' + esc(jobCustomer(j).name) + ' · ' + esc(typeLabel(j.type)) + ' · ' + statusChip(j.status) + '</li>';
      }).join('') + '</ul></section>' +
      '<section class="hub-card" id="owner-retests"><h3>Retests due in the next 60 days</h3>' +
        (m.due.length ? '<ul class="hub-list">' + m.due.slice(0, 8).map(function (d) {
          var place = site(d.site_id);
          return '<li>' + esc(d.next_test_due) + ' · ' + esc(customer(place.customer_id).name) + ' · ' + esc(d.type) + ' ' + esc(d.serial) +
            (state.cycle >= 3 ? ' <button type="button" data-action="schedule-retest" data-device-id="' + d.id + '">Schedule retest</button>' : '') +
          '</li>';
        }).join('') + '</ul>' : '<p>None in this sample window.</p>') +
        (state.cycle >= 3 ? '' : '<p class="hub-muted">Scheduling a retest from this list ships in Cycle 3.</p>') +
      '</section></div>';
  }

  function stat(label, value) {
    return '<article class="hub-stat"><p class="hub-stat__value">' + esc(value) + '</p><p>' + esc(label) + '</p>' + sampleChip() + '</article>';
  }

  function bar(x, value, max, label, display) {
    var h = Math.max(4, 120 * (value / max));
    return '<rect x="' + x + '" y="' + (160 - h) + '" width="80" height="' + h + '" fill="#1A47B8"></rect>' +
      '<text x="' + (x + 40) + '" y="' + (152 - h) + '" text-anchor="middle" fill="#0F1115" font-size="14">' + display + '</text>' +
      '<text x="' + (x + 40) + '" y="190" text-anchor="middle" fill="#4A4A47" font-size="14">' + label + '</text>';
  }

  function methodView() {
    var tabs = '<div class="hub-switch" role="group" aria-label="How we got here">' +
      button('method-tab', 'discovery', 'Discovery', state.methodTab === 'discovery') +
      button('method-tab', 'roadmap', 'Roadmap', state.methodTab === 'roadmap') +
      button('method-tab', 'cycles', 'Cycles', state.methodTab === 'cycles') +
      button('method-tab', 'feedback', 'Feedback', state.methodTab === 'feedback') +
    '</div>';
    var body = state.methodTab === 'roadmap' ? roadmapView() : state.methodTab === 'cycles' ? cyclesView() : state.methodTab === 'feedback' ? feedbackView() : discoveryView();
    return '<div class="hub-wide">' + tabs + body + '</div>';
  }

  function discoveryView() {
    return '<h2>Discovery</h2><p>Before any software, time with the crews and the office. This is the paper path, and where the record breaks.</p>' +
      '<ol class="hub-swim">' +
        swim('Technician', 'Writes the job on a paper ticket at the site.', false) +
        swim('Truck', 'The ticket rides in the truck for days.', true) +
        swim('Office', 'Whatever is still readable gets retyped. Illegible tickets never become invoices.', true) +
        swim('Bookkeeper', 'Types the same ticket into accounting. The invoice goes out one to three weeks later.', true) +
        swim('Customer', 'Gets a late invoice. The backflow certificate may still be missing.', true) +
      '</ol>' +
      '<h3>Pain register</h3><p class="hub-muted">Estimated monthly cost is sample data, not a measured result.</p>' +
      '<div class="hub-table-wrap"><table class="hub-table"><caption>Pains found in discovery. Costs are sample data.</caption><thead><tr>' +
        '<th scope="col">#</th><th scope="col">Pain</th><th scope="col">Who feels it</th><th scope="col">Frequency</th><th scope="col">Estimated monthly cost</th><th scope="col">Root cause</th>' +
      '</tr></thead><tbody>' + PAINS.map(function (p) {
        return '<tr><th scope="row">' + p[0] + '</th><td>' + esc(p[1]) + '</td><td>' + esc(p[2]) + '</td><td>' + esc(p[3]) + '</td><td>' + money(p[4]) + ' ' + sampleChip() + '</td><td>' + esc(p[5]) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      matrix();
  }

  function swim(lane, text, lost) {
    return '<li' + (lost ? ' class="is-lost"' : '') + '><span class="hub-swim__lane">' + esc(lane) + '</span><p>' + esc(text) + '</p>' +
      (lost ? '<strong>Information lost here</strong>' : '') + '</li>';
  }

  function matrix() {
    var points = [
      ['P1', 120, 78], ['P2', 200, 118], ['P3', 150, 160],
      ['P4', 470, 90], ['P7', 540, 150],
      ['P5', 130, 300], ['P6', 230, 340]
    ];
    var dots = points.map(function (p) {
      return '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="8" fill="#1A47B8"></circle>' +
        '<text x="' + (p[1] + 14) + '" y="' + (p[2] + 5) + '" fill="#0F1115" font-size="16" font-family="DM Sans, sans-serif">' + p[0] + '</text>';
    }).join('');
    return '<h3>Impact and effort</h3><p class="hub-muted">P1, P2, and P3 are the MVP: high impact, low effort. P4 and P7 are next. P5 and P6 are quick wins for Lane B after go-live.</p>' +
      '<svg class="hub-matrix" viewBox="0 0 680 460" role="img" aria-label="Impact versus effort. P1, P2, and P3 are high impact and low effort. P4 and P7 are high impact and higher effort. P5 and P6 are lower impact and low effort.">' +
        '<rect x="40" y="30" width="600" height="380" fill="#fff" stroke="#D4D9E4"></rect>' +
        '<line x1="340" y1="30" x2="340" y2="410" stroke="#D4D9E4"></line>' +
        '<line x1="40" y1="220" x2="640" y2="220" stroke="#D4D9E4"></line>' +
        '<text x="70" y="54" fill="#4A4A47" font-size="14" font-family="DM Sans, sans-serif">High impact, low effort</text>' +
        '<text x="360" y="54" fill="#4A4A47" font-size="14" font-family="DM Sans, sans-serif">High impact, higher effort</text>' +
        '<text x="70" y="246" fill="#4A4A47" font-size="14" font-family="DM Sans, sans-serif">Quick wins for Lane B</text>' +
        '<text x="360" y="246" fill="#4A4A47" font-size="14" font-family="DM Sans, sans-serif">Later</text>' +
        '<text x="300" y="448" fill="#4A4A47" font-size="14" font-family="DM Sans, sans-serif">Effort</text>' +
        '<text x="8" y="220" fill="#4A4A47" font-size="14" font-family="DM Sans, sans-serif" transform="rotate(-90 8 220)">Impact</text>' +
        dots +
      '</svg><p>' + sampleChip() + '</p>';
  }

  function roadmapView() {
    var items = [
      ['MVP · tickets to invoice-ready', 'P1, P2, P3', 1],
      ['Dispatch board', 'P4', 2],
      ['Retest reminders', 'P7', 3],
      ['Parts capture improvements', 'P5', 2],
      ['Site history', 'P6', 3]
    ];
    return '<h2>Roadmap</h2><p>One use case first: the biggest win for the least effort. Later items ship on the cycle shown. Chips follow the demo-mode cycle.</p><ol class="hub-road">' +
      items.map(function (item) {
        var shipped = state.cycle >= item[2];
        var label = shipped ? 'Shipped · Cycle ' + item[2] : (state.cycle + 1 === item[2] ? 'Next · Cycle ' + item[2] : 'Planned · Cycle ' + item[2]);
        return '<li><div><strong>' + esc(item[0]) + '</strong><p class="hub-muted">' + esc(item[1]) + '</p></div><span class="hub-chip ' + (shipped ? 'hub-chip--pass' : 'hub-chip--scheduled') + '">' + esc(label) + '</span></li>';
      }).join('') + '</ol>';
  }

  function cyclesView() {
    return '<h2>Cycles</h2><p>Two-week cycles. After Cycle 1, Lane A (new) and Lane B (improvements) ship together. <span class="hub-chip hub-chip--pass">With you</span> means the client’s team tested it and signed off.</p>' +
      '<ol class="hub-cycles">' + db.releases.map(function (rel) {
        var visible = state.cycle >= rel.cycle_number;
        return '<li><p class="hub-k">Cycle ' + rel.cycle_number + ' · Lane ' + rel.lane + (rel.lane === 'A' ? ', new' : ', improved') + '</p><h3>' + esc(rel.title) + '</h3><p>' + esc(rel.description) + '</p>' +
          (rel.uat_signed_off && visible ? '<span class="hub-chip hub-chip--pass">With you</span>' : '') +
          (!visible ? '<span class="hub-chip hub-chip--scheduled">Not in this cycle yet</span>' : '') +
        '</li>';
      }).join('') + '</ol>';
  }

  function feedbackView() {
    return '<h2>Feedback</h2><p>Sample notes from technicians and office staff. Use re-ranks the roadmap. Tags, impact, and effort are part of the record.</p><div class="hub-feedback">' +
      db.feedback.map(function (item) {
        var done = state.cycle >= item.cycle_addressed;
        return '<article class="hub-card"><p class="hub-k">' + esc(item.author_role) + '</p><p>' + esc(item.text) + '</p>' +
          '<p><span class="hub-chip hub-chip--scheduled">' + esc(item.tag) + '</span> ' +
          '<span class="hub-muted">Impact ' + esc(item.impact) + ' · Effort ' + esc(item.effort) + '</span></p>' +
          '<p>' + (done ? '<span class="hub-chip hub-chip--pass">Addressed · Cycle ' + item.cycle_addressed + '</span>' : '<span class="hub-chip hub-chip--scheduled">Queued · Cycle ' + item.cycle_addressed + '</span>') + '</p></article>';
      }).join('') + '</div>';
  }

  function setupSignature() {
    var canvas = document.getElementById('sig-pad');
    var job = state.jobId ? getJob(state.jobId) : null;
    if (!canvas || !job || isClosed(job)) return;
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, rect.width) * ratio;
    canvas.height = Math.max(1, rect.height) * ratio;
    ctx.scale(ratio, ratio);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#0F1115';
    ctx.fillStyle = '#0F1115';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    if (job.signature_image) {
      var img = new Image();
      img.onload = function () { ctx.drawImage(img, 0, 0, rect.width, rect.height); };
      img.src = job.signature_image;
    }
    var drawing = false;
    var last = null;
    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    canvas.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      drawing = true;
      last = pos(e);
      canvas.dataset.inked = '1';
      ctx.beginPath();
      ctx.arc(last.x, last.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      e.preventDefault();
    });
    function end() { drawing = false; }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
  }

  function onClick(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn || !rootEl.contains(btn)) return;
    readBinds();
    var action = btn.getAttribute('data-action');
    var value = btn.getAttribute('data-value');
    if (action === 'section') state.section = value;
    if (action === 'cycle') {
      state.cycle = Number(value);
      if (state.cycle < 3 && state.officeTab === 'retests') state.officeTab = 'assign';
    }
    if (action === 'role') {
      state.role = value;
      state.section = 'work';
      if (value === 'office' && state.preferReview) {
        state.officeTab = 'review';
        state.preferReview = false;
      }
      if (value !== 'tech') state.jobId = null;
    }
    if (action === 'method-tab') state.methodTab = value;
    if (action === 'office-tab') state.officeTab = value;
    if (action === 'open-job') {
      state.jobId = btn.getAttribute('data-job-id');
      state.section = 'work';
      state.role = 'tech';
    }
    if (action === 'back-today') state.jobId = null;
    if (action === 'start-job') {
      var started = getJob(state.jobId);
      if (started && started.status === 'scheduled') started.status = 'in_progress';
    }
    if (action === 'close-job') closeJob();
    if (action === 'fill-pass') fillReadings('pass');
    if (action === 'fill-fail') fillReadings('fail');
    if (action === 'add-part') addPart();
    if (action === 'pick-part') addPart(btn.getAttribute('data-part-id'));
    if (action === 'remove-part') removePart(btn.getAttribute('data-part-used'));
    if (action === 'add-photo') addPhoto();
    if (action === 'remove-photo') removePhoto(btn.getAttribute('data-photo-id'));
    if (action === 'clear-sig') {
      var signed = getJob(state.jobId);
      if (signed) signed.signature_image = '';
    }
    if (action === 'approve') approveJob(btn.getAttribute('data-job-id'));
    if (action === 'schedule-return') scheduleReturn(btn.getAttribute('data-job-id'));
    if (action === 'schedule-retest') scheduleRetest(btn.getAttribute('data-device-id'));
    if (action === 'create-job') createJob();
    if (action === 'export-csv') exportCsv();
    if (action === 'download-cert') downloadCert(btn.getAttribute('data-job-id'), btn.getAttribute('data-device-id'));
    if (action === 'goto-board') {
      state.section = 'work';
      state.role = 'office';
      state.officeTab = 'assign';
      state.scrollTo = 'board';
    }
    if (action === 'goto-parts' || action === 'goto-history') {
      state.section = 'work';
      state.role = 'tech';
      state.techId = 't4';
      state.jobId = action === 'goto-history' ? 'j-demo' : 'j-live';
      state.scrollTo = action === 'goto-history' ? 'history' : 'parts';
    }
    if (action === 'goto-retests') {
      state.section = 'work';
      state.role = 'office';
      state.officeTab = 'retests';
      state.scrollTo = 'retests';
    }
    render();
  }

  function onChange(e) {
    var t = e.target;
    if (t.matches('[data-check]')) {
      readBinds();
      return;
    }
    if (!t.matches('[data-rerender]')) return;
    readBinds();
    if (t.id === 'tech-select') state.techId = t.value;
    if (t.getAttribute('data-bind') === 'form.customerId') {
      var nextSites = sitesFor(state.form.customerId);
      state.form.siteId = nextSites[0] ? nextSites[0].id : '';
      state.form.deviceIds = devicesForSite(state.form.siteId).map(function (d) { return d.id; });
    }
    if (t.getAttribute('data-bind') === 'form.siteId' || t.getAttribute('data-bind') === 'form.type') {
      state.form.deviceIds = devicesForSite(state.form.siteId).map(function (d) { return d.id; });
    }
    render();
  }

  function onInput(e) {
    if (!e.target.matches('[data-live]')) return;
    readBinds();
    render();
  }

  function boot() {
    rootEl = document.getElementById('hub-app');
    if (!rootEl) return;
    rootEl.addEventListener('click', onClick);
    rootEl.addEventListener('change', onChange);
    rootEl.addEventListener('input', onInput);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
