
import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title?: string;
  description?: string;
  noIndex?: boolean; // Add noIndex property to MetaProps interface
  image?: string; // Add image property to MetaProps interface
  type?: string; // Add type property to MetaProps interface
}

const Meta: React.FC<MetaProps> = ({ 
  title = 'ToDoTrip - AI Travel App',
  description = 'AI-powered travel app for planning trips around Russia',
  noIndex = false, // Default value for noIndex
  image,
  type = 'website' // Default value for type
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex" />}
      {image && <meta property="og:image" content={image} />}
      {type && <meta property="og:type" content={type} />}
    </Helmet>
  );
};

export default Meta;
