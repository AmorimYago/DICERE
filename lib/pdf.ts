/**
 * PDF generation service for reports
 * Note: This is a basic implementation. For production, consider using:
 * - jsPDF
 * - PDFKit
 * - Puppeteer (for HTML to PDF conversion)
 * - React-PDF
 */

export interface ReportData {
  childName: string
  date: string
  totalSequences: number
  totalImages: number
  mostUsedWords: string[]
  sequences?: Array<{
    timestamp: string
    images: string[]
  }>
}

/**
 * Generate PDF report HTML that can be converted to PDF
 * This returns HTML that's optimized for PDF printing
 */
export function generatePDFReportHTML(data: ReportData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório DICERE - ${data.childName}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 4px solid #2196F3;
          }
          
          .logo {
            font-size: 42px;
            font-weight: bold;
            color: #2196F3;
            margin-bottom: 10px;
          }
          
          .subtitle {
            color: #666;
            font-size: 16px;
          }
          
          .report-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .info-row:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 600;
            color: #555;
          }
          
          .info-value {
            font-weight: bold;
            color: #2196F3;
          }
          
          .section {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #2196F3;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2196F3;
          }
          
          .words-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 10px;
            margin-top: 15px;
          }
          
          .word-item {
            background-color: #2196F3;
            color: white;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            font-weight: 600;
          }
          
          .sequence-item {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            border-left: 4px solid #4CAF50;
          }
          
          .sequence-time {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .sequence-images {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .image-tag {
            background-color: white;
            border: 2px solid #4CAF50;
            color: #4CAF50;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">DICERE</div>
          <div class="subtitle">Relatório de Comunicação AAC</div>
        </div>
        
        <div class="report-info">
          <div class="info-row">
            <span class="info-label">Nome da Criança:</span>
            <span class="info-value">${data.childName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Data do Relatório:</span>
            <span class="info-value">${data.date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Total de Sequências:</span>
            <span class="info-value">${data.totalSequences}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Total de Imagens Usadas:</span>
            <span class="info-value">${data.totalImages}</span>
          </div>
        </div>
        
        ${data.mostUsedWords.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Palavras Mais Usadas</h2>
            <div class="words-grid">
              ${data.mostUsedWords.map(word => `<div class="word-item">${word}</div>`).join('')}
            </div>
          </div>
        ` : ''}
        
        ${data.sequences && data.sequences.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Histórico de Comunicação</h2>
            ${data.sequences.map(seq => `
              <div class="sequence-item">
                <div class="sequence-time">${seq.timestamp}</div>
                <div class="sequence-images">
                  ${seq.images.map(img => `<span class="image-tag">${img}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Gerado em ${new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>© ${new Date().getFullYear()} DICERE - Comunicação para Crianças Autistas</p>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate a simple text-based PDF-ready content
 * This can be enhanced with actual PDF libraries
 */
export function generatePDFContent(data: ReportData): string {
  const lines = [
    '='.repeat(60),
    'DICERE - Relatório de Comunicação AAC',
    '='.repeat(60),
    '',
    `Nome da Criança: ${data.childName}`,
    `Data: ${data.date}`,
    `Total de Sequências: ${data.totalSequences}`,
    `Total de Imagens Usadas: ${data.totalImages}`,
    '',
    '-'.repeat(60),
    'PALAVRAS MAIS USADAS',
    '-'.repeat(60),
    ...data.mostUsedWords.map((word, idx) => `${idx + 1}. ${word}`),
    '',
  ]

  if (data.sequences && data.sequences.length > 0) {
    lines.push(
      '-'.repeat(60),
      'HISTÓRICO DE COMUNICAÇÃO',
      '-'.repeat(60),
      ''
    )
    
    data.sequences.forEach((seq, idx) => {
      lines.push(`${idx + 1}. ${seq.timestamp}`)
      lines.push(`   Imagens: ${seq.images.join(', ')}`)
      lines.push('')
    })
  }

  lines.push(
    '='.repeat(60),
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    '© DICERE - Comunicação para Crianças Autistas',
    '='.repeat(60)
  )

  return lines.join('\n')
}

/**
 * Convert report data to downloadable PDF blob URL
 * Note: This is a simplified version. For production, use proper PDF libraries.
 */
export function createPDFBlobUrl(data: ReportData): string {
  const html = generatePDFReportHTML(data)
  const blob = new Blob([html], { type: 'text/html' })
  return URL.createObjectURL(blob)
}

/**
 * Trigger PDF download in browser
 */
export function downloadPDFReport(data: ReportData, filename?: string): void {
  const html = generatePDFReportHTML(data)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `relatorio-dicere-${data.childName}-${data.date}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
