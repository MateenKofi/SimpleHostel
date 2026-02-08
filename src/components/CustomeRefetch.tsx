import { RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

type CustomeRefetchProps = {
  refetch?: () => void;
  message?: string;
};

const CustomeRefetch = ({ refetch, message }: CustomeRefetchProps) => {
  return (
    <div className="w-full h-[50vh] grid place-items-center">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          {message || 'Error loading data'}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Something went wrong while fetching the data
        </p>
        <Button
          variant="outline"
          onClick={refetch}
          disabled={!refetch}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default CustomeRefetch;
