'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './page.module.css';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic (Czechia)", "Democratic Republic of the Congo", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const PassportForm = () => {
  const [persons, setPersons] = useState([{
    full_name: '',
    date_of_birth: '',
    country: '',
    address: '',
    passport_number: '',
    expiry_date: '',
    email: '',
    phone_number: '',
    file: null,
  }]);

  const [status, setStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setPersons(prev => prev.map((p, i) => i === index ? { ...p, [name]: value } : p));
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
      setPersons(prev => [...prev, {
        full_name: '',
        date_of_birth: '',
        country: '',
        address: '',
        passport_number: '',
        expiry_date: '',
        email: '',
        phone_number: '',
        file: null,
      }]);
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
        const fileName = `${Date.now()}_${safeName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('passport-photos')
          .upload(fileName, person.file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('passport-photos')
          .getPublicUrl(fileName);

        uploadedPersons.push({
          full_name: person.full_name,
          date_of_birth: person.date_of_birth,
          country: person.country,
          address: person.address,
          passport_number: person.passport_number,
          expiry_date: person.expiry_date,
          email: person.email,
          phone_number: person.phone_number,
          photo_url: publicUrlData.publicUrl,
        });
      }

      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persons: uploadedPersons }),
      });

      if (!emailRes.ok) throw new Error('Failed to send email');

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
        phone_number: '',
        file: null,
      }]);
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

              {/* Name */}
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

              {/* Birthdate */}
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
                  <select
                    id={`country_${index}`}
                    name="country"
                    value={person.country}
                    onChange={(e) => handleChange(index, e)}
                    required
                    className={styles.selectInput}
                  >
                    <option value="" disabled>Country</option>
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

              {/* Email */}
              <div className={styles.inputGroup}>
                <label htmlFor={`email_${index}`}>Email</label>
                <input
                  id={`email_${index}`}
                  name="email"
                  placeholder="Enter email"
                  type="email"
                  value={person.email}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              {/* Phone */}
              <div className={styles.inputGroup}>
                <label htmlFor={`phone_number_${index}`}>Phone Number</label>
                <input
                  id={`phone_number_${index}`}
                  name="phone_number"
                  placeholder="Enter phone number"
                  type="text"
                  value={person.phone_number}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

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
                <small>Max file size: 5 MB</small>
              </div>
            </div>
          ))}

          <div className={styles.buttonRow}>
            {persons.length < 5 && (
              <button type="button" onClick={addPerson} className={styles.addBtn}>
                + Add Another Person
              </button>
            )}
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>

        <p className={styles.status}>{status}</p>
      </div>

      {showSuccess && (
        <div className={styles.overlay}>
          <div className={styles.overlayBox}>
            <h2>✅ Thank you!</h2>
            <p>Your submission was successful.<br />The tab will close when you click below.</p>
            <button
              onClick={() => {
                setShowSuccess(false);
                window.close();
              }}
              className={styles.closeBtn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PassportForm;
