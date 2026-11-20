// All website text lives here. To change wording, edit it here.
// To add new text: add a key in BOTH "en" and "kn", then use data-i18n="key" in index.html.

const translations = {
  en: {
    "shop.name": "Shop Name",
    "nav.home": "Home",
    "nav.collections": "Collections",
    "nav.about": "About Us",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",

    "hero.title": "Elegant Dresses for Every Occasion",
    "hero.subtitle": "Sarees, kurtis, lehengas and more — chosen with care, priced with honesty.",
    "hero.cta1": "View Collections",
    "hero.cta2": "Visit Our Shop",

    "collections.title": "Our Collections",
    "col.sarees": "Sarees",
    "col.sarees.desc": "Silk, cotton and designer sarees",
    "col.kurtis": "Kurtis",
    "col.kurtis.desc": "Daily wear and festive kurtis",
    "col.lehengas": "Lehengas",
    "col.lehengas.desc": "Wedding and party wear",
    "col.kids": "Kids Wear",
    "col.kids.desc": "Comfortable and colourful outfits",

    "about.title": "About Our Shop",
    "about.text": "Serving our community for years, we bring you quality fabrics, the latest designs and personal service. Come in, feel the fabric, and find the dress that suits you.",
    "about.f1": "Quality fabrics",
    "about.f2": "Fair prices",
    "about.f3": "Easy alteration service",
    "about.f4": "Friendly personal help",

    "reviews.title": "What Our Customers Say",
    "reviews.r1": "Add a real customer review here.",
    "reviews.name": "— Customer name",

    "contact.title": "Visit Us",
    "contact.address": "Address",
    "contact.address.value": "Shop No. 00, Main Road, Your Town, Karnataka",
    "contact.phone": "Phone",
    "contact.hours": "Opening Hours",
    "contact.hours.value": "Mon–Sun: 10:00 AM – 9:00 PM",
    "contact.whatsapp": "Chat on WhatsApp",

    "footer.text": "© 2026 Shop Name. All rights reserved."
  },

  kn: {
    "shop.name": "ಅಂಗಡಿಯ ಹೆಸರು",
    "nav.home": "ಮುಖಪುಟ",
    "nav.collections": "ಸಂಗ್ರಹಗಳು",
    "nav.about": "ನಮ್ಮ ಬಗ್ಗೆ",
    "nav.reviews": "ಅಭಿಪ್ರಾಯಗಳು",
    "nav.contact": "ಸಂಪರ್ಕಿಸಿ",

    "hero.title": "ಪ್ರತಿ ಸಂದರ್ಭಕ್ಕೂ ಸೊಗಸಾದ ಉಡುಪುಗಳು",
    "hero.subtitle": "ಸೀರೆ, ಕುರ್ತಿ, ಲೆಹೆಂಗಾ ಮತ್ತು ಇನ್ನಷ್ಟು — ಪ್ರೀತಿಯಿಂದ ಆಯ್ದ, ನ್ಯಾಯವಾದ ಬೆಲೆಯಲ್ಲಿ.",
    "hero.cta1": "ಸಂಗ್ರಹಗಳನ್ನು ನೋಡಿ",
    "hero.cta2": "ನಮ್ಮ ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ",

    "collections.title": "ನಮ್ಮ ಸಂಗ್ರಹಗಳು",
    "col.sarees": "ಸೀರೆಗಳು",
    "col.sarees.desc": "ರೇಷ್ಮೆ, ಹತ್ತಿ ಮತ್ತು ಡಿಸೈನರ್ ಸೀರೆಗಳು",
    "col.kurtis": "ಕುರ್ತಿಗಳು",
    "col.kurtis.desc": "ದಿನನಿತ್ಯ ಮತ್ತು ಹಬ್ಬದ ಕುರ್ತಿಗಳು",
    "col.lehengas": "ಲೆಹೆಂಗಾಗಳು",
    "col.lehengas.desc": "ಮದುವೆ ಮತ್ತು ಪಾರ್ಟಿ ಉಡುಪುಗಳು",
    "col.kids": "ಮಕ್ಕಳ ಉಡುಪುಗಳು",
    "col.kids.desc": "ಆರಾಮದಾಯಕ ಮತ್ತು ವರ್ಣರಂಜಿತ ಉಡುಪುಗಳು",

    "about.title": "ನಮ್ಮ ಅಂಗಡಿಯ ಬಗ್ಗೆ",
    "about.text": "ಹಲವು ವರ್ಷಗಳಿಂದ ನಿಮ್ಮ ಸೇವೆಯಲ್ಲಿ, ಗುಣಮಟ್ಟದ ಬಟ್ಟೆ, ಹೊಸ ವಿನ್ಯಾಸ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸೇವೆಯನ್ನು ನೀಡುತ್ತಿದ್ದೇವೆ. ಬನ್ನಿ, ಬಟ್ಟೆಯನ್ನು ಸ್ಪರ್ಶಿಸಿ, ನಿಮಗೆ ಹೊಂದುವ ಉಡುಪನ್ನು ಆರಿಸಿ.",
    "about.f1": "ಗುಣಮಟ್ಟದ ಬಟ್ಟೆಗಳು",
    "about.f2": "ನ್ಯಾಯವಾದ ಬೆಲೆ",
    "about.f3": "ಸುಲಭ ಆಲ್ಟರೇಶನ್ ಸೌಲಭ್ಯ",
    "about.f4": "ಸ್ನೇಹಪೂರ್ಣ ವೈಯಕ್ತಿಕ ಸಹಾಯ",

    "reviews.title": "ನಮ್ಮ ಗ್ರಾಹಕರು ಏನು ಹೇಳುತ್ತಾರೆ",
    "reviews.r1": "ಇಲ್ಲಿ ನಿಜವಾದ ಗ್ರಾಹಕರ ಅಭಿಪ್ರಾಯವನ್ನು ಸೇರಿಸಿ.",
    "reviews.name": "— ಗ್ರಾಹಕರ ಹೆಸರು",

    "contact.title": "ನಮ್ಮನ್ನು ಭೇಟಿ ಮಾಡಿ",
    "contact.address": "ವಿಳಾಸ",
    "contact.address.value": "ಅಂಗಡಿ ಸಂಖ್ಯೆ 00, ಮುಖ್ಯ ರಸ್ತೆ, ನಿಮ್ಮ ಊರು, ಕರ್ನಾಟಕ",
    "contact.phone": "ದೂರವಾಣಿ",
    "contact.hours": "ತೆರೆಯುವ ಸಮಯ",
    "contact.hours.value": "ಸೋಮ–ಭಾನು: ಬೆಳಿಗ್ಗೆ 10:00 – ರಾತ್ರಿ 9:00",
    "contact.whatsapp": "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ",

    "footer.text": "© 2026 ಅಂಗಡಿಯ ಹೆಸರು. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ."
  }
};
