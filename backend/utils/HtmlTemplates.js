const verification = (magicLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <table align="center" width="600" style="border-collapse: collapse; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
        <tr>
          <td style="text-align: center; padding: 20px 0;">
            <h1 style="color: #2d89ef; margin: 0;">Trend Mart</h1>
            <p style="font-size: 18px; color: #555;">Your Trusted Marketplace</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="font-size: 24px; color: #333; text-align: center;">Verify Your Email</h2>
            <p style="font-size: 16px; color: #555;">
              Hi there,
            </p>
            <p style="font-size: 16px; color: #555;">
              Thank you for signing up at <strong>Trend Mart</strong>. To start exploring amazing deals and products, please verify your email by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" style="font-size: 16px; color: #fff; background-color: #2d89ef; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center;">
              Or paste this link into your browser if the button above doesn't work:
            </p>
            <p style="font-size: 14px; color: #2d89ef; text-align: center; word-wrap: break-word;">
              <a href="${magicLink}" style="color: #2d89ef; text-decoration: none;">${magicLink}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #aaa;">
              If you did not create an account with Trend Mart, please ignore this email.
            </p>
            <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Trend Mart. All Rights Reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const text = `
    Trend Mart - Your Trusted Marketplace
    -------------------------------------
    
    Hi there,

    Thank you for signing up at Trend Mart. To start exploring amazing deals and products, please verify your email by clicking the link below:

    Verify Email: ${magicLink}

    If you did not create an account with Trend Mart, please ignore this email.

    Regards,
    Trend Mart Team
  `;

  return { html, text };
};

module.exports = { verification };
