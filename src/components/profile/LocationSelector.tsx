
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';
import { russianCities } from '@/data/cities';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface LocationSelectorProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const LocationSelector = ({ form }: LocationSelectorProps) => {
  const { city: detectedCity, status: geoStatus, error: geoError, detectCity } = useGeolocation();
  
  const handleDetectCity = () => {
    detectCity();
  };

  // Set detected city in form when available
  React.useEffect(() => {
    if (geoStatus === 'success' && detectedCity) {
      form.setValue('city', detectedCity);
      toast.success(`Город успешно определен: ${detectedCity}`);
    } else if (geoStatus === 'error' && geoError) {
      toast.error(geoError);
    }
  }, [geoStatus, detectedCity, geoError, form]);

  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Город</FormLabel>
          <div className="space-y-2">
            <Select 
              onValueChange={field.onChange} 
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger className="w-full flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-todoMediumGray" />
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-80">
                {russianCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2 mt-1"
              onClick={handleDetectCity}
              disabled={geoStatus === 'loading'}
            >
              {geoStatus === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Определение...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4" />
                  Определить автоматически
                </>
              )}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
