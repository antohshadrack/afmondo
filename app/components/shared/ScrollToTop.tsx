"use client";

import { Affix, Transition, ActionIcon, rem } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

export default function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <Transition transition="slide-up" mounted={scroll.y > 300}>
        {(transitionStyles) => (
          <ActionIcon
            style={transitionStyles}
            color="orange"
            variant="filled"
            size="lg"
            radius="xl"
            onClick={() => scrollTo({ y: 0 })}
            aria-label="Scroll to top"
          >
            <IconArrowUp size={18} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}
