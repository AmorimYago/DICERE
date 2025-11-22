/**
 * Email service for sending reports and notifications
 * Note: This uses a basic approach. For production, consider using services like:
 * - SendGrid
 * - AWS SES
 * - Resend
 * - NodeMailer with SMTP
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

/**
 * Send email using configured email service
 * This is a placeholder implementation. In production, replace with actual email service.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // For development/testing, log email details
    console.log('📧 Email would be sent:')
    console.log(`  To: ${options.to}`)
    console.log(`  Subject: ${options.subject}`)
    console.log(`  Has attachments: ${options.attachments ? 'Yes' : 'No'}`)

    // TODO: Implement actual email sending using your preferred service
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // await sgMail.send({
    //   to: options.to,
    //   from: process.env.FROM_EMAIL,
    //   subject: options.subject,
    //   html: options.html,
    //   attachments: options.attachments
    // })

    // For now, return true to indicate success
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Generate HTML email template for report
 */
export function generateReportEmailTemplate(data: {
  childName: string
  date: string
  totalSequences: number
  totalImages: number
  mostUsedWords: string[]
  reportUrl?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório DICERE</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2196F3;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #2196F3;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #666;
            font-size: 14px;
          }
          .content {
            margin-bottom: 30px;
          }
          .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            margin: 10px 0;
            background-color: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #2196F3;
          }
          .stat-label {
            font-weight: 600;
            color: #555;
          }
          .stat-value {
            font-weight: bold;
            color: #2196F3;
          }
          .words-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }
          .word-tag {
            background-color: #2196F3;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2196F3;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DICERE</div>
            <div class="subtitle">Relatório de Comunicação AAC</div>
          </div>
          
          <div class="content">
            <h2>Olá!</h2>
            <p>Aqui está o relatório de comunicação de <strong>${data.childName}</strong> para o dia <strong>${data.date}</strong>.</p>
            
            <div class="stat-row">
              <span class="stat-label">Total de Sequências</span>
              <span class="stat-value">${data.totalSequences}</span>
            </div>
            
            <div class="stat-row">
              <span class="stat-label">Total de Imagens Usadas</span>
              <span class="stat-value">${data.totalImages}</span>
            </div>
            
            ${data.mostUsedWords.length > 0 ? `
              <div style="margin-top: 20px;">
                <h3 style="color: #333;">Palavras Mais Usadas</h3>
                <div class="words-list">
                  ${data.mostUsedWords.map(word => `<span class="word-tag">${word}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${data.reportUrl ? `
              <div style="text-align: center;">
                <a href="${data.reportUrl}" class="button">Ver Relatório Completo</a>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Este é um email automático do DICERE.</p>
            <p>© ${new Date().getFullYear()} DICERE - Comunicação para Crianças Autistas</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Send report email to user
 */
export async function sendReportEmail(
  recipientEmail: string,
  reportData: {
    childName: string
    date: string
    totalSequences: number
    totalImages: number
    mostUsedWords: string[]
    reportUrl?: string
  }
): Promise<boolean> {
  const html = generateReportEmailTemplate(reportData)
  
  return sendEmail({
    to: recipientEmail,
    subject: `Relatório DICERE - ${reportData.childName} - ${reportData.date}`,
    html,
  })
}
