import * as Tooltip from "@radix-ui/react-tooltip";

type TooltipSide = "top" | "right" | "bottom" | "left";

interface TooltipComponentProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: TooltipSide;
}

export default function TooltipComponent({ children, content, side = "top" }: TooltipComponentProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-black text-white text-sm rounded-md px-2 py-1 z-[1000] shadow-lg"
            side={side}
          >
            {content}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
