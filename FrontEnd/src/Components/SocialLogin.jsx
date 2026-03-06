export default function SocialLogin() {
  const providers = [
    { name: "Google", mark: "G", className: "google" },
    { name: "Apple", mark: "", className: "apple" },
    { name: "Microsoft", mark: "■", className: "microsoft" },
  ];

  return (
    <div className="et-social-login">
      <div className="et-social-login__divider">
        <span>Or login with</span>
      </div>

      <div className="et-social-login__grid">
        {providers.map((provider) => (
          <button
            key={provider.name}
            type="button"
            className={`et-social-login__button ${provider.className}`}
            aria-label={`Login with ${provider.name}`}
          >
            <span>{provider.mark}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
