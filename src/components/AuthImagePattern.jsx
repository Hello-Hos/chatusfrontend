const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        {/* 3x3 Grid with Logo in Center Box */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 flex items-center justify-center ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              {/* Add Logo to the Center Box (5th Box) */}
              {i === 4 && (
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
            </div>
          ))}
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;