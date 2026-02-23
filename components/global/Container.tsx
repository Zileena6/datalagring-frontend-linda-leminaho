import { cn } from '@/lib/utils';

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'mx-auto max-w-6xl xl:max-w-dvw px-8 w-full flex-1',
        className,
      )}
    >
      {children}
    </div>
  );
};
export default Container;
