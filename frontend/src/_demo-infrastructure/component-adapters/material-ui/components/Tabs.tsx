import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import type { TabsProps } from "@gusto/embedded-react-sdk";

export function MuiTabs({
  tabs,
  selectedId,
  onSelectionChange,
  "aria-label": ariaLabel,
  className,
}: TabsProps) {
  const [internalId, setInternalId] = useState(selectedId ?? tabs[0]?.id ?? "");
  const currentId = selectedId ?? internalId;
  const content = tabs.find((tab) => tab.id === currentId)?.content;

  const handleChange = (id: string) => {
    const tab = tabs.find((t) => t.id === id);
    if (tab?.isDisabled) return;
    if (!selectedId) setInternalId(id);
    onSelectionChange(id);
  };

  return (
    <Box className={className} sx={{ width: "100%" }}>
      <Tabs
        value={currentId}
        onChange={(_, value) => handleChange(value)}
        aria-label={ariaLabel}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            disabled={tab.isDisabled}
          />
        ))}
      </Tabs>
      <Box role="tabpanel" sx={{ pt: 2, width: "100%" }}>
        {content}
      </Box>
    </Box>
  );
}
