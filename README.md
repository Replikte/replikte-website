# Operational Hub demo

Clickable sales demo for an owner-operated field company. Ridgeline Plumbing & Backflow is fictional. Every metric is sample data.

The demo ships as a static page, the same way the Go High Level and Bid Intake pages do. Open `operational-hub.html` in a browser, or serve the repo root with any static file server. There is no install step, no database, and no API key. Seed data is created in the browser when the page loads.

## Five-minute demo script

1. **Discovery (45 s).** “Before we touched software, we spent time with the crews and the office. Here's where information got lost and what it was costing.” In the demo, open **How we got here → Discovery**. Walk the swimlane, the pain register, and the impact–effort plot. P1, P2, and P3 are the MVP.

2. **Roadmap (20 s).** “We picked the one use case with the biggest win for the least effort: tickets to invoice-ready.” Open **Roadmap**.

3. **Technician view (60 s).** “This is the tech on site. Readings, parts, photos, signature, done. No paper.” Switch the role to **Technician**. The phone-width column lists today. Open **Kettlehouse Diner**. Use **Fill sample passing readings** (or type readings), add a part, attach a photo, enter a customer name, sign, and **Close job**. To show a failure, use **Fill sample failing readings** instead. The screen says **Fail**, and the status becomes **Needs follow-up**.

4. **Office (45 s).** “Same day, the office reviews it. One click, and the certificate is generated.” Switch to **Office**. The Review queue opens on the job you just closed. **Approve**, then **Download certificate**. A failed test cannot be approved; schedule a return instead.

5. **Bookkeeper (20 s).** “It lands invoice-ready and exports to the accounting system they already use.” Switch to **Bookkeeper**. **Export for your accounting system** downloads a CSV. There is no live accounting connection.

6. **Owner (30 s).** “The owner finally sees what's finished, what's unbilled, and what retests are coming.” Switch to **Owner**. Every figure is labeled Sample data.

7. **Cycles (60 s).** Toggle **Cycle 2**, then **Cycle 3**. “Every two weeks, two lanes ship together. New features, plus improvements the team asked for. Their feedback re-ranks the roadmap.” Cycle 2 reveals the dispatch board and parts search. Cycle 3 reveals retest reminders and site history. Use the buttons under the cycle toggle to open each one. **How we got here → Cycles** and **Feedback** show the release notes, the “With you” sign-off, and how items move from queued to addressed.

8. **Close (20 s).** “That's the approach: fit the technology to how the business works, prove it on the highest win, then grow it in priced phases.”

## Offline queue

Not built in this demo. It would wrap `closeJob()` in `operational-hub.js`. When the technician’s phone is offline, the close payload — readings, parts, photos, signature, and the customer’s name — would be written to IndexedDB and sent when the connection returns. The demo keeps that call in memory so a presenter can finish the story with no setup.

## Sample data

Reloading the page restores the original seed: 25 customers, 40 sites, 8 technicians, 120 jobs, 60 parts, and 12 feedback notes. About 15% of completed backflow tests are failures. Nothing in the seed is a real client, prospect, or person.
