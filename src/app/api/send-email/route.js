// src/app/api/send-email/route.js
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const { persons } = await req.json()

  // Create HTML email content with improved styling
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
        .header h1 { font-size: 28px; margin: 0; }
        .person { padding: 20px; border-bottom: 1px solid #e0e0e0; }
        .person:last-child { border-bottom: none; }
        .person h2 { font-size: 22px; color: #007bff; margin-bottom: 15px; }
        .person p { font-size: 16px; margin: 8px 0; line-height: 1.5; }
        .person strong { color: #555; }
        .person img { display: block; max-width: 200px; border-radius: 4px; margin-top: 10px; border: 1px solid #ddd; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Passport Submission</h1>
        </div>
  `

  persons.forEach((p, index) => {
    htmlContent += `
        <div class="person">
          <h2>${p.full_name} (${index + 1})</h2>
          <p><strong>Full Name:</strong> ${p.full_name}</p>
          <p><strong>Passport Number:</strong> ${p.passport_number}</p>
          <p><strong>Date of Birth:</strong> ${p.date_of_birth}</p>
          <p><strong>Expiry Date:</strong> ${p.expiry_date}</p>
          <p><strong>Email:</strong> ${p.email || 'N/A'}</p>
          <p><strong>Address:</strong> ${p.address || 'N/A'}</p>
          <p><strong>Phone Number:</strong> ${p.phone_number || 'N/A'}</p>
          <img src="${p.photo_url}" alt="Passport Photo" />
        </div>
    `
  })

  htmlContent += `
        <div class="footer">
          This email was generated automatically. Please do not reply.
          berishaapartments 2025 
        </div>
      </div>
    </body>
    </html>
  `

  await resend.emails.send({
    from: 'noreply@resend.dev',
    to: ['egiberisha9@gmail.com'], // testing email
    subject: 'New Passport Submission',
    html: htmlContent,
  })

  return NextResponse.json({ ok: true })
}