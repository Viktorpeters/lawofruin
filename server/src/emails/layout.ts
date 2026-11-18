/* The one frame every email shares. Built the way email must be built to look right in Gmail,
   Outlook, Apple Mail and on phones: tables for layout, every style written inline, a fixed
   600px column that shrinks on small screens, images with width set and alt text, and web-safe
   fonts (Georgia and a monospace) because email apps do not load web fonts reliably.
   The images live on the website: lawofruin.app/email/header.jpg and book.jpg. */
import { env } from "../config/env";

export const CONTACT = "lawofruin@gmail.com";

const site = () => env.APP_URL.replace(/\/$/, "");
export const assets = () => `${site()}/email`;

const C = { page: "#e9e2d4", paper: "#f7f2e8", ink: "#1d1812", soft: "#5c5246", mute: "#8c8377", gold: "#9a7430", line: "#ddd3c2", dark: "#0b0a08" };

export type Shell = {
  preheader: string;            // the grey line inboxes show after the subject
  heading: string;
  body: string;                 // inner HTML: use p(), label(), table rows from below
  cta?: { label: string; url: string };
  image?: "book";               // a wide picture under the header
  reason: string;               // why the reader got this email (footer)
  unsubscribeUrl?: string;      // marketing only: the law requires a way out
};

export const p = (html: string) =>
  `<p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${C.soft}">${html}</p>`;

export const label = (text: string) =>
  `<p style="margin:26px 0 8px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.gold}">${text}</p>`;

/* a two-column list of facts: a receipt, a summary */
export const facts = (rows: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:6px 0 18px;border-top:1px solid ${C.line}">${rows
    .map(
      ([k, v]) => `<tr>
      <td style="padding:11px 0;border-bottom:1px solid ${C.line};font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.mute}">${k}</td>
      <td align="right" style="padding:11px 0;border-bottom:1px solid ${C.line};font-family:Georgia,serif;font-size:15px;color:${C.ink}">${v}</td>
    </tr>`,
    )
    .join("")}</table>`;

/* the one-time code, large and spaced, easy to read and to type */
export const code = (value: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px"><tr><td style="padding:16px 26px;border:1px solid ${C.gold};font-family:'Courier New',Courier,monospace;font-size:34px;letter-spacing:10px;color:${C.ink}">${value}</td></tr></table>`;

export function layout(s: Shell) {
  const url = site();
  const cta = s.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:10px 0 6px"><tr>
        <td style="border:1px solid ${C.ink}"><a href="${s.cta.url}" style="display:inline-block;padding:14px 26px;font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${C.ink};text-decoration:none">${s.cta.label}</a></td>
      </tr></table>`
    : "";
  const image = s.image === "book"
    ? `<tr><td style="background:${C.dark}"><img src="${assets()}/book.jpg" width="600" alt="The Laws of Ruin, Investigation I: The Fall of Kings" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>`
    : "";
  const link = (path: string, text: string) => `<a href="${url}${path}" style="color:${C.mute};text-decoration:underline">${text}</a>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${s.heading}</title>
<style>
  @media (max-width: 620px) {
    .col { width: 100% !important; }
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 25px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${s.preheader}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}">
  <tr><td align="center" style="padding:28px 12px">
    <table role="presentation" class="col" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${C.paper}">
      <tr><td style="background:${C.dark}"><a href="${url}"><img src="${assets()}/header.jpg" width="600" alt="The Laws of Ruin" style="display:block;width:100%;max-width:600px;height:auto;border:0"></a></td></tr>
      ${image}
      <tr><td class="pad" style="padding:40px 44px 34px">
        <h1 class="h1" style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:29px;line-height:1.2;color:${C.ink}">${s.heading}</h1>
        ${s.body}
        ${cta}
      </td></tr>
      <tr><td class="pad" style="padding:26px 44px 34px;border-top:1px solid ${C.line}">
        <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.ink}">The Laws of Ruin</p>
        <p style="margin:0 0 12px;font-family:Georgia,serif;font-size:13px;line-height:1.6;color:${C.mute}">Published by the Publications Team of Orion Learning Innovations, Lagos, Nigeria. Questions: <a href="mailto:${CONTACT}" style="color:${C.mute}">${CONTACT}</a></p>
        <p style="margin:0 0 12px;font-family:Georgia,serif;font-size:13px;line-height:1.6;color:${C.mute}">${s.reason}</p>
        <p style="margin:0;font-family:Georgia,serif;font-size:13px;line-height:1.6;color:${C.mute}">${link("/terms", "Terms")} &nbsp;·&nbsp; ${link("/privacy", "Privacy")} &nbsp;·&nbsp; ${link("/refunds", "Refunds")}${s.unsubscribeUrl ? ` &nbsp;·&nbsp; <a href="${s.unsubscribeUrl}" style="color:${C.mute};text-decoration:underline">Unsubscribe</a>` : ""}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
