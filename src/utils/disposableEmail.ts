// src/utils/disposableEmails.ts

export const disposableDomains = [
  "mailinator.com",
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.com",  
  "10minutemail.com",
  "10minuteMail.com",
  "yopmail.com",
  "guerrillamail.com",
  "mailjetable.fr",
  "mohmal.com",
  "tmailor.com",
  "mailnesia.com",
  "trashmail.com",
  "emailondeck.com",
  "trashmail.com",
  "dispostable.com",
  "spamgourmet.com",
  "burnermail.io",
  "maildrop.cc",
  "getnada.com",
  "emailfake.com",
  "temporary-email.com",
  "mailcatch.com",
  "spamobox.com",
  "spamfree24.com",
  "inboxes.com",
  "inboxkitten.com",
  "spamgourmet.net",
  "tempemail.net",
  "mailnesia.info",
  "throwawaymail.net",
  "fakeinbox.com",
  "emailondeck.com",
  "mailforspam.com",
  "mailexpire.com",
  "dispostable.com",
  "temporary-email.com",
  "fakemailgenerator.net",
  "spamgourmet.net",
  "mailfreeonline.com",
  "emailondeck.net",
  "dropmail.me",
];

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return disposableDomains.includes(domain); // Si retourne true, c'est un email jetable 
}