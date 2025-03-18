export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject') || 'New Contact Form Submission';
    const message = formData.get('message');
    
    // Validate inputs
    if (!name || !email || !message) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Email content
    const emailContent = `
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      
      Message:
      ${message}
    `;
    
    // Send email using Cloudflare Email
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'admin@caricominvest.com', name: 'CaricomInvest Admin' }],
          },
        ],
        from: {
          email: 'no-reply@caricominvest.com',
          name: 'CaricomInvest Website',
        },
        subject: `Contact Form: ${subject}`,
        content: [
          {
            type: 'text/plain',
            value: emailContent,
          },
        ],
      }),
    });

    // Redirect back with success message
    return Response.redirect('/?message=success#contact', 302);
  } catch (error) {
    return new Response('Error processing form: ' + error.message, { status: 500 });
  }
}
