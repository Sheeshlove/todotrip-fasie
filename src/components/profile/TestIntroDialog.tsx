
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TestIntroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: () => void;
}

export const TestIntroDialog: React.FC<TestIntroDialogProps> = ({
  open,
  onOpenChange,
  onStart
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-todoDarkGray border-todoBlack text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-todoYellow">
            Тест личности для путешественников
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white">
            <p>Этот тест займет около 15 минут вашего времени.</p>
            <p className="mt-2">Вам предстоит ответить на 120 вопросов, чтобы определить ваш психологический профиль путешественника.</p>
            <p className="mt-2">Оцените каждое утверждение по шкале от 1 до 5:</p>
            <ul className="mt-2 ml-4 list-disc">
              <li>1 — Совсем не согласен</li>
              <li>2 — Скорее не согласен</li>
              <li>3 — Нейтрален</li>
              <li>4 — Скорее согласен</li>
              <li>5 — Полностью согласен</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-todoMediumGray text-todoMediumGray hover:bg-todoMediumGray hover:text-todoDarkGray">
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onStart}
            className="bg-todoYellow text-black hover:bg-yellow-400"
          >
            Начать тест
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
