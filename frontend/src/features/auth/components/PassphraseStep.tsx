/**
 * Passphrase input step component
 */
interface PassphraseStepProps {
  passphrase: string;
  onPassphraseChange: (passphrase: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PassphraseStep({ passphrase, onPassphraseChange, onSubmit }: PassphraseStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          placeholder="Enter your passphrase"
          value={passphrase}
          onChange={(e) => onPassphraseChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          autoComplete="new-password"
          required
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-2">
          This passphrase decrypts your keys. It's never sent to the server.
        </p>
      </div>
      <button
        type="submit"
        className="w-full bg-[#1e293b] text-white py-3 rounded-lg font-medium hover:bg-[#334155] transition-colors"
      >
        Continue
      </button>
    </form>
  );
}
