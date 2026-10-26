/**
 * Creates the ixigo capstone survey as a Google Form (18 questions).
 * How to use: open https://script.new, paste this file, click Run on createSurvey,
 * approve access, then check the Execution log for the form links.
 */
function createSurvey() {
  const form = FormApp.create('Train travel when your ticket is waitlisted – 4 min survey');
  form.setDescription(
    "I'm researching how people handle waitlisted or unavailable train tickets. " +
    'No selling, answers are anonymous. Takes about 4 minutes.'
  );
  form.setProgressBar(true);
  form.setCollectEmail(false);

  // ---------- Section 1: Screening ----------
  const q1 = form.addMultipleChoiceItem()
    .setTitle('1. In the last 6 months, did your preferred train show Waitlisted (WL), RAC or No seats when you tried to book?')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. How often do you travel by train?')
    .setChoiceValues(['Once a month or more', 'Every 2–3 months', '2–3 times a year', 'Once a year or less'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('3. Which apps or channels do you use to book trains?')
    .setChoiceValues(['IRCTC', 'ixigo', 'ConfirmTkt', 'MakeMyTrip', 'redRail / redBus', 'Paytm', 'Travel agent'])
    .showOtherOption(true)
    .setRequired(true);

  // ---------- Section 2: Last waitlisted trip ----------
  const sec2 = form.addPageBreakItem()
    .setTitle('Your last waitlisted trip')
    .setHelpText('Think about the most recent time your train showed WL, RAC or no seats.');

  form.addMultipleChoiceItem()
    .setTitle('4. What was the trip for?')
    .setChoiceValues(['Festival / going home', 'Work', 'Exam or interview', 'Family function', 'Holiday'])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('5. How many people were travelling?')
    .setChoiceValues(['Just me', '2', '3–4', '5 or more'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6. How many days before the journey were you booking?')
    .setChoiceValues(['Same day / next day', '2–7 days', '1–4 weeks', 'More than a month'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('7. What did you do after seeing WL or no seats?')
    .setChoiceValues([
      'Searched other trains', 'Tried another class', 'Tried another date',
      'Checked a nearby station', 'Checked buses', 'Checked flights',
      'Booked the WL ticket anyway', 'Tried Tatkal / Premium Tatkal',
      'Asked family or an agent', 'Gave up'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('8. How many times did you search before deciding?')
    .setChoiceValues(['1–2', '3–5', '6–10', 'More than 10'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('9. What did you finally do?')
    .setChoiceValues([
      'Booked a confirmed train',
      'Booked WL with protection or backup (e.g. Alternate Travel Plan, VIKALP)',
      'Booked WL with no backup', 'Took a bus', 'Took a flight',
      'Booked Tatkal myself', 'Booked through an agent', 'Postponed or cancelled the trip'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('10. Did you try booking Tatkal for this trip? What happened?')
    .setChoiceValues([
      'Yes, got a confirmed Tatkal ticket',
      'Yes, but got Tatkal waitlist',
      "Yes, but couldn't book (sold out in minutes / app slow / payment failed)",
      'Yes, through an agent',
      'No, Tatkal fare too high',
      "No, didn't think of it / didn't know timing"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('11. Where did you finally book?')
    .setChoiceValues(['ixigo / ConfirmTkt', 'IRCTC', 'Another app', 'Agent', 'Did not book'])
    .setRequired(true);

  // ---------- Section 3: How you decide ----------
  form.addPageBreakItem().setTitle('How you decide');

  form.addGridItem()
    .setTitle('12. Rank what matters most when choosing an alternative (1 = most important).')
    .setRows(['Price', 'Arrival time', 'Total journey time', 'Chance of confirmation',
              'Station close to home', 'Class / comfort', 'Free cancellation'])
    .setColumns(['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5'])
    .setValidation(FormApp.createGridValidation()
      .requireLimitOneResponsePerColumn()
      .setHelpText('Use each rank only once.')
      .build());

  form.addScaleItem()
    .setTitle('13. When an app shows a confirmation chance (e.g. "65% chance"), how much do you trust it?')
    .setBounds(1, 5)
    .setLabels('Not at all', 'Fully')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('14. Has a waitlisted ticket with a high predicted chance (70%+) ever ended differently than you expected?')
    .setChoiceValues([
      'Yes, it ended as RAC (shared berth)',
      'Yes, it stayed waitlisted / got cancelled',
      'No, it confirmed as expected',
      "I don't remember / never saw a prediction"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('15. What was the hardest part of finding an alternative?')
    .setChoiceValues([
      'Too many options to compare', "Didn't trust the prediction",
      'Alternatives too costly', "Couldn't find seats for everyone together",
      'Found out too late', 'Had to check many apps'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('16. If an app showed you one recommended plan plus a backup, what must it show for you to book it?');

  // ---------- Section 4: About you ----------
  form.addPageBreakItem().setTitle('About you');

  form.addMultipleChoiceItem()
    .setTitle('17. Age group')
    .setChoiceValues(['Under 22', '22–30', '31–45', '46+'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('18. Can I call you for a 15-minute chat about this trip? If yes, share your name and WhatsApp number.')
    .setHelpText('Optional');

  // Q1 branching: Yes -> continue, No -> submit
  q1.setChoices([
    q1.createChoice('Yes', sec2),
    q1.createChoice('No', FormApp.PageNavigationType.SUBMIT)
  ]);

  form.setConfirmationMessage('Thank you! Your answers will help make train travel less stressful.');

  Logger.log('Share link: ' + form.getPublishedUrl());
  Logger.log('Edit link:  ' + form.getEditUrl());
}
