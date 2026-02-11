export interface PasswordStrength {
  score: number; // 0-4
  label: 'weak' | 'fair' | 'good' | 'strong';
  color: string;
  percentage: number;
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  
  if (!password) {
    return { score: 0, label: 'weak', color: 'hsl(var(--destructive))', percentage: 0 };
  }
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Complexity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  // Determine strength
  if (score <= 1) {
    return { score, label: 'weak', color: 'hsl(var(--destructive))', percentage: 25 };
  } else if (score === 2) {
    return { score, label: 'fair', color: 'hsl(39 100% 57%)', percentage: 50 };
  } else if (score === 3) {
    return { score, label: 'good', color: 'hsl(45 93% 47%)', percentage: 75 };
  } else {
    return { score, label: 'strong', color: 'hsl(142 71% 45%)', percentage: 100 };
  }
};
