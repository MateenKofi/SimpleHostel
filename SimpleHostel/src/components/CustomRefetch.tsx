import { useState, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/framer-animation';

type CustomRefetchProps = {
  // Existing (backward compatible)
  refetch?: () => void;
  message?: string;

  // New - Customization
  title?: string;
  description?: string;
  icon?: ReactNode;
  variant?: 'destructive' | 'warning' | 'info';

  // New - Error details
  error?: Error | { message?: string } | string | null;
  showErrorDetails?: boolean;

  // New - Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  // New - Layout
  size?: 'compact' | 'medium' | 'full';
  showCard?: boolean;
  className?: string;
};

const variantStyles = {
  destructive: {
    bg: 'bg-destructive/10',
    icon: 'text-destructive',
  },
  warning: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-600 dark:text-amber-500',
  },
  info: {
    bg: 'bg-muted',
    icon: 'text-muted-foreground',
  },
} as const;

const sizeStyles = {
  compact: {
    container: 'py-8',
    icon: 'h-8 w-8',
    iconPadding: 'p-3',
    title: 'text-lg',
  },
  medium: {
    container: 'py-12',
    icon: 'h-10 w-10',
    iconPadding: 'p-4',
    title: 'text-xl',
  },
  full: {
    container: 'h-[50vh]',
    icon: 'h-12 w-12',
    iconPadding: 'p-4',
    title: 'text-xl',
  },
} as const;

const CustomRefetch = ({
  refetch,
  message,
  title,
  description,
  icon: customIcon,
  variant = 'destructive',
  error,
  showErrorDetails = false,
  primaryAction,
  secondaryAction,
  size = 'medium',
  showCard = false,
  className,
}: CustomRefetchProps) => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleRefetch = useCallback(async () => {
    if (isRefetching) return;
    setIsRefetching(true);
    try {
      await refetch?.();
    } finally {
      setIsRefetching(false);
    }
  }, [refetch, isRefetching]);

  const styles = variantStyles[variant];
  const sizeConfig = sizeStyles[size];

  const displayTitle = title || message || 'Error loading data';
  const displayDescription = description || 'Something went wrong while fetching the data';

  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message
    : null;

  const content = (
    <motion.div
      variants={fadeIn('up', 0)}
      initial="hidden"
      animate="show"
      className={cn(
        'w-full flex flex-col items-center text-center max-w-md mx-auto',
        size === 'full' && 'grid place-items-center',
        sizeConfig.container,
        className
      )}
    >
      <div className={cn('rounded-full', styles.bg, sizeConfig.iconPadding, 'mb-4')}>
        {customIcon ? (
          customIcon
        ) : variant === 'warning' ? (
          <AlertTriangle className={cn(sizeConfig.icon, styles.icon)} />
        ) : variant === 'info' ? (
          <Info className={cn(sizeConfig.icon, styles.icon)} />
        ) : (
          <AlertCircle className={cn(sizeConfig.icon, styles.icon)} />
        )}
      </div>

      <h2 className={cn('font-semibold text-foreground mb-1', sizeConfig.title)}>
        {displayTitle}
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        {displayDescription}
      </p>

      {errorMessage && showErrorDetails && (
        <div className="w-full mb-4">
          <button
            onClick={() => setShowError(!showError)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto transition-colors"
          >
            {showError ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Hide error details
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Show error details
              </>
            )}
          </button>
          {showError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-muted rounded-md text-xs text-muted-foreground text-left overflow-x-auto"
            >
              <pre className="whitespace-pre-wrap break-words font-mono">{errorMessage}</pre>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            disabled={isRefetching}
          >
            {secondaryAction.label}
          </Button>
        )}
        <Button
          variant={primaryAction?.variant || 'outline'}
          onClick={primaryAction?.onClick || handleRefetch}
          disabled={isRefetching || !refetch}
          className="gap-2"
        >
          {isRefetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          {primaryAction?.label || 'Try Again'}
        </Button>
      </div>
    </motion.div>
  );

  if (showCard) {
    return (
      <div className={cn('w-full', size === 'full' && 'h-[50vh] grid place-items-center')}>
        <Card className="p-6">
          {content}
        </Card>
      </div>
    );
  }

  return content;
};

// Also export as CustomeRefetch for backward compatibility
export { CustomRefetch, CustomRefetch as CustomeRefetch };
export default CustomRefetch;
