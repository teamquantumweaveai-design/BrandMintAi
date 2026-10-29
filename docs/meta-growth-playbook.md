# Meta Growth System: internal playbook

How Quantum Weave AI finds small businesses, runs the free 7-day trial and turns it into a paid plan.
Internal only. Prices, limits and the payment flow are in `docs/meta-growth.md`.

**Promise:** We keep your business visible online, so you can focus on serving your customers.

## The offer we advertise

A free 7-day social media trial: 2 posts, 1 short Reel, captions, a quick profile review and a simple 7-day plan.
The owner sees our work before paying anything. The trial has no live ads, no ad spend and no automatic upgrade.
One trial per business.

## Funnel

Meta ad → `/meta-growth/` or WhatsApp → free-trial enquiry → qualification → 7-day delivery → review → optional paid plan
(Stay Active ₹3,999 or Reach More Customers ₹6,999, incl. GST; ad spend paid separately to Meta).

## Trial intake checklist (Day 0)

Collect on WhatsApp. Do not ask for a long form before the first reply.

- [ ] Owner's name
- [ ] Business name and category
- [ ] City or service area (can we realistically serve them?)
- [ ] Instagram profile link
- [ ] Facebook page, if any
- [ ] WhatsApp number for enquiries
- [ ] Logo, business photos and videos (we only use what they send; no shoots)
- [ ] Main goal: look professional, stay consistent, or get more enquiries
- [ ] Eligibility: no earlier trial for this business
- [ ] Publishing process agreed: who approves, and what account access we get

## 7-day delivery checklist

| Day | Work |
|---|---|
| 0 | Intake (above), eligibility check, agree how content is approved and published |
| 1–2 | Profile review notes. Design, caption and send post 1 for approval; publish once approved |
| 3–5 | Post 2 and the short Reel from their footage; approve and publish |
| 6 | Explain what next month could look like and how Meta ads to WhatsApp would work for them |
| 7 | Share the work done, any honest observations, the 7-day plan, and the two monthly plans. No pressure, no auto-renewal |

Rules: one consolidated revision round per asset. Never publish without approval. Never promise results.
Capacity: no more than **5 trials at the same time** until we know how long each one takes. Do not show countdowns
or "only X left" on the site unless that limit is really enforced.

## Priority audiences to test first

Hypotheses, not proven rankings. Judge them on real enquiry quality and trial-to-paid conversion.

1. Salons and beauty studios
2. Gyms and fitness studios
3. Yoga and Pilates businesses
4. Interior designers
5. Coaching centres

Then test the other ten posters in `marketing/meta-ads/`.

## Targeting approach

- One ad set per industry and poster, so results can be compared. Do not mix all industries in one vague ad.
- Target areas we can actually serve.
- Keep the offer the same everywhere: free 7-day trial.
- Use the matching URL from `marketing/meta-ads/landing-urls.csv` as the destination, or a Click-to-WhatsApp ad.
- Follow Meta's rules, especially for health services (skin, dental, physio, nutrition): no medical claims or
  before/after promises.
- Track cost per qualified enquiry and trial-to-paid conversion, not likes or cheap clicks. Never promise virality.

## First 30 days

| Week | Focus |
|---|---|
| 1 | Website refresh live, creatives ready, GA4 events checked, every CTA and payment flow tested |
| 2 | Personal outreach to suitable businesses; first industry ads; onboard a manageable number of trials |
| 3 | Deliver trials, collect feedback, present the paid plans |
| 4 | Measure paid conversions, review creative performance, improve the page and onboarding from real behaviour |

## Outreach message (personal, one at a time)

For businesses we have genuinely looked at. Not for bulk or unsolicited mass messaging.

> Hi [Name], I came across [Business Name] and liked [specific observation].
>
> I run Quantum Weave AI. We help local businesses keep Instagram and Facebook active with professional posts, Reels
> and Meta ads that connect interested customers to WhatsApp.
>
> We're offering a free 7-day social media trial with 2 branded posts, 1 short Reel and a simple content plan.
>
> No payment details or long-term commitment.
>
> Would you like to see a few content ideas for your business?

## What to measure (internal, not for the website)

1. Landing-page visitors
2. Free-trial enquiry clicks (`free_trial_cta_click`)
3. Qualified free-trial enquiries
4. Trials started
5. Trials completed
6. Trial-to-paid conversion
7. Stay Active vs Reach More Customers purchases (`payment_success` by `plan`)
8. Second-month renewal
9. Hours spent delivering each plan
10. Cost per paying customer, where the data is reliable

Do not publish any of these as claims on the website without evidence.
