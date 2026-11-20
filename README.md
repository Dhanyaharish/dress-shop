# Dress Shop Website (English / ಕನ್ನಡ)

A static, bilingual website. No installs needed: just HTML, CSS and JavaScript.

## Files
| File | Purpose |
|---|---|
| `index.html` | Page structure. Every translatable text has a `data-i18n="key"` attribute. |
| `style.css` | Colours, layout, mobile design. Change colours in `:root` at the top. |
| `translations.js` | All English and Kannada text. Edit wording here. |
| `script.js` | Language toggle + mobile menu. Remembers the chosen language. |

## Run it in Visual Studio Code
1. Unzip the folder, then in VS Code: **File > Open Folder**.
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` > **Open with Live Server**.

## Things to replace before launch
- Shop name (search `Shop Name` and `ಅಂಗಡಿಯ ಹೆಸರು`)
- Phone number (`+91 00000 00000`, `tel:` and `wa.me/` links)
- Address and opening hours (in `translations.js`, both languages)
- Photos: create an `images/` folder and set e.g. `style="background-image:url('images/sarees.jpg')"` on each `.card-img`; hero and about images in `style.css`
- Google Maps embed link in the `<iframe>` (Google Maps > Share > Embed a map)
- Reviews: use ONLY real customer reviews with permission
- Have a native Kannada speaker check the Kannada text once

## Adding new text
1. Add the key to both `en` and `kn` in `translations.js`.
2. Use it in HTML: `<p data-i18n="your.key">English text</p>`.

## Publishing (free options)
Netlify Drop, GitHub Pages or Cloudflare Pages. Later, buy a domain (e.g. shopname.in).
