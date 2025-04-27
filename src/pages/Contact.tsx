
import PageLayout from '@/components/PageLayout';

const Contact = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:todotrip.work@gmail.com';
  };

  return (
    <PageLayout title="ТуДуТрип - Связаться с нами" description="Контактная информация">
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="max-w-2xl w-full space-y-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-todoYellow mb-6">Будем рады вашему сообщению!</h1>
          <p className="text-white text-lg mb-4">
            Если у вас есть вопросы, идеи, предложения о сотрудничестве или вы хотите присоединиться к нашей команде, пишите нам на{' '}
            <button
              onClick={handleEmailClick}
              className="text-todoYellow hover:underline cursor-pointer"
            >
              todotrip.work@gmail.com
            </button>
          </p>
          <p className="text-white text-lg">
            Пожалуйста, указывайте тему письма — это поможет нам быстрее разобраться и дать вам ответ.
          </p>
          <p className="text-white text-lg mt-6">
            Мы стараемся отвечать оперативно и с вниманием к каждому обращению. Спасибо, что выбираете нас!
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
