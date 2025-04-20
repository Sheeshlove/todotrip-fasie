
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SavedRoutesDialog() {
  const navigate = useNavigate();
  // For demo purposes, we'll assume there are no saved routes
  const savedRoutes: any[] = [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Добавить из сохранённого
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-todoDarkGray">
        <DialogHeader>
          <DialogTitle className="text-white">Сохранённые маршруты</DialogTitle>
        </DialogHeader>
        
        {savedRoutes.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-white text-center">
              ого, да у вас нет ни одного маршрута :(
            </p>
            <Button 
              className="bg-todoYellow text-black hover:bg-yellow-400"
              onClick={() => {
                navigate('/');
              }}
            >
              так давайте насохраняем всякого
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedRoutes.map((route) => (
              // This is a placeholder for when we implement saved routes
              <div key={route.id}>{route.name}</div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
