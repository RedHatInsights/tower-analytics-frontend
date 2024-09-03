import { Button, Split, SplitItem } from "@patternfly/react-core";
import moment from "moment";
import React, { useEffect, useState } from "react";

export function DateCell(props: { value: number | string }) {
  const date = new Date(props.value);
  return (
    <Split hasGutter>
      <SplitItem>{date.toLocaleDateString()}</SplitItem>
      <SplitItem>{date.toLocaleTimeString()}</SplitItem>
    </Split>
  );
}

export function SinceCell(props: {
  value: string | number | undefined | null;
  author?: string;
  onClick?: () => void;
  t?: (t: string) => string;
}) {
  let { t } = props;
  t = t ? t : (t: string) => t;
  const { author, onClick } = props;
  const [dateTime, setDateTime] = useState<string | null>(null);
  useEffect(() => {
    setDateTime(moment(props.value).fromNow());
    const timeout = setInterval(() => {
      setDateTime(moment(props.value).fromNow());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [props.value]);
  if (props.value === undefined) return <></>;
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      {dateTime}
      {author && <span>&nbsp;{t("by")}&nbsp;</span>}
      {onClick ? (
        <Button variant="link" isInline onClick={onClick}>
          {author}
        </Button>
      ) : (
        <span>{author}</span>
      )}
    </span>
  );
}
