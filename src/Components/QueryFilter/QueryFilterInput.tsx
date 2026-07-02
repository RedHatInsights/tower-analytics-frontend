import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Menu } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuContainer } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuItem } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuList } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { SearchInput } from '@patternfly/react-core/dist/dynamic/components/SearchInput';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import CodeIcon from '@patternfly/react-icons/dist/dynamic/icons/code-icon';
import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import React, { useEffect, useRef, useState } from 'react';

type IFilterState = Record<string, string[]>;

export interface FieldDef {
  key: string;
  op: '~' | '=';
  displayLabel: string;
  hint: string;
  filterStateKey: string;
  values: { value: string; label: string }[] | null;
}

const COMPLETE_CLAUSE_RE = /\w+\s*(?:~|=)\s*"[^"]*"/gi;

function getActiveTail(input: string): string {
  return input
    .trimEnd()
    .replace(COMPLETE_CLAUSE_RE, '')
    .replace(/AND\s*/gi, '')
    .trimStart();
}

function autoCloseQuote(input: string): string {
  const quoteCount = (input.match(/"/g) ?? []).length;
  return quoteCount % 2 !== 0 ? input + '"' : input;
}

function parseFilterState(input: string, fieldDefs: FieldDef[]): IFilterState {
  const state: IFilterState = {};
  const re = /(\w+)\s*(?:~|=)\s*"([^"]*)"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    const [, key, value] = m;
    const field = fieldDefs.find((f) => f.key === key.toLowerCase());
    if (field && value.trim()) {
      state[field.filterStateKey] = [
        ...(state[field.filterStateKey] ?? []),
        value,
      ];
    }
  }
  return state;
}

interface Suggestion {
  id: string;
  label: string;
  description: string;
  apply: (currentInput: string) => string;
}

function computeSuggestions(
  input: string,
  fieldDefs: FieldDef[],
): Suggestion[] {
  const trimmed = input.trimEnd();
  const tail = getActiveTail(trimmed);
  const beforeTail = trimmed.slice(0, trimmed.length - tail.length);

  const usedKeys = new Set<string>();
  const usedRe = /(\w+)\s*(?:~|=)\s*"[^"]*"/gi;
  let m: RegExpExecArray | null;
  while ((m = usedRe.exec(trimmed)) !== null) usedKeys.add(m[1].toLowerCase());

  const availableFields = fieldDefs.filter((f) => !usedKeys.has(f.key));

  if (tail === '' && usedKeys.size > 0 && availableFields.length > 0) {
    return availableFields.map((f) => ({
      id: `and-${f.key}`,
      label: `AND  ${f.displayLabel}  "..."`,
      description: f.hint,
      apply: (cur) => cur.trimEnd() + ` AND ${f.key} ${f.op} "`,
    }));
  }

  for (const enumField of fieldDefs.filter((f) => f.values)) {
    const escapedKey = enumField.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escapedKey}\\s*=\\s*"?[^"]*$`).test(tail)) {
      return enumField.values!.map((v) => ({
        id: `val-${v.value}`,
        label: v.label,
        description: v.value,
        apply: () => beforeTail + `${enumField.key} = "${v.value}" `,
      }));
    }
  }

  if (/^[a-z]*$/.test(tail)) {
    return availableFields
      .filter((f) => f.key.startsWith(tail))
      .map((f) => ({
        id: `field-${f.key}`,
        label: `${f.displayLabel}  "..."`,
        description: f.hint,
        apply: () => beforeTail + `${f.key} ${f.op} "`,
      }));
  }

  return [];
}

interface QueryFilterInputProps {
  value: string;
  onChange: (v: string) => void;
  setFilterState: (state: IFilterState) => void;
  fieldDefs: FieldDef[];
  placeholder?: string;
  onClear?: () => void;
}

export function QueryFilterInput({
  value,
  onChange,
  setFilterState,
  fieldDefs,
  placeholder,
  onClear,
}: QueryFilterInputProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [navigated, setNavigated] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilterState(parseFilterState(value, fieldDefs));
  }, [value, fieldDefs]);

  const openWithSuggestions = (input: string) => {
    const s = computeSuggestions(input, fieldDefs);
    setSuggestions(s);
    setActiveIndex(-1);
    setNavigated(false);
    setOpen(s.length > 0);
  };

  const applySuggestion = (s: Suggestion) => {
    const next = s.apply(value);
    onChange(next);
    setFilterState(parseFilterState(next, fieldDefs));
    openWithSuggestions(next);
    setTimeout(
      () =>
        (toggleRef.current?.querySelector('input') as HTMLInputElement)?.focus(),
      0,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        if (!open || !suggestions.length) break;
        e.preventDefault();
        setNavigated(true);
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        if (!open || !suggestions.length) break;
        e.preventDefault();
        setNavigated(true);
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (open && navigated && activeIndex >= 0 && suggestions[activeIndex]) {
          applySuggestion(suggestions[activeIndex]);
        } else {
          const committed = autoCloseQuote(value);
          if (committed !== value) {
            onChange(committed);
            setFilterState(parseFilterState(committed, fieldDefs));
            openWithSuggestions(committed);
          } else {
            openWithSuggestions(value);
          }
          setTimeout(
            () =>
              (
                toggleRef.current?.querySelector('input') as HTMLInputElement
              )?.focus(),
            0,
          );
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  return (
    <MenuContainer
        isOpen={open}
        onOpenChange={setOpen}
        onOpenChangeKeys={['Escape']}
        menu={
          <Menu ref={menuRef} isPlain>
            <MenuList>
              {suggestions.map((s, i) => (
                <MenuItem
                  key={s.id}
                  isFocused={navigated && i === activeIndex}
                  description={s.description}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applySuggestion(s)}
                >
                  <code style={{ fontSize: 13 }}>{s.label}</code>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        }
        menuRef={menuRef}
        toggle={
          <div ref={toggleRef} style={{ width: '100%' }}>
            <SearchInput
              style={{ width: '100%' }}
              placeholder={
                placeholder ??
                'e.g.  name ~ "ansible"  AND  tag = "Operations"'
              }
              value={value}
              onChange={(_e, v) => {
                onChange(v);
                openWithSuggestions(v);
              }}
              onFocus={() => openWithSuggestions(value)}
              onKeyDown={handleKeyDown}
              onClear={() => {
                onChange('');
                setFilterState({});
                setOpen(false);
                onClear?.();
              }}
            />
          </div>
        }
        toggleRef={toggleRef}
        popperProps={{ width: 'trigger', enableFlip: true, preventOverflow: true }}
      />
  );
}

interface FilterVariantToggleProps {
  variant: 'a' | 'b';
  onChange: (v: 'a' | 'b') => void;
}

export function FilterVariantToggle({
  variant,
  onChange,
}: FilterVariantToggleProps) {
  const isAdvanced = variant === 'b';
  return (
    <Tooltip
      content={
        isAdvanced ? 'Switch to basic filters' : 'Switch to advanced query'
      }
    >
      <Button
        variant='control'
        icon={isAdvanced ? <CodeIcon /> : <FilterIcon />}
        aria-label={
          isAdvanced ? 'Switch to basic filters' : 'Switch to advanced query'
        }
        aria-pressed={isAdvanced}
        onClick={() => onChange(isAdvanced ? 'a' : 'b')}
      />
    </Tooltip>
  );
}
