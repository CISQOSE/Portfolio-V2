// api/contact.js — Vercel Serverless Function
// Envoie un email via Gmail SMTP avec Nodemailer

const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // CORS — autoriser uniquement POST
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prenom, nom, email, message } = req.body;

  // Validation
  if (!prenom || !email || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  // Validation email basique
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }

  try {
    // Créer le transporteur Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,   // bmsc1906@gmail.com
        pass: process.env.GMAIL_PASS,   // Mot de passe d'application Gmail
      },
    });

    // Email reçu dans ta boîte
    await transporter.sendMail({
      from: `"Portfolio Shanks_Dev" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `📩 Nouveau message de ${prenom} ${nom || ''} — Portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #0d0d0d; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00e5c3, #0099ff); padding: 28px 32px;">
            <h2 style="margin: 0; color: #fff; font-size: 22px;">Nouveau message depuis ton portfolio</h2>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 13px; width: 100px;">Prénom</td>
                <td style="padding: 10px 0; font-weight: 600; color: #fff;">${prenom}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Nom</td>
                <td style="padding: 10px 0; color: #fff;">${nom || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #00e5c3;">${email}</a></td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;">
            <p style="color: #888; font-size: 13px; margin-bottom: 8px;">Message</p>
            <p style="background: #1a1a1a; padding: 18px; border-radius: 8px; line-height: 1.7; color: #e0e0e0; white-space: pre-wrap;">${message}</p>
            <div style="margin-top: 28px;">
              <a href="mailto:${email}" style="display:inline-block; background: linear-gradient(135deg,#00e5c3,#0099ff); color:#000; font-weight:700; padding: 12px 28px; border-radius: 8px; text-decoration: none;">Répondre à ${prenom}</a>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #111; color: #555; font-size: 12px;">
            Envoyé depuis shanks-dev.vercel.app
          </div>
        </div>
      `,
    });

    // Email de confirmation à l'expéditeur
    await transporter.sendMail({
      from: `"Shanks_Dev" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ Message bien reçu — Shanks_Dev`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #0d0d0d; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00e5c3, #0099ff); padding: 28px 32px;">
            <h2 style="margin: 0; color: #fff; font-size: 22px;">Message bien reçu !</h2>
          </div>
          <div style="padding: 32px;">
            <p>Bonjour <strong>${prenom}</strong>,</p>
            <p>Merci pour ton message ! Je l'ai bien reçu et je te répondrai dans les plus brefs délais.</p>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">— Babacar (Shanks_Dev)</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Erreur email :', err);
    return res.status(500).json({ error: 'Erreur lors de l\'envoi. Réessaie plus tard.' });
  }
}
