import { throttle } from "lodash";
import React from "react";
import { useInView } from "react-intersection-observer";

export interface IVirtualizerProps {
  count: number;
  overscan?: number;
  elementHeightPx: number;
  element: (props: {
    index: number;
    topPx: number;
    heightPx: number;
  }) => React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  disableOutro?: boolean;
  outroElement?: (props: {
    isLoading: boolean;
    isError: boolean;
  }) => React.ReactNode;
}

export const Virtualizer: React.FC<IVirtualizerProps> = (props) => {
  const {
    count,
    overscan,
    elementHeightPx,
    element,
    isLoading,
    isError,
    hasMore,
    onLoadMore,
    containerProps,
    disableOutro,
    outroElement,
  } = props;

  const Overscan = overscan ?? 10;
  const ContainerRef = React.useRef<HTMLDivElement>(null);
  const [Scroll, setScroll] = React.useState({
    yPx: 0,
    index: 0,
  });
  const { ref: OutroElementRef, inView } = useInView({
    initialInView: false,
    threshold: 0.5,
  });

  const AllChildren = React.useMemo(() => new Array(count).fill(0), [count]);

  const ContainerHeight = ContainerRef.current?.offsetHeight ?? 0;

  const StartIndex = Math.max(
    Math.floor(Scroll.yPx / elementHeightPx) - Overscan,
    0
  );

  const EndIndex = Math.min(
    Math.ceil((Scroll.yPx + ContainerHeight) / elementHeightPx - 1) + Overscan,
    count - 1
  );

  React.useEffect(() => {
    if (inView && hasMore && !isLoading && !isError) onLoadMore?.();
  }, [inView]);

  const WeightContainerHeightPx = count * elementHeightPx;

  return (
    <div
      {...containerProps}
      style={{
        display: "block",
        ...containerProps?.style,
        position: "relative",
        overflow: "auto",
      }}
      ref={ContainerRef}
      onScroll={throttle(
        (e) => {
          const ScrollYPx = e.target.scrollTop;
          const Index = Math.trunc(ScrollYPx / (elementHeightPx * Overscan));

          if (Scroll.index !== Index)
            setScroll({
              yPx: ScrollYPx,
              index: Index,
            });
        },
        100,
        { leading: false }
      )}
    >
      <div style={{ display: "block", height: `${WeightContainerHeightPx}px` }}>
        {AllChildren.slice(StartIndex, EndIndex + 1).map((_, index) =>
          element({
            index: StartIndex + index,
            topPx: (StartIndex + index) * elementHeightPx,
            heightPx: elementHeightPx,
          })
        )}
      </div>
      {!!count && !disableOutro && (
        <div ref={OutroElementRef}>
          {outroElement?.({
            isLoading: !!isLoading,
            isError: !!isError,
          })}
        </div>
      )}
    </div>
  );
};
