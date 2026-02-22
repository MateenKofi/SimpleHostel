/**
 * Password Strength Indicator Component
 * Visual feedback for password strength requirements
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

// Calculate password strength
function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "", color: "bg-gray-200" };
  }

  let score = 0;

  // Length score
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Character variety score
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (varietyCount >= 2) score++;
  if (varietyCount >= 3) score++;
  if (varietyCount === 4) score++;

  // Deductions
  if (/(.)\1{2,}/.test(password)) score -= 1;
  if (/^[0-9]+$/.test(password)) score -= 1;
  if (/^[a-zA-Z]+$/.test(password)) score -= 1;

  score = Math.max(0, Math.min(5, score));

  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = [
    "bg-gray-200",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-600",
  ];

  return {
    score,
    label: labels[score],
    color: colors[score],
  };
}

// Check if password meets all requirements
function getPasswordRequirements(password: string): {
  valid: boolean;
  requirements: { label: string; met: boolean }[];
} {
  const requirements = [
    { label: "At least 12 characters", met: password.length >= 12 },
    { label: "Uppercase & lowercase letters", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "At least one number", met: /\d/.test(password) },
    { label: "At least one special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const valid = requirements.every((req) => req.met);

  return { valid, requirements };
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
}) => {
  const strength = getPasswordStrength(password);
  const { valid, requirements } = getPasswordRequirements(password);

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span
            className={cn(
              "font-medium",
              strength.score >= 4 ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {strength.label || "Enter password"}
          </span>
        </div>
        <div className="flex gap-1 h-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full transition-all duration-300",
                i <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Password must contain:
          </p>
          <ul className="space-y-1.5">
            {requirements.map((req, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                )}
              >
                {req.met ? (
                  <Check size={14} className="shrink-0" />
                ) : (
                  <X size={14} className="shrink-0" />
                )}
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Compact version for smaller spaces
 */
export const PasswordStrengthCompact: React.FC<{ password: string }> = ({ password }) => {
  const strength = getPasswordStrength(password);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 h-1.5 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-200",
              i <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground w-20 text-right">
        {strength.label}
      </span>
    </div>
  );
};

export default PasswordStrengthIndicator;
