import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

export function SinceCell(props: {
  value: string | number | undefined | null;
  author?: string;
  onClick?: () => void;
}) {
  const { author, onClick } = props;
  const [dateTime, setDateTime] = useState<string | null>(null);

  useEffect(() => {
    setDateTime(moment(props.value).fromNow());
    const timeout = setInterval(() => {
      setDateTime(moment(props.value).fromNow());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [props.value]);

  if (props.value === undefined) {
    return <></>;
  }

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {dateTime}
      {author && <span>&nbsp;by&nbsp;</span>}
      {onClick ? (
        <Button variant='link' isInline onClick={onClick}>
          {author}
        </Button>
      ) : (
        <span>{author}</span>
      )}
    </span>
  );
}
