
import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title?: string;
  description?: string;
}

const Meta: React.FC<MetaProps> = ({ 
  title = 'ToDoTrip - AI Travel App',
  description = 'AI-powered travel app for planning trips around Russia'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Meta;
