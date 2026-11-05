/**
 * Nepal Pay demo payloads.
 *
 * These are the simple JSON payloads used by several Nepali QR generators for
 * personal bank and wallet codes: a bank account number plus a bank code, or
 * an eSewa / Khalti mobile number plus the account name. They are not the
 * NRB/Fonepay EMVCo merchant-QR standard, so the Studio labels them as demos
 * and asks people to test with their own app before printing.
 */

export const NEPAL_PAY_TYPES = [
  {
    id: 'bank',
    label: 'Bank',
    blurb: 'Account number, account name, and bank code.',
  },
  {
    id: 'esewa',
    label: 'eSewa',
    blurb: 'Mobile number and the name on the wallet.',
  },
  {
    id: 'khalti',
    label: 'Khalti',
    blurb: 'Mobile number and the name on the wallet.',
  },
];

export const NEPAL_BANKS = [
  { code: 'ADBLNPKA', name: 'Agricultural Development Bank', type: 'commercial' },
  { code: 'CTZNNPKA', name: 'Citizens Bank International', type: 'commercial' },
  { code: 'EVBLNPKA', name: 'Everest Bank', type: 'commercial' },
  { code: 'GLBBNPKA', name: 'Global IME Bank', type: 'commercial' },
  { code: 'HIMANPKA', name: 'Himalayan Bank', type: 'commercial' },
  { code: 'KMBLNPKA', name: 'Kumari Bank', type: 'commercial' },
  { code: 'LXBLNPKA', name: 'Laxmi Sunrise Bank', type: 'commercial' },
  { code: 'MBLNNPKA', name: 'Machhapuchchhre Bank', type: 'commercial' },
  { code: 'NARBNPKA', name: 'Nabil Bank', type: 'commercial' },
  { code: 'NEBLNPKA', name: 'Nepal Bank', type: 'commercial' },
  { code: 'NIBLNPKT', name: 'Nepal Investment Mega Bank', type: 'commercial' },
  { code: 'NSBINPKA', name: 'Nepal SBI Bank', type: 'commercial' },
  { code: 'NICENPKA', name: 'NIC Asia Bank', type: 'commercial' },
  { code: 'NMBBNPKA', name: 'NMB Bank', type: 'commercial' },
  { code: 'PRVUNPKA', name: 'Prabhu Bank', type: 'commercial' },
  { code: 'PCBLNPKA', name: 'Prime Commercial Bank', type: 'commercial' },
  { code: 'RBBANPKA', name: 'Rastriya Banijya Bank', type: 'commercial' },
  { code: 'SNMANPKA', name: 'Sanima Bank', type: 'commercial' },
  { code: 'SIDDNPKA', name: 'Siddhartha Bank', type: 'commercial' },
  { code: 'SCBLNPKA', name: 'Standard Chartered Bank Nepal', type: 'commercial' },
  { code: 'KDBLNPK1', name: 'Kasthamandap Development Bank', type: 'development' },
  { code: 'NINFNPKA', name: 'Nepal Infrastructure Bank', type: 'development' },
];

export const NEPAL_PAY_DEMO = {
  bank: {
    type: 'bank',
    bankCode: 'NMBBNPKA',
    accountNumber: '0000000000000000',
    accountName: 'DEMO USER',
  },
  esewa: {
    type: 'esewa',
    phone: '9800000000',
    accountName: 'DEMO USER',
  },
  khalti: {
    type: 'khalti',
    phone: '9800000000',
    accountName: 'DEMO USER',
  },
};

export function buildNepalPayPayload(input = {}) {
  const type = input.type;
  const accountName = String(input.accountName ?? '').trim().toUpperCase();

  if (type === 'bank') {
    const accountNumber = String(input.accountNumber ?? '').replace(/\D/g, '');
    const bankCode = String(input.bankCode ?? '').trim().toUpperCase();
    if (!bankCode) throw new Error('Choose a bank.');
    if (accountNumber.length !== 16) throw new Error('Account number must be 16 digits.');
    if (!accountName) throw new Error('Account name is required.');
    return JSON.stringify({ accountNumber, accountName, bankCode });
  }

  if (type === 'esewa' || type === 'khalti') {
    const phone = String(input.phone ?? '').replace(/\D/g, '');
    if (phone.length !== 10) throw new Error('Mobile number must be 10 digits.');
    if (!accountName) throw new Error('Account name is required.');
    return type === 'esewa'
      ? JSON.stringify({ eSewa_id: phone, name: accountName })
      : JSON.stringify({ Khalti_ID: phone, name: accountName });
  }

  throw new Error('Choose Bank, eSewa, or Khalti.');
}

export function parseNepalPayPayload(text) {
  try {
    const value = JSON.parse(String(text ?? ''));
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    if (typeof value.eSewa_id === 'string') {
      return {
        type: 'esewa',
        phone: value.eSewa_id,
        accountName: String(value.name ?? ''),
      };
    }
    if (typeof value.Khalti_ID === 'string') {
      return {
        type: 'khalti',
        phone: value.Khalti_ID,
        accountName: String(value.name ?? ''),
      };
    }
    if (typeof value.accountNumber === 'string' && typeof value.bankCode === 'string') {
      return {
        type: 'bank',
        accountNumber: value.accountNumber,
        accountName: String(value.accountName ?? ''),
        bankCode: value.bankCode,
      };
    }
  } catch {
    // Not a payment payload. The Studio treats it as ordinary text.
  }
  return null;
}

export function nepalPayTypeLabel(type) {
  return NEPAL_PAY_TYPES.find((item) => item.id === type)?.label ?? 'Nepal Pay';
}
