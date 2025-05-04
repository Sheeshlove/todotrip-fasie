
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface TestPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTakeFullTest: () => void;
  onTakeQuickTest: () => void;
  onSkipTest: () => void;
}

export const TestPromptDialog: React.FC<TestPromptDialogProps> = ({
  open,
  onOpenChange,
  onTakeFullTest,
  onTakeQuickTest,
  onSkipTest
}) => {
  const navigate = useNavigate();
  const [showSecondDialog, setShowSecondDialog] = React.useState(false);

  const handleSkip = () => {
    // Show second dialog asking about quick test
    onOpenChange(false);
    setShowSecondDialog(true);
  };

  const handleCloseSecondDialog = () => {
    setShowSecondDialog(false);
    onSkipTest();
  };

  const handleGoToProfile = () => {
    navigate('/profile');
    onTakeFullTest();
    toast.info("Перейти на вкладку 'Личность', чтобы пройти тест");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Узнайте свою личность</DialogTitle>
            <DialogDescription>
              Пройдите тест OCEAN, чтобы лучше узнать себя и находить наиболее совместимых попутчиков.
              Результаты теста помогут нам предложить вам людей со схожими интересами и ценностями.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 py-4">
            <p className="text-sm text-muted-foreground">
              Тест занимает около 10-15 минут и содержит вопросы о ваших предпочтениях, 
              привычках и отношении к различным ситуациям в путешествиях.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="sm:w-auto w-full"
            >
              Не сейчас
            </Button>
            <Button 
              onClick={handleGoToProfile}
              className="sm:w-auto w-full bg-todoYellow text-black hover:bg-yellow-400"
            >
              Пройти тест
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSecondDialog} onOpenChange={setShowSecondDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Короткая версия теста</AlertDialogTitle>
            <AlertDialogDescription>
              Хотите пройти короткую версию теста? Это займет всего 2-3 минуты и поможет 
              нам найти для вас подходящих попутчиков.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseSecondDialog}>
              Пропустить
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onTakeQuickTest}
              className="bg-todoYellow text-black hover:bg-yellow-400"
            >
              Пройти короткий тест
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
