import Link from 'next/link';

interface FeatureHighlightProps {
  title: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isLibrarian?: boolean; // For visual differentiation
}

export const FeatureHighlight = ({ 
  title, 
  features, 
  ctaText, 
  ctaLink, 
  isLibrarian = false 
}: FeatureHighlightProps) => {
  const bgColor = isLibrarian ? 'bg-green-50' : 'bg-indigo-50';
  const borderColor = isLibrarian ? 'border-green-500' : 'border-indigo-500';
  const textColor = isLibrarian ? 'text-green-800' : 'text-indigo-800';
  const ctaClasses = isLibrarian 
    ? 'bg-green-600 hover:bg-green-700' 
    : 'bg-indigo-600 hover:bg-indigo-700';

  return (
    <div className={`p-6 md:p-8 rounded-xl shadow-lg border-t-4 ${borderColor} ${bgColor} transition-transform duration-300 hover:scale-[1.01]`}>
      <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>
        {title}
      </h3>
      <ul className="space-y-3 mb-6 list-none">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <span className={`mr-3 ${isLibrarian ? 'text-green-500' : 'text-indigo-500'}`}>
              {isLibrarian ? '✅' : '⭐'}
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link href={ctaLink} passHref>
        <button className={`w-full py-3 text-white font-semibold rounded-lg shadow-md ${ctaClasses} transition duration-150`}>
          {ctaText}
        </button>
      </Link>
    </div>
  );
};