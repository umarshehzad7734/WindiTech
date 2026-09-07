<?php
/**
 * Windii Technologies — contact form configuration.
 *
 * SETUP:
 *   1. Copy this file to  contact-config.php  (drop the ".example")
 *   2. Fill in the values below
 *   3. Upload it next to contact.php in public_html
 *
 * Never commit contact-config.php to git — it holds credentials.
 * The bundled .htaccess blocks it from being downloaded over the web.
 */

return [
    // Where enquiries are delivered.
    'to_email'   => 'info@windiitechnologies.com',
    'to_name'    => 'Windii Technologies',

    /*
     * The From address. It MUST be on a domain you are allowed to send as —
     * never the visitor's address, which would fail SPF and land in spam.
     * The visitor's address is set as Reply-To automatically.
     */
    'from_email' => 'no-reply@windiitechnologies.com',
    'from_name'  => 'Windii Technologies',

    /*
     * 'mail'   — PHP's built-in mail(). No setup. Best when the destination
     *            mailbox lives on this same host (delivery is local).
     * 'resend' — Resend HTTP API. Better deliverability, and works even when
     *            the host blocks outbound SMTP ports. Requires an API key and
     *            a verified sending domain. See DNS-AND-EMAIL.md.
     */
    'transport' => 'mail',

    // Only needed when transport is 'resend'.
    'resend_api_key' => '',

    // Max submissions per IP address per window.
    'rate_limit_max'        => 5,
    'rate_limit_window_sec' => 600,
];
