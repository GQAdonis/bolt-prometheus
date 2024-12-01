export function StatusMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="absolute -bottom-6 left-0 right-0 text-center text-sm text-bolt-elements-textSecondary animate-fade-in">
      {message}
    </div>
  );
}
