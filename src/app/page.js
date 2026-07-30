'use client';

import { useState } from 'react';
import styles from './page.module.css';

const countryFlagMap = {
  "Afghanistan": "🇦🇫", "Albania": "🇦🇱", "Algeria": "🇩🇿", "Andorra": "🇦🇩", "Angola": "🇦🇴",
  "Antigua and Barbuda": "🇦🇬", "Argentina": "🇦🇷", "Armenia": "🇦🇲", "Australia": "🇦🇺", "Austria": "🇦🇹", "Azerbaijan": "🇦🇿",
  "Bahamas": "🇧🇸", "Bahrain": "🇧🇭", "Bangladesh": "🇧🇩", "Barbados": "🇧🇧", "Belarus": "🇧🇾", "Belgium": "🇧🇪", "Belize": "🇧🇿", "Benin": "🇧🇯",
  "Bhutan": "🇧🇹", "Bolivia": "🇧🇴", "Bosnia and Herzegovina": "🇧🇦", "Botswana": "🇧🇼", "Brazil": "🇧🇷", "Brunei": "🇧🇳", "Bulgaria": "🇧🇬",
  "Burkina Faso": "🇧🇫", "Burundi": "🇧🇮", "Cabo Verde": "🇨🇻", "Cambodia": "🇰🇭", "Cameroon": "🇨🇲", "Canada": "🇨🇦", "Central African Republic": "🇨🇫",
  "Chad": "🇹🇩", "Chile": "🇨🇱", "China": "🇨🇳", "Colombia": "🇨🇴", "Comoros": "🇰🇲", "Congo (Congo-Brazzaville)": "🇨🇬", "Costa Rica": "🇨🇷", "Croatia": "🇭🇷",
  "Cuba": "🇨🇺", "Cyprus": "🇨🇾", "Czech Republic (Czechia)": "🇨🇿", "Democratic Republic of the Congo": "🇨🇩", "Denmark": "🇩🇰", "Djibouti": "🇩🇯",
  "Dominica": "🇩🇲", "Dominican Republic": "🇩🇴", "Ecuador": "🇪🇨", "Egypt": "🇪🇬", "El Salvador": "🇸🇻", "Equatorial Guinea": "🇬🇶", "Eritrea": "🇪🇷", "Estonia": "🇪🇪",
  "Eswatini (fmr. Swaziland)": "🇸🇿", "Ethiopia": "🇪🇹", "Fiji": "🇫🇯", "Finland": "🇫🇮", "France": "🇫🇷", "Gabon": "🇬🇦", "Gambia": "🇬🇲", "Georgia": "🇬🇪", "Germany": "🇩🇪", "Ghana": "🇬🇭",
  "Greece": "🇬🇷", "Grenada": "🇬🇩", "Guatemala": "🇬🇹", "Guinea": "🇬🇳", "Guinea-Bissau": "🇬🇼", "Guyana": "🇬🇾", "Haiti": "🇭🇹", "Honduras": "🇭🇳", "Hungary": "🇭🇺", "Iceland": "🇮🇸", "India": "🇮🇳",
  "Indonesia": "🇮🇩", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Ireland": "🇮🇪", "Israel": "🇮🇱", "Italy": "🇮🇹", "Jamaica": "🇯🇲", "Japan": "🇯🇵", "Jordan": "🇯🇴", "Kazakhstan": "🇰🇿", "Kenya": "🇰🇪", "Kiribati": "🇰🇮",
  "Kosovo": "🇽🇰", "Kuwait": "🇰🇼", "Kyrgyzstan": "🇰🇬", "Laos": "🇱🇦", "Latvia": "🇱🇻", "Lebanon": "🇱🇧", "Lesotho": "🇱🇸", "Liberia": "🇱🇷", "Libya": "🇱🇾", "Liechtenstein": "🇱🇮", "Lithuania": "🇱🇹",
  "Luxembourg": "🇱🇺", "Madagascar": "🇲🇬", "Malawi": "🇲🇼", "Malaysia": "🇲🇾", "Maldives": "🇲🇻", "Mali": "🇲🇱", "Malta": "🇲🇹", "Marshall Islands": "🇲🇭", "Mauritania": "🇲🇷", "Mauritius": "🇲🇺",
  "Mexico": "🇲🇽", "Micronesia": "🇫🇲", "Moldova": "🇲🇩", "Monaco": "🇲🇨", "Mongolia": "🇲🇳", "Montenegro": "🇲🇪", "Morocco": "🇲🇦", "Mozambique": "🇲🇿", "Myanmar (Burma)": "🇲🇲", "Namibia": "🇳🇦",
  "Nauru": "🇳🇷", "Nepal": "🇳🇵", "Netherlands": "🇳🇱", "New Zealand": "🇳🇿", "Nicaragua": "🇳🇮", "Niger": "🇳🇪", "Nigeria": "🇳🇬", "North Korea": "🇰🇵", "North Macedonia": "🇲🇰", "Norway": "🇳🇴",
  "Oman": "🇴🇲", "Pakistan": "🇵🇰", "Palau": "🇵🇼", "Palestine State": "🇵🇸", "Panama": "🇵🇦", "Papua New Guinea": "🇵🇬", "Paraguay": "🇵🇾", "Peru": "🇵🇪", "Philippines": "🇵🇭", "Poland": "🇵🇱",
  "Portugal": "🇵🇹", "Qatar": "🇶🇦", "Romania": "🇷🇴", "Russia": "🇷🇺", "Rwanda": "🇷🇼", "Saint Kitts and Nevis": "🇰🇳", "Saint Lucia": "🇱🇨", "Saint Vincent and the Grenadines": "🇻🇨",
  "Samoa": "🇼🇸", "San Marino": "🇸🇲", "Sao Tome and Principe": "🇸🇹", "Saudi Arabia": "🇸🇦", "Senegal": "🇸🇳", "Serbia": "🇷🇸", "Seychelles": "🇸🇨", "Sierra Leone": "🇸🇱", "Singapore": "🇸🇬",
  "Slovakia": "🇸🇰", "Slovenia": "🇸🇮", "Solomon Islands": "🇸🇧", "Somalia": "🇸🇴", "South Africa": "🇿🇦", "South Korea": "🇰🇷", "South Sudan": "🇸🇸", "Spain": "🇪🇸", "Sri Lanka": "🇱🇰", "Sudan": "🇸🇩",
  "Suriname": "🇸🇷", "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Syria": "🇸🇾", "Taiwan": "🇹🇼", "Tajikistan": "🇹🇯", "Tanzania": "🇹🇿", "Thailand": "🇹🇭", "Timor-Leste": "🇹🇱", "Togo": "🇹🇬", "Tonga": "🇹🇴",
  "Trinidad and Tobago": "🇹🇹", "Tunisia": "🇹🇳", "Turkey": "🇹🇷", "Turkmenistan": "🇹🇲", "Tuvalu": "🇹🇻", "Uganda": "🇺🇬", "Ukraine": "🇺🇦", "United Arab Emirates": "🇦🇪",
  "United Kingdom": "🇬🇧", "United States": "🇺🇸", "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿", "Vanuatu": "🇻🇺", "Vatican City": "🇻🇦", "Venezuela": "🇻🇪", "Vietnam": "🇻🇳", "Yemen": "🇾🇪",
  "Zambia": "🇿🇲", "Zimbabwe": "🇿🇼"
};

// Country to ISO code mapping for reliable flag CDN
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

// Country phone codes
const countryPhoneCodes = {
  "Afghanistan": "+93", "Albania": "+355", "Algeria": "+213", "Andorra": "+376", "Angola": "+244",
  "Antigua and Barbuda": "+1-268", "Argentina": "+54", "Armenia": "+374", "Australia": "+61", "Austria": "+43", "Azerbaijan": "+994",
  "Bahamas": "+1-242", "Bahrain": "+973", "Bangladesh": "+880", "Barbados": "+1-246", "Belarus": "+375", "Belgium": "+32", "Belize": "+501", "Benin": "+229",
  "Bhutan": "+975", "Bolivia": "+591", "Bosnia and Herzegovina": "+387", "Botswana": "+267", "Brazil": "+55", "Brunei": "+673", "Bulgaria": "+359",
  "Burkina Faso": "+226", "Burundi": "+257", "Cabo Verde": "+238", "Cambodia": "+855", "Cameroon": "+237", "Canada": "+1", "Central African Republic": "+236",
  "Chad": "+235", "Chile": "+56", "China": "+86", "Colombia": "+57", "Comoros": "+269", "Congo (Congo-Brazzaville)": "+242", "Costa Rica": "+506", "Croatia": "+385",
  "Cuba": "+53", "Cyprus": "+357", "Czech Republic (Czechia)": "+420", "Democratic Republic of the Congo": "+243", "Denmark": "+45", "Djibouti": "+253",
  "Dominica": "+1-767", "Dominican Republic": "+1-809", "Ecuador": "+593", "Egypt": "+20", "El Salvador": "+503", "Equatorial Guinea": "+240", "Eritrea": "+291", "Estonia": "+372",
  "Eswatini (fmr. Swaziland)": "+268", "Ethiopia": "+251", "Fiji": "+679", "Finland": "+358", "France": "+33", "Gabon": "+241", "Gambia": "+220", "Georgia": "+995", "Germany": "+49", "Ghana": "+233",
  "Greece": "+30", "Grenada": "+1-473", "Guatemala": "+502", "Guinea": "+224", "Guinea-Bissau": "+245", "Guyana": "+592", "Haiti": "+509", "Honduras": "+504", "Hungary": "+36", "Iceland": "+354", "India": "+91",
  "Indonesia": "+62", "Iran": "+98", "Iraq": "+964", "Ireland": "+353", "Israel": "+972", "Italy": "+39", "Jamaica": "+1-876", "Japan": "+81", "Jordan": "+962", "Kazakhstan": "+7", "Kenya": "+254", "Kiribati": "+686",
  "Kosovo": "+383", "Kuwait": "+965", "Kyrgyzstan": "+996", "Laos": "+856", "Latvia": "+371", "Lebanon": "+961", "Lesotho": "+266", "Liberia": "+231", "Libya": "+218", "Liechtenstein": "+423", "Lithuania": "+370",
  "Luxembourg": "+352", "Madagascar": "+261", "Malawi": "+265", "Malaysia": "+60", "Maldives": "+960", "Mali": "+223", "Malta": "+356", "Marshall Islands": "+692", "Mauritania": "+222", "Mauritius": "+230",
  "Mexico": "+52", "Micronesia": "+691", "Moldova": "+373", "Monaco": "+377", "Mongolia": "+976", "Montenegro": "+382", "Morocco": "+212", "Mozambique": "+258", "Myanmar (Burma)": "+95", "Namibia": "+264",
  "Nauru": "+674", "Nepal": "+977", "Netherlands": "+31", "New Zealand": "+64", "Nicaragua": "+505", "Niger": "+227", "Nigeria": "+234", "North Korea": "+850", "North Macedonia": "+389", "Norway": "+47",
  "Oman": "+968", "Pakistan": "+92", "Palau": "+680", "Palestine State": "+970", "Panama": "+507", "Papua New Guinea": "+675", "Paraguay": "+595", "Peru": "+51", "Philippines": "+63", "Poland": "+48",
  "Portugal": "+351", "Qatar": "+974", "Romania": "+40", "Russia": "+7", "Rwanda": "+250", "Saint Kitts and Nevis": "+1-869", "Saint Lucia": "+1-758", "Saint Vincent and the Grenadines": "+1-784",
  "Samoa": "+685", "San Marino": "+378", "Sao Tome and Principe": "+239", "Saudi Arabia": "+966", "Senegal": "+221", "Serbia": "+381", "Seychelles": "+248", "Sierra Leone": "+232", "Singapore": "+65",
  "Slovakia": "+421", "Slovenia": "+386", "Solomon Islands": "+677", "Somalia": "+252", "South Africa": "+27", "South Korea": "+82", "South Sudan": "+211", "Spain": "+34", "Sri Lanka": "+94", "Sudan": "+249",
  "Suriname": "+597", "Sweden": "+46", "Switzerland": "+41", "Syria": "+963", "Taiwan": "+886", "Tajikistan": "+992", "Tanzania": "+255", "Thailand": "+66", "Timor-Leste": "+670", "Togo": "+228", "Tonga": "+676",
  "Trinidad and Tobago": "+1-868", "Tunisia": "+216", "Turkey": "+90", "Turkmenistan": "+993", "Tuvalu": "+688", "Uganda": "+256", "Ukraine": "+380", "United Arab Emirates": "+971",
  "United Kingdom": "+44", "United States": "+1", "Uruguay": "+598", "Uzbekistan": "+998", "Vanuatu": "+678", "Vatican City": "+379", "Venezuela": "+58", "Vietnam": "+84", "Yemen": "+967",
  "Zambia": "+260", "Zimbabwe": "+263"
};

const countries = Object.keys(countryFlagMap);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const uploadPassportPhoto = async (file, safeName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', safeName);

  const res = await fetch('/api/upload-photo', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.error || 'Failed to upload photo');
  }

  const body = await res.json();
  if (!body.publicUrl) {
    throw new Error(body?.error || 'Upload did not return a public URL');
  }

  return body.publicUrl;
};

// Helper to fetch flag images from reliable CDN using ISO codes
const getFlagUrl = (country) => {
  if (!country || !countryToIso[country]) return 'https://flagcdn.com/w40/un.png'; // UN flag as default world representation
  return `https://flagcdn.com/w40/${countryToIso[country]}.png`;
};

const PassportForm = () => {
  const [persons, setPersons] = useState([
    {
      full_name: '',
      date_of_birth: '',
      country: '',
      address: '',
      passport_number: '',
      expiry_date: '',
      email: '',
      phone_country: '',
      phone_number: '',
      file: null,
    },
  ]);

  const [status, setStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setPersons(prev => prev.map((p, i) => {
      if (i === index) {
        const updatedPerson = { ...p, [name]: value };
        // Auto-set phone country prefix when residency country changes
        if (name === 'country' && value && !p.phone_country) {
          updatedPerson.phone_country = value;
        }
        return updatedPerson;
      }
      return p;
    }));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert(`File size exceeds 5 MB: ${file.name}`);
      e.target.value = '';
      return;
    }
    setPersons(prev => prev.map((p, i) => i === index ? { ...p, file } : p));
  };

  const addPerson = () => {
    if (persons.length < 5) {
      setPersons(prev => [
        ...prev,
        {
          full_name: '',
          date_of_birth: '',
          country: '',
          address: '',
          passport_number: '',
          expiry_date: '',
          email: '',
          phone_country: '',
          phone_number: '',
          file: null,
        },
      ]);
    }
  };

  const removePerson = (index) => {
    if (persons.length === 1) return;
    setPersons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Uploading data...');

    try {
      const uploadedPersons = [];

      for (const person of persons) {
        if (!person.file) throw new Error('All persons must have a passport photo');

        const fileExt = person.file.name.split('.').pop();
        const safeName = person.full_name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_');
        const uniqueSuffix = Math.random().toString(36).slice(2, 8);
        const fileName = `${Date.now()}_${uniqueSuffix}_${safeName}.${fileExt}`;

        const publicUrl = await uploadPassportPhoto(person.file, fileName);

        uploadedPersons.push({
          full_name: person.full_name,
          date_of_birth: person.date_of_birth,
          country: person.country,
          address: person.address,
          passport_number: person.passport_number,
          expiry_date: person.expiry_date,
          email: person.email,
          phone_country: person.phone_country,
          phone_prefix: person.phone_country ? countryPhoneCodes[person.phone_country] : '',
          phone_number: person.phone_number,
          photo_url: publicUrl,
        });
      }

      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persons: uploadedPersons }),
      });

      if (!emailRes.ok) {
        const errorBody = await emailRes.json().catch(() => null);
        throw new Error(errorBody?.error || 'Failed to send email');
      }

      setStatus('✅ Data saved and email sent successfully!');
      setShowSuccess(true);
      setPersons([{
        full_name: '',
        date_of_birth: '',
        country: '',
        address: '',
        passport_number: '',
        expiry_date: '',
        email: '',
        phone_country: '',
        phone_number: '',
        file: null,
      }]);

      setTimeout(() => {
        setStatus('');
      }, 3000);
    } catch (err) {
      console.error('Submission error:', err);
      const message = err?.message || err?.error_description || JSON.stringify(err) || 'Unknown error';
      setStatus('❌ Error: ' + message);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <img src="./logo.png" alt="Logo" className={styles.logo} />
      </header>

      <div className={styles.container}>
        <h1 className={styles.title}>Passport Submission Portal</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {persons.map((person, index) => (
            <div key={index} className={styles.personCard}>
              <div className={styles.cardHeader}>
                <h3>Person {index + 1}</h3>
                {persons.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removePerson(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Full Name */}
              <div className={styles.inputGroup}>
                <label htmlFor={`full_name_${index}`}>Full Name</label>
                <input
                  id={`full_name_${index}`}
                  name="full_name"
                  placeholder="Enter full name"
                  type="text"
                  value={person.full_name}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className={styles.inputGroup}>
                <label htmlFor={`date_of_birth_${index}`}>Date of Birth</label>
                <input
                  id={`date_of_birth_${index}`}
                  type="date"
                  name="date_of_birth"
                  value={person.date_of_birth}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className={styles.datePickerInput}
                />
              </div>

              {/* Country */}
              <div className={styles.inputGroup}>
                <label htmlFor={`country_${index}`}>Country</label>
                <div className={styles.selectWrapper}>
                  <img
                    src={getFlagUrl(person.country)}
                    alt=""
                    className={styles.flagImg}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <select
                    id={`country_${index}`}
                    name="country"
                    value={person.country}
                    onChange={(e) => handleChange(index, e)}
                    required
                    className={styles.selectInput}
                  >
                    <option value="" disabled>Select a country</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className={styles.inputGroup}>
                <label htmlFor={`address_${index}`}>Address</label>
                <input
                  id={`address_${index}`}
                  name="address"
                  placeholder="Enter address"
                  type="text"
                  value={person.address}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              {/* Passport or ID Number */}
              <div className={styles.inputGroup}>
                <label htmlFor={`passport_number_${index}`}>Passport / ID Number</label>
                <input
                  id={`passport_number_${index}`}
                  name="passport_number"
                  placeholder="Enter passport or ID number"
                  type="text"
                  value={person.passport_number}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              {/* Expiry Date */}
              <div className={styles.inputGroup}>
                <label htmlFor={`expiry_date_${index}`}>Expiry Date</label>
                <input
                  id={`expiry_date_${index}`}
                  type="date"
                  name="expiry_date"
                  value={person.expiry_date}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className={styles.datePickerInput}
                />
              </div>

              {/* Email & Phone - Only for first person */}
              {index === 0 && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor={`email_${index}`}>Email</label>
                    <input
                      id={`email_${index}`}
                      name="email"
                      placeholder="Enter email"
                      type="email"
                      value={person.email}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={`phone_${index}`}>Phone Number</label>
                    <div className={styles.phoneInputGroup}>
                      <div className={styles.phoneCodeWrapper}>
                        <img
                          src={getFlagUrl(person.phone_country)}
                          alt=""
                          className={styles.phoneFlagImg}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <select
                          id={`phone_country_${index}`}
                          name="phone_country"
                          value={person.phone_country}
                          onChange={(e) => handleChange(index, e)}
                          className={styles.phoneCodeSelect}
                          required
                        >
                          <option value="" disabled>Prefix</option>
                          {countries.map(c => (
                            <option key={c} value={c}>{countryPhoneCodes[c]} ({countryToIso[c]?.toUpperCase()})</option>
                          ))}
                        </select>
                      </div>
                      <input
                        id={`phone_${index}`}
                        name="phone_number"
                        placeholder="Enter phone number"
                        type="text"
                        value={person.phone_number}
                        onChange={(e) => handleChange(index, e)}
                        className={styles.phoneNumberInput}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Passport Photo */}
              <div className={styles.inputGroup}>
                <label htmlFor={`file_${index}`}>Passport Photo</label>
                <input
                  id={`file_${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                  required
                />
                <small>Max file size: 10 MB</small>
              </div>
            </div>
          ))}

          <div className={styles.buttonRow}>
            {persons.length < 5 && (
              <button type="button" onClick={addPerson} className={styles.addBtn}>
                + Add Another Person
              </button>
            )}
            <button type="submit" className={styles.submitBtn}>Submit</button>
          </div>
        </form>

        <p className={styles.status}>{status}</p>
      </div>

      {showSuccess && (
        <div className={styles.overlay}>
          <div className={styles.overlayBox}>
            <h2>✅ Thank you!</h2>
            <p>Your submission was successful.<br />Click OK to refresh the page.</p>
            <button
              onClick={() => {
                setShowSuccess(false);
                window.location.reload();
              }}
              className={styles.closeBtn}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>&copy; 2026 Berisha Apartments. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default PassportForm;
