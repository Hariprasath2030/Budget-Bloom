// Smart categorization engine for auto-detected transactions

export interface DetectedTransaction {
  amount: number;
  merchantName: string;
  paymentMethod?: string;
  sourceApp?: string;
  rawNotification?: string;
  transactionDate?: string;
}

export interface CategorizedTransaction extends DetectedTransaction {
  category: string;
  icon: string;
  confidence: number; // 0-1
}

// In-memory fallback when DB categories aren't loaded yet
const FALLBACK_CATEGORIES: Record<string, { category: string; icon: string }> = {
  swiggy: { category: 'Food & Dining', icon: '🍕' },
  zomato: { category: 'Food & Dining', icon: '🍕' },
  amazon: { category: 'Shopping', icon: '🛒' },
  flipkart: { category: 'Shopping', icon: '🛒' },
  uber: { category: 'Transport', icon: '🚗' },
  ola: { category: 'Transport', icon: '🚗' },
  rapido: { category: 'Transport', icon: '🚗' },
  netflix: { category: 'Entertainment', icon: '🎬' },
  hotstar: { category: 'Entertainment', icon: '🎬' },
  spotify: { category: 'Entertainment', icon: '🎵' },
  electricity: { category: 'Utilities', icon: '💡' },
  bigbasket: { category: 'Groceries', icon: '🛒' },
  dunzo: { category: 'Groceries', icon: '🛒' },
  blinkit: { category: 'Groceries', icon: '🛒' },
  zepto: { category: 'Groceries', icon: '🛒' },
  bookmyshow: { category: 'Entertainment', icon: '🎟️' },
  makemytrip: { category: 'Travel', icon: '✈️' },
  cred: { category: 'Credit Card', icon: '💳' },
};

const CATEGORY_ICONS: Record<string, string> = {
  'Food & Dining': '🍕',
  'Shopping': '🛒',
  'Transport': '🚗',
  'Entertainment': '🎬',
  'Utilities': '💡',
  'Groceries': '🛒',
  'Travel': '✈️',
  'Health': '💊',
  'Education': '📚',
  'UPI Payment': '📱',
  'Credit Card': '💳',
  'Other': '💰',
};

// Parse amount from notification text
export function parseAmount(text: string): number | null {
  // Match patterns like ₹1,234.56, Rs. 500, INR 2000, $100
  const patterns = [
    /[₹]\s?([\d,]+\.?\d*)/,
    /Rs\.?\s?([\d,]+\.?\d*)/,
    /INR\s?([\d,]+\.?\d*)/,
    /\$\s?([\d,]+\.?\d*)/,
    /amount[:\s]+([\d,]+\.?\d*)/i,
    /paid[:\s]+([\d,]+\.?\d*)/i,
    /([\d,]+\.?\d*)\s?(?:has been|was|is)\s+(?:debited|sent|paid|transferred)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }
  return null;
}

// Parse merchant name from notification text
export function parseMerchantName(text: string): string {
  // Common patterns for UPI/banking notifications
  const patterns = [
    /paid\s+(?:to|@)\s+([^\s,]+)/i,
    /sent\s+(?:to|@)\s+([^\s,]+)/i,
    /(?:paid|sent)\s+(?:₹[\d,.]+)\s+to\s+([^\s,]+)/i,
    /(?:to|@)\s+([A-Za-z][A-Za-z0-9\s&'-]{1,30})/i,
    /([A-Za-z][A-Za-z0-9\s&'-]{2,30})\s+(?:transaction|payment)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1].trim();
      // Clean up common suffixes
      return name.replace(/\s*(via|through|using|on).*$/i, '').trim();
    }
  }

  return 'Unknown Merchant';
}

// Parse payment method
export function parsePaymentMethod(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('upi') || lower.includes('google pay') || lower.includes('gpay') || lower.includes('phonepe') || lower.includes('paytm') || lower.includes('bharatpe')) return 'UPI';
  if (lower.includes('credit card') || lower.includes('debit card') || lower.includes('card ending')) return 'Card';
  if (lower.includes('net banking') || lower.includes('netbanking')) return 'Net Banking';
  if (lower.includes('wallet') || lower.includes('paytm wallet')) return 'Wallet';
  if (lower.includes('imps') || lower.includes('neft') || lower.includes('rtgs')) return 'Bank Transfer';
  return 'UPI';
}

// Parse source app
export function parseSourceApp(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('google pay') || lower.includes('gpay')) return 'Google Pay';
  if (lower.includes('phonepe')) return 'PhonePe';
  if (lower.includes('paytm')) return 'Paytm';
  if (lower.includes('cred')) return 'CRED';
  if (lower.includes('bharatpe')) return 'BharatPe';
  if (lower.includes('amazon pay')) return 'Amazon Pay';
  if (lower.includes('mobikwik')) return 'Mobikwik';
  if (lower.includes('freecharge')) return 'Freecharge';
  return 'Unknown';
}

// Categorize using merchant database
export function categorize(
  transaction: DetectedTransaction,
  dbCategories: Array<{ merchant_pattern: string; category: string; icon: string; user_id?: string | null }> = []
): CategorizedTransaction {
  const merchantLower = (transaction.merchantName || '').toLowerCase();
  let matchedCategory: string | null = null;
  let matchedIcon: string = '💰';
  let confidence = 0;

  // 1. Try DB categories first (user-specific take priority)
  const userCats = dbCategories.filter((c: any) => c.user_id);
  const globalCats = dbCategories.filter((c: any) => !c.user_id);

  for (const db of [...userCats, ...globalCats]) {
    if (merchantLower.includes(db.merchant_pattern) || db.merchant_pattern.includes(merchantLower)) {
      matchedCategory = db.category;
      matchedIcon = db.icon;
      confidence = db.user_id ? 0.95 : 0.85;
      break;
    }
  }

  // 2. Fallback to in-memory lookup
  if (!matchedCategory) {
    for (const [pattern, cat] of Object.entries(FALLBACK_CATEGORIES)) {
      if (merchantLower.includes(pattern) || pattern.includes(merchantLower)) {
        matchedCategory = cat.category;
        matchedIcon = cat.icon;
        confidence = 0.75;
        break;
      }
    }
  }

  // 3. Keyword hefistics
  if (!matchedCategory) {
    const lower = merchantLower;
    if (/food|restaur|cafe|coffee|pizza|burger|biryani|mess|tiffin|dhaba/.test(lower)) {
      matchedCategory = 'Food & Dining'; matchedIcon = '🍕'; confidence = 0.6;
    } else if (/shop|mart|store|market|bazaar/.test(lower)) {
      matchedCategory = 'Shopping'; matchedIcon = '🛒'; confidence = 0.6;
    } else if (/cab|taxi|auto|bus|metro|rail|irctc|flight|air/.test(lower)) {
      matchedCategory = 'Transport'; matchedIcon = '🚗'; confidence = 0.6;
    } else if (/movie|film|game|play|concert|show/.test(lower)) {
      matchedCategory = 'Entertainment'; matchedIcon = '🎬'; confidence = 0.6;
    } else if (/hospital|clinic|doctor|pharma|medic|diagnostic/.test(lower)) {
      matchedCategory = 'Health'; matchedIcon = '💊'; confidence = 0.6;
    } else if (/school|college|tuition|coach|academy|learn/.test(lower)) {
      matchedCategory = 'Education'; matchedIcon = '📚'; confidence = 0.6;
    } else if (/electric|water|gas|internet|broadband|recharge/.test(lower)) {
      matchedCategory = 'Utilities'; matchedIcon = '💡'; confidence = 0.6;
    }
  }

  // 4. Default
  if (!matchedCategory) {
    matchedCategory = 'Other';
    matchedIcon = CATEGORY_ICONS['Other'];
    confidence = 0.3;
  }

  return {
    ...transaction,
    category: matchedCategory,
    icon: matchedIcon,
    confidence,
  };
}

// Full pipeline: parse raw notification -> categorized transaction
export function parseNotification(rawText: string): Omit<CategorizedTransaction, 'confidence'> & { confidence: number } {
  const amount = parseAmount(rawText);
  const merchantName = parseMerchantName(rawText);
  const paymentMethod = parsePaymentMethod(rawText);
  const sourceApp = parseSourceApp(rawText);

  const detected: DetectedTransaction = {
    amount: amount || 0,
    merchantName,
    paymentMethod,
    sourceApp,
    rawNotification: rawText,
  };

  return categorize(detected);
}

// Available categories for user selection
export const AVAILABLE_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍕' },
  { name: 'Shopping', icon: '🛒' },
  { name: 'Groceries', icon: '🛒' },
  { name: 'Transport', icon: '🚗' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Utilities', icon: '💡' },
  { name: 'Health', icon: '💊' },
  { name: 'Education', icon: '📚' },
  { name: 'Travel', icon: '✈️' },
  { name: 'UPI Payment', icon: '📱' },
  { name: 'Credit Card', icon: '💳' },
  { name: 'Other', icon: '💰' },
];

// Sample notifications for simulation/demo
export const SIMULATED_NOTIFICATIONS = [
  "You paid ₹450.00 to Swiggy via Google Pay",
  "₹1,299.00 debited from your account for Amazon India transaction",
  "You sent ₹180.00 to @chaitanyacab via PhonePe UPI",
  "Payment of ₹599.00 received by Netflix through CRED",
  "₹2,500.00 paid to Bigbasket on PhonePe",
  "You paid ₹35.00 to Rapido via Google Pay",
  "₹499.00 sent to Spotify India via Paytm",
  "Electricity bill of ₹1,850.00 paid successfully via PhonePe",
  "₹3,200.00 paid to MakeMyTrip via Amazon Pay",
  "₹75.00 paid to Chai Point via Google Pay",
];
