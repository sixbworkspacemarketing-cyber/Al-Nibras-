// Receipt generator utilities for Al Nibras Finance
import { Language, translations } from './translations';

export interface Transaction {
  id: string;
  amount: number;
  sender: string;
  recipient: string;
  date: string;
  time: string;
  purpose: string;
  status: 'completed' | 'pending';
}

// Sample transaction data
export const sampleTransactions: Transaction[] = [
  {
    id: 'TXN-2024-001',
    amount: 5000,
    sender: 'Ahmed (Parent)',
    recipient: 'Ali',
    date: '2024-03-15',
    time: '10:30 AM',
    purpose: 'Pocket Money',
    status: 'completed',
  },
  {
    id: 'TXN-2024-002',
    amount: 2500,
    sender: 'Ahmed (Parent)',
    recipient: 'Sara',
    date: '2024-03-14',
    time: '02:15 PM',
    purpose: 'Allowance',
    status: 'completed',
  },
  {
    id: 'TXN-2024-003',
    amount: 1000,
    sender: 'Ahmed (Parent)',
    recipient: 'Ali',
    date: '2024-03-13',
    time: '09:00 AM',
    purpose: 'Reward',
    status: 'pending',
  },
  {
    id: 'TXN-2024-004',
    amount: 3000,
    sender: 'Ahmed (Parent)',
    recipient: 'Sara',
    date: '2024-03-12',
    time: '11:45 AM',
    purpose: 'Gift',
    status: 'completed',
  },
  {
    id: 'TXN-2024-005',
    amount: 7500,
    sender: 'Ahmed (Parent)',
    recipient: 'Ali',
    date: '2024-03-10',
    time: '04:30 PM',
    purpose: 'Pocket Money',
    status: 'completed',
  },
];

export function generateReceiptHTML(tx: Transaction, lang: Language = 'en'): string {
  const t = (key: keyof typeof translations) => translations[key]?.[lang] || translations[key]?.['en'] || key;
  const dir = lang === 'ur' ? 'rtl' : 'ltr';
  const fontFamily = lang === 'ur' ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" : "'Inter', sans-serif";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Al Nibras Finance - ${t('transactionReceipt')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      background: #1a1a1a;
      color: #ffffff;
      padding: 40px 20px;
      direction: ${dir};
    }
    .receipt {
      max-width: 500px;
      margin: 0 auto;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      border: 1px solid rgba(255, 215, 0, 0.3);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo h1 {
      font-size: 20px;
      font-weight: 900;
      background: linear-gradient(180deg, #FFD700, #AA841E);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.2em;
    }
    .logo p { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.3em; }
    .divider { height: 1px; background: rgba(255,255,255,0.1); margin: 20px 0; }
    .amount {
      text-align: center;
      padding: 24px 0;
    }
    .amount .value {
      font-size: 36px;
      font-weight: 900;
      color: #DC2626;
    }
    .amount .label {
      font-size: 10px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      margin-top: 4px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .detail-row .label { color: #999; font-size: 13px; }
    .detail-row .value { font-weight: 700; font-size: 13px; }
    .sharia-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 20px 0;
      padding: 12px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      color: #10B981;
      font-weight: 700;
      font-size: 12px;
    }
    .status {
      text-align: center;
      margin-top: 20px;
    }
    .status span {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .status-completed { background: rgba(16,185,129,0.15); color: #10B981; }
    .status-pending { background: rgba(245,158,11,0.15); color: #F59E0B; }
    .footer {
      text-align: center;
      margin-top: 24px;
      font-size: 10px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="logo">
      <h1>AL NIBRAS FINANCE</h1>
      <p>${t('transactionReceipt')}</p>
    </div>
    <div class="divider"></div>
    <div class="amount">
      <div class="value">PKR ${tx.amount.toLocaleString('en-PK')}</div>
      <div class="label">${t('amount')}</div>
    </div>
    <div class="divider"></div>
    <div class="detail-row">
      <span class="label">${t('transactionId')}</span>
      <span class="value">${tx.id}</span>
    </div>
    <div class="detail-row">
      <span class="label">${t('sender')}</span>
      <span class="value">${tx.sender}</span>
    </div>
    <div class="detail-row">
      <span class="label">${t('recipient')}</span>
      <span class="value">${tx.recipient}</span>
    </div>
    <div class="detail-row">
      <span class="label">${t('dateTime')}</span>
      <span class="value">${tx.date} ${tx.time}</span>
    </div>
    <div class="detail-row">
      <span class="label">${t('purpose')}</span>
      <span class="value">${tx.purpose}</span>
    </div>
    <div class="sharia-badge">
      ✓ ${t('shariaCompliant')} (${t('zeroInterest')})
    </div>
    <div class="status">
      <span class="status-${tx.status}">${tx.status === 'completed' ? t('completed') : t('pending')}</span>
    </div>
    <div class="footer">
      <p>${t('receiptNote')}</p>
      <p style="margin-top:8px">Al Nibras Finance © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>`;
}

export function generateReceiptText(tx: Transaction, lang: Language = 'en'): string {
  const t = (key: keyof typeof translations) => translations[key]?.[lang] || translations[key]?.['en'] || key;

  return `
═══════════════════════════════════
     AL NIBRAS FINANCE
     ${t('transactionReceipt')}
═══════════════════════════════════

${t('amount')}: PKR ${tx.amount.toLocaleString('en-PK')}

${t('transactionId')}: ${tx.id}
${t('sender')}: ${tx.sender}
${t('recipient')}: ${tx.recipient}
${t('dateTime')}: ${tx.date} ${tx.time}
${t('purpose')}: ${tx.purpose}

✓ ${t('shariaCompliant')} (${t('zeroInterest')})

${t('status')}: ${tx.status === 'completed' ? t('completed') : t('pending')}

───────────────────────────────────
${t('receiptNote')}
Al Nibras Finance © ${new Date().getFullYear()}
═══════════════════════════════════
  `.trim();
}

export function downloadReceipt(tx: Transaction, lang: Language = 'en') {
  const html = generateReceiptHTML(tx, lang);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${tx.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyReceiptToClipboard(tx: Transaction, lang: Language = 'en'): Promise<void> {
  const text = generateReceiptText(tx, lang);
  return navigator.clipboard.writeText(text);
}