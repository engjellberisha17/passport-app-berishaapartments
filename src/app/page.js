'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './page.module.css';

const PassportForm = () => {
  const [persons, setPersons] = useState([
    {
      full_name: '',
      passport_number: '',
      date_of_birth: '',
      expiry_date: '',
      email: '',
      address: '',
      phone_number: '',
      file: null,
    },
  ]);
  const [status, setStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // ✅ new state

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setPersons((prev) => prev.map((p, i) => (i === index ? { ...p, [name]: value } : p)));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    setPersons((prev) => prev.map((p, i) => (i === index ? { ...p, file } : p)));
  };

  const addPerson = () => {
    if (persons.length < 5) {
      setPersons((prev) => [
        ...prev,
        {
          full_name: '',
          passport_number: '',
          date_of_birth: '',
          expiry_date: '',
          email: '',
          address: '',
          phone_number: '',
          file: null,
        },
      ]);
    }
  };

  const removePerson = (index) => {
    if (persons.length === 1) return;
    setPersons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Uploading data...');

    try {
      const uploadedPersons = [];

      for (const person of persons) {
        if (!person.file) throw new Error('All persons must have a passport photo');

        const fileExt = person.file.name.split('.').pop();
        const fileName = `${Date.now()}_${person.full_name.replace(/\s+/g, '_')}.${fileExt}`;

        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('passport-photos')
          .upload(fileName, person.file);
        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('passport-photos')
          .getPublicUrl(fileName);

        uploadedPersons.push({
          full_name: person.full_name,
          passport_number: person.passport_number,
          date_of_birth: person.date_of_birth,
          expiry_date: person.expiry_date,
          email: person.email,
          address: person.address,
          phone_number: person.phone_number,
          photo_url: publicUrlData.publicUrl,
        });
      }

      const { error: dbError } = await supabase.from('passports').insert(uploadedPersons);
      if (dbError) throw dbError;

      // ✅ Send email
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persons: uploadedPersons }),
      });
      if (!emailRes.ok) throw new Error('Failed to send email');

      setStatus('✅ Data saved and email sent successfully!');
      setShowSuccess(true); // ✅ show overlay
      setPersons([
        {
          full_name: '',
          passport_number: '',
          date_of_birth: '',
          expiry_date: '',
          email: '',
          address: '',
          phone_number: '',
          file: null,
        },
      ]);
    } catch (err) {
      console.error('Submission error:', err);
      const message =
        err?.message || err?.error_description || JSON.stringify(err) || 'Unknown error';
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

              {/* Form Fields */}
              {[
                { label: 'Full Name', name: 'full_name', placeholder: 'Enter full name' },
                { label: 'Passport Number / ID Number', name: 'passport_number', placeholder: 'Enter passport or ID number' },
                { label: 'Email (optional)', name: 'email', placeholder: 'Enter email', type: 'email' },
                { label: 'Address (optional)', name: 'address', placeholder: 'Enter address' },
                { label: 'Phone Number (optional)', name: 'phone_number', placeholder: 'Enter phone number' },
              ].map(({ label, name, placeholder, type = 'text' }) => (
                <div key={name} className={styles.inputGroup}>
                  <label htmlFor={`${name}_${index}`}>{label}</label>
                  <input
                    id={`${name}_${index}`}
                    name={name}
                    placeholder={placeholder}
                    type={type}
                    value={person[name]}
                    onChange={(e) => handleChange(index, e)}
                    required={name === 'full_name' || name === 'passport_number'}
                  />
                </div>
              ))}

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

              <div className={styles.inputGroup}>
                <label htmlFor={`expiry_date_${index}`}>Passport Expiry Date</label>
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

              <div className={styles.inputGroup}>
                <label htmlFor={`file_${index}`}>Passport Photo</label>
                <input
                  id={`file_${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                  required
                />
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

      {/* ✅ Overlay */}
      {showSuccess && (
        <div className={styles.overlay}>
          <div className={styles.overlayBox}>
            <h2>✅ Thank you!</h2>
            <p>Your submission was successful.<br />You can now close this tab.</p>
            <button onClick={() => setShowSuccess(false)} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PassportForm;
