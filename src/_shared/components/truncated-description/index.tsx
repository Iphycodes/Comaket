import { truncateText } from '@grc/_shared/helpers';
import { useState } from 'react';

interface TruncatedDescriptionProps {
  description: string;
  max: number;
}

const TruncatedDescription = ({ description, max }: TruncatedDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayText = isExpanded ? description : truncateText(description, max);

  return (
    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
      {displayText}
      {description.length > 100 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1 text-blue-500 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default TruncatedDescription;
