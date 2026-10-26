/**
 * Creates the ixigo capstone survey as a bilingual (English + Hindi) Google Form.
 * How to use: open https://script.new, paste this file, click Run on createSurvey,
 * approve access, then check the Execution log for the form links.
 */
function createSurvey() {
  const form = FormApp.create('Waitlisted train ticket survey / वेटिंग टिकट सर्वे – 4 min');
  form.setDescription(
    "I'm researching how people handle waitlisted or unavailable train tickets. No selling, answers are anonymous. Takes about 4 minutes.\n\n" +
    'मैं जानना चाहता हूँ कि ट्रेन टिकट वेटिंग या उपलब्ध न होने पर लोग क्या करते हैं। कोई बिक्री नहीं, जवाब गोपनीय रहेंगे। लगभग 4 मिनट लगेंगे।'
  );
  form.setProgressBar(true);
  form.setCollectEmail(false);

  // ---------- Section 1: Screening ----------
  const q1 = form.addMultipleChoiceItem()
    .setTitle('1. In the last 6 months, did your preferred train show Waitlisted (WL), RAC or No seats when you tried to book? / पिछले 6 महीनों में, क्या बुकिंग करते समय आपकी पसंद की ट्रेन में वेटिंग (WL), RAC या सीट उपलब्ध नहीं दिखी?')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. How often do you travel by train? / आप कितनी बार ट्रेन से यात्रा करते हैं?')
    .setChoiceValues([
      'Once a month or more / महीने में एक बार या ज़्यादा',
      'Every 2–3 months / हर 2–3 महीने में',
      '2–3 times a year / साल में 2–3 बार',
      'Once a year or less / साल में एक बार या कम'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('3. Which apps or channels do you use to book trains? / ट्रेन टिकट बुक करने के लिए आप कौन-से ऐप या माध्यम इस्तेमाल करते हैं?')
    .setChoiceValues(['IRCTC', 'ixigo', 'ConfirmTkt', 'MakeMyTrip', 'redRail / redBus', 'Paytm', 'Travel agent / ट्रैवल एजेंट'])
    .showOtherOption(true)
    .setRequired(true);

  // ---------- Section 2: Last waitlisted trip ----------
  const sec2 = form.addPageBreakItem()
    .setTitle('Your last waitlisted trip / आपकी पिछली वेटिंग वाली यात्रा')
    .setHelpText('Think about the most recent time your train showed WL, RAC or no seats. / उस आखिरी बार के बारे में सोचें जब आपकी ट्रेन में WL, RAC या सीट नहीं दिखी थी।');

  form.addMultipleChoiceItem()
    .setTitle('4. What was the trip for? / यात्रा किस लिए थी?')
    .setChoiceValues([
      'Festival / going home / त्योहार / घर जाना',
      'Work / काम',
      'Exam or interview / परीक्षा या इंटरव्यू',
      'Family function / पारिवारिक कार्यक्रम',
      'Holiday / छुट्टी'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('5. How many people were travelling? / कितने लोग यात्रा कर रहे थे?')
    .setChoiceValues(['Just me / सिर्फ़ मैं', '2', '3–4', '5 or more / 5 या ज़्यादा'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6. How many days before the journey were you booking? / यात्रा से कितने दिन पहले आप बुक कर रहे थे?')
    .setChoiceValues([
      'Same day / next day / उसी दिन / अगले दिन',
      '2–7 days / 2–7 दिन',
      '1–4 weeks / 1–4 हफ़्ते',
      'More than a month / एक महीने से ज़्यादा'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('7. What did you do after seeing WL or no seats? / WL या सीट न मिलने पर आपने क्या किया?')
    .setChoiceValues([
      'Searched other trains / दूसरी ट्रेनें देखीं',
      'Tried another class / दूसरी क्लास देखी',
      'Tried another date / दूसरी तारीख देखी',
      'Checked a nearby station / पास का स्टेशन देखा',
      'Checked buses / बस देखी',
      'Checked flights / फ़्लाइट देखी',
      'Booked the WL ticket anyway / फिर भी WL टिकट बुक किया',
      'Tried Tatkal / Premium Tatkal / तत्काल या प्रीमियम तत्काल ट्राई किया',
      'Asked family or an agent / परिवार या एजेंट से पूछा',
      'Gave up / छोड़ दिया'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('8. How many times did you search before deciding? / फ़ैसला करने से पहले आपने कितनी बार सर्च किया?')
    .setChoiceValues(['1–2', '3–5', '6–10', 'More than 10 / 10 से ज़्यादा'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('9. What did you finally do? / आख़िर में आपने क्या किया?')
    .setChoiceValues([
      'Booked a confirmed train / कन्फ़र्म ट्रेन टिकट बुक किया',
      'Booked WL with protection or backup (e.g. Alternate Travel Plan, VIKALP) / सुरक्षा या बैकअप के साथ WL बुक किया (जैसे Alternate Travel Plan, VIKALP)',
      'Booked WL with no backup / बिना बैकअप के WL बुक किया',
      'Took a bus / बस से गए',
      'Took a flight / फ़्लाइट से गए',
      'Booked Tatkal myself / खुद तत्काल बुक किया',
      'Booked through an agent / एजेंट से बुक कराया',
      'Postponed or cancelled the trip / यात्रा टाल दी या रद्द की'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('10. Did you try booking Tatkal for this trip? What happened? / क्या आपने इस यात्रा के लिए तत्काल बुक करने की कोशिश की? क्या हुआ?')
    .setChoiceValues([
      'Yes, got a confirmed Tatkal ticket / हाँ, कन्फ़र्म तत्काल टिकट मिला',
      'Yes, but got Tatkal waitlist / हाँ, लेकिन तत्काल में भी वेटिंग मिली',
      "Yes, but couldn't book (sold out in minutes / app slow / payment failed) / हाँ, लेकिन बुक नहीं हो पाया (मिनटों में खत्म / ऐप धीमा / पेमेंट फ़ेल)",
      'Yes, through an agent / हाँ, एजेंट के ज़रिए',
      'No, Tatkal fare too high / नहीं, तत्काल किराया बहुत ज़्यादा था',
      "No, didn't think of it / didn't know timing / नहीं, ध्यान नहीं आया / समय पता नहीं था"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('11. Where did you finally book? / आख़िर में आपने कहाँ से बुक किया?')
    .setChoiceValues([
      'ixigo / ConfirmTkt',
      'IRCTC',
      'Another app / कोई दूसरा ऐप',
      'Agent / एजेंट',
      'Did not book / बुक नहीं किया'
    ])
    .setRequired(true);

  // ---------- Section 3: How you decide ----------
  form.addPageBreakItem().setTitle('How you decide / आप कैसे तय करते हैं');

  form.addGridItem()
    .setTitle('12. Rank what matters most when choosing an alternative (1 = most important). / दूसरा विकल्प चुनते समय क्या सबसे ज़रूरी है, रैंक दें (1 = सबसे ज़रूरी)।')
    .setRows([
      'Price / किराया',
      'Arrival time / पहुँचने का समय',
      'Total journey time / कुल यात्रा समय',
      'Chance of confirmation / कन्फ़र्म होने की संभावना',
      'Station close to home / घर के पास स्टेशन',
      'Class / comfort / क्लास / आराम',
      'Free cancellation / मुफ़्त कैंसिलेशन'
    ])
    .setColumns(['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5'])
    .setValidation(FormApp.createGridValidation()
      .requireLimitOneResponsePerColumn()
      .setHelpText('Use each rank only once. / हर रैंक सिर्फ़ एक बार इस्तेमाल करें।')
      .build());

  form.addScaleItem()
    .setTitle('13. When an app shows a confirmation chance (e.g. "65% chance"), how much do you trust it? / जब ऐप कन्फ़र्म होने की संभावना दिखाता है (जैसे "65%"), आप उस पर कितना भरोसा करते हैं?')
    .setBounds(1, 5)
    .setLabels('Not at all / बिल्कुल नहीं', 'Fully / पूरा')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('14. Has a waitlisted ticket with a high predicted chance (70%+) ever ended differently than you expected? / क्या कभी ऊँची संभावना (70%+) वाला वेटिंग टिकट उम्मीद से अलग निकला?')
    .setChoiceValues([
      'Yes, it ended as RAC (shared berth) / हाँ, RAC मिला (बर्थ शेयर करनी पड़ी)',
      'Yes, it stayed waitlisted / got cancelled / हाँ, वेटिंग ही रहा / कैंसिल हो गया',
      'No, it confirmed as expected / नहीं, उम्मीद के मुताबिक कन्फ़र्म हुआ',
      "I don't remember / never saw a prediction / याद नहीं / कभी संभावना नहीं देखी"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('15. What was the hardest part of finding an alternative? / दूसरा विकल्प ढूँढने में सबसे मुश्किल क्या था?')
    .setChoiceValues([
      'Too many options to compare / तुलना के लिए बहुत ज़्यादा विकल्प',
      "Didn't trust the prediction / संभावना पर भरोसा नहीं था",
      'Alternatives too costly / विकल्प बहुत महंगे थे',
      "Couldn't find seats for everyone together / सबके लिए एक साथ सीट नहीं मिली",
      'Found out too late / बहुत देर से पता चला',
      'Had to check many apps / कई ऐप देखने पड़े'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('16. If an app showed you one recommended plan plus a backup, what must it show for you to book it? / अगर ऐप एक सुझाया गया प्लान और एक बैकअप दिखाए, तो बुक करने के लिए उसमें क्या दिखना ज़रूरी है?')
    .setHelpText('You can answer in Hindi or English. / आप हिंदी या अंग्रेज़ी में जवाब दे सकते हैं।');

  // ---------- Section 4: About you ----------
  form.addPageBreakItem().setTitle('About you / आपके बारे में');

  form.addMultipleChoiceItem()
    .setTitle('17. Age group / उम्र')
    .setChoiceValues(['Under 22 / 22 से कम', '22–30', '31–45', '46+'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('18. Can I call you for a 15-minute chat about this trip? If yes, share your name and WhatsApp number. / क्या मैं इस यात्रा के बारे में 15 मिनट बात करने के लिए आपको कॉल कर सकता हूँ? अगर हाँ, तो अपना नाम और WhatsApp नंबर लिखें।')
    .setHelpText('Optional / वैकल्पिक');

  // Q1 branching: Yes -> continue, No -> submit
  q1.setChoices([
    q1.createChoice('Yes / हाँ', sec2),
    q1.createChoice('No / नहीं', FormApp.PageNavigationType.SUBMIT)
  ]);

  form.setConfirmationMessage(
    'Thank you! Your answers will help make train travel less stressful. / धन्यवाद! आपके जवाब ट्रेन यात्रा को आसान बनाने में मदद करेंगे।'
  );

  Logger.log('Share link: ' + form.getPublishedUrl());
  Logger.log('Edit link:  ' + form.getEditUrl());
}
