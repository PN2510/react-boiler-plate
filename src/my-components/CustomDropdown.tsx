'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  placeholder: string;
  isMulti: boolean;
  onSelect: (selected: Option | Option[]) => void;
  onLoadMore?: () => Promise<Option[]>;
}

export default function CustomDropdown({
  options: initialOptions,
  placeholder,
  isMulti,
  onSelect,
  onLoadMore,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(initialOptions);
  const [selected, setSelected] = useState<Option[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: Option) => {
    if (isMulti) {
      setSelected((prev) =>
        prev.some((item) => item.value === option.value)
          ? prev.filter((item) => item.value !== option.value)
          : [...prev, option],
      );
    } else {
      setSelected([option]);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    onSelect(isMulti ? selected : selected[0]);
  }, [selected, isMulti, onSelect]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  const loadMore = async () => {
    if (onLoadMore) {
      setLoading(true);
      const newOptions = await onLoadMore();
      setOptions((prev) => [...prev, ...newOptions]);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length > 0 ? (
            selected.map((option) => (
              <span
                key={option.value}
                className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded-md flex items-center"
              >
                {option.label}
                {isMulti && (
                  <X
                    size={14}
                    className="ml-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option);
                    }}
                  />
                )}
              </span>
            ))
          ) : (
            <span className="">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b"
          />
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-muted flex items-center justify-between ${
                selected.some((item) => item.value === option.value)
                  ? 'bg-muted'
                  : ''
              }`}
              onClick={() => toggleOption(option)}
            >
              {option.label}
              {selected.some((item) => item.value === option.value) && (
                <Check size={16} />
              )}
            </div>
          ))}
          {onLoadMore && (
            <Button
              onClick={loadMore}
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
