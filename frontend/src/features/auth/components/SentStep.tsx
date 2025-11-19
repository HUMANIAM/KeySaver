/**
 * Email sent confirmation step component
 */
interface SentStepProps {
  onTryDifferentEmail: () => void;
}

export function SentStep({ onTryDifferentEmail }: SentStepProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-gray-700">✉️ Check your email for the verification link!</p>
      <p className="text-sm text-gray-500">Click the link in the email to continue.</p>
      <button
        onClick={onTryDifferentEmail}
        className="text-blue-600 hover:text-blue-700 text-sm"
      >
        Try different email
      </button>
    </div>
  );
}
