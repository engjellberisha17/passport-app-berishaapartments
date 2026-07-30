import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const countryToIso = {
  "Afghanistan": "af", "Albania": "al", "Algeria": "dz", "Andorra": "ad", "Angola": "ao",
  "Antigua and Barbuda": "ag", "Argentina": "ar", "Armenia": "am", "Australia": "au", "Austria": "at", "Azerbaijan": "az",
  "Bahamas": "bs", "Bahrain": "bh", "Bangladesh": "bd", "Barbados": "bb", "Belarus": "by", "Belgium": "be", "Belize": "bz", "Benin": "bj",
  "Bhutan": "bt", "Bolivia": "bo", "Bosnia and Herzegovina": "ba", "Botswana": "bw", "Brazil": "br", "Brunei": "bn", "Bulgaria": "bg",
  "Burkina Faso": "bf", "Burundi": "bi", "Cabo Verde": "cv", "Cambodia": "kh", "Cameroon": "cm", "Canada": "ca", "Central African Republic": "cf",
  "Chad": "td", "Chile": "cl", "China": "cn", "Colombia": "co", "Comoros": "km", "Congo (Congo-Brazzaville)": "cg", "Costa Rica": "cr", "Croatia": "hr",
  "Cuba": "cu", "Cyprus": "cy", "Czech Republic (Czechia)": "cz", "Democratic Republic of the Congo": "cd", "Denmark": "dk", "Djibouti": "dj",
  "Dominica": "dm", "Dominican Republic": "do", "Ecuador": "ec", "Egypt": "eg", "El Salvador": "sv", "Equatorial Guinea": "gq", "Eritrea": "er", "Estonia": "ee",
  "Eswatini (fmr. Swaziland)": "sz", "Ethiopia": "et", "Fiji": "fj", "Finland": "fi", "France": "fr", "Gabon": "ga", "Gambia": "gm", "Georgia": "ge", "Germany": "de", "Ghana": "gh",
  "Greece": "gr", "Grenada": "gd", "Guatemala": "gt", "Guinea": "gn", "Guinea-Bissau": "gw", "Guyana": "gy", "Haiti": "ht", "Honduras": "hn", "Hungary": "hu", "Iceland": "is", "India": "in",
  "Indonesia": "id", "Iran": "ir", "Iraq": "iq", "Ireland": "ie", "Israel": "il", "Italy": "it", "Jamaica": "jm", "Japan": "jp", "Jordan": "jo", "Kazakhstan": "kz", "Kenya": "ke", "Kiribati": "ki",
  "Kosovo": "xk", "Kuwait": "kw", "Kyrgyzstan": "kg", "Laos": "la", "Latvia": "lv", "Lebanon": "lb", "Lesotho": "ls", "Liberia": "lr", "Libya": "ly", "Liechtenstein": "li", "Lithuania": "lt",
  "Luxembourg": "lu", "Madagascar": "mg", "Malawi": "mw", "Malaysia": "my", "Maldives": "mv", "Mali": "ml", "Malta": "mt", "Marshall Islands": "mh", "Mauritania": "mr", "Mauritius": "mu",
  "Mexico": "mx", "Micronesia": "fm", "Moldova": "md", "Monaco": "mc", "Mongolia": "mn", "Montenegro": "me", "Morocco": "ma", "Mozambique": "mz", "Myanmar (Burma)": "mm", "Namibia": "na",
  "Nauru": "nr", "Nepal": "np", "Netherlands": "nl", "New Zealand": "nz", "Nicaragua": "ni", "Niger": "ne", "Nigeria": "ng", "North Korea": "kp", "North Macedonia": "mk", "Norway": "no",
  "Oman": "om", "Pakistan": "pk", "Palau": "pw", "Palestine State": "ps", "Panama": "pa", "Papua New Guinea": "pg", "Paraguay": "py", "Peru": "pe", "Philippines": "ph", "Poland": "pl",
  "Portugal": "pt", "Qatar": "qa", "Romania": "ro", "Russia": "ru", "Rwanda": "rw", "Saint Kitts and Nevis": "kn", "Saint Lucia": "lc", "Saint Vincent and the Grenadines": "vc",
  "Samoa": "ws", "San Marino": "sm", "Sao Tome and Principe": "st", "Saudi Arabia": "sa", "Senegal": "sn", "Serbia": "rs", "Seychelles": "sc", "Sierra Leone": "sl", "Singapore": "sg",
  "Slovakia": "sk", "Slovenia": "si", "Solomon Islands": "sb", "Somalia": "so", "South Africa": "za", "South Korea": "kr", "South Sudan": "ss", "Spain": "es", "Sri Lanka": "lk", "Sudan": "sd",
  "Suriname": "sr", "Sweden": "se", "Switzerland": "ch", "Syria": "sy", "Taiwan": "tw", "Tajikistan": "tj", "Tanzania": "tz", "Thailand": "th", "Timor-Leste": "tl", "Togo": "tg", "Tonga": "to",
  "Trinidad and Tobago": "tt", "Tunisia": "tn", "Turkey": "tr", "Turkmenistan": "tm", "Tuvalu": "tv", "Uganda": "ug", "Ukraine": "ua", "United Arab Emirates": "ae",
  "United Kingdom": "gb", "United States": "us", "Uruguay": "uy", "Uzbekistan": "uz", "Vanuatu": "vu", "Vatican City": "va", "Venezuela": "ve", "Vietnam": "vn", "Yemen": "ye",
  "Zambia": "zm", "Zimbabwe": "zw"
};

const getFlagUrl = (country) => {
  const iso = countryToIso[country];
  return iso ? `https://flagcdn.com/w40/${iso}.png` : 'https://flagcdn.com/w40/un.png';
};

export async function POST(req) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY environment variable is not set.' },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const { persons } = await req.json();

  const totalCount = persons.length;

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
        .header h1 { font-size: 28px; margin: 0; }
        .summary { text-align: center; padding: 15px; font-size: 18px; font-weight: 500; background-color: #f0f4ff; color: #004aad; border-bottom: 1px solid #e0e0e0; }
        .person { padding: 20px; border-bottom: 1px solid #e0e0e0; }
        .person:last-child { border-bottom: none; }
        .person h2 { font-size: 22px; color: #007bff; margin-bottom: 15px; }
        .person p { font-size: 16px; margin: 8px 0; line-height: 1.5; }
        .person strong { color: #555; }
        .person img { display: block; max-width: 200px; border-radius: 4px; border: 1px solid #ddd; }
        .person img[alt*="flag"] { display: inline-block; width: 24px; height: 24px; border-radius: 0; margin: 0 8px 0 0; border: none; vertical-align: middle; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Passport Submission</h1>
        </div>

        <div class="summary">
          This email contains <strong>${totalCount}</strong> passport${totalCount > 1 ? 's' : ''}.
        </div>
  `;

  persons.forEach((p, index) => {
    htmlContent += `
      <div class="person">
        <h2>${p.full_name} (${index + 1})</h2>
        <p><strong>Full Name:</strong> ${p.full_name}</p>
        <p><strong>Date of Birth:</strong> ${p.date_of_birth}</p>
        <p><strong>Country:</strong> <img src="${getFlagUrl(p.country)}" alt="${p.country} flag" style="display:inline; vertical-align:middle; width:24px; height:auto;" /> ${p.country}</p>
        <p><strong>Address:</strong> ${p.address || ''}</p>
        <p><strong>Passport / ID Number:</strong> ${p.passport_number}</p>
        <p><strong>Expiry Date:</strong> ${p.expiry_date}</p>
    `;

    // Only show Email and Phone for the first person
    if (index === 0) {
      const phone = p.phone_prefix && p.phone_number ? `${p.phone_prefix}${p.phone_number}` : p.phone_number || '';
      htmlContent += `
        <p><strong>Email:</strong> ${p.email || ''}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `;
    }

    htmlContent += `
        <p>Passport Image:</p>
        <img src="${p.photo_url}" alt="Passport Photo" />
      </div>
    `;
  });

  htmlContent += `
        <div class="footer">
          This email was generated automatically. Please do not reply.<br/>
          © Berisha Apartments 2025
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'noreply@resend.dev',
      to: ['egiberisha9@gmail.com'],
      subject: 'New Passport Submission',
      html: htmlContent,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: 'Failed to send email: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error('Email sending error:', err);
    return NextResponse.json(
      { error: 'Failed to send email: ' + err.message },
      { status: 500 }
    );
  }
}
