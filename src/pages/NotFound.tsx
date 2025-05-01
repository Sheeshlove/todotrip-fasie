
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout 
      title="ТуДуТрип - Страница не найдена" 
      description="Страница не найдена"
    >
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-todoYellow">404</h1>
          <p className="text-xl text-todoLightGray mb-4">Страница не найдена</p>
          <a href="/" className="text-todoYellow hover:text-yellow-400 underline">
            Вернуться на главную
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
