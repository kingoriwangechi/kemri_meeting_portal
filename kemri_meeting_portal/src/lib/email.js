import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMeetingInvitation = async (meeting, attendees) => {
	const { title, description, dateTime, platform, meetingLink, organizer } =
		meeting;

	const formatDate = (dateTime) => {
		return new Date(dateTime).toLocaleString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		});
	};

	const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .meeting-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>KEMRI Meeting Invitation</h1>
      </div>
      
      <div class="content">
        <h2>You're invited to: ${title}</h2>
        
        <div class="meeting-details">
          <p><strong>Date & Time:</strong> ${formatDate(dateTime)}</p>
          <p><strong>Platform:</strong> ${platform}</p>
          <p><strong>Organizer:</strong> ${organizer}</p>
          ${
						description
							? `<p><strong>Description:</strong> ${description}</p>`
							: ""
					}
        </div>
        
        ${
					meetingLink
						? `
          <p>Join the meeting using the link below:</p>
          <a href="${meetingLink}" class="button">Join Meeting</a>
        `
						: ""
				}
        
        <p>Please save this date and time in your calendar.</p>
      </div>
      
      <div class="footer">
        <p>Kenya Medical Research Institute (KEMRI)</p>
        <p>This is an automated message from the KEMRI Meeting Portal</p>
      </div>
    </body>
    </html>
  `;

	const msg = {
		to: attendees,
		from: "noreply@kemri.go.ke", // Use your verified sender
		subject: `KEMRI Meeting Invitation: ${title}`,
		html: htmlContent,
	};

	try {
		await sgMail.send(msg);
		return { success: true };
	} catch (error) {
		console.error("Error sending email:", error);
		return { success: false, error: error.message };
	}
};
