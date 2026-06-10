# Client logos - drop the files here

You supplied these 10 logos. The landing page "Trusted by" marquee loads them
from this `clients/` folder. Save each uploaded file here renamed **exactly** as
shown on the right. Until a file is present, that card shows the client's name as
clean text, so the section never looks broken.

| Logo | Save here as |
|---|---|
| Government of Sindh (emblem) | government-of-sindh.jpg |
| Investment Department, Government of Sindh | investment-department-gos.png |
| BYD Mega Motor (black) | byd-mega-motor.png |
| PalmPay | palmpay.png |
| Sapphire (dark) | sapphire.jpg |
| COMSATS University Islamabad | comsats.webp |
| Stewart (black) | stewart-pakistan.png |
| Future Technologies | future-technologies.png |
| CGD Consulting | cgd-consulting.jpeg |
| O7O / OSEVENO | o7o.png |

Notes:
- Use the dark/colour versions (not the white ones) because the cards are white.
- The public HTML no longer contains any local-machine path fallback; it loads
  only from `clients/...` and falls back to text if a file is missing.
- Before using each logo publicly, confirm you have permission to display that
  client's mark. See `XPERION_PRELAUNCH_PRIVACY.md` (the Government of Sindh
  emblem in particular needs authorization).
- This `.md` file is blocked from search engines and should not be deployed.
