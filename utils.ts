export function cn(...inputs: (string | boolean | undefined | null | { [key: string]: boolean })[]) {
  const classes: string[] = [];
  
  inputs.forEach((input) => {
    if (!input) return;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });
  
  return classes.join(' ');
}

// 1 PKR = 10 Coins
export const COIN_TO_PKR_RATE = 0.1;

export function coinsToPkr(coins: number): number {
  return Number((coins * COIN_TO_PKR_RATE).toFixed(2));
}

export function pkrToCoins(pkr: number): number {
  return Math.round(pkr / COIN_TO_PKR_RATE);
}

export function formatCoins(coins: number): string {
  return new Intl.NumberFormat('en-PK').format(coins);
}

export function formatPKR(pkr: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(pkr);
}

export function generateReferralCode(name: string = ''): string {
  const prefix = name.replace(/\s+/g, '').substring(0, 4).toUpperCase() || 'PAK';
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randNum}`;
}
